// import { DancesProvider } from "https://deno.land/x/dance/dancesprovider.ts"
// import { DancesProvider } from "https://raw.githubusercontent.com/dance-planner/dance/master/dancesprovider.ts"
import { DancesProvider } from "./dancesprovider.ts"

const result = DancesProvider.getAllDances()
console.log(`Feel free to extend this list via pull requests ${result}`)

const heidelbergGeo = {
    latitude: 49.40768,
    longitude: 8.69079
}

const events = DancesProvider.getDanceEvents(heidelbergGeo, 20)
console.log(`Dance Events ${JSON.stringify(events)}`)


