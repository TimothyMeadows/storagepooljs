var StoragePool = function (contianerName, containerVersion) {
    return new Promise(function (resolve, reject) {
        var indexedDB = window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
        var version = this.version = containerVersion || 3;

        var StorageContainer = function (contianerName, database) {
            this.name = contianerName;
            this.version = version;

            var count = this.count = function () {
                return new Promise(function (resolve, reject) {
                    var container = database.transaction([contianerName], "readonly")
                        .objectStore(contianerName)
                        .count();

                    container.onsuccess = function (event) {
                        resolve(container.result);
                    };

                    container.onerror = function (event) {
                        reject(Error("Error getting count"));
                    };
                });
            };

            var list = this.list = function () {
                return new Promise(function (resolve, reject) {
                    var container = database.transaction([contianerName], "readonly")
                        .objectStore(contianerName)
                        .getAllKeys();

                    container.onsuccess = function (event) {
                        resolve(container.result);
                    };

                    container.onerror = function (event) {
                        reject(Error("Error getting count"));
                    };
                });
            };

            var StorageBlob = this.StorageBlob = function (path) {
                if (!path)
                    throw "Invalid path supplied!";

                if (path.indexOf("/") == -1)
                    path = "/" + path;

                if (path.indexOf("\\") != -1)
                    path = path.replace("\\", "/");

                var write = this.write = function (value) {
                    return new Promise(function (resolve, reject) {
                        var blob = database.transaction([contianerName], "readwrite")
                            .objectStore(contianerName)
                            .put(value, path);

                        blob.onsuccess = function () {
                            resolve();
                        };

                        blob.onerror = function (event) {
                            reject(Error(`Error getting ${path}`));
                        };
                    });


                };

                var read = this.read = function () {
                    return new Promise(function (resolve, reject) {
                        var blob = database.transaction([contianerName], "readonly")
                            .objectStore(contianerName)
                            .get(path);

                        blob.onsuccess = function (event) {
                            resolve(blob.result);
                        };

                        blob.onerror = function (event) {
                            reject(Error(`Error getting ${path}`));
                        };
                    });
                };

                var _delete = this.delete = function () {
                    return new Promise(function (resolve, reject) {
                        var blob = database.transaction([contianerName], "readwrite")
                            .objectStore(contianerName)
                            .delete(path);

                        blob.onsuccess = function (event) {
                            resolve();
                        };

                        blob.onerror = function (event) {
                            reject(Error(`Error removing ${path}`));
                        };
                    });
                };

                var exists = this.exists = function () {
                    return new Promise(function (resolve, reject) {
                        var blob = database.transaction([contianerName], "readonly")
                            .objectStore(contianerName)
                            .getKey(path);

                        blob.onsuccess = function (event) {
                            resolve(blob.result == path);
                        };

                        blob.onerror = function (event) {
                            reject(false);
                        };
                    });
                };
            };
        };

        var connection = indexedDB.open(contianerName, version), database;
        connection.onsuccess = function (event) {
            database = connection.result;
            database.onerror = function (event) {
                reject(Error("Error creating/accessing IndexedDB"));
            };

            resolve(new StorageContainer(contianerName, database));
        };

        connection.onupgradeneeded = connection.onversionchange = function (event) {
            connection.result.deleteObjectStore(contianerName);
            connection.result.createObjectStore(contianerName);
        };
    });
};