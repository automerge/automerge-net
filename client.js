const Automerge = require('automerge')
const Connection = require('./connection')
const net = require('net')
const HOST = '127.0.0.1'
const PORT = 9876
const docSet = new Automerge.DocSet()

// Print out the document whenever it changes
docSet.registerHandler((docId, doc) => {
  console.log(`[${docId}] ${JSON.stringify(doc)}`)
})

// Make a change to the document every 3 seconds
setInterval(() => {
  let doc = docSet.getDoc('example')
  if (doc) {
    doc = Automerge.change(doc, doc => {
      doc.clientNum = (doc.clientNum || 0) + 1
    })
    docSet.setDoc('example', doc)
  }
}, 3000)

const socket = new net.Socket()
let connection

// Connecting to a TCP port
socket.connect(PORT, HOST, () => {
  console.log(`[${HOST}:${PORT}] connected`)
  connection = new Connection(docSet, socket)
})

// Receiving data from the server
socket.on('data', (data) => {
  if (!(data instanceof Buffer)) {
    data = Buffer.from(data, 'utf8')
  }
  connection.receiveData(data)
})

socket.on('close', () => {
  console.log(`[${HOST}:${PORT}] connection closed`)
})

socket.on('error', (err) => {
  console.log(`[${socket.remoteAddress}:${socket.remotePort}] error: ${err}`)
})
