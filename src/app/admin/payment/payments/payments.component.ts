import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { User } from '../../../state/models'
import {
  ConfirmationService,
  PrimeNGConfig,
  Message,
  LazyLoadEvent
} from 'primeng/api'
import {
  PaymentsService,
  Payment,
  STATUS_LIST,
  IPaymentStatus
} from 'src/app/services/payments.service'
import { UserService } from 'src/app/services/user.service'
import roles from 'src/data/roles'
import { combineLatest, Subject } from 'rxjs'
import { Subscription } from 'rxjs'
import { skip, startWith } from 'rxjs/operators'

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnDestroy {
  loadingPayments = false

  users: User[] = []
  selectedUser: User
  subUserFilter = new Subject<User>()

  statusList = STATUS_LIST
  selectedStatus: IPaymentStatus
  subStatusFilter = new Subject<IPaymentStatus>()

  currentPage: number = 1
  totalRecords: number = 0
  rows: number = 0
  subPaginatorFilter = new Subject<LazyLoadEvent>()

  msgs: Message[] = []

  paymentCols = ['Id', 'Name', 'Email', 'Day of Payment']
  paymentRows = ['id', 'name', 'email', 'dateFormated']

  payments: Payment[]
  paymentSubscription: Subscription

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private userService: UserService,
    private paymentService: PaymentsService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.userService
      .getUsers(roles.student)
      .subscribe((users) => (this.users = users))

    this.paymentSubscription = combineLatest([
      this.subUserFilter.pipe(startWith({} as User)),
      this.subStatusFilter.pipe(startWith({} as IPaymentStatus)),
      this.subPaginatorFilter.pipe(startWith({ first: 0 } as LazyLoadEvent))
    ]).subscribe(([user, status, lazyEvent]) => {
      const page =
        lazyEvent &&
        lazyEvent.first &&
        lazyEvent.first >= this.currentPage * this.rows
          ? this.currentPage + 1
          : this.currentPage

      this.getPayments(page, user?.id, status?.id)
    })
  }

  ngOnDestroy(): void {
    this.paymentSubscription.unsubscribe()
  }

  getPayments(page = 1, userId?: number, statusId?: number) {
    this.loadingPayments = true

    this.paymentService.getPayments(page, statusId, userId).subscribe(
      (paymentPaginator) => {
        this.loadingPayments = false
        this.rows = paymentPaginator.per_page
        this.currentPage = paymentPaginator.current_page
        this.totalRecords = paymentPaginator.total
        this.payments = paymentPaginator.data
      },
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

  downloadVoucher(payment: Payment) {
    const a = document.createElement('a')
    const fileType = payment.voucher.split(';')[0].split('/')[1]
    a.href = payment.voucher
    a.download = `voucher-${payment.payment_date}.${fileType}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}
