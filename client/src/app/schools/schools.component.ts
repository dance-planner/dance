import { Component, Input } from '@angular/core'
import { AppComponent } from '../app.component'
import { ModuleService } from '../module.service'

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./../app.component.css'],
})
export class SchoolsComponent {

  @Input() public formattedCities: any
  @Input() public city: any

  public async onCitySelected(item: string) {
    for (const city of AppComponent.countriesAndCities) {
      if (item.split(ModuleService.delimiter)[0] === city.name) {
        this.city = city
      }
    }
  }

  public getLink(cityName: string, countryCode?: string) {
    if (countryCode === undefined) {
      return `https://www.google.de/search?q=dance+school+${cityName}`
    }

    return `https://www.google.de/search?q=dance+school+${cityName}+(${countryCode})`
  }
}
