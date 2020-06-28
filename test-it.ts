import { DancesProvider } from "https://deno.land/x/dance/dancesprovider.ts"


const result = DancesProvider.getAllDances()
console.log(`\nFeel free to extend this list via pull requests: \n${result}\n`)

const heidelbergGeo = {
    latitude: 49.40768,
    longitude: 8.69079
}

const radius = 18
const events = DancesProvider.getDanceEvents(heidelbergGeo, radius)
console.log(`\nDance Events in the radius of ${radius} kilometers: \n${JSON.stringify(events)}\n`)


