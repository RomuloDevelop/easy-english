import { Component } from '@angular/core'
import { User } from '../../../state/models'
import { PaymentsService } from 'src/app/services/payments.service'

@Component({
  selector: 'app-user-no-payment',
  template: `
    <app-user-payment-status [getData]="getData()"></app-user-payment-status>
  `
})
export class UserNoPaymentComponent {
  constructor(private paymentService: PaymentsService) {}

  getData() {
    return this.paymentService.getUsersWithoutPayment.bind(this.paymentService)
  }
}
