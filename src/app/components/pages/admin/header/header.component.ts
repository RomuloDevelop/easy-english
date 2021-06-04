import { Component, EventEmitter, Output, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'

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
        label: 'File',
        icon: 'pi pi-fw pi-file'
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil'
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user'
      },
      {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar'
      },
      {
        separator: true
      },
      {
        label: 'Quit',
        icon: 'pi pi-fw pi-power-off'
      }
    ]
  }
}
