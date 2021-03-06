import { Component, Input, Output, EventEmitter } from '@angular/core'
import { ICardData } from './card.interfaces'
import * as moment from 'moment'
import { DomSanitizer } from '@angular/platform-browser'
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

  @Output() public reportEvent = new EventEmitter<string>()
  public detailLevel = 1
  public shareMode = false
  public reportingMode = false
  public reportedBecause = ''
  public furtherInfo = 'Further Info'
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
  public constructor(private readonly sanitizer: DomSanitizer, private readonly backendService: BackendService) {

    setTimeout(() => {
      if (!CardComponent.userKnowsHeCanClickAnEventImage) {
        CardComponent.userKnowsHeCanClickAnEventImage = true
      }
    },         20000)

  }

  public getImagePath(): any {

    return this.sanitizer.bypassSecurityTrustResourceUrl(this.card.imageURL)
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

  public findADriver() {
    if (confirm(`Until now no private driver registered for this event. Shall I foward you to a taxi company in ${this.card.city}?`)) {
      location.assign(`https://www.google.com/search?q=taxi+${this.card.city}`)
    }
  }

  public report() {
    this.reportEvent.emit(this.card.eventID)
  }

  public getLinkToTutorials() {

    if (this.card.dance.includes('Salsa')) {
      return 'https://dance-planner.org/?group=teo'
    }
    if (this.card.dance.includes('Bachata')) {
      return 'https://dance-planner.org/?group=bachata'
    }

    return `https://www.youtube.com/results?search_query=${this.card.dance}+dance+tutorial`
  }

  public copyText(eventID: string) {
    const val = `${document.URL.split('?')[0]}?id=${eventID}`
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

    // alert(NavbarComponent.operatingSystem);
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
