import { Component, OnInit } from '@angular/core'
import { User } from '../../../state/models'
import { PaymentsService } from 'src/app/services/payments.service'

@Component({
  selector: 'app-user-payment',
  template: `
    <app-user-payment-status [users]="users"></app-user-payment-status>
  `
})
export class UserPaymentComponent implements OnInit {
  users: User[]

  constructor(private paymentService: PaymentsService) {}

  ngOnInit() {
    this.paymentService.getUsersWithPayment().subscribe((data) => {
      this.users = data
    })
  }
}
