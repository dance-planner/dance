import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.css', '../app.component.css'],
})
export class RangeComponent {

  @Input() public currentRange: number
  @Input() public maximumRange: number
  @Input() public minimumRange: number
  @Input() public cityName: string
  @Output() public setValue = new EventEmitter<number>()

  public handleChange() {
    this.setValue.emit(this.currentRange)
  }
}
