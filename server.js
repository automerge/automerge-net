const { Connection } = require('./Connection')
const net = require('net')

class Server {
  constructor(docSet, port, host) {
    this.docSet = docSet
    this.port = port
    this.host = host
  }

  listen() {
    // This function is called every time a client connects to our socket
    const handler = socket => {
      console.log(`SERVER: [${socket.remoteAddress}:${socket.remotePort}] connected`)
      const connection = new Connection(this.docSet, socket)

      // Receiving data from the client
      socket.on('data', data => {
        // Coerce data to Buffer
        if (!(data instanceof Buffer)) data = Buffer.from(data, 'utf8')
        connection.receiveData(data)
      })

      socket.on('close', data => connection.close())

      socket.on('error', err => {
        throw err
      })
    }

    // Listen on a TCP port
    net.createServer(handler).listen(this.port, this.host)
    console.log(`SERVER: Listening on ${this.host}:${this.port}`)
  }
}

exports.Server = Server
