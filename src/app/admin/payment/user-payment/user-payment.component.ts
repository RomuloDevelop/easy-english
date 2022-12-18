import { Component } from '@angular/core'
import { PaymentsService } from 'src/app/services/payments.service'

@Component({
  selector: 'app-user-payment',
  template: `
    <app-user-payment-status [getData]="getData()"></app-user-payment-status>
  `
})
export class UserPaymentComponent {
  constructor(private paymentService: PaymentsService) {}

  getData() {
    return this.paymentService.getUsersWithPayment.bind(this.paymentService)
  }
}
