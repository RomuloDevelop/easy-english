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
import roles from '../../data/roles'
import { map } from 'rxjs/operators'
import { PATH_FROM_LOGIN_KEY, TOKEN_KEY } from 'src/data/constants'

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
    const actualUrl = route.url.map((item) => item.path).join('/')
    localStorage.setItem(PATH_FROM_LOGIN_KEY, actualUrl)
    this.router.navigate([`/login`], {
      relativeTo: this.route
    })
  }

  getRole(route: ActivatedRouteSnapshot) {
    const { url } = route
    return roles[url[0].path.toUpperCase()]
  }

  getRoute(route: ActivatedRouteSnapshot) {
    const { url } = route
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
    const token = localStorage.getItem(TOKEN_KEY)
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
          return result
        })
      )
    } else {
      this.redirectToLogin(route)
      return false
    }
  }
}
