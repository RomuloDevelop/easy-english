import { Component, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
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
  }[]
  constructor() {}

  ngOnInit() {
    this.items = [
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
        route: 'users/1'
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
  }
}
