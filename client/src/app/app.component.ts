import { Component, HostListener, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as arrayMove from 'array-move'
import { Observable } from 'rxjs'
import { BackendService } from './backend.service'
import { GeoService } from './geo.service'
import { IModuleData, ModuleService } from './module.service'
import { IEvent, initialRange } from './shared-interfaces-and-constants'
import * as moment from 'moment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  public static deferredPrompt
  public static countriesAndCities

  @Input() public static sessionWithoutCookieId: string
  public scrollPosition = 0
  public eventId: Observable<string>
  public title = 'Dance Planner'
  public allEvents: IEvent[] = []
  public events: IEvent[] = []
  public view = 'find'
  public city: any
  public dance = ''
  public md: IModuleData
  public placeHolder = 'Start Typing ...'
  public poi: any = {}
  public selectedItem = 'Bachata'
  public inputStyle = {}
  public readyForPrompt = false
  public alreadyPromotedTheApp = false
  public restToBeLoaded = true
  public initialRange = initialRange
  public minimumRange = 11
  public maximumRange = 100
  public dpAccessToken
  public currentRange = initialRange

  public dances: string[] = [
    'Bachata',
    'Salsa',
    'Merengue',
  ]
  public loaded = false
  public thirtysecondsover = false
  // private geoData
  // private ip = '0'

  private readonly referenceMoment = moment(moment().format('YYYY-MM-DD')).subtract(1, 'h')

  public constructor(private readonly route: ActivatedRoute,
                     private readonly moduleService: ModuleService,
                     private readonly geoService: GeoService,
                     private readonly backendService: BackendService) { }

  @HostListener('window:scroll', ['$event'])
  public onScroll(e) {
    // console.log(this.scrollPosition)
    this.scrollPosition = window.pageYOffset
  }

  public ngOnInit() {
    if (this.allEvents === undefined || this.allEvents === null || this.allEvents.length === 0) {

      BackendService.backendURL = 'https://danceplanner.org'
      // BackendService.backendURL = 'http://localhost:3001'
      this.route
        .queryParamMap
        .subscribe((result: any) => {
          if (result.params !== undefined) {
            if (result.params.id !== undefined) {
              this.eventId = result.params.id
            } else if (result.params.group !== undefined) {
              if (result.params.group === 'findDancePartners') {

                this.view = 'findDancePartners'

              } else {
                this.backendService.getGroupLink(result.params.group)
                  .subscribe((theGroup: any) => {
                    location.assign(`https://t.me/joinchat/${theGroup.link}`)
                  })
              }
            }
          }
        })

      setTimeout(() => {
        this.backendService.getCities()
          .subscribe((result: any) => {
            AppComponent.countriesAndCities = result
            this.moduleService.prepareCityTypeAhead(AppComponent.countriesAndCities)
          })
      },         2700)

      window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault()
        AppComponent.deferredPrompt = event
      })

      this.getLandingPageData()

    }
  }
  public clickFurtherEvents() {
    window.scrollTo(0, 0)
  }

  public async onDanceStyleSelected(item: string) {
    this.dance = item
    this.filterEvents(this.city, this.dance, this.currentRange)
    await this.moduleService.prepareCardsFromEvents(this.events, this.poi)
    this.md = this.moduleService.getModuleData()
  }

  public async onCitySelected(item: string) {
    for (const city of AppComponent.countriesAndCities) {
      if (item.split(ModuleService.delimiter)[0] === city.name) {
        this.city = city
        this.filterEvents(this.city, this.dance, this.currentRange)
        await this.moduleService.prepareCardsFromEvents(this.events, this.poi)
        this.md = this.moduleService.getModuleData()
        this.md.selectedCity = city.name
      }
    }
  }
  public async handleRangeSetting($event) {
    this.currentRange = $event
    this.filterEvents(this.city, this.dance, this.currentRange)
    await this.moduleService.prepareCardsFromEvents(this.events, this.poi)
    this.md = this.moduleService.getModuleData()
    this.md.selectedCity = this.city.name
    // this.useAsApp(11)
  }

  public onClickMenuEntry(target: string) {

    if (target === 'find') {
      window.location.reload()
    } else if (target === 'create') {
      location.assign('https://t.me/danceplanner_bot')
    } else if (target === 'app') {
      history.replaceState(null, null, ' ')
      this.useAsApp(0)
      this.view = 'find'
    } else {
      this.view = target
    }
  }

  public useAsApp(secondsDelay: number): any {

    if (!this.alreadyPromotedTheApp) {
      this.alreadyPromotedTheApp = true
      setTimeout(() => {
        if (AppComponent.deferredPrompt === undefined) {
          alert('To use the App Version please click the Share Button at the bottom of your browser and click "Add to Homescreen".')
        } else {
          AppComponent.deferredPrompt.prompt()
          AppComponent.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt')
            } else {
              console.log('User dismissed the A2HS prompt')
            }
            AppComponent.deferredPrompt = null
          })
        }
      },         secondsDelay * 1000)
    }
  }

  private getLandingPageData() {
    this.backendService.getLandingPageData()
      .subscribe(async (result: any) => {
        this.poi = {
          lat: result[1].lat,
          lon: result[1].lon,
        }

        this.city = result[1]
        this.allEvents = (this.eventId === undefined) ?
          result[0] :
          this.handleSpecificEventRequest(result[0])

        this.filterEvents(this.city, this.dance, this.initialRange)

        if (this.events.length < 4) {
          this.initialRange = 40
          this.filterEvents(this.city, this.dance, this.initialRange)
        }

        await this.moduleService.prepareCardsFromEvents(this.events, this.poi)
        this.md = this.moduleService.getModuleData()
        this.currentRange = this.initialRange
        this.loaded = true
      },         (error) => {
        console.log(error)
      })
  }

  private handleSpecificEventRequest(allEvents): IEvent[] {
    let sortedSpecifically: IEvent[] = allEvents
    const theSpecificEvent: IEvent = sortedSpecifically.filter(
      (event: IEvent) => event.id === (this.eventId as unknown),
    )[0]
    if (theSpecificEvent === undefined) {
      alert('I could not find the specific event. Perhaps it was in the past.')
      location.assign('https://dance-planner.org')
    } else {
      const distance = this.geoService.getDistance(theSpecificEvent.lat, theSpecificEvent.lon, this.city.lat, this.city.lon)
      this.initialRange = Math.round(distance > this.initialRange
        ? distance + 11
        : this.initialRange,
      )
      this.maximumRange = this.initialRange * 3
      const indexOfTheRequestedEventInArray = sortedSpecifically.indexOf(
        theSpecificEvent,
      )

      if (indexOfTheRequestedEventInArray !== 0) {
        sortedSpecifically = arrayMove(
          sortedSpecifically,
          indexOfTheRequestedEventInArray,
          0,
        )
      }

      return sortedSpecifically
    }
  }

  private filterEvents(city: any, dance: string, range: number) {
    // console.log(`filtering ${this.allEvents.length} events by ${dance} and ${range} and ${JSON.stringify(city)}`)
    this.events = []
    for (const event of this.allEvents) {

      const distance = this.geoService.getDistance(city.lat, city.lon, event.lat, event.lon)
      if (distance < range && (dance === '' || dance === 'All Dance Styles' || event.dances.toLowerCase().indexOf(dance.toLowerCase()) !== -1) && ((this.referenceMoment.isBefore(moment(event.startDate))))) {
        this.events.push(event)
      }
      if (dance === '----------------------------------------' && event.dances === '' && !this.titleIncludesDanceStuff(event.title)) {
        this.events.push(event)
        // if (this.events.length > 20) {
        //   return
        // }
      }

      // if (this.events.length > 27) {
      //   return
      // }
    }
  }

  private titleIncludesDanceStuff(title) {
    const partyStuff = [
      'beat',
      'move',
      'shake',
    ]
    for (const party of partyStuff) {
      if (title.indexOf(party) !== -1) {
        return true
      }
    }

    return false
  }
}
