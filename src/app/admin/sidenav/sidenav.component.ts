import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { selectActualUser } from '../../state/session/session.selectors'
import { User } from '../../state/models'
import { ROLES } from 'src/data/roles'
import { AdminService } from '../admin.service'
import { PaymentsService } from 'src/app/services/payments.service'
import { take } from 'rxjs/operators'

interface MenuItem {
  label: string
  icon?: string
  route?: string
  admin: boolean
  routes?: MenuItem[]
  open?: boolean
  badgeCount?: number | string
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  actualUser: User
  roles = ROLES

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
      const { total, withoutPayments, withPayments } = response
      this.items[3].badgeCount = total
      this.paymentRoutes[1].badgeCount = withoutPayments
      this.paymentRoutes[2].badgeCount = withPayments
    })
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
