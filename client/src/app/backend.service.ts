// tslint:disable-next-line: no-submodule-imports
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { forkJoin } from 'rxjs'
// tslint:disable-next-line: ordered-imports
import { IDanceGroup, ILinkDancesDatesLocation, ICityGroup } from './shared-interfaces-and-constants'

@Injectable({
  providedIn: 'root',
})

export class BackendService {

  public static responseList: any[] = []
  public static dataURL: string
  public static backendURL: string
  public static cityGroups: ICityGroup[]

  public constructor(private readonly http: HttpClient) { }

  public report(link: string, token: string, dpAccessToken: string, fblogin: string) {
    alert('Reported Successfully. Thank You for keeping the Dance Planner clean.')

    return this.post(`${BackendService.dataURL}/reportEvent`, { link }, token, dpAccessToken, fblogin)
  }

  public postLink(linkDancesDatesLocation: ILinkDancesDatesLocation, token: string, dpAccessToken: string, fblogin: string) {
    return this.post(`${BackendService.dataURL}/postLink`, { linkDancesDatesLocation }, token, dpAccessToken, fblogin)
  }

  public getDanceGroups(token: string) {

    return this.get(`${BackendService.backendURL}/community/getTelegramGroups/key/123`, token)
  }

  public postDanceGroup(danceGroup: IDanceGroup, token: string, dpAccessToken: string, fblogin: string) {
    return this.post(`${BackendService.backendURL}/postDanceGroup`, danceGroup, token, dpAccessToken, fblogin)
  }

  // public reportEvent(report: IReport, token: string): any {
  //   return this.post(serviceEndpoints.reportEvent, { report }, token)
  // }

  // public getEvents(token: string) {
  //   alert(token)
  //   return this.get(serviceEndpoints.events, token)
  // }

  public getCities(token: string) {
    return this.get(`${BackendService.backendURL}/cities/getCitiesWithMin/minNumberOfInhabitants/90000/key/123`, token)
  }

  public getLandingPageData(token: string): any {
    const events = this.get(`${BackendService.backendURL}/events/getAllEvents/key/123`, token)
    const ipLocation = this.get(`${BackendService.backendURL}/location/getIPLocation/key/123`, token)
    const cityGroups = this.get(`${BackendService.backendURL}/community/getTelegramGroups/key/123`, token)

    return forkJoin([events, ipLocation, cityGroups])

  }

  private get(url: any, token: string): any {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }
    console.log(`calling to get ${url}`)

    return this.http.get<any>(url, options)

  }

  private post(url: string, body: any, token: string, dpAccessToken: string, fblogin: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'jwt': token,
        'fblogin': fblogin,
        'dpAccessToken': dpAccessToken,
      }),
    }

    console.log(JSON.stringify(body))

    return this.http.post<any>(url, JSON.stringify(body), httpOptions)
  }

}
