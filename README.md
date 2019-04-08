# NeDB Database

A simple wrapper for some of the nedb functionality.
It puts nedb into a class and adds typescript types.

## Usage

Create a new database via:

```ts
const db = new Database<YourEntityType>({
  filename: 'path/to/nedb-file'
})
```


### Initialization

To init your db just provide an array with a query and the corresponding value that should be added to the database.
The init function checks if the value exists in the db and creates it otherwise.

```ts
await db.init([
  {
    query: { key: 'myConfig' },
    value: {
      key: { key: 'myConfig' },
      value: 'here it is'
    }
  }
])
```

### Querying, Inserting & Co.

It is basically the same syntax as nedb but with promises:

```ts
const entry = await db.findOne({ key: 'myConfig' })

await db.update({ key: 'myConfig' }, {
    key: 'myConfig'
    value: 'new value'
  })
```

Supported methods are: `insert`, `find`, `fineOne`, `count`, `update`, `remove`.
Cursor operations are not supported.