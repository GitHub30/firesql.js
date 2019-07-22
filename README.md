# firesql.js
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
const firesql = new FireSQL('http://localhost:8080')

// Listen table changes.
firesql.on('messages', (rows, type) => {
    // rows is changed rows.
    // type is any one of the following.
    //   - InsertRowsEvent
    //   - UpdateRowsEvent
    //   - DeleteRowsEvent
})

// Listen specific row changes.
// 42 is primary key value or unique index value.
firesql.on('messages/42', (row, type) => {
    // rows is changed row.
    // type is any one of the following.
    //   - InsertRowsEvent
    //   - UpdateRowsEvent
    //   - DeleteRowsEvent
})

// CREATE TABLE Statement
await firesql.query(`
CREATE TABLE IF NOT EXISTS messages (
    message_id int NOT NULL AUTO_INCREMENT,
    username VARCHAR(255),
    message VARCHAR(255),
    PRIMARY KEY(message_id)
)`)

// Select Statement
// Response messages is
// [{username: 'John', message: 'hello'}, {username: 'Bob', message: 'hi'}]
const messages = await firesql
  .table('messages')
  .where('message_id', '>=', 42)
  .select('username', 'message')

// Insert Statement
await firesql
  .table('messages')
  .insert({username: 'Alice', message: '😜'})

// Update Statement
await firesql
  .table('messages')
  .where('username', 'Alice')
  .update({message: '😊'})

// Delete Statement
await firesql
  .table('messages')
  .where('username', 'Alice')
  .delete()
```

# License
MIT
