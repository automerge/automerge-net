const Automerge = require('automerge')
const Connection = require('./connection')
const net = require('net')
const HOST = '127.0.0.1'
const PORT = 9876
const docSet = new Automerge.DocSet()

docSet.registerHandler((docId, doc) => {
  console.log(`[${docId}] ${JSON.stringify(doc)}`)
})

const socket = new net.Socket()
let connection

socket.connect(PORT, HOST, () => {
  console.log(`[${HOST}:${PORT}] connected`)
  connection = new Connection(docSet, socket)
})

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
