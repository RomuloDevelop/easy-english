import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { User } from '../../../state/models'
import { ConfirmationService, PrimeNGConfig, Message } from 'primeng/api'
import { PaymentsService, Payment } from 'src/app/services/payments.service'

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  loadingPayments = false
  msgs: Message[] = []

  paymentCols = ['Id', 'Name', 'Email', 'Phone', 'Day of Payment']
  paymentRows = ['id', 'name', 'email', 'phone', 'dateFormated']

  payments: Payment[]

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private paymentService: PaymentsService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.getTable()
  }

  getTable() {
    this.loadingPayments = true
    this.paymentService
      .getPayments(() => (this.loadingPayments = false))
      .subscribe(
        (payments) => (this.payments = payments),
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

  editPayment(payment: Payment) {
    this._router.navigate(['edit', payment.id], {
      relativeTo: this.route
    })
  }

  confirmDeletePayment(payment: Payment) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.msgs = [
          { severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }
        ]
        this.deletePayment(payment)
      },
      reject: () => {
        this.msgs = [
          { severity: 'info', summary: 'Rejected', detail: 'You have rejected' }
        ]
        console.error(this.msgs)
      }
    })
  }

  deletePayment(payment: Payment) {
    this.paymentService.deletePayment(payment.id).subscribe(
      () => {},
      (err) => {
        console.error(err)
      }
    )
  }
}
