const Automerge = require('automerge')
const { Server } = require('../Server')
const HOST = '127.0.0.1'
const PORT = 9876

const docSet = new Automerge.DocSet()

// Initialise an example document
const exampleDoc = Automerge.init()
docSet.setDoc('example', exampleDoc)

// Print out the document whenever it changes
docSet.registerHandler((docId, doc) => console.log(`SERVER: [${docId}] ${JSON.stringify(doc)}`))

// Make a change to the document every 3 seconds
const timer = setInterval(() => {
  let doc = docSet.getDoc('example')
  doc = Automerge.change(doc, doc => {
    doc.serverNum = (doc.serverNum || 0) + 1
  })
  docSet.setDoc('example', doc)
  if (doc.serverNum >= 5) clearInterval(timer)
}, 3000)

const server = new Server(docSet, PORT, HOST)
server.listen()
