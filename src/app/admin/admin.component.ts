import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { SessionService } from '../services/session.service'
import { LoaderService } from '../components/common/loader/loader.service'
import { selectActualUser } from '../state/session/session.selectors'
import { RouterAnimations } from '../utils/Animations'
import { User } from '../state/models'
import { Roles } from 'src/data/roles'

interface MenuItem {
  label: string
  icon?: string
  route?: string
  admin: boolean
  routes?: MenuItem[]
  open?: boolean
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [RouterAnimations.routerForwardAnimation()]
})
export class AdminComponent implements OnInit {
  actualUser: User
  roles = Roles
  viewMenu = true
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
      routes: [
        {
          label: 'Pagos',
          route: 'payments',
          admin: true
        },
        {
          label: 'Pagos atrasados',
          route: 'payments',
          admin: true
        },
        {
          label: 'Pagos al día',
          route: 'payments',
          admin: true
        }
      ]
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
    private store: Store,
    private sessionService: SessionService,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.store.pipe(select(selectActualUser)).subscribe((user) => {
      this.actualUser = user
    })
  }

  openMenu(index: number) {
    const item = this.items[index]
    if (item.open != null) {
      item.open = !item.open
    }
    console.log(item)
  }

  logout() {
    this.loader.show()
    this.sessionService.logout(() => this.loader.show(false)).subscribe()
  }
}
