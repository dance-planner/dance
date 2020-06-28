import { allDances } from 'https://deno.land/x/dance/dances.ts'
import { ILocationOnEarthSurface, IDanceEvent } from 'https://deno.land/x/dance/interfaces.ts'
import { danceEvents } from 'https://deno.land/x/dance/danceevents.ts'

import { DistanceCalculator } from "https://deno.land/x/distancecalculator/distance-calculator.ts"


export class DancesProvider {

    public static getAllDances(): any[] {
        return allDances
    }

    public static getDanceEvents(location: ILocationOnEarthSurface, radiusInKm: number, sourceURL?: string): IDanceEvent[] {
        if (sourceURL === undefined) {
            return this.filterByRadius(danceEvents, location, radiusInKm)
        }
        return []
    }

    private static filterByRadius(danceEvents: IDanceEvent[], location: ILocationOnEarthSurface, radiusInKm: number) {
        return danceEvents.filter((danceEvent: IDanceEvent) => {
            const distanceInKilometers =
                DistanceCalculator.getDistanceInKilometers(location.latitude, location.longitude, danceEvent.lat, danceEvent.lon)
            if (distanceInKilometers <= radiusInKm) {
                return true
            }
            return false
        })
    }

}