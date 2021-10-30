import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
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
  @ViewChild('file') file: ElementRef
  paymentId = parseInt(this.route.snapshot.paramMap.get('id'))
  users: User[] = []
  actualUrl = this.route.snapshot.url.map((segment) => segment.path).join('/')
  willUpdate = false
  loading = false
  voucher: File = null
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
    date: ['', Validators.required],
    status: [1, Validators.required]
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
        })
    }
    console.log('init')
  }
  async updatePayment() {
    const base64 = await this.convertBlobToBase64(this.voucher)
    const payment: Payment = {
      user_id: this.form.get('user_id').value,
      description: base64,
      date: moment(this.form.get('date').value).format('YYYY-MM-DD'),
      status: this.form.get('status').value
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

  getVoucher() {
    this.file.nativeElement.click()
  }

  setFile(event) {
    this.voucher = event.target.files[0]
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = () => {
        const base64data = reader.result as string
        console.log('onload', base64data)
        resolve(base64data)
      }
      reader.readAsDataURL(blob)
    })
  }
}
