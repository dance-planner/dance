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

  public loaded: boolean
  public apiKey: string
  // @HostListener('window:scroll', ['$event'])
  // @HostListener('window:scroll', ['$event']) // for window scroll events
  // private geoData
  // private ip = '0'

  private readonly referenceMoment = moment(moment().format('YYYY-MM-DD')).subtract(1, 'h')

  public constructor(private readonly route: ActivatedRoute,
                     private readonly moduleService: ModuleService,
                     private readonly geoService: GeoService,
                     private readonly backendService: BackendService) { }

  @HostListener('window:scroll', ['$event'])
  public onScroll(e) {
    this.scrollPosition = window.pageYOffset
    // if (this.scrollPosition > 1700 && this.restToBeLoaded) {
    //   void this.loadTheOtherImagesForCurrentSelection()
    // }
  }

  // public async loadTheOtherImagesForCurrentSelection() {
  //   this.restToBeLoaded = false
  //   console.log(`loading additional ${this.md.cards.length - 7} images`)
  //   for (const card of this.md.cards.slice(7, this.md.cards.length)) {
  //     const objectURL = await this.backendService.fetchImage((card.imageURL), {
  //       method: 'GET',
  //       headers: {
  //         jwt: this.apiKey,
  //       },
  //     })
  //     card.imageURL = objectURL
  //   }
  // }

  public ngOnInit() {
    this.apiKey = document.getElementById('apiKey').innerHTML.trim()
    BackendService.backendURL = document.getElementById('backendURL').innerHTML.trim()
    BackendService.apiKey = document.getElementById('apiKey').innerHTML.trim()
    if (BackendService.backendURL === 'backendURLContent' && BackendService.apiKey === 'apiKeyContent') {
      BackendService.backendURL = 'http://localhost:3002'
      BackendService.apiKey = '123'
    }
    this.route
      .queryParamMap
      .subscribe((result: any) => {
        if (result.params !== undefined) {
          this.eventId = result.params.id
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

  public clickFurtherEvents() {
    window.scrollTo(0, 0)
  }
  public async onDanceStyleSelected(item: string) {
    this.dance = item
    this.filterEvents(this.city, this.dance, this.currentRange)
    await this.moduleService.prepareCardsFromEvents(this.events, this.poi, this.apiKey)
    this.md = this.moduleService.getModuleData()
  }

  public async onCitySelected(item: string) {
    const countryCode = item.split('flags/')[1].split('.svg')[0]
    for (const city of AppComponent.countriesAndCities) {
          if (item.split(ModuleService.delimiter)[0] === city.name) {
            this.city = city
            this.filterEvents(this.city, this.dance, this.currentRange)
            await this.moduleService.prepareCardsFromEvents(this.events, this.poi, this.apiKey)
            this.md = this.moduleService.getModuleData()
            this.md.selectedCity = city.name
          }
    }
  }

  public async handleRangeSetting($event) {
    this.currentRange = $event
    this.filterEvents(this.city, this.dance, this.currentRange)
    await this.moduleService.prepareCardsFromEvents(this.events, this.poi, this.apiKey)
    this.md = this.moduleService.getModuleData()
    this.md.selectedCity = this.city.name
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
        BackendService.cityGroups = result[2]
        this.allEvents = (this.eventId === undefined) ?
          result[0] :
          this.handleSpecificEventRequest(result[0])

        this.filterEvents(this.city, this.dance, this.initialRange)

        if (this.events.length < 4) {
          this.initialRange = 40
          this.filterEvents(this.city, this.dance, this.initialRange)
        }

        await this.moduleService.prepareCardsFromEvents(this.events, this.poi, this.apiKey)
        this.md = this.moduleService.getModuleData()
        this.currentRange = this.initialRange
        this.loaded = true
      },         (error) => {
        console.log(error)
      })

    setTimeout(() => {
      if (!this.loaded) {
        alert('There is very much traffic at the moment. This is just a Hobby Project and I did not expect such a strong demand for this service.')
      }
    },         11000)
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
    this.events = []
    this.allEvents.map((event: IEvent) => {
      const distance = this.geoService.getDistance(city.lat, city.lon, event.lat, event.lon)
      if (distance < range && (dance === '' || dance === 'All Dance Styles' || event.dances.toLowerCase().indexOf(dance.toLowerCase()) !== -1) && ((this.referenceMoment.isBefore(moment(event.startDate))))) {
        this.events.push(event)
      }
      if (dance === '----------------------------------------' && event.dances === '' && !this.titleIncludesDanceStuff(event.title)) {
        this.events.push(event)
        if (this.events.length > 20) {
          return
        }
      }

      if (this.events.length > 27) {
        return
      }
    })
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
