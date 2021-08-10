import { Component } from '@angular/core'
import ContactInfo from '../../../../data/networks'

@Component({
  selector: 'app-header-style-three',
  templateUrl: './header-style-three.component.html',
  styleUrls: ['./header-style-three.component.scss']
})
export class HeaderStyleThreeComponent {
  phones = ContactInfo.getPhones()

  constructor() {}

  classApplied = false
  toggleClass() {
    this.classApplied = !this.classApplied
  }

  classApplied2 = false
  toggleClass2() {
    this.classApplied2 = !this.classApplied2
  }

  classApplied3 = false
  toggleClass3() {
    this.classApplied3 = !this.classApplied3
  }
}
