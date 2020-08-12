import * as fs from 'fs-sync'
import * as path from 'path'
import * as express from 'express'
import * as compression from 'compression'
const http = require('http')
const https = require('https')

export const config = fs.readJSON(path.join(path.resolve(''), './.env.json'))

const app = express()
const pathToStaticAssets = path.join(path.resolve(''), './../server/docs')
app.use(express.static(pathToStaticAssets))

app.use(compression())

const html = fs.read(`${pathToStaticAssets}/i-want-compression-via-route.html`)

app.get('/', (req, res) => {
  res.send(html)
})

if (config.httpsPort > 0) {
  const privateKey = fs.read(config.certificatePrivateKeyFile)
  const certificate = fs.read(config.certificateFile)
  const credentials = { key: privateKey, cert: certificate }
  const httpsServer = https.createServer(credentials, app)
  httpsServer.listen(config.httpsPort)
}

if (config.httpPort > 0) {
  const httpServer = http.createServer(app)
  httpServer.listen(config.httpPort)
  console.log(`listening on : http://localhost:${config.httpPort}`)
}

let forwarded = false
ensureRedirectingFromUnsafeHostToSaveHost()

// tslint:disable-next-line: only-arrow-functions
function ensureRedirectingFromUnsafeHostToSaveHost() {
  const unsafePort = 80
  const httpForwarderAPPListeningOnUnsafePort = express()

  httpForwarderAPPListeningOnUnsafePort.get('*', (req, res) => {
    if (!forwarded) {
      forwarded = true
      setTimeout(() => {
        forwarded = false
      },         100)
      res.send(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url='https://dance-planner.org'" /></head><body><p>Redirecting to https: <a href="https://dance-planner.org">https://dance-planner.org/</a></p></body></html>`)
    }
  })

  httpForwarderAPPListeningOnUnsafePort.listen(unsafePort)
}
