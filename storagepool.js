var StoragePool = function (contianerName) {
    if (!Promise)
        throw "No Promise support, can't continue.";

    return new Promise(function (resolve, reject) {
        var public = { IndexedDB: false, IDBTransaction: false };
        var indexedDB = window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;
        var version = public.version = 1.0;

        if (!indexedDB) {
            reject(Error("IndexedDB support not found!"));
            return;
        } else public.IndexedDB = true;

        if (!IDBTransaction) {
            reject(Error("IDBTransaction support not found!"));
            return;
        } else public.IDBTransaction = true;

        var connection = indexedDB.open(contianerName, version), database;
        connection.onsuccess = function (event) {
            database = connection.result;
            resolve(public);
        };
    });
};