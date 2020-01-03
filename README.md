# shridb

### The .json file & promise based javascript database for nodejs, nwjs, electron etc...

* **Create & Interact with each json file as a table.**
* **Make essential queries required for database operation**
* **Also make queries on array level instead of table**
* **Backup & Restore Database**
* **lodash, file-extra based persistent database**
---

### :pray: Help, Support, Encourage
> Please, support shridb development by sending money: [Donate](https://paypal.me/govindbhumkar?locale.x=en_GB) 
---
<img src="https://i.imgur.com/UTT3C2Rm.png" alt="shridb_logo">

## Installation
```
npm install shridb
```
## Usage

```
var Shridb = require('shridb');
```

```javascript
var db = new Shridb(databaseName); 
// Creates a folder with `databaseName` in project directory, 
// if `databaseName` is Empty then default folder named 'Shridb' will be created.
// Example
var db = new Shridb(nw.App.dataPath + '/yourDBName'); // node webkit or nwjs
var db = new Shridb(path.join(nw.App.dataPath, 'yourDBName'); 
// node webkit or nwjs with path.join method (requires path module);
```
**Arguments:**  
**databaseName(String):** The name of database or path to database.


## Methods:
 > Let's consider our table or data(array) named 'products' contains the following collection for performing queries.
 
```javascript
[{
	"id": 1,
	"type": "donut",
	"name": "Cake",
	"batters": {
	    "batter": [
			{ "id": 1001, "type": "Regular" },
			{ "id": 1002, "type": "Chocolate" },
			{ "id": 1003, "type": "Blueberry" },
			{ "id": 1004, "type": "Devil's Food" }
		]
	},
	"topping":[
		{ "id": 5001, "type": "None",   "price": 0 },
		{ "id": 5002, "type": "Glazed", "price": 85 },
		{ "id": 5005, "type": "Sugar",  "price": 60 },
		{ "id": 5007, "type": "Powdered Sugar", "price": 48 },
		{ "id": 5006, "type": "Chocolate with Sprinkles", "price": 75 },
		{ "id": 5003, "type": "Chocolate", "price": 50 },
		{ "id": 5004, "type": "Maple",  "price": 14 }
	],
	"price": 470
},
{
	"id": 2,
	"type": "meal",
	"name": "Pizza",
	"size": {
		"small": {"info":"A Small Pizza", "offer":"Single with coke"},
		"medium": {"info":"A Medium Pizza", "offer":"Combo with krushers"},
		"large":{"info":"A Large Pizza", "offer":"All in one"}
	},
	"topping": [
		{ "id": 7001, "type": "Pepperoni",   "price": 46 },
		{ "id": 7002, "type": "Mushrooms", "price": 52 },
		{ "id": 7005, "type": "Onions",  "price": 60 },
		{ "id": 7007, "type": "Bacon", "price": 90 },
		{ "id": 7006, "type": "Green peppers", "price": 35 },
		{ "id": 7003, "type": "Spinach", "price": 29 },
		{ "id": 7004, "type": "Sousage",  "price": 12 }
	],
	"price": 795
}]
```

> Note: data(consider above one) defined in this documentation is supposed to be in array format.

---
##### `db.getTable(tableName)`
* Creates/adds table named **tableName.json** to database, returns its data if already exists or create one.
```javascript 
db.getTable(table).then((tableData) => { 
	console.log(tableData); 
}).catch((err) => {
	console.log(err);
});
 /* We defined our collection as a table here, No need to add a table, 
 just call this function and it will create a separate file with .json extension, 
 if the file does not exist then it will be created(containing [] empty array) or 
 if exists then Gets table data from the database and supplies the result. */
 // Example
 db.getTable('products').then((data) => { 
	console.log(data); 
    /* if 'products' not exist, then 'products.json' file created which returns
    empty array, otherwise returns data from table if exists */
}).catch((err) => {
	console.log(err);
});
```
**Arguments:**  
* **table (String):** The name of table or collection to add/retrieve data.
---

##### `db.saveTable(table, tableData)`
* Save data to table
```javascript 
// Example
db.getTable('products').then((data) => {		
	data.push({
	"id": 1,
	"type": "donut",
	"name": "Cake",
	"batters":
		{
		    "batter":
			[
				{ "id": 1001, "type": "Regular" },
				{ "id": 1002, "type": "Chocolate" },
				{ "id": 1003, "type": "Blueberry" },
				{ "id": 1004, "type": "Devil's Food" }
			]
		},
	"topping":
		[
			{ "id": 5001, "type": "None",   "price": 0 },
			{ "id": 5002, "type": "Glazed", "price": 85 },
			{ "id": 5005, "type": "Sugar",  "price": 60 },
			{ "id": 5007, "type": "Powdered Sugar", "price": 48 },
			{ "id": 5006, "type": "Chocolate with Sprinkles", "price": 75 },
			{ "id": 5003, "type": "Chocolate", "price": 50 },
			{ "id": 5004, "type": "Maple",  "price": 14 }
		],
	"price": 470.00
});		
db.saveTable('products', data);	// save/overwrites data to table with pushed elements
//products has been saved
}).catch((error) => {
    console.log(error);
});
```
> **See Also**: db.insert() method alternative to push method without calling db.saveTable() everytime

**Arguments:**
* **table (String):** The name of table.
* **tableData (Array):** Data to save to table (overwrites whole data with tableData)
---
##### `db.insert(table, object/arrayOfObjects)`
* Insert single object *or* array of objects to table
```javascript 
db.insert(table, object/arrayOfObjects).then((data) => {
	console.log(data);
}).catch((error) => {
	console.log(error);
});

// Example: 1 - Insert Single Object
db.insert('products', {
	"id": 2,
	"type": "meal",
	"name": "Pizza",
	"size": {
		"small": {"info":"A Small Pizza", "offer":"Single with coke"},
		"medium": {"info":"A Medium Pizza", "offer":"Combo with krushers"},
		"large":{"info":"A Large Pizza", "offer":"All in one"}
	},
	"topping": [
		{ "id": 7001, "type": "Pepperoni",   "price": 46 },
		{ "id": 7002, "type": "Mushrooms", "price": 52 },
		{ "id": 7005, "type": "Onions",  "price": 60 },
		{ "id": 7007, "type": "Bacon", "price": 90 },
		{ "id": 7006, "type": "Green peppers", "price": 35 },
		{ "id": 7003, "type": "Spinach", "price": 29 },
		{ "id": 7004, "type": "Sousage",  "price": 12 }
	],
	"price": 795.00
}).then((data) => {
	console.log(data);
}).catch((error) => {
	console.log(error);
});

// Example: 2 - Insert Array of objects
db.insert('products', [
        {"id": 3,"type": ...},
        {"id": 4,"type": ...} 
    ]).then((data) => {
	console.log(data);
}).catch((error) => {
	console.log(error);
});

// Example: 3 - Using getMax() to insert incremental id's
db.getMax('products', 'id').then((maxId) => {
    maxId++;
    db.insert('products', {"id": maxId, "name":"pasta", ..})
    .then((data) => {
    	console.log(data);
    }).catch((error) => {
    	console.log(error);
    });
}).catch((error) => console.log(error));

```
**Arguments:**
* **table (String):** The name of table.
* **object/arrayOfObjects:** Single object- {} or array of objects [{..}, {..}] 

---
##### `db.getMax(table/array, property)`
* Returns maximum value of property from table/array.
```javascript 
db.getMax(table/array, property).then((maxValue) => {
	console.log(maxValue);
}).catch((error) => console.log(error));

// Example
// query to table
db.getMax('products', 'id').then((maxValue) => {
    console.log(maxValue);
}).catch((error) => console.log(error));

// query to array
db.getTable('products').then((data) => { 
    db.getMax(data[0].topping, 'id').then((maxValue) => {
    	console.log(maxValue);
    }).catch((error) => console.log(error));
});
```
**Arguments:**
* **table (String/array):** The name of table or an array
* **property (data):** property of which to get maximum value
---

##### `db.getMin(table/array, property)`
* Returns minimum value of property from table/array.
```javascript 
db.getMin(table/array, property).then((minValue) => {
	console.log(minValue);
}).catch((error) => console.log(error));

// Example
// query to table
db.getMin('products', 'id').then((minValue) => {
    console.log(minValue);
}).catch((error) => console.log(error));

// query to array instead of table
db.getTable('products').then((data) => { 
    db.getMin(data[0].topping, 'id').then((minValue) => {
        console.log(minValue);
    }).catch((error) => console.log(error));
});
```
**Arguments:**
* **table (String/array):** The name of table or an array
* **property (data):** property of which to get minimum value
---

##### `db.updateOne(table/array, oldObj, newObj)`
* Update the old object(first occurance) in table/array with new object(or only specific property in new object).
*Note*: if table is defined, then it directly updates the table in database(no need to call saveTable) and if array is defined, then it returns updated array.
```javascript 
db.updateOne(table/array, oldObj, newObj).then((updatedData) => {
	console.log(updatedData);
}).catch((error) => console.log(error));

// Example
// query to table
db.updateOne('products', {name:'Cake'}, {name:'Ice Cake'}).then((data) => {
	console.log(data);	// updates one object in table, returns updated table
    /* 
    { id: 1,
  type: 'donut',
  name: 'Ice Cake',
  batters: { batter: [ [Object], [Object], ...] },
  topping: [ [Object], [Object], [Object], ... ] }
     */
}).catch((error) => console.log(error)); 
 // query to array
 db.getTable('products').then((data) => {
	db.updateOne(data[0].topping, {type:'Sugar'}, {type:'Crystal Sugar'}).then((data) => {
		console.log(data);	// returns updated array, no effect on table in database
	}).catch((error) => console.log(error));
}).catch((err) => {
	console.log(err);
});

```
**Arguments:**
* **table (String/array):** The name of table or an array,
* **oldObj(object):** old object exists in table,
* **newObj(object):** new object to replace old object
---

##### `db.updateAll(table/array, oldObj, newObj)`
* Update all records(all occurances) of old object in table/array with new object(or only specific property in new object).
*Note*: if table is defined, then it directly updates the table in database(no need to call saveTable) and if array is defined, then it returns updated array.
```javascript 
db.updateAll(table/array, oldObj, newObj).then((updatedData) => {
	console.log(updatedData);
}).catch((error) => console.log(error));
// Example
// query to table
db.updateAll('products', {name:'Cake'}, {name:'Ice Cake'}).then((data) => {
	console.log(data);	// updates all object in table, returns updated table
}).catch((error) => console.log(error));

 // query to array
 db.getTable('products').then((data) => {
	db.updateAll(data[0].topping, {type:'Sugar'}, {type:'Crystal Sugar'}).then((data) => {
		console.log(data);	// returns updated array, no effect on table in database
	}).catch((error) => console.log(error));
}).catch((err) => {
	console.log(err);
});
```
**Arguments:**
* **table(String/array):** The name of table or an array
* **oldObj(object):** old object that exists in table
* **newObj(object):** new object to replace old object
---

##### `db.findOne(table/array, obj)`
* Returns first record(first occurrence) from table/array that matches to `obj`.

```javascript 
db.findOne(table/array, obj).then((foundObj) => {
	console.log(foundObj);
}).catch((error) => console.log(error));
// Example: 1
db.findOne('products', {name:'Pizza'}).then((pizza) => {
	console.log(pizza);
}).catch((error) => console.log(error));

// Example: 2
db.findOne('products', {name:'Pizza'}).then((pizzaObj) => {
    db.findOne(pizzaObj.topping, {type:'Bacon'}).then(baconObj => {
        console.log(baconObj); 
        // { id: 7007, type: 'Bacon', price: 90 }
    }).catch((error) => console.log(error));
}).catch((error) => console.log(error));

// Example: 3 
// find key of object
db.findOne('products', {name:'Pizza'}).then((pizzaObj) => {
    db.findOne(pizzaObj.size, {offer:'All in one'}).then(data => {
        console.log(data);  // large
    }).catch((error) => console.log(error));
}).catch((error) => console.log(error));

```
**Arguments:**
* **table(String/array):** The name of table or an array,
* **obj(object):** object to find one record
---

##### `db.findAll(table/array, obj)`
* Returns array of records from table/array that matches to obj.

```javascript 
db.findAll(table/array, obj).then((foundObj) => {
	console.log(foundObj);
}).catch((error) => console.log(error));

// Example: 1
db.findAll('products', 'id').then((foundData) => {
	console.log(foundData); // return all objects having 'id' property
}).catch((error) => console.log(error));

// Example: 2
db.findOne('products', {name:'Cake'}).then((cakeObj) => {
    db.findAll(cakeObj.topping, function(topping) { 
    	return topping.price > 14 && topping.price < 75; 
    }).then((foundData) => {
    	console.log(foundData);
    	/* [ 
    	{ id: 5005, type: 'Sugar', price: 60 },
            { id: 5007, type: 'Powdered Sugar', price: 48 },
            { id: 5003, type: 'Chocolate', price: 50 } 
        ] */
    }).catch((error) => console.log(error));
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array):** The name of table or an array,
* **obj(object):** object to find all records
---
##### `db.findIndex(table/array, obj)`
* Returns the index of first record(first occurrence) from table/array that matches to `obj`.

```javascript 
db.findIndex(table/array, obj).then((foundIndex) => {
	console.log(foundIndex);
}).catch((error) => console.log(error));

// Example: 1
db.findIndex('products', {name:'Cake'}).then((index) => {
	console.log(index); // 0
}).catch((error) => console.log(error));

// Example: 2
db.findIndex('products', {name:'Pizza'}).then((index) => {
	console.log(index); // 1
}).catch((error) => console.log(error));

// Example: 3
db.findIndex('products', function(product) { 
    return product.type == 'meal'; 
}).then((index) => {
    console.log(index); // 1
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array):** The name of table or an array,
* **obj(object):** object to find index
---

##### `db.findLast(table/array, obj)`
* Returns last record(last occurrence) from table/array that matches to `obj`.

```javascript 
db.findLast(table/array, obj).then((lastRecord) => {
    console.log(lastRecord);
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array):** The name of table or an array,
* **obj(object):** object to find last record
---

##### `db.findLastIndex(table/array, obj)`
* Returns the index of last record(last occurance) from table/array that matches to obj.

```javascript 
db.findLastIndex(table/array, obj).then((index) => {
    console.log(index);
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array)**: The name of table or an array,
* **obj(object):** object to find last index
---

##### `db.removeOne(table/array, obj)`
* Removes first record(first occurance) from table/array that matches to `obj`.
```javascript 
db.removeOne(table/array, obj).then((removedObj) => {
	console.log(removedObj);
}).catch((error) => console.log(error));

// Example
db.removeOne('products', {type:'meal'}).then((removedObj) => {
	console.log(removedObj);
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array):** The name of table or an array,
* **obj(object):** object to remove
---

##### `db.map(tableName, property)`
* Extracts property value from each object, returns array.

```javascript 
db.map(table/array, prop).then((mappedData) => {
	console.log(mappedData);
}).catch((error) => console.log(error));

// Example 1:
db.map('products', 'name').then((mappedData) => {
    console.log(mappedData);    // [ 'Cake', 'Pizza' ]
}).catch((error) => console.log(error));

// Example 2:
db.getTable('products').then((data) => {
    db.map(data[1].topping, 'id').then((mappedData) => {
        console.log(mappedData);
        // [ 7001, 7002, 7005, 7007, 7006, 7003, 7004 ]
    }).catch((error) => console.log(error));
}).catch((error) => console.log(error));

```
**Arguments:**
* **table(String/array):** The name of table or an array,
* **property(String):** property to extract from each object
---

##### `db.removeTable(tableName)`
* Remove/Delete table from database
```javascript 
db.removeTable(tableName).then((info) => {
    console.log(info);
}).catch((error) => console.log(error));

// Example
db.removeTable('products').then((info) => {
    console.log(info); // 'products' table removed from database
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String):** The name of table to remove

---
##### `db.cleanTable(table/array/object)`
* Removes all data in table or removes all data in array/object, returns empty array/object
```javascript 
db.cleanTable(table/array/object);

// Example: 1 - Cleans table
db.cleanTable('products').then((info) => {
    console.log(info);  // []
}).catch((error) => console.log(error));

//Example: 2 - Cleans Array
db.cleanTable(array).then((info) => {
    console.log(info); // []
}).catch((error) => console.log(error));

//Example: 3 - Cleans Object
db.cleanTable(object).then((info) => {
    console.log(info); // {}
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array/object):** The name of table or array/object
---

##### `db.fetchJson(path)`
* Reads and returns data of defined path having `.json` extension
```javascript 
db.fetchJson(path).then((data) => {
    console.log(data);
}).catch((error) => console.log(error));

// Example
db.fetchJson('path/to/file.json').then((data) => {
    console.log(data);
}).catch((error) => console.log(error));
```
**Arguments:**
* **path(String):** path/to/file.json
---

##### `db.doSum(table/array, property)`
* Returns the sum of defined property in array
```javascript 
db.doSum(table, prop).then((data) => {
    console.log(data);
}).catch((error) => console.log(error));

// Example: 1
db.doSum('products', 'price').then((priceTotal) => {
    console.log(priceTotal);  // 1265
}).catch((error) => console.log(error));

// Example: 2
db.getTable('products').then((data) => {
    db.doSum(data[1].topping, 'price').then((priceTotal) => {
    	console.log(priceTotal);  // 324
    }).catch((error) => console.log(error));
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array):** The name of table or an array,
* **property(String):** property of which to get sum value
---

##### `db.groupBy(table/array, value)`
* Returns grouped data by value
```javascript 
db.groupBy(table/array, obj).then((data) => {
	console.log(data);
}).catch((error) => console.log(error));

// Example
db.getTable('products').then((data) => {
    db.groupBy(data[0].topping, 'type').then((groupData) => {
    	console.log(groupData);
/* { None: [ { id: 5001, type: 'None', price: 0 } ],
  Glazed: [ { id: 5002, type: 'Glazed', price: 85 } ],
  Sugar: [ { id: 5005, type: 'Sugar', price: 60 } ],
  'Powdered Sugar': [ { id: 5007, type: 'Powdered Sugar', price: 48 } ],
  'Chocolate with Sprinkles': [ { id: 5006, type: 'Chocolate with Sprinkles', price: 75 } ],
  Chocolate: [ { id: 5003, type: 'Chocolate', price: 50 } ],
  Maple: [ { id: 5004, type: 'Maple', price: 14 } ] } */
    }).catch((error) => console.log(error));
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array):** The name of table or an array
* **value(String):** Value to get data by group
---

##### `db.orderBy(table, sortPropety, orderBy)`
* Returns sorted/ordered data by value
```javascript 
db.orderBy(table/array, sortProperty, orderBy).then((data) => {
    console.log(data);
}).catch((error) => console.log(error));

// Example 1:
db.orderBy('products', 'id', 'desc').then((data) => {
    console.log(data);  // returns descending data
}).catch((error) => console.log(error));

// Example 2:
db.getTable('products').then((data) => {
    db.orderBy(data[1].topping, ['price', 'id'], ['asc', 'desc'])
    .then((data) => {
    	console.log(data); // returns ascending data by price
    }).catch((error) => console.log(error));
}).catch((error) => console.log(error));

```
**Arguments:**
* **table(String/array):** The name of table or an array
* **sortProperty(String/array):** Single property or array of property to sort
* **orderBy(String/array):** orderBy-['asc', 'desc'], (asc = ascending, desc = descending)

---
##### `db.unique(table, property)`
* Returns the new duplicate free array
```javascript 
db.unique('products', property).then((uniqueData) => {
    console.log(uniqueData);
}).catch((error) => console.log(error));

// Example:
db.unique('products', 'id').then((uniqueData) => {
    console.log(uniqueData);
}).catch((error) => console.log(error));

```
**Arguments:**
* **table(String/array):** The name of table or an array
* **property(String):** property value to get unique data
---
##### `db.pushBefore(table, object, newObject)`
* Push new object before existed object, returns array with pushed object
```javascript 
db.pushBefore(table, object, newObject).then((data) => {
    console.log(data);
}).catch((error) => console.log(error));

// Example 1:
db.pushBefore('products', {name:'Pizza'}, {id:3, ...})
.then((data) => {
    console.log(data); // return array data with pushed element
}).catch((error) => console.log(error));

// Example 2:
db.getTable('products').then((data) => {
    db.pushBefore(data, {name:'Pizza'}, {id:3, ...}).then((data) => {
        console.log(data); // return array with pushed element
    }).catch((error) => console.log(error));
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array):** The name of table or an array
* **object(object):** The object exist in table
* **newObject(object):** New object to push before existed object
---
##### `db.pushAfter(table, object, newObject)`
* Push new object after existed object, returns array with pushed object
```javascript 
db.pushAfter(table, object, newObject).then((data) => {
    console.log(data);
}).catch((error) => console.log(error));

// Example 1:
db.pushAfter('products', {name:'Pizza'}, {id:3, ...})
.then((data) => {
    console.log(data); // return array data with pushed element
}).catch((error) => console.log(error));

// Example 2:
db.getTable('products').then((data) => {
    db.pushAfter(data, {name:'Pizza'}, {id:3, ...}).then((data) => {
        console.log(data); // return array with pushed element
    }).catch((error) => console.log(error));
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array):** The name of table or an array
* **object(object):** The object exist in table
* **newObject(object):** New object to push after existed object
---

##### `db.backupDatabase(destinationPath, folderName)`
* Backup database to destination path by creating folder - `folderName` where you can store backup
```javascript 
db.backupDatabase(destinationPath, folderName);

// Example
db.backupDatabase('path/to/directory', 'myBackupFolder').then((info) => {
    console.log(info);  // databaseName backup successfull..!
}).catch((error) => console.log(error));
```
**Arguments:**
* **destinationPath(String):** path/to/backup/directory,
* **folderName(String)**: Folder name where you can store backup
---

##### `db.restoreDatabase(sourcePath)`
* Restore database from source path to your database path
```javascript 
db.restoreDatabase(sourcePath);

// Example
db.restoreDatabase('path/from/backup/directory').then((info) => {
    console.log(info); // databaseName restored successfully..!
}).catch((error) => console.log(error));
```
**Arguments:**
* **sourcePath(String):** path/from/backup/directory
---

##### `db.dateRangeFilter(table, dateProperty, startDate, endDate)`
* Returns filtered array data between start date and end date
```javascript 
db.dateRangeFilter(tableName, dateProperty, startDate, endDate)

// Example
var employee = [
	{"id": 1, "name": "Aarav", "joinDate": "2019-07-14T12:00:00-06:30"},
 	{"id": 2, "name": "Govind", "joinDate": "2019-06-10T12:00:00-06:30"},
 	{"id": 3, "name": "Bhumkar", "joinDate": "2020-01-01T12:00:00-06:30"},
 	{"id": 4, "name": "Om", "joinDate": "2020-01-02T12:00:00-06:30"},
 	{"id": 5, "name": "Shri", "joinDate": "2019-12-25T12:00:00-06:30"}
];

db.dateRangeFilter(employee, 'joinDate', employee[1].joinDate, employee[4].joinDate)
.then((data) => {
    console.log(data);
}).catch((error) => console.log(error));
```
**Arguments:**
* **table(String/array):** The name of table or an array
* **dateProperty(String):** Date property to filter
* **startDate(Date):** Start date
* **endDate(Date):** End Date
---

## Utilities
`db.utils.trimString(text)`
* Removes leading, between, trailing whitespace
```javascript
// Example 1
var myName = db.utils.trimString('Govind        Bhumkar');
console.log(myName);    // Govind Bhumkar

// Example 2
var myName = db.utils.trimString('     Govind  Sham   Bhumkar  ');
console.log(myName);    // Govind Sham Bhumkar

// Example 3
var myName = db.utils.trimString('  Govind     Sham    Bhumkar   ');
console.log(myName);    // Govind Sham Bhumkar
```
**Arguments:**
* **text(String):** text to trim
---


