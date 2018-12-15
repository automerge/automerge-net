const { Connection } = require('./Connection')
const net = require('net')

class Client {
  constructor(docSet, port, host) {
    this.docSet = docSet
    this.host = host
    this.port = port
    this.socket = new net.Socket()
  }

  connect() {
    // Connect to a TCP port
    this.socket.connect(
      this.port,
      this.host,
      () => (this.connection = new Connection(this.docSet, this.socket))
    )

    // Receiving data from the server
    this.socket.on('data', data => {
      // Coerce data to Buffer
      if (!(data instanceof Buffer)) data = Buffer.from(data, 'utf8')
      this.connection.receiveData(data)
    })

    // Server closed connection
    this.socket.on('close', () => {
      console.log(`CLIENT: server connection [${this.host}:${this.port}] closed`)
    })

    // Server error
    this.socket.on('error', err => {
      throw err
    })
  }
}

exports.Client = Client
