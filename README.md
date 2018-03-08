# storagepool.js

This is a javascript library designed to run in all desktop, and mobile browsers that can support the [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). It functions much like most cloud based Storage API's that exist separating data between containers, and blobs.

This library is capable of large file storage in the browser. You can reach 500 MB in both desktop, and mobile browsers without any notices or warnings. Moving beyond 500 MB may result in a prompt from the browser to the user requesting if they will allow more space to be stored. Some mobile browsers will deny any attempt to store more than 1 GB of space regardless of the users input.

### StoragePool(contianerName:string, containerVersion:number):Promise

- *containerName:string* <br/>
This is the name of the container you which to access. It will be created if it does not already exist.

- (optional) *containerVersion:number* <br/>
This is the storage container version. This is an optional parameter and best left alone. However, changing the value can be used as a quick way to drop, and re-create the storage pool rather than deleting all items that might exist in that pool.

At the root of storagepool.js is the StoragePool constructor. It's safe to use as both a class, or a function. I personally tend to use it more as a function than a class as you will see in the examples. The method will return a Promise that on success will return a StorageContainer object.

#### Example
```javascript
StoragePool("test-container").then(function (container) { /* ... */ });
```

### StorageContainer.count():Promise

This method will return a count of all of the items in the storage container. This is an optimized method rather than depending on StorageContainer.list().length.

#### Example
```javascript
StoragePool("test-container").then(function (container) {
    container.count().then(function (count) {
        console.log("file count: " + count);
    });
});
```

### StorageContainer.list():Promise

This method will return a list of all of the items in the storage container. The array will contain the path of all items.

#### Example
```javascript
StoragePool("test-container").then(function (container) {
    container.list().then(function (list) {
        for (var i = 0; i <= list.length - 1; i++) {
            console.log(i + ": " + list[i])
        }
    });
});
```

### StorageBlob(path:string):Class

At the heart of storagepool.js is the StorageBlob class. This class represents a "file" inside of the "filesystem" in the form of a Blob.

- *path:string* <br/>
This is the path, including file name to the location you wish to access.

#### Example
```javascript
StoragePool("test-container").then(function (container) {
    var blob = new container.StorageBlob("/test/path/test.doc");
});
```

### StorageBlob.write(value:*):Promise

This will write the contents of value to the StorageBlob path. The contents can be anything however complex JavaScript objects should be pre-encoded in JSON before storage to prevent any issues or exposure of properties not meant to be public. Will return when write is complete.

- *value:** <br/>
This is the content of the StorageBlob you wish to write. It can be anything including a Buffer, Array, string, Blob etc..

#### Example
```javascript
StoragePool("test-container").then(function (container) {
    var blob = new container.StorageBlob("/test/path/test.txt");
    
    blob.write("caw caw caw").then(function () {
        console.log("test.txt was writen!");
    });
});
```

### StorageBlob.fetch(url:string):Promise

This writes the contents returned in http status 200 to the StorageBlob path. The contents should be a virtual url path, or an http / https url with which you have CORS rights to access. Will return when download, and write are complete.

- *url:string* <br/>
This is the url you wish to fetch a blob from. Due to CORS you should use either virtual paths such as /images/image.png or fully qualified URLs if you know you have proper access rights from the domain you are running storagepool.js from.

#### Example
```javascript
StoragePool("test-container").then(function (container) {
    var blob = new container.StorageBlob("/test/path/test.png");
    
    blob.fetch("my-logo-black-small.png").then(function () {
        console.log("test.png was writen!");
    });
});
```

### StorageBlob.read():Promise

This will read the contents at the StorageBlob path. Will return undefined if no content is found. Best to use StorageBlob.exists() first if you are unsure if a file is there as it's better optimized.

#### Example
```javascript
StoragePool("test-container").then(function (container) {
    var blob = new container.StorageBlob("/test/path/test.txt");
    
    blob.read().then(function (file) {
        console.log(file);
    });
});
```

### StorageBlob.delete():Promise

This will delete the contents of the StorageBlob path. Will return when the delete is completed.

#### Example
```javascript
StoragePool("test-container").then(function (container) {
    var blob = new container.StorageBlob("/test/path/test.txt");
    
    blob.delete().then(function () {
        console.log("test.txt has been removed.");
    });
});
```

### StorageBlob.exists():Promise

This will check if the StorageBlob contains a path. This is an optimized method. Will return true if a path exists, and false if one does not.

#### Example
```javascript
StoragePool("test-container").then(function (container) {
    var blob = new container.StorageBlob("/test/path/test.txt");
    
    blob.exists().then(function (exists) {
        console.log("exists: " + exists);
    });
});
```
