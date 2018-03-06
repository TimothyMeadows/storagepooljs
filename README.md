# storagepool.js

This is a javascript library designed to run in all desktop, and mobile browsers that can support the [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). It functions much like most cloud based Storage API's that exist seperating data between containers, and blobs.

This library is capable of large file storage in the browser. You can reach 500 MB in both desktop, and mobile browsers without any notices or warnings. Moving beyond 500 MB may result in a prompt from the browser to the user requesting if they will allow more space to be stored. Some mobile browsers will deny any attempt to store more than 1 GB of space reguardless of the users input.

For now you can see below for a sample of how to use the library. You can also check test.html in the repository for a running sample. Documenting will be added in the future (tm).

```javascript
StoragePool("test-container").then(function (container) {
    container.count().then(function (count) {
        console.log("file count: " + count);
    });

    container.list().then(function (list) {
        for (var i = 0; i <= list.length - 1; i++) {
            console.log(i + ": " + list[i])
        }
    });

    var blob = new container.StorageBlob("/test/path/test.txt");
    blob.exists().then(function (exists) {
        if (exists) {
            blob.delete().then(function () {
                blob.write("This is the test contents of test.txt").then(function () {
                    blob.read().then(function (file) {
                        console.log(file);
                    });
                });
            });
        } else {
            blob.write("This is the test contents of test.txt").then(function () {
                blob.read().then(function (file) {
                    console.log(file);
                });
            });
        }
    });
});
```