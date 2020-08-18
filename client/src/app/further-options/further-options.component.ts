import { Component, OnInit, Input } from '@angular/core'
import { IEvent, IDanceGroup, EGroupType } from '../shared-interfaces-and-constants'
import { BackendService } from '../backend.service'
import { AppComponent } from '../app.component'
import { ModuleService } from '../module.service'

@Component({
  selector: 'app-further-options',
  templateUrl: './further-options.component.html',
  styleUrls: ['./further-options.component.css', '../app.component.css'],
})
export class FurtherOptionsComponent implements OnInit {

  @Input() public allEvents: IEvent[]
  @Input() public jwt = ''
  @Input() public danceStyles
  @Input() public cities
  @Input() public fblogin: string
  @Input() public dpAccessToken: string

  public groupLink = ''
  public addingGroupLink = false
  public selectedDanceStyle = ''
  public selectedCity = ''
  public searchTerm = ''
  public showInsights = false
  public showFacebookGroups = false
  public showTelegramGroups = false
  public readyForDisplay = false
  public danceGroups: IDanceGroup[]
  public filteredDanceGroups: IDanceGroup[]
  public sortingDirectionDown = false
  public cityGroups: any[] = []

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit() {
    this.backendService.getDanceGroups(this.jwt)
      .subscribe((result: IDanceGroup[]) => {
        this.danceGroups = result
        this.readyForDisplay = true
      })

    for (const cityGroup of BackendService.cityGroups) {
      cityGroup.completeLink = `https://t.me/joinchat/${cityGroup.telegramInvitationLink}`
      this.cityGroups.push(cityGroup)
    }
  }

  public onDanceStyleSelected(danceStyle: any) {
    this.selectedDanceStyle = danceStyle
  }

  // public onCitySelected(item: string) {
  //   const countryCode = item.split('flags/')[1].split('.svg')[0]
  //   for (const countryWithCities of AppComponent.countriesAndCities) {
  //     if (countryWithCities.countryCode.toLowerCase() === countryCode) {
  //       for (const city of countryWithCities) {
  //         if (item.split(ModuleService.delimiter)[0] === city.name) {
  //           this.selectedCity = city.name
  //         }
  //       }
  //     }
  //   }
  // }

  public clickInsights() {
    this.showInsights = !this.showInsights
  }
}
