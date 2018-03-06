var StoragePool = function (contianerName) {
    var public = { IndexedDB: false, IDBTransaction: false };
    var indexedDB = window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;
    var version = public.version = 1.0;

    if (!indexedDB) {
        console.log("IndexedDB support not found!");
        return public;
    } else public.IndexedDB = true;

    if (!IDBTransaction) {
        console.log("IDBTransaction support not found!");
        return public;
    } else public.IDBTransaction = true;

    var connection = indexedDB.open(contianerName, version), database;
    connection.onsuccess = function (event) {
        database = connection.result;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports)
            exports = module['exports'] = public;

        exports.StoragePool = public;
    } else {
        if (typeof root !== 'undefined')
            root.StoragePool = public;
    }

    return public;
};