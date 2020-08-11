import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { ModuleService } from '../module.service'

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['../app.component.css'],
})
export class TypeaheadComponent implements OnInit {

  @Input() public placeHolder
  @Input() public useCustomTemplate: boolean
  @Input() public items: string[]
  @Input() public selectedItem
  @Input() public domain: string
  @Input() public maxNumberOfProposals

  @Output() public itemSelected = new EventEmitter<string>()

  public selectedItemBackup = this.selectedItem
  public formattedCities: string[] = []
  public inputStyle: any

  public ngOnInit() {
    this.inputStyle = this.getTypeAheadStyle(this.domain)
  }

  public getImageUrl(item: string): string {
    if (item.indexOf(ModuleService.delimiter) !== -1) {
      const imgUrl = item.split(ModuleService.delimiter)[1]

      return imgUrl
    }

    return 'https://fance-stiftung.de/api/app/app-images/logo.png'
  }

  public getThePureString(item: string): string {
    if (item.indexOf(ModuleService.delimiter) !== -1) {
      return item.split(ModuleService.delimiter)[0]
    }

    return item
  }

  public onInputClicked() {
    this.selectedItemBackup = this.selectedItem
    this.selectedItem = ''
  }

  public onInputLeft() {
    if (this.selectedItem === '') {
      this.selectedItem = this.selectedItemBackup
    }
  }

  public onItemSelected(item: any) {
    let selectedString: string
    if (typeof (item) === 'string') {
      selectedString = item
      this.itemSelected.emit(selectedString)
    } else {
      selectedString = item.item.split(ModuleService.delimiter)[0]
      this.itemSelected.emit(item.item)
    }
    this.selectedItem = selectedString
  }

  public getTypeAheadStyle(client: string) {
    if (client === 'dances') {

      return {
        'width': '100%',
        'font-size': '22px',
        'min-height': '2.4em',
        'background-color': '#000',
        'text-align': 'center',
        'color': 'rgb(213,54,84)',
      }
    }

    return {
      'width': '100%',
      'font-size': '22px',
      'min-height': '2.4em',
      'background-color': '#000',
      'text-align': 'center',
      'color': 'rgb(93,188, 210)',

    }

  }
}
