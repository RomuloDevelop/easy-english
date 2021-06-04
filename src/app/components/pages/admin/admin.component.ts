import { Component, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  viewMenu = false
  items: MenuItem[]
  constructor() {}

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-pw pi-file'
      },
      {
        label: 'Gestión de Cursos',
        icon: 'pi pi-pw pi-file'
      },
      {
        label: 'Gestión de Profesores',
        icon: 'pi pi-fw pi-pencil'
      },
      {
        label: 'Gestión de Alumnos',
        icon: 'pi pi-fw pi-question'
      },
      {
        label: 'Gestión de Pagos',
        icon: 'pi pi-fw pi-cog'
      }
    ]
  }
}
