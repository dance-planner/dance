import { Component, OnInit, Input } from '@angular/core'
import { IEvent } from '../shared-interfaces-and-constants'
import { BackendService } from '../backend.service'

@Component({
  selector: 'app-further-options',
  templateUrl: './further-options.component.html',
  styleUrls: ['./further-options.component.css', '../app.component.css'],
})
export class FurtherOptionsComponent implements OnInit {

  @Input() public allEvents: IEvent[]
  @Input() public interest = ''

  public groupLink = ''
  public addingGroupLink = false
  public selectedDanceStyle = ''
  public selectedCity = ''
  public searchTerm = ''
  public title = 'Dance Partners'
  public showInsights = false
  public showFacebookGroups = false
  public showTelegramGroups = false
  public readyForDisplay = false
  public danceGroups: any[]
  public filteredDanceGroups: any[]
  public sortingDirectionDown = false
  public cityGroups: any[] = []

  public constructor(private readonly backendService: BackendService) { }

  public ngOnInit() {

    if (this.interest === 'findTutorials') {
      this.title = 'Tutorials'
    } else if (this.interest === 'findOutfits') {
      this.title = 'Outfit Sharing Groups'
    }

    this.backendService.getDanceGroups()
      .subscribe((result: any[]) => {
        this.danceGroups = result
        this.readyForDisplay = true

        for (const cityGroup of this.danceGroups) {
          cityGroup.completeLink = `https://t.me/joinchat/${cityGroup.telegramInvitationLink}`
          if (this.interest === 'findTutorials') {
            if (cityGroup.cityName === '') {
              this.cityGroups.push(cityGroup)
            }
          } else {
            this.cityGroups.push(cityGroup)
          }
        }
      })
  }

  public onDanceStyleSelected(danceStyle: any) {
    this.selectedDanceStyle = danceStyle
  }

  public clickInsights() {
    this.showInsights = !this.showInsights
  }
}
