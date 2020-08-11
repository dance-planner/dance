import { Component, Input } from '@angular/core'
import { ICardData } from './card.interfaces'
import * as moment from 'moment'
import { BackendService } from '../backend.service'
import { ICityGroup } from '../shared-interfaces-and-constants'

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css', '../app.component.css'],
})
export class CardComponent {

  public static userKnowsHeCanClickAnEventImage = false

  @Input() public card: ICardData
  @Input() public jwt: string

  public detailLevel = 1
  public shareMode = false
  public reportingMode = false
  public reportedBecause = ''
  public ready = false
  public weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  public getImagePath(): any {
    return this.card.imageURL
  }

  public clickShare() {
    this.shareMode = !this.shareMode
  }

  public clickDetails() {
    this.detailLevel += 1
    if (this.detailLevel === 3) {
      this.detailLevel = 0
    }
  }

  public getLinkToTutorials() {
    return `https://www.youtube.com/results?search_query=${this.card.dance}+dance+tutorial`
  }

  public getLinkToPartners() {
    const cityGroupForEvent = BackendService.cityGroups.filter((e: ICityGroup) => e.countryCode.toLowerCase() === this.card.countryCode.toLowerCase() && e.cityName.toLowerCase() === this.card.city.toLowerCase())[0]
    if (cityGroupForEvent === undefined || cityGroupForEvent.telegramInvitationLink === '') {
      return 'https://www.google.com/search?q=https://www.facebook.com groups bachata hamburg'
    }

    return `https://t.me/joinchat/${cityGroupForEvent.telegramInvitationLink}`
  }

  public getLinkToDrivers() {
    return `https://www.google.com/search?q=taxi+${this.card.city} ${this.card.countryCode}`
  }

  public copyText(eventID: string) {
    const val = document.getElementById(eventID).innerHTML.trim()
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = val
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    selBox.setSelectionRange(0, 9999)
    document.execCommand('copy')
    document.body.removeChild(selBox)

    alert('Invitationlink copied to clipboard. Ready to share it with your friends.')
  }

  public clickCard() {
    CardComponent.userKnowsHeCanClickAnEventImage = true
    this.detailLevel += 1
    if (this.detailLevel === 3) {
      this.detailLevel = 0
    }
  }

  public getTimeInfo(): string {
    if (moment(this.card.date).isSame(moment(), 'days')) {
      return 'Today'
    }
    if (moment(this.card.date).isSame(moment().add(1, 'days'), 'days')) {
      return 'Tomorrow'
    }

    return `${this.getWeekDay(this.card.date)}`
  }

  public getWeekDay(nextOccurrenceRaw: string): string {
    const weekdayNumber = moment(nextOccurrenceRaw).weekday()
    const weekdayText = this.weekDays[weekdayNumber]

    return weekdayText
  }
}
