// tslint:disable-next-line: no-submodule-imports
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { forkJoin } from 'rxjs'
// tslint:disable-next-line: ordered-imports
import { ILinkDancesDatesLocation, ICityGroup } from './shared-interfaces-and-constants'

@Injectable({
  providedIn: 'root',
})

export class BackendService {

  public static responseList: any[] = []
  public static dataURL: string
  public static backendURL: string

  public constructor(private readonly http: HttpClient) { }

  // http://localhost:3001/community/getTelegramGroups/key/123
  public getDanceGroups() {

    return this.get(`${BackendService.backendURL}/community/getTelegramGroups/key/123`)
  }

  public getCities() {
    return this.get(`${BackendService.backendURL}/cities/getCitiesWithMin/minNumberOfInhabitants/90000/key/123`)
  }

  public getGroupLink(groupId: string) {
    return this.get(`${BackendService.backendURL}/community/getTelegramInvitationLink/groupId/${groupId}/key/123`)
  }

  public getLandingPageData(): any {
    const events = this.get(`${BackendService.backendURL}/events/getAllEvents/key/123`)
    const ipLocation = this.get(`${BackendService.backendURL}/location/getIPLocation/key/123`)

    return forkJoin([events, ipLocation])

  }

  private get(url: any): any {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }
    console.log(`calling to get ${url}`)

    return this.http.get<any>(url, options)
  }

  // private post(url: string, body: any, token: string, dpAccessToken: string, fblogin: string) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'jwt': token,
  //       'fblogin': fblogin,
  //       'dpAccessToken': dpAccessToken,
  //     }),
  //   }

  //   console.log(JSON.stringify(body))

  //   return this.http.post<any>(url, JSON.stringify(body), httpOptions)
  // }

}
