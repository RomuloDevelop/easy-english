import { Component, EventEmitter, Output } from '@angular/core'
import ContactInfo from '../../../../data/networks'
@Component({
  selector: 'app-header-style-two',
  templateUrl: './header-style-two.component.html',
  styleUrls: ['./header-style-two.component.scss']
})
export class HeaderStyleTwoComponent {
  @Output() logout = new EventEmitter()
  loading = false
  phones = ContactInfo.getPhones()
  classApplied = false
  classApplied2 = false
  classApplied3 = false

  constructor() {}

  toggleClass() {
    this.classApplied = !this.classApplied
  }

  toggleClass2() {
    this.classApplied2 = !this.classApplied2
  }

  toggleClass3() {
    this.classApplied3 = !this.classApplied3
  }
}
