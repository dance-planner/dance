import { Injectable } from '@angular/core'

enum DistanceUnit {
  Kilometers = 'K',
  NauticMiles = 'N',
  LightYears = 'LY',
}

@Injectable({
  providedIn: 'root',
})
export class GeoService {

  public static readonly unitKilometers = 'K'
  public static readonly unitNauticMiles = 'N'

  public getDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string = DistanceUnit.Kilometers) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0
    }
    const radlat1 = Math.PI * lat1 / 180
    const radlat2 = Math.PI * lat2 / 180
    const theta = lon1 - lon2
    const radtheta = Math.PI * theta / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === GeoService.unitKilometers) { dist = dist * 1.609344 }
    if (unit === GeoService.unitNauticMiles) { dist = dist * 0.8684 }

    return dist

  }
}
