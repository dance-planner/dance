import { allDances } from 'https://raw.githubusercontent.com/dance-planner/dance/master/dances.ts'
import { ILocationOnEarthSurface, IDanceEvent } from './interfaces.ts'
// import { danceEvents } from 'https://raw.githubusercontent.com/dance-planner/dance/master/danceevents.ts'
import { danceEvents } from './danceevents.ts'

export class DancesProvider {

    public static getAllDances(): any[] {
        return allDances
    }

    public static getDanceEvents(location: ILocationOnEarthSurface, radiusInKm: number, sourceURL?: string): IDanceEvent[] {
        if (sourceURL === undefined) {
            return danceEvents
        }
        return []
    }
}