import { Component, Input, OnInit } from '@angular/core'
import { User } from '../../../state/models'
import { STATUS_LIST } from 'src/app/services/user.service'
import { keyBy } from 'lodash'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-user-payment-status',
  templateUrl: './user-payment-status.component.html',
  styleUrls: ['./user-payment-status.component.scss']
})
export class UserPaymentStatusComponent implements OnInit {
  @Input() getData: () => Observable<User[]>
  users: User[]
  loadingUsers = false

  statuses = keyBy(STATUS_LIST, 'id')
  selectedUser: User
  showStatusModal = false

  userCols = ['Id', 'Name', 'Email', 'Status']
  userRows = ['id', 'name', 'email', 'status']

  role: number

  constructor() {}

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.loadingUsers = true
    this.getData().subscribe(
      (users) => {
        this.users = users
      },
      () => {},
      () => (this.loadingUsers = false)
    )
  }

  editStatus(user: User) {
    this.selectedUser = user
    this.showStatusModal = true
  }

  modified() {
    this.loadData()
  }
}
