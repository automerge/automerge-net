const { Client } = require('../Client')
const Automerge = require('automerge')
const HOST = '127.0.0.1'
const PORT = 9876

const docSet = new Automerge.DocSet()

// Print out the document whenever it changes
docSet.registerHandler((docId, doc) => console.log(`CLIENT: [${docId}] ${JSON.stringify(doc)}`))

// Make a change to the document every 4 seconds
const timer = setInterval(() => {
  let doc = docSet.getDoc('example')
  if (doc) {
    doc = Automerge.change(doc, doc => {
      doc.clientNum = (doc.clientNum || 0) + 1
    })
    docSet.setDoc('example', doc)
    if (doc.clientNum >= 5) clearInterval(timer)
  }
}, 4000)

const client = new Client(docSet, PORT, HOST)
client.connect()
