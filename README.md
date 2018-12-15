This repo provides lightweight client and server wrappers that add automatic socket-based network synchronization to [Automerge](https://github.com/automerge/automerge) document sets.

### Server

A `Server` wraps an Automerge `DocSet`.

For example, let's initialize an Automerge document and add it to a document set.

```javascript
const Automerge = require('automerge')

// Initialize a document set
const serverDocs = new Automerge.DocSet()

// Initialize a document
const exampleDoc = Automerge.init()

// Add the document to the document set
serverDocs.setDoc('example', exampleDoc)
```

Then we can create a server for the `DocSet`, and have it listen on a port:

```javascript
const { Server } = require('automerge-net')

const server = new Server(serverDocs, PORT, HOST)
server.listen()
```

### Client

A `Client` also wraps an Automerge `DocSet`.

Let's create an empty document set and connect it to our server:

```javascript
const { Client } = require('../Client')
const Automerge = require('automerge')

// Create an empty document set
const clientDocs = new Automerge.DocSet()

const client = new Client(clientDocs, PORT, HOST)
client.connect()
```

The two document sets will be reconciled on first connection, and any subsequent changes on either the client or the server will be magically synchronized, without any further intervention on our part.

### Demo

You can see this in action by running the demo. The demo fires up a server and a client, each of which then makes a series of updates: The server updates `serverNum` every 3 seconds, and the client updates `clientNum` every 4 seconds.

```sh
> yarn start
yarn run v1.12.3
$ run-p start:server start:client
$ node demo/server
$ node demo/client
SERVER: Listening on 127.0.0.1:9876
SERVER: [127.0.0.1:53254] connected
SERVER: [example] {"serverNum":1}
CLIENT: [example] {"serverNum":1}
CLIENT: [example] {"serverNum":1,"clientNum":1}
SERVER: [example] {"serverNum":1,"clientNum":1}
SERVER: [example] {"serverNum":2,"clientNum":1}
CLIENT: [example] {"serverNum":2,"clientNum":1}
CLIENT: [example] {"serverNum":2,"clientNum":2}
SERVER: [example] {"serverNum":2,"clientNum":2}
SERVER: [example] {"serverNum":3,"clientNum":2}
CLIENT: [example] {"serverNum":3,"clientNum":2}
...
```
