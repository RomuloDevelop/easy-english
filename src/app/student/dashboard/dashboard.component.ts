import { Component, OnInit } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { User } from 'src/app/state/models'
import { selectActualUser } from 'src/app/state/session/session.selectors'
import { SessionService } from '../../services/session.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User
  loadingLogOutPanel = null
  loadingLogOutButton = false

  constructor(
    private sessionService: SessionService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store
      .pipe(select(selectActualUser))
      .subscribe((user) => (this.user = user))
  }

  logoutButton() {
    this.loadingLogOutButton = true
    this.logout()
  }

  logoutPanel(index) {
    this.loadingLogOutPanel = index
    this.logout()
  }

  logout() {
    this.sessionService
      .logout(() => {
        this.loadingLogOutPanel = false
        this.loadingLogOutButton = false
      })
      .subscribe()
  }
}
