import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MessageService } from 'primeng/api'
import { NavigationService } from '../../../services/navigation.service'
import { PaymentsService, Payment } from 'src/app/services/payments.service'
import { UserService } from 'src/app/services/user.service'
import { User } from 'src/app/state/models'
import * as moment from 'moment'

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss']
})
export class CreatePaymentComponent implements OnInit {
  paymentId = parseInt(this.route.snapshot.paramMap.get('id'))
  users: User[] = []
  actualUrl = this.route.snapshot.url.map((segment) => segment.path).join('/')
  willUpdate = false
  loading = false
  statusList = [
    {
      id: 1,
      description: 'Pendiente'
    },
    {
      id: 2,
      description: 'Pago parcial'
    },
    {
      id: 3,
      description: 'Pagado'
    }
  ]

  form = this.formBuilder.group({
    user_id: [null, Validators.required],
    description: ['', Validators.required],
    date: ['', Validators.required],
    status: [1, Validators.required],
    percentage: ['', Validators.required]
  })

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private userService: UserService,
    private paymentService: PaymentsService
  ) {}

  ngOnInit(): void {
    this.willUpdate = this.actualUrl.includes('edit')
    this.userService.getUsers(2).subscribe((users) => (this.users = users))
    if (this.willUpdate) {
      this.loading = true
      this.paymentService
        .getPayment(this.paymentId, () => (this.loading = false))
        .subscribe((payment) => {
          this.form.controls.user_id.setValue(payment.user_id)
          this.form.controls.description.setValue(payment.description)
          this.form.controls.date.setValue(moment(payment.date).toDate())
          this.form.controls.status.setValue(payment.status)
          this.form.controls.percentage.setValue(payment.percentaje)
        })
    }
    console.log('init')
  }
  updatePayment() {
    const payment: Payment = {
      user_id: this.form.get('user_id').value,
      description: this.form.get('description').value,
      date: moment(this.form.get('date').value).format('YYYY-MM-DD'),
      status: this.form.get('status').value,
      percentaje: this.form.get('percentage').value
    }
    this.loading = true
    if (this.willUpdate) {
      payment.id = this.paymentId
      this.paymentService
        .updatePayment(payment, () => (this.loading = false))
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'The user has been updated'
            })
          },
          (err) => {
            console.error(err)
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err
            })
          }
        )
    } else {
      this.paymentService
        .insertPayment(payment, () => (this.loading = false))
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'The user has been created'
            })
            this.navigationService.back(`../../payments`, this.route)
          },
          (err) => {
            console.error(err)
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err
            })
          }
        )
    }
  }
}
