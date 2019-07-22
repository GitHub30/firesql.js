# firesql.js [![npm version](https://badge.fury.io/js/firesql.js.svg)](https://badge.fury.io/js/firesql.js)
FireSQL Javascript SDK for FireSQL(a.k.a Realtime MySQL).

# Install
```bash
npm install --save firesql.js
# or
yarn add firesql.js
```

# Usage
```javascript
import { FireSQL } from 'firesql.js'

// First argument is a FireSQL url.
// FireSQL is here https://github.com/GitHub30/firesql
const db = new FireSQL('http://localhost:8080')

// Listen table changes.
db.on('messages', (rows, type) => {
    // rows is changed rows.
    // type is any one of the following.
    //   - InsertRowsEvent
    //   - UpdateRowsEvent
    //   - DeleteRowsEvent
})

// Listen specific row changes.
// 42 is primary key value or unique index value.
db.on('messages/42', (row, type) => {
    // row is changed row.
    // type is any one of the following.
    //   - InsertRowsEvent
    //   - UpdateRowsEvent
    //   - DeleteRowsEvent
})

// Coming soon...
db.table('message').where('message_id', '=', 42).on((row, type) => {
    // row is changed row.
    // type is any one of the following.
    //   - InsertRowsEvent
    //   - UpdateRowsEvent
    //   - DeleteRowsEvent
})

// CREATE TABLE Statement
await db.query(`
CREATE TABLE IF NOT EXISTS messages (
    message_id int NOT NULL AUTO_INCREMENT,
    username VARCHAR(255),
    message VARCHAR(255),
    PRIMARY KEY(message_id)
)`)

// Select Statement
// Response messages is
// [{username: 'John', message: 'hello'}, {username: 'Bob', message: 'hi'}]
const messages = await db
  .table('messages')
  .where('message_id', '>=', 42)
  .select('username', 'message')

// Insert Statement
await db
  .table('messages')
  .insert({username: 'Alice', message: '😜'})

// Update Statement
await db
  .table('messages')
  .where('username', 'Alice')
  .update({message: '😊'})

// Delete Statement
await db
  .table('messages')
  .where('username', 'Alice')
  .delete()
```

# License
MIT
