import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { selectActualUser } from '../state/session/session.selectors'
import roles, { Roles } from '../../data/roles'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  redirectToLogin(route: ActivatedRouteSnapshot) {
    const actualUrl = route.parent.url.map((item) => item.path).join('/')
    this.router.navigate([`${actualUrl}/login`], {
      relativeTo: this.route
    })
  }

  getRole(route: ActivatedRouteSnapshot) {
    const url = route.parent.url
    return roles[url[0].path]
  }

  getRoute(route: ActivatedRouteSnapshot) {
    const url = route.parent.url
    return url[0].path
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token')
    if (token != null) {
      return this.store.pipe(
        select(selectActualUser),
        map((user) => {
          const result =
            user.role === 1 ||
            (this.getRoute(route) === 'admin' && user.role === 3) ||
            (this.getRoute(route) === 'student' && user.role === 2)
          if (!result) {
            this.redirectToLogin(route)
          }
          console.log('guard', this.getRole(route))
          return result
        })
      )
    } else {
      this.redirectToLogin(route)
      return false
    }
  }
}
