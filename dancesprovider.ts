import { allDances, danceInManyLanguages } from 'https://deno.land/x/dance/dances.ts'
import { ILocationOnEarthSurface, IDanceEvent } from 'https://deno.land/x/dance/interfaces.ts'
import { DistanceCalculator } from "https://deno.land/x/distancecalculator/distance-calculator.ts"
import axiod from "https://deno.land/x/axiod/mod.ts"

export class DancesProvider {

    private static readonly decoder = new TextDecoder('utf-8')
    public static getAllDances(): any[] {
        return allDances
    }

    public static async getDanceEvents(location: ILocationOnEarthSurface, radiusInKm: number, sourceURL?: string): Promise<IDanceEvent[]> {

        if (sourceURL === undefined) {
            const url = "https://raw.githubusercontent.com/dance-planner/dance/master/events/events-created-via-bot.json"
            const danceEvents = (await axiod.get(url)).data
            const filteredEvents = this.filterByRadius(danceEvents, location, radiusInKm)

            return filteredEvents
        }
        return []
    }

    public static async getAllDanceEvents(): Promise<IDanceEvent[]> {
        const decoder = new TextDecoder('utf-8')
        const danceEvents: IDanceEvent[] = JSON.parse(decoder.decode(await Deno.readFile(`${Deno.cwd()}/events/events-created-via-bot.json`)))

        return danceEvents
    }

    public static getDanceInLanguage(countryCode: string): string {
        return danceInManyLanguages.filter((entry) => entry.countryCode === countryCode.toLowerCase())[0].dancing
    }

    private static filterByRadius(danceEvents: IDanceEvent[], location: ILocationOnEarthSurface, radiusInKm: number) {
        return danceEvents.filter((danceEvent: IDanceEvent) => {
            const distanceInKilometers =
                DistanceCalculator.getDistanceInKilometers(location.latitude, location.longitude, danceEvent.lat, danceEvent.lon)
            // console.log(distanceInKilometers)
            if (distanceInKilometers <= radiusInKm) {
                return true
            }
            return false
        })
    }

}