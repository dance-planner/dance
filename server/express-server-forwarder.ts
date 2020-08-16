import * as express from 'express'

const unsafePort = 80
const httpForwarderAPPListeningOnUnsafePort = express()

let forwarded = false
httpForwarderAPPListeningOnUnsafePort.get('*', (req, res) => {
  if (!forwarded) {
    forwarded = true
    setTimeout(() => {
      forwarded = false
    }, 100)
    res.send(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url='https://dance-planner.org'" /></head><body><p>Redirecting to https: <a href="https://dance-planner.org">https://dance-planner.org/</a></p></body></html>`)
  }
})

httpForwarderAPPListeningOnUnsafePort.listen(unsafePort)