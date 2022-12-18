import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import Endpoints from '../../data/endpoints'
import { catchError, finalize, map, mergeMap } from 'rxjs/operators'
import { InterceptorError } from '../interceptors/commonOptions'
import { of, throwError } from 'rxjs'
import { UserService } from './user.service'
import roles, { ROLES } from '../../data/roles'
import { TOKEN_KEY } from 'src/data/constants'

const { loginUrl, logoutUrl } = Endpoints

export interface Login {
  email: string
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  login(data: Login, requiredRole: ROLES[], finalizeCb = () => {}) {
    return this.http
      .post<{ access_token: string; token_type: string }>(loginUrl, data)
      .pipe(
        map(({ access_token }) => {
          localStorage.setItem(TOKEN_KEY, access_token)
          return access_token
        }),
        mergeMap((access_token) =>
          this.userService.getActualUser().pipe(
            mergeMap((user) => {
              if (!requiredRole.some((value) => value === user.role)) {
                return this.logout(() => {}, false).pipe(
                  map(() => {
                    let roleName = ''
                    for (let role in roles) {
                      if (requiredRole.some((value) => value === roles[role])) {
                        roleName = role.toLowerCase()
                        break
                      }
                    }
                    throw {
                      defaultMessage: `The user is not a${
                        roleName[0] === 'a' ? 'n' : ''
                      } ${roleName}`
                    }
                  })
                )
              }
              return of({ user, access_token })
            })
          )
        ),
        catchError((error: InterceptorError) => {
          let message = error.defaultMessage
          if (error.status === 401) {
            message = 'Correo o contraseña inconrrectos'
          }
          return throwError(message)
        }),
        finalize(finalizeCb)
      )
  }

  logout(finalizeCb = () => {}, redirect = true) {
    return this.http.get(logoutUrl).pipe(
      map(() => {
        localStorage.removeItem(TOKEN_KEY)
        if (redirect) {
          this.router.navigate(['/'], {
            replaceUrl: true
          })
        }
      }),
      catchError((error: InterceptorError) => {
        const message = error.defaultMessage
        return throwError(message)
      }),
      finalize(finalizeCb)
    )
  }
}
