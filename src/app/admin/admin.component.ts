import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { selectActualUser } from '../state/session/session.selectors'
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
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
      icon: 'pi pi-pw pi-file',
      route: '/admin'
    },
    {
      label: 'Gestión de Cursos',
      icon: 'pi pi-pw pi-file',
      route: '/admin'
    },
    {
      label: 'Gestión de Profesores',
      icon: 'pi pi-fw pi-pencil',
      route: 'users/3'
    },
    {
      label: 'Gestión de Alumnos',
      icon: 'pi pi-fw pi-question',
      route: 'users/2'
    },
    {
      label: 'Gestión de Pagos',
      icon: 'pi pi-fw pi-cog'
    }
  ]

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.pipe(select(selectActualUser)).subscribe((user) => {
      if (user.role === 1) {
        this.items.push({
          label: 'Gestión de Inscripciónes',
          icon: 'pi pi-fw pi-question',
          route: 'enrollments'
        })
      }
    })
  }
}
