import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { SessionService } from '../services/session.service'
import { LoaderService } from '../components/common/loader/loader.service'
import { selectActualUser } from '../state/session/session.selectors'
import { RouterAnimations } from '../utils/Animations'
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [RouterAnimations.routerForwardAnimation()]
})
export class AdminComponent implements OnInit {
  viewMenu = true
  items: {
    label: string
    icon: string
    route?: string
  }[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-pw pi-chart-bar',
      route: '/admin'
    },
    {
      label: 'Gestión de Cursos',
      icon: 'pi pi-pw pi-book',
      route: '/admin'
    },
    {
      label: 'Gestión de Profesores',
      icon: 'pi pi-fw pi-user-edit',
      route: 'teachers'
    },
    {
      label: 'Gestión de Alumnos',
      icon: 'pi pi-fw pi-user',
      route: 'students'
    },
    {
      label: 'Gestión de Pagos',
      icon: 'pi pi-fw pi-credit-card',
      route: 'payments'
    }
  ]

  constructor(
    private store: Store,
    private sessionService: SessionService,
    private loader: LoaderService
  ) {}

  ngOnInit() {
    this.store.pipe(select(selectActualUser)).subscribe((user) => {
      if (user.role === 1) {
        this.items.push({
          label: 'Gestión de Inscripciónes',
          icon: 'pi pi-fw pi-users',
          route: 'enrollments'
        })
      }
    })
  }

  logout() {
    this.loader.show()
    this.sessionService.logout(() => this.loader.show(false)).subscribe()
  }
}
