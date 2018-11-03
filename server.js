const Automerge = require('automerge')
const Connection = require('./connection')
const net = require('net')
const HOST = '0.0.0.0'
const PORT = 9876

const docSet = new Automerge.DocSet()
const initDoc = Automerge.change(Automerge.init(), doc => doc.hello = 'Hi!')
docSet.setDoc('example', initDoc)

docSet.registerHandler((docId, doc) => {
  console.log(`[${docId}] ${JSON.stringify(doc)}`)
})

function handler(socket) {
  console.log(`[${socket.remoteAddress}:${socket.remotePort}] connected`)
  const connection = new Connection(docSet, socket)

  socket.on('data', (data) => {
    if (!(data instanceof Buffer)) {
      data = Buffer.from(data, 'utf8')
    }
    connection.receiveData(data)
  })

  socket.on('close', (data) => {
    console.log(`[${socket.remoteAddress}:${socket.remotePort}] connection closed`)
  })

  socket.on('error', (err) => {
    console.log(`[${socket.remoteAddress}:${socket.remotePort}] error: ${err}`)
  })
}

net.createServer(handler).listen(PORT, HOST)
console.log(`Listening on ${HOST}:${PORT}`)
