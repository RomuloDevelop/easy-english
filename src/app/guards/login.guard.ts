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
    canActivate = token != null
    if (!canActivate) {
      const actualUrl = route.parent.url.map((item) => item.path).join('/')
      this.router.navigate([`${actualUrl}/login`], {
        relativeTo: this.route
      })
    }
    return canActivate
  }
}
