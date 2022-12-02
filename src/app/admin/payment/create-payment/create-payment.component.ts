import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MessageService } from 'primeng/api'
import { NavigationService } from '../../../services/navigation.service'
import {
  PaymentsService,
  Payment,
  STATUS_LIST,
  PAYMENT_STATUS
} from 'src/app/services/payments.service'
import { UserService } from 'src/app/services/user.service'
import { User } from 'src/app/state/models'
import * as moment from 'moment'
import { Subscription } from 'rxjs'

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
  statusList = STATUS_LIST
  PAYMENT_STATUS = PAYMENT_STATUS

  form = this.formBuilder.group({
    user_id: [null, Validators.required],
    payment_date: ['', Validators.required],
    payment_month: [0, Validators.required],
    status: [PAYMENT_STATUS.ADMIN_PENDING, Validators.required],
    description: ['', Validators.required]
  })

  statusFieldSubscription: Subscription

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
          this.form.controls.date.setValue(
            moment(payment.payment_date).toDate()
          )
          this.form.controls.status.setValue(payment.status)
        })
    }
  }

  async updatePayment() {
    const base64 = await this.convertBlobToBase64(this.voucher)
    const status = this.form.get('status').value

    const payment: Payment = {
      user_id: this.form.get('user_id').value,
      description: this.form.get('user_id').value,
      payment_date: moment(this.form.get('payment_date').value).format(
        'YYYY-MM-DD'
      ),
      payment_month: moment(this.form.get('payment_month').value).format(
        'YYYY-MM-DD'
      ),
      status,
      voucher: base64
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

  clearVoucher() {
    this.voucher = null
    this.file.nativeElement.value = null
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = () => {
        const base64data = reader.result as string
        resolve(base64data)
      }
      reader.readAsDataURL(blob)
    })
  }
}
