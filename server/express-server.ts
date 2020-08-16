
import { cities } from './cities'
import * as fs from 'fs-sync'
import * as path from 'path'
import * as express from 'express'
import * as compression from 'compression'

const http = require('http')
const https = require('https')
const cors = require('cors')
const shell = require('shelljs');

const configFileId = path.join(path.resolve(''), './../topsecret/.env.json')
console.log(`working with config path: ${configFileId}`)
const groupsFileId = path.join(path.resolve(''), './../groups/telegram.json')
console.log(`working with groupsPath path: ${groupsFileId}`)
const eventsFilePath = path.join(path.resolve(''), './../events/events.json')
console.log(`working with eventsFilePath path: ${eventsFilePath}`)
const eventsFileId = path.join(path.resolve(''), './../events/events.json')
console.log(`working with eventsFileId path: ${eventsFileId}`)
export const config = fs.readJSON(configFileId)

executeMasterplan()
  .then((result: any) => {
    console.log('hä')
  })
  .catch((error) => console.log(error.message))

async function executeMasterplan() {
  regularlyGetTheLatestFancyShit()
  const app = express();
  app.use(cors())
  app.use(compression())
  const mainStaticAssetsPath = useStaticAssets(app)
  const html = await readPageToMainMemory(mainStaticAssetsPath)
  defineRoutes(app, html)
  startListening(app)

}



async function readPageToMainMemory(pathToStaticAssets: string): Promise<string> {
  return fs.read(`${pathToStaticAssets}/i-want-compression-via-route.html`)
}

function regularlyGetTheLatestFancyShit() {
  setInterval(async () => {
    const commandToBeExecuted = `./../topsecret/pull.sh`
    try {
      shell.exec(commandToBeExecuted)
    } catch (error) {
      console.log(error.message)
    }

  }, 2 * 60 * 1000)
}

function useStaticAssets(app): string {
  const pathToStaticAssets = path.join(path.resolve(''), './docs')
  const pathToStaticAssets2 = path.join(path.resolve(''), './docs/assets')
  app.use(express.static(pathToStaticAssets))
  app.use(express.static(pathToStaticAssets2))
  console.log(`serving static assets from ${pathToStaticAssets} and from \n${pathToStaticAssets2}`)
  return pathToStaticAssets
}


function defineRoutes(app, html) {

  app.get('/', (req, res) => {
    res.send(html)
  })

  app.get('/images/getEventImage/name/:name', (req: any, res: any) => {
    const imageFileId = `${eventsFilePath}/${req.params.name}`
    console.log(`using imageFileId: ${imageFileId}`)
    res.sendFile(imageFileId);
  });

  app.get('/events/getAllEvents/key/:key', async (req: any, res: any) => {
    res.send(fs.readJSON(eventsFileId))
  });

  app.get('/cities/getCitiesWithMin/minNumberOfInhabitants/:minNumberOfInhabitants/key/:key', async (req: any, res: any) => {
    console.log(req.headers)
    res.send(cities);
  });

  app.get('/location/getIPLocation/key/:key', async (req: any, res: any) => {
    res.send({
      name: 'Heidelberg',
      lat: 49.40768,
      lon: 8.69079,
    });
  });

  app.get('/community/getTelegramGroups/key/:key', async (req: any, res: any) => {
    res.send(fs.readJSON(groupsFileId))
  });
}

function startListening(app) {
  if (config.httpsPort > 0) {
    const certificate = fs.read(config.pathToCert)
    const privateKey = fs.read(config.pathToCertKey)
    const credentials = { key: privateKey, cert: certificate }
    const httpsServer = https.createServer(credentials, app)
    httpsServer.listen(config.httpsPort)
    console.log(`listening on : https://danceplanner.org`)
  }

  console.log(config.httpPort)
  if (config.httpPort > 0) {
    const httpServer = http.createServer(app)
    httpServer.listen(config.httpPort)
    console.log(`listening on : http://localhost:${config.httpPort}`)
  }
}
