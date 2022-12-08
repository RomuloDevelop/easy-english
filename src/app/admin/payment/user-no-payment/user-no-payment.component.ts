import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { User } from '../../../state/models'
import { ConfirmationService, Message } from 'primeng/api'
import { PaymentsService } from 'src/app/services/payments.service'

@Component({
  selector: 'app-user-no-payment',
  templateUrl: './user-no-payment.component.html',
  styleUrls: ['./user-no-payment.component.scss']
})
export class UserNoPaymentComponent implements OnInit {
  actualUser: User
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
    private paymentService: PaymentsService
  ) {}

  ngOnInit() {
    this.paymentService.getUsersWithoutPayment().subscribe((data) => {
      this.users = data
    })
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

  deleteUser(user: User) {}
}
