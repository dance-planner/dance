
import { cities } from './cities'
import * as fs from 'fs-sync'
import * as path from 'path'
import * as express from 'express'
import * as compression from 'compression'
import * as axios from 'axios'
const requestIp = require('request-ip')
// const axios = require('axios')


const http = require('http')
const https = require('https')
const cors = require('cors')
const shell = require('shelljs');
const dancePlannersHomeLocation = {
  name: 'Heidelberg',
  lat: 49.40768,
  lon: 8.69079,
}

const configFileId = path.join(path.resolve(''), './../topsecret/.env.json')
const groupsFileId = path.join(path.resolve(''), './../groups/telegram.json')
const eventsFilePath = path.join(path.resolve(''), './../events')
const eventsFileId = path.join(path.resolve(''), './../events/events.json')

const config = fs.readJSON(configFileId)

let events = sortByDate(fs.readJSON(eventsFileId))

executeMasterplan()
  .then((result: any) => {
    console.log('masterplan works')
  })
  .catch((error) => console.log(error.message))

async function executeMasterplan() {
  regularlyGetTheLatestFancyShit()
  const app = express();
  app.use(cors())
  app.use(compression())
  const mainStaticAssetsPath = useStaticAssets(app)
  const html = await fs.read(`${mainStaticAssetsPath}/i-want-compression-via-route.html`)
  defineRoutes(app, html)
  startListening(app)
}


function regularlyGetTheLatestFancyShit() {
  setInterval(async () => {
    const commandToBeExecuted = `./../topsecret/pull.sh`
    try {
      shell.exec(commandToBeExecuted)
      events = sortByDate(fs.readJSON(eventsFileId))
    } catch (error) {
      console.log(error.message)
    }

  }, 2 * 60 * 1000)
}

function sortByDate(events: any[]): any[] {
  return events.sort((c1, c2) => {
    if (c1.startDate > c2.startDate) {
      return 1
    }

    if (c1.startDate < c2.startDate) {
      return -1
    }

    return 0
  })
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
    res.sendFile(`${eventsFilePath}/${req.params.name}`);
  });

  app.get('/events/getAllEvents/key/:key', async (req: any, res: any) => {
    res.send(events)
  });

  app.get('/cities/getCitiesWithMin/minNumberOfInhabitants/:minNumberOfInhabitants/key/:key', async (req: any, res: any) => {
    res.send(cities);
  });

  app.get('/location/getIPLocation/key/:key', async (req: any, res: any) => {
    const magic = requestIp.getClientIp(req)
    let ipAdressOfClient
    if (magic.includes('ffff:')) {
      ipAdressOfClient = magic.split('ffff:')[1]
      console.log('\nipAdressOfClient:')
      console.log(ipAdressOfClient)

      const result = (await (axios as any).get(`https://freegeoip.app/json/${ipAdressOfClient}`)).data

      if (result === undefined || result.city === undefined || ipAdressOfClient.includes(':')) {
        res.send(dancePlannersHomeLocation);
      } else {
        res.send({
          name: result.city,
          lat: result.latitude,
          lon: result.longitude,
        });

      }
    } else {
      console.log('I could not determine ip adress of request')
      res.send(dancePlannersHomeLocation);
    }
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

  if (config.httpPort > 0) {
    const httpServer = http.createServer(app)
    httpServer.listen(config.httpPort)
    console.log(`listening on : http://localhost:${config.httpPort}`)
  }
}
