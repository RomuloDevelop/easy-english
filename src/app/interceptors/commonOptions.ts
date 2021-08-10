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

@Injectable()
export class CommonOptions implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = 'https://backend.ochoadev.com/api/'
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
    return throwError('Something bad happened; please try again later.')
  }
}
