import { Injectable } from '@angular/core'
import { NavBarProvider } from './navbar/navbar.provider'

// import { BackendService } from '../backend.service';

import { ICardData } from './card/card.interfaces'
import { GeoService } from './geo.service'
import { IEvent, initialRange } from './shared-interfaces-and-constants'
import { dances } from '../dances'
import { BackendService } from './backend.service'
import { INavbarData } from 'ng-responsive-navbar'

export interface IModuleData {
  danceStyles: string[]
  formattedCities: string[]
  selectedDanceStyle: string
  placeHolder: string
  itemSize: number
  height: number
  typeAheadConfig: any
  navBarData: INavbarData
  selectedCity: string
  minimumRange: number
  maximumRange: number
  // currentRange: number
  cards: ICardData[]
  minPop: number
}

export interface IFlagAndCity {
  flagUrl: string
  cityName: string
}

@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  public static delimiter = ' |fance#< '
  public danceStyles: string[] = dances
  public formattedCities: string[] = []
  public selectedDanceStyle = 'Choose Dance Style'
  public selectedCity = 'Choose Location'
  public placeHolder = 'Start Typing ...'
  public itemSize = 400
  public height = 3000
  public typeAheadConfig: any = this.getTypeAheadConfig()
  public minimumRange = 10
  public maximumRange = 70
  public currentRange = initialRange
  public cards: ICardData[] = []
  public minPop = 1000

  public constructor(private readonly geoService: GeoService, private readonly backendService: BackendService) {

  }

  public getModuleData(): IModuleData {
    const moduleData: IModuleData = {
      danceStyles: this.danceStyles,
      formattedCities: this.formattedCities,
      selectedDanceStyle: this.selectedDanceStyle,
      placeHolder: this.placeHolder,
      itemSize: this.itemSize,
      height: this.height,
      typeAheadConfig: this.typeAheadConfig,
      navBarData: NavBarProvider.getNavBarData('en'),
      selectedCity: this.selectedCity,
      minimumRange: this.minimumRange,
      maximumRange: this.maximumRange,
      cards: this.cards,
      minPop: this.minPop,
    }

    // alert(this.cards[0].linkToThisItem);
    return moduleData
  }

  public getTypeAheadConfig(): any {
    return {
      debounceTimeInMilliSeconds: 200,
      showAfterXLetters: 1,
      maxAmountOfDisplayedItems: 10,
    }
  }

  public async prepareCardsFromEvents(events: IEvent[], pointOfInterest: any, jwt: string): Promise<void> {
    const cards: ICardData[] = []
    let counter = 0
    // alert(JSON.stringify(events[0]))

    for (const event of events) {
      counter += 1
      // if (counter < 7) {
      //   const objectURL = await this.backendService.fetchImage((`${BackendService.dataURL}/getImage/name/${event.imageName}`), {
      //     method: 'GET',
      //     headers: {
      //       jwt,
      //     },
      //   })
      //   imageURL = objectURL
      // } else {
      //   imageURL = `${BackendService.dataURL}/getImage/name/${event.imageName}` // will be replaced on demand after scrolling ...
      // }

      const formattedDances = event.dances.replace(/, /g, '-')
      const imageName = `dancing-${formattedDances}-in-${event.city}-${event.countryCode}-on-${event.startDate}-${event.id}.jpg`
      // const imageURL = `https://github.com/dance-planner/dance/blob/master/events/${imageName}?raw=true`
      const imageURL = `https://danceplanner.org/images/getEventImage/name/${imageName}`

      const card: ICardData = {
        eventID: event.id,
        title: event.title,
        dance: event.dances,
        info: event.title,
        details: '',
        date: event.startDate,
        countryCode: event.countryCode,
        city: event.city,
        linkToThisItem: (window.location.toString().indexOf('?id=') === -1) ? `${window.location}?id=${event.id}` : window.location.toString(),
        linkToFurtherInfo: event.link,
        imageURL,
        distance: this.geoService.getDistance(event.lat, event.lon, pointOfInterest.lat, pointOfInterest.lon),
      }

      cards.push(card)
    }

    this.cards = cards
  }

  public prepareCityTypeAhead(cities) {
    for (const city of cities) {
      const cityWithFlagUrl =
          `${city.name}${ModuleService.delimiter}../../assets/flags/${city.country.toLowerCase()}.svg`
      this.formattedCities.push(cityWithFlagUrl)
    }

    return this.formattedCities
  }
}
