import { Component, OnInit } from '@angular/core'
import { CourseService } from '../course.service'
import { MenuItem } from 'primeng/api'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[]
  viewProfile = false

  constructor(private courseService: CourseService) {}

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

  openNav() {
    this.courseService.hideMenuMesage(true)
  }
}
