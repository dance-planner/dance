import { Injectable } from '@angular/core'
import { DistanceCalculator } from 'distance-calculator-lat-lon'

@Injectable({
  providedIn: 'root',
})
export class GeoService {

  public getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const dc: DistanceCalculator = new DistanceCalculator()

    const distance: number = dc.getdistance(lat1, lon1, lat2, lon2, 'K')
    // const distance: number = dc.getDistance(lat1, lon1, lat2, lon2, 'K')

    return (distance)
  }
}
