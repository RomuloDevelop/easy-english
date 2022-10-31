import { Component, EventEmitter, Output, OnInit } from '@angular/core'
import { StudentService } from '../../student.service'
import { MenuItem } from 'primeng/api'
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() logout = new EventEmitter()
  items: MenuItem[]
  viewProfile = false

  constructor(private studentService: StudentService, private router: Router) {}

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
        label: 'My courses',
        icon: 'pi pi-fw pi-book',
        command: () => this.router.navigate(['../student'])
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.logout.emit()
      }
    ]
  }

  openNav() {
    this.studentService.hideMenuMesage(true)
  }
}
