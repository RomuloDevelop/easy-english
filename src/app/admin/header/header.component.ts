import { Component, EventEmitter, Output, OnInit } from '@angular/core'
import { SessionService } from '../../services/session.service'
import { MenuItem } from 'primeng/api'
import ContactInfo from '../../../data/networks'

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() openNav = new EventEmitter()
  @Output() logout = new EventEmitter()
  items: MenuItem[]
  viewProfile = false
  rrss = ContactInfo.getNetworks()
  phones = ContactInfo.getPhones()
  classApplied = false

  constructor() {}

  open() {
    this.openNav.emit()
  }

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
