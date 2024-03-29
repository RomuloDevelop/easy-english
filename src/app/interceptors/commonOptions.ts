import { Injectable } from '@angular/core'
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'
import { TOKEN_KEY, DEFAULT_HTTP_ERROR_MESSAGE } from 'src/data/constants'

export interface InterceptorError extends HttpErrorResponse {
  defaultMessage: string
}

@Injectable()
export class CommonOptions implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers = req.headers.set('Content-Type', 'application/json')
    const url = 'https://backend.aeasyenglish.com/api/'

    // Determina si requiere token
    if (req.url !== 'login' && req.url !== 'register') {
      const token = `Bearer ${localStorage.getItem(TOKEN_KEY)}`
      headers = headers.set('Authorization', token)
    }

    const reqCopy = req.clone({
      url: url + req.url,
      headers
    })
    return next.handle(reqCopy).pipe(
      // retry(3),
      catchError(this.handleError) // then handle the error
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      )
    }
    // Return an observable with a user-facing error message.
    const customError: InterceptorError = {
      ...error,
      defaultMessage: DEFAULT_HTTP_ERROR_MESSAGE
    }
    return throwError(customError)
  }
}
