import { Component, OnInit, Input } from '@angular/core'
import { IEvent, IDanceGroup } from '../shared-interfaces-and-constants'
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-further-options',
  templateUrl: './further-options.component.html',
  styleUrls: ['./further-options.component.css', '../app.component.css'],
})
export class FurtherOptionsComponent implements OnInit {

  @Input() public allEvents: IEvent[]
  @Input() public danceStyles
  @Input() public cities
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
    this.backendService.getDanceGroups('')
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

  public clickInsights() {
    this.showInsights = !this.showInsights
  }
}
