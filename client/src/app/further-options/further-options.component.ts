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

  // public searchGroup(): void {
  //   this.filteredDanceGroups = this.danceGroups.filter((entry: IDanceGroup) => {
  //     if (entry.city.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 ||
  //       entry.dance.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1 ||
  //       entry.groupType.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
  //       return true
  //     }

  //     return false
  //   })
  // }

  // public clickShowTelegramGroups() {
  //   this.showTelegramGroups = !this.showTelegramGroups
  // }

  public onCitySelected(item: string) {
    const countryCode = item.split('flags/')[1].split('.svg')[0]
    for (const countryWithCities of AppComponent.countriesAndCities) {
      if (countryWithCities.countryCode.toLowerCase() === countryCode) {
        for (const city of countryWithCities) {
          if (item.split(ModuleService.delimiter)[0] === city.name) {
            this.selectedCity = city.name
          }
        }
      }
    }
  }

  // public addDanceGroup() {

  //   const groupType: EGroupType | '' = this.getGroupTypeFromLink(this.groupLink)
  //   if (groupType === '') {
  //     alert('Almost perfect. Your link should start with https://www.chat.whatsapp.com/ or with https://www.facebook.com/groups/ or with https://t.me/joinchat/')
  //   } else {

  //     const newGroup: IDanceGroup = {
  //       city: this.selectedCity,
  //       groupType,
  //       dance: this.selectedDanceStyle,
  //       id: this.getIDFromGroupLink(this.groupLink, groupType),
  //     }

  //     this.backendService.postDanceGroup(newGroup, this.jwt, this.dpAccessToken, this.fblogin)
  //       .subscribe((result: IDanceGroup[]) => {
  //         this.danceGroups = result
  //         this.addingGroupLink = false
  //         this.groupLink = ''
  //         this.selectedDanceStyle = ''
  //         this.selectedCity = ''
  //       })

  //   }
  // }

  // public allDataIsValid(): boolean {
  //   if (this.getGroupTypeFromLink(this.groupLink) === '') {

  //     return false
  //   }

  //   return true
  // }

  public clickInsights() {
    this.showInsights = !this.showInsights
  }

  // public clickshowFacebookGroups() {
  //   this.showFacebookGroups = !this.showFacebookGroups
  // }

  // public startAdding() {
  //   this.addingGroupLink = true
  // }

  // public groupClicked(group: IDanceGroup) {
  //   if (confirm(`This will forward you to a ${group.groupType} Group, which someone in the world wide web entered here.`)) {
  //     window.location.assign(this.getLink(group))
  //   }

  // }

  // public sortBy(sortBy: string) {
  //   this.sortingDirectionDown = !this.sortingDirectionDown

  //   return (this.sortingDirectionDown) ?
  //     this.sortAscending(this.danceGroups, sortBy) :
  //     this.sortDescending(this.danceGroups, sortBy)

  // }

  // public isGroupLinkValid(): boolean {
  //   if (this.groupLink.indexOf('https://www.facebook.com') === 0 || this.groupLink.indexOf('https://www.chat.whatsapp.com') === 0 || this.groupLink.indexOf('https://t.me') === 0) {
  //     return true
  //   }

  //   alert(`Your Group Link should either start with: https://www.facebook.com or with https://www.chat.whatsapp.com or with https://t.me`)

  //   return false
  // }

//   private sortAscending(dancegroups: IDanceGroup[], sortBy: string): IDanceGroup[] {

//     switch (sortBy) {

//       case 'city': return dancegroups.sort((dancegroup1: IDanceGroup, dancegroup2: IDanceGroup) => {
//         if (dancegroup1.city > dancegroup2.city) {
//           return 1
//         }

//         if (dancegroup1.city < dancegroup2.city) {
//           return -1
//         }

//         return 0
//       })

//       case 'type': return dancegroups.sort((dancegroup1: IDanceGroup, dancegroup2: IDanceGroup) => {
//         if (dancegroup1.city > dancegroup2.city) {
//           return 1
//         }

//         if (dancegroup1.city < dancegroup2.city) {
//           return -1
//         }

//         return 0
//       })

//       case 'dance': return dancegroups.sort((dancegroup1: IDanceGroup, dancegroup2: IDanceGroup) => {
//         if (dancegroup1.dance > dancegroup2.dance) {
//           return 1
//         }

//         if (dancegroup1.dance < dancegroup2.dance) {
//           return -1
//         }

//         return 0
//       })

//       default: return []
//     }
//   }

//   private sortDescending(dancegroups: IDanceGroup[], sortBy: string): IDanceGroup[] {
//     switch (sortBy) {

//       case 'city':
//         return dancegroups.sort((dancegroup1: IDanceGroup, dancegroup2: IDanceGroup) => {
//           if (dancegroup1.city < dancegroup2.city) {
//             return 1
//           }

//           if (dancegroup1.city > dancegroup2.city) {
//             return -1
//           }

//           return 0
//         })

//       case 'type':
//         return dancegroups.sort((dancegroup1: IDanceGroup, dancegroup2: IDanceGroup) => {
//           if (dancegroup1.city < dancegroup2.city) {
//             return 1
//           }

//           if (dancegroup1.city > dancegroup2.city) {
//             return -1
//           }

//           return 0
//         })

//       case 'dance':
//         return dancegroups.sort((dancegroup1: IDanceGroup, dancegroup2: IDanceGroup) => {
//           if (dancegroup1.city < dancegroup2.city) {
//             return 1
//           }

//           if (dancegroup1.city > dancegroup2.city) {
//             return -1
//           }

//           return 0
//         })
//       default: return []
//     }
//   }

//   private getGroupTypeFromLink(groupLink: string): EGroupType | '' {

//     if (groupLink.indexOf('https://t.me/joinchat/') !== -1) { return EGroupType.Telegram }
//     if (groupLink.indexOf('https://www.facebook.com/groups/') !== -1) { return EGroupType.Telegram }
//     if (groupLink.indexOf('https://www.chat.whatsapp.com/') !== -1) { return EGroupType.Telegram }

//     return ''
//   }

//   private getIDFromGroupLink(groupLink: string, groupType): string {

//     switch (groupType) {
//       case 'Telegram': return groupLink.split('/')[4]
//       case 'Facebook': return groupLink.split('/')[4]
//       case 'WhatsApp': return groupLink.split('/')[4]
//       default: alert('ä')
//     }
//   }

//   private getLink(group: IDanceGroup): string {
//     switch (group.groupType) {
//       case 'Telegram': return `https://t.me/joinchat/${group.id}`
//       case 'Facebook': return `https://www.facebook.com/groups/${group.id}`
//       case 'WhatsApp': return `https://www.chat.whatsapp.com/${group.id}`
//       default: alert('ä')
//     }
//   }
//
}
