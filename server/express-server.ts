
import { cities } from './cities'
import * as fs from 'fs-sync'
import * as path from 'path'
import * as express from 'express'
import * as compression from 'compression'
import * as axios from 'axios'
import { DistanceCalculator } from './distance-calculator'
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
let telegramGroups = fs.readJSON(groupsFileId)
let requestIPLocations: any[] = []

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
  let magicCounter = 0
  setInterval(async () => {
    const commandToBeExecuted = `./../topsecret/pull.sh`
    try {
      await shell.exec(commandToBeExecuted)
      console.log(`pulled successfully - events before: ${events.length}`)
      events = sortByDate(fs.readJSON(eventsFileId))
      console.log(`events after: ${events.length}`)
      telegramGroups = fs.readJSON(groupsFileId)
    } catch (error) {
      console.log(error.message)
    }
    if (magicCounter === 2000) {
      requestIPLocations = []
      magicCounter = 0
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

function sortByDistance(groups: any[]): any[] {
  return groups.sort((c1, c2) => {
    if (c1.distance > c2.distance) {
      return 1
    }

    if (c1.distance < c2.distance) {
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
    res.sendFile(`${eventsFilePath}/images/${req.params.name}`);
  });

  app.get('/events/getAllEvents/key/:key', async (req: any, res: any) => {
    res.send(events)
  });

  app.get('/cities/getCitiesWithMin/minNumberOfInhabitants/:minNumberOfInhabitants/key/:key', async (req: any, res: any) => {
    res.send(cities);
  });

  app.get('/location/getIPLocationByCity/countryCode/:countryCode/cityName/:cityName/key/:key', async (req: any, res: any) => {

    const city = cities.filter((c: any) => c.country === req.params.countryCode && c.name === req.params.cityName)[0]
    console.log(JSON.stringify(city))
    res.send ({
      name: city.name,
      lat: city.lat,
      lon: city.lon,
    })
  })

  app.get('/location/getIPLocation/key/:key', async (req: any, res: any) => {
    const magic = requestIp.getClientIp(req)
    let ipAdressOfClient

    if (magic.includes('ffff:')) {
      ipAdressOfClient = magic.split('ffff:')[1]
      console.log('\nipAdressOfClient:')
      console.log(ipAdressOfClient)

      let location

      const existingEntry = requestIPLocations.filter((e: any) => e.ipAdressOfClient === ipAdressOfClient)[0]
      if (existingEntry === undefined) {

        const result = (await (axios as any).get(`https://freegeoip.app/json/${ipAdressOfClient}`)).data

        if (result === undefined || result.city === undefined || result.city === '' || ipAdressOfClient.includes(':')) {
          res.send(dancePlannersHomeLocation);
        } else {
          location = {
            name: result.city,
            lat: result.latitude,
            lon: result.longitude,
          }

          const requestIPLocation = {
            ipAdressOfClient,
            name: result.city,
            lat: result.latitude,
            lon: result.longitude,
          }

          requestIPLocations.push(requestIPLocation)
        }

      } else {
        location = {
          name: existingEntry.name,
          lat: existingEntry.lat,
          lon: existingEntry.lon,
        }
      }
      res.send(location);

    } else {
      console.log('I could not determine ip adress of request')
      res.send(dancePlannersHomeLocation);
    }
  });

  app.get('/community/getTelegramGroups/key/:key', async (req: any, res: any) => {
    let telegramGroupsWithInvitationLink = telegramGroups.filter((g: any) => g.telegramInvitationLink !== '')
    const ipAdressOfClient = getIPAddressOfClient(req)
    let existingEntry = requestIPLocations.filter((e: any) => e.ipAdressOfClient === ipAdressOfClient)[0]
    if (existingEntry === undefined) {
      res.send(telegramGroupsWithInvitationLink)
    } else {

      telegramGroupsWithInvitationLink = enrichDistance(telegramGroupsWithInvitationLink, existingEntry.lat, existingEntry.lon)

      telegramGroupsWithInvitationLink = sortByDistance(telegramGroupsWithInvitationLink)

      const sortedTelegramGroups = telegramGroupsWithInvitationLink
      res.send(sortedTelegramGroups)
    }

  });

  app.get('/community/getTelegramInvitationLink/groupId/:groupId/key/:key', async (req: any, res: any) => {
    const entry = telegramGroups.filter((g: any) => g.dpId === req.params.groupId)[0]
    if (entry === undefined) {
      const errorMessage = `I could not find an entry for dpId: ${req.params.groupId}`
      console.log(errorMessage)
      throw new Error(errorMessage)
    } else {
      res.send({ link: entry.telegramInvitationLink })
    }
  });
}

function enrichDistance(telegramGroups: any[], latUser: number, lonUser: number): any[] {

  for (const g of telegramGroups) {
    if (g.countryCode === '' || g.cityName === '') {
      g.distance = 1000000
    } else {

      const city = cities.filter((c: any) => c.country === g.countryCode && c.name === g.cityName)[0]

      if (city === undefined) {
        g.distance === 10000
      } else {
        g.distance = DistanceCalculator.getDistanceInKilometers(latUser, lonUser, city.lat, city.lon)
      }
    }
  }

  return telegramGroups
}

function getIPAddressOfClient(req: any): string {
  const magic = requestIp.getClientIp(req)
  let ipAdressOfClient

  if (magic.includes('ffff:')) {
    ipAdressOfClient = magic.split('ffff:')[1]
    return ipAdressOfClient
  } else {
    return '95.216.151.143'
  }
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
