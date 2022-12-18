import { Component, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { selectActualUser } from '../../state/session/session.selectors'
import { User } from '../../state/models'
import { ROLES } from 'src/data/roles'
import { AdminService } from '../admin.service'
import { PaymentsService } from 'src/app/services/payments.service'
import { take } from 'rxjs/operators'
import { Subscription } from 'rxjs'

interface MenuItem {
  label: string
  icon?: string
  route?: string
  admin: boolean
  routes?: MenuItem[]
  open?: boolean
  badgeInfo?: {
    count: number | string
    message: string
  }
}

const WITHOUT_PAYMENT_MESSAGE = 'Usuarios con pagos atrasados'
const WITH_PAYMENT_MESSAGE = 'Usuarios con pagos al día e inactivos'

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  actualUser: User
  roles = ROLES
  viewMenuSubscription: Subscription

  paymentRoutes: MenuItem[] = [
    {
      label: 'Pagos',
      route: 'payments',
      admin: true
    },
    {
      label: 'Pagos atrasados',
      route: 'payments/users-without-payment',
      admin: true
    },
    {
      label: 'Pagos al día',
      route: 'payments/users-with-payment',
      admin: true
    }
  ]

  items: MenuItem[] = [
    {
      label: 'Gestión de Cursos',
      icon: 'pi pi-pw pi-book',
      route: '/admin',
      admin: false
    },
    {
      label: 'Gestión de Profesores',
      icon: 'pi pi-fw pi-user-edit',
      route: 'teachers',
      admin: false
    },
    {
      label: 'Gestión de Alumnos',
      icon: 'pi pi-fw pi-user',
      route: 'students',
      admin: true
    },
    {
      label: 'Gestión de Prospectos',
      icon: 'pi pi-fw pi-user-plus',
      route: 'prospects',
      admin: true
    },
    {
      label: 'Gestión de Pagos',
      icon: 'pi pi-fw pi-credit-card',
      admin: true,
      open: false,
      routes: this.paymentRoutes
    },
    {
      label: 'Gestión de Inscripciones',
      icon: 'pi pi-fw pi-users',
      route: 'enrollments',
      admin: true
    },
    {
      label: 'Gestión de Tips',
      icon: 'pi pi-fw pi-comment',
      route: 'tips',
      admin: true
    }
  ]

  constructor(
    public adminService: AdminService,
    private store: Store,
    private paymentsService: PaymentsService
  ) {}

  ngOnInit() {
    this.store.pipe(select(selectActualUser)).subscribe((user) => {
      this.actualUser = user
    })

    this.paymentsService.getPaymentCounts().subscribe((response) => {
      const { withoutPayments, withPayments } = response
      if (withoutPayments != null)
        this.paymentRoutes[1].badgeInfo = {
          count: withoutPayments,
          message: WITHOUT_PAYMENT_MESSAGE
        }

      if (withPayments != null)
        this.paymentRoutes[2].badgeInfo = {
          count: withPayments,
          message: WITH_PAYMENT_MESSAGE
        }
    })

    this.viewMenuSubscription = this.adminService.viewMenu$.subscribe(
      (opened) => {
        if (!opened) {
          this.items.forEach((item) => {
            if (item.routes) item.open = false
          })
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.viewMenuSubscription.unsubscribe()
  }

  openMenu(index: number) {
    const item = this.items[index]
    if (item.open != null) {
      item.open = !item.open
      this.adminService.viewMenu$.pipe(take(1)).subscribe((opened) => {
        if (!opened) {
          this.adminService.toggleNav()
        }
      })
    }
  }
}
