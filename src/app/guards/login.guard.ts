import { Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private route: ActivatedRoute) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let canActivate = false
    const token = localStorage.getItem('token')
    // if (token != null) {
    //   const tokenDeserialized = JSON.parse(atob(token.split('.')[1]))
    //   const expiry = tokenDeserialized.exp
    //   const actualDate = Math.floor(new Date().getTime() / 1000)
    //   canActivate = expiry > actualDate
    // }
    canActivate = token != null
    if (!canActivate) {
      localStorage.removeItem('token')
      localStorage.removeItem('data')
      const actualUrl = route.parent.url.map((item) => item.path).join('/')
      this.router.navigate([`${actualUrl}/login`], {
        relativeTo: this.route
      })
    }
    return canActivate
  }
}
