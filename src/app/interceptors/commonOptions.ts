import { Injectable } from '@angular/core'
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { HttpErrorResponse } from '@angular/common/http'

export interface InterceptorError extends HttpErrorResponse {
  defaultMessage: string
}

@Injectable()
export class CommonOptions implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers = req.headers
    const url = 'https://backend.ochoadev.com/api/'

    // Determina si requiere token
    if (req.url !== 'login' && req.url !== 'register') {
      const token = `Bearer ${localStorage.getItem('token')}`
      headers = headers.set('Authorization', token)
    }

    const reqCopy = req.clone({
      url: url + req.url,
      headers: req.headers.set('Content-Type', 'application/json')
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
      defaultMessage:
        'Ocurrió un error al procesar su solicitud, intente de nuevo mas tarde'
    }
    return throwError(customError)
  }
}
