import { opine, serveStatic } from "https://deno.land/x/opine@0.20.2/mod.ts";
import { httpPort, httpsPort } from './../topsecret/.env.ts'
import * as log from "https://deno.land/std/log/mod.ts";
import { CommandLineProcessor } from "https://deno.land/x/commandline_processor/commandline-processor.ts"
import { green } from 'https://deno.land/std@0.53.0/fmt/colors.ts'
import { Persistence } from "https://deno.land/x/persistence/persistence.ts"
import { CityService } from 'https://deno.land/x/cities/cityservice.ts'


// Masterplan
regularlyGetTheLatestFancyShit()
const app = opine();
const mainStaticAssetsPath = useStaticAssets(app)
log.warning(mainStaticAssetsPath)
const html = await readPageToMainMemory(mainStaticAssetsPath)
defineMiddleWare(app)
defineRoutes(app, html)
startListening()


// Details
function startListening() {

  console.log(httpPort)
  console.log(httpsPort)
  if (httpPort > 0) {
    console.log(`${green(`listening on http port ${httpPort}`)}`)
    app.listen(httpPort)
  }

  if (httpsPort > 0) {
    log.error('ok')
    console.log(`${green(`listening on https port ${httpsPort}`)}`)
    const httpsOptions = {
      port: 443,
      certFile: '/etc/letsencrypt/live/danceplanner.org/cert.pem',
      keyFile: '/etc/letsencrypt/live/danceplanner.org/privkey.pem',
    }
    app.listen(httpsOptions)
  }
}

let forwarded = false
ensureRedirectingFromUnsafeHostToSaveHost()

function defineMiddleWare(app: any) {
  const myFancyMiddleware = function (req: any, res: any, next: any) {
    log.info(req.url)
    next();
  };

  app.use(myFancyMiddleware)
}

// ensureForwardingFromUnsafePort(target)
// function ensureForwardingFromUnsafePort(target) {

// }

function defineRoutes(app: any, html: string) {

  app.get('/', (req: any, res: any) => {
    res.send(html);
  });

  app.get('/events/getAllEvents/key/:key', async (req: any, res: any) => {
    res.send(JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/events/events.json`)));
  });

  app.get('/cities/getCitiesWithMin/minNumberOfInhabitants/:minNumberOfInhabitants/key/:key', async (req: any, res: any) => {
    log.error(req.params.minNumberOfInhabitants)
    const cities = CityService.getCitiesByPopulation(Number(req.params.minNumberOfInhabitants))
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
    res.send(JSON.parse(await Persistence.readFromLocalFile(`${Deno.cwd()}/groups/telegram.json`)));
  });

}


async function readPageToMainMemory(mainStaticAssetsPath: string): Promise<string> {

  log.error(mainStaticAssetsPath)
  const decoder = new TextDecoder('utf-8')
  let html = decoder.decode(await Deno.readFile(`${mainStaticAssetsPath}/i-want-compression-via-route.html`))
  if (httpsPort > 0) {
    html = html.replace('backendURLContent', 'https://danceplanner.org')
    html = html.replace('apiKeyContent', '123')
  } else {
    html = html.replace('backendURLContent', 'http://localhost:3002')
    html = html.replace('apiKeyContent', '123')
  }

  return html
}


function useStaticAssets(app: any): string {
  const staticPath = `${Deno.cwd()}/assets/dance-planner-light-client/`
  const staticPath2 = `${Deno.cwd()}/assets/dance-planner-light-client/assets/_icons`

  app.use(serveStatic(staticPath));
  app.use(serveStatic(staticPath2));

  return staticPath
}


function regularlyGetTheLatestFancyShit() {
  setInterval(async () => {
    const commandToBeExecuted = `./pull-dance.sh`
    // const commandToBeExecuted = `ls`
    try {
      log.error(await CommandLineProcessor.process(commandToBeExecuted))
    } catch (error) {
      log.error(`hmm - ${error.message}`)
    }

  }, 2 * 60 * 1000)
}


function ensureRedirectingFromUnsafeHostToSaveHost() {
  const unsafePort = 80
  const httpForwarderAPPListeningOnUnsafePort = opine()

  httpForwarderAPPListeningOnUnsafePort.get('*', (req, res) => {
    if (!forwarded) {
      forwarded = true
      setTimeout(() => {
        forwarded = false
      }, 100)
      res.send(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url='https://danceplanner.org'" /></head><body><p>Redirecting to https: <a href="https://danceplanner.org">https://danceplanner.org/</a></p></body></html>`)
    }
  })

  httpForwarderAPPListeningOnUnsafePort.listen(unsafePort)
}
