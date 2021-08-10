import { Component, EventEmitter, Output, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import ContactInfo from '../../../data/networks'

@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() openNav = new EventEmitter()
  items: MenuItem[]
  viewProfile = false
  open() {
    this.openNav.emit()
  }

  constructor() {}

  rrss = ContactInfo.getNetworks()
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
  ngOnInit() {
    this.items = [
      {
        label: 'My Profile',
        icon: 'pi pi-fw pi-user'
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        routerLink: '/'
      }
    ]
  }
}
