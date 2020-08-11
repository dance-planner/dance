// tslint:disable-next-line: no-submodule-imports
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { forkJoin } from 'rxjs'
// tslint:disable-next-line: ordered-imports
import { IDanceGroup, ICityGroup } from './shared-interfaces-and-constants'

@Injectable({
  providedIn: 'root',
})

export class BackendService {

  public static responseList: any[] = []
  public static apiKey: string
  public static backendURL: string
  public static cityGroups: ICityGroup[]
  private readonly minNumberOfPeopleInCity = 90000
  public constructor(private readonly http: HttpClient) { }

  public getCities() {

    return this.get(`${BackendService.backendURL}/cities/getCitiesWithMin/minNumberOfInhabitants/${this.minNumberOfPeopleInCity}/key/${BackendService.apiKey}`, 'whatever')
  }

  public getLandingPageData(): any {
    // const events = this.get('https://raw.githubusercontent.com/dance-planner/dance/master/events/events.json', 'ok')
    const events = this.get(`${BackendService.backendURL}/events/getAllEvents/key/${BackendService.apiKey}`, 'whatever')
    // const events = []
    const ipLocation = this.get(`${BackendService.backendURL}/location/getIPLocation/key/${BackendService.apiKey}`, 'whatever')
    // const ipLocation = this.get('https://freegeoip.app/json/', token)
    const cityGroups = this.get(`${BackendService.backendURL}/community/getTelegramGroups/key/${BackendService.apiKey}`, 'whatever')

    return forkJoin([events, ipLocation, cityGroups])

  }

  public async fetchImage(url, headers): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(url, headers)
        .then((response) => response.blob()) // sending the blob response to the next then
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob)
          resolve(objectUrl)
        }) // resolved the promise with the objectUrl
        .catch(reject) // if there are any errors reject them
    })
  }

  private get(url: any, token: string): any {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'jwt': token,
      }),
    }
    console.log(`calling to get ${url}`)

    return this.http.get<any>(url, options)

  }
}
