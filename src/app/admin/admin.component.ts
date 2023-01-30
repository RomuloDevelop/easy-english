import { Component } from '@angular/core'
import { SessionService } from '../services/session.service'
import { LoaderService } from '../components/common/loader/loader.service'
import { RouterAnimations } from '../utils/Animations'
import { AdminService } from './admin.service'

@Component({
  selector: 'app-admin',
  template: `
    <app-page-layout>
      <div class="admin-container">
        <app-sidenav></app-sidenav>
        <div
          class="admin-content"
          [class]="{ active: (adminService.viewMenu$ | async) }"
        >
          <app-admin-header
            (openNav)="adminService.toggleNav()"
            (logout)="logout()"
          ></app-admin-header>
          <section>
            <div
              class="container-lg"
              [@routeAnimations]="
                o && o.activatedRouteData && o.activatedRouteData['animation']
              "
            >
              <router-outlet #o="outlet"></router-outlet>
            </div>
          </section>
        </div>
      </div>
    </app-page-layout>
  `,
  styleUrls: ['./admin.component.scss'],
  animations: [RouterAnimations.routerForwardAnimation()]
})
export class AdminComponent {
  constructor(
    public adminService: AdminService,
    private sessionService: SessionService,
    private loader: LoaderService
  ) {}

  logout() {
    this.loader.show()
    this.sessionService.logout(() => this.loader.show(false)).subscribe()
  }
}
