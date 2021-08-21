import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Store, select } from '@ngrx/store'
import { User } from '../../../state/models'
import { selectUsers } from '../../../state/admin/admin.selectores'
import { ConfirmationService, PrimeNGConfig, Message } from 'primeng/api'
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  loadingUsers = false
  msgs: Message[] = []

  userCols = ['Id', 'Name', 'Email', 'Phone', 'Day of Birth']
  userRows = ['id', 'name', 'email', 'phone', 'dob']

  users: User[]

  role: number

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private store: Store,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.route.paramMap.subscribe((params) => {
      this.role = parseInt(params.get('role'))
      this.getTable()
      this.store.pipe(select(selectUsers)).subscribe((data) => {
        console.log(data)
        this.users = data
      })
    })
  }

  getTable() {
    this.loadingUsers = true
    this.userService
      .getUsers(this.role, () => (this.loadingUsers = false))
      .subscribe(
        (users) => {},
        (err) => {
          console.error(err)
        }
      )
  }

  toCreatePage() {
    this._router.navigate(['create'], {
      relativeTo: this.route
    })
  }

  editUser(user: User) {
    this._router.navigate(['edit', user.id], {
      relativeTo: this.route
    })
  }

  // changeStatus(e, course: CoursesTableRow) {
  //   const { id } = course
  //   this.courseService
  //     .updateCourse({ id, status: e.checked })
  //     .subscribe((data) => console.log(data))
  // }

  confirmDeleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.msgs = [
          { severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }
        ]
        this.deleteUser(user)
      },
      reject: () => {
        this.msgs = [
          { severity: 'info', summary: 'Rejected', detail: 'You have rejected' }
        ]
        console.error(this.msgs)
      }
    })
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user.id).subscribe(
      () => {},
      (err) => {
        console.error(err)
      }
    )
  }
}
