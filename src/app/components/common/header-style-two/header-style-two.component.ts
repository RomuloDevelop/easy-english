import { Component } from '@angular/core'
import ContactInfo from '../../../../data/networks'
@Component({
  selector: 'app-header-style-two',
  templateUrl: './header-style-two.component.html',
  styleUrls: ['./header-style-two.component.scss']
})
export class HeaderStyleTwoComponent {
  constructor() {}

  phones = ContactInfo.getPhones()
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
