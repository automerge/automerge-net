const Automerge = require('automerge')

class Connection {
  constructor(docSet, socket) {
    this.connection = new Automerge.Connection(docSet, msg => this.sendData(msg))
    this.socket = socket
    this.buffer = Buffer.alloc(0)
    this.connection.open()
  }

  receiveData(data) {
    this.buffer = Buffer.concat([this.buffer, data])

    // If there is enough data in the buffer, decode it into messages
    while (true) {
      if (this.buffer.length < 4) break

      const msglen = this.buffer.readInt32BE(0)
      if (this.buffer.length < msglen + 4) break

      const msg = JSON.parse(this.buffer.toString('utf8', 4, msglen + 4))
      this.buffer = this.buffer.slice(msglen + 4)
      // console.log('CONNECTION: received', msg)
      this.connection.receiveMsg(msg)
    }
  }

  sendData(msg) {
    if (!this.socket) return
    // console.log('CONNECTION: sending', data)
    const data = Buffer.from(JSON.stringify(msg), 'utf8')
    const header = Buffer.alloc(4)
    header.writeInt32BE(data.length, 0)
    this.socket.write(header)
    this.socket.write(data)
  }

  close() {
    if (!this.socket) return
    this.socket.end()
    this.socket = null
  }
}

exports.Connection = Connection
