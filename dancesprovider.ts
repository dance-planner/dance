import { allDances, danceInManyLanguages } from 'https://deno.land/x/dance@1.1.0/dances.ts'
import { ILocationOnEarthSurface, IDanceEvent } from 'https://deno.land/x/dance@1.1.0/interfaces.ts'
import { DistanceCalculator } from "https://deno.land/x/distancecalculator/distance-calculator.ts"
import { Request } from "https://deno.land/x/request@1.1.0/request.ts"

export class DancesProvider {

    private static readonly url = "https://raw.githubusercontent.com/dance-planner/dance/master/events/events.json"

    public static getAllDances(): any[] {
        return allDances
    }

    public static async getDanceEvents(location: ILocationOnEarthSurface, radiusInKm: number, sourceURL?: string): Promise<IDanceEvent[]> {

        if (sourceURL === undefined) {
            const danceEvents = await Request.get(DancesProvider.url)
            const filteredEvents = this.filterByRadius(danceEvents, location, radiusInKm)

            return filteredEvents
        }
        return []
    }

    public static async getAllDanceEvents(): Promise<IDanceEvent[]> {
        const danceEvents = await Request.get(DancesProvider.url)
        
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