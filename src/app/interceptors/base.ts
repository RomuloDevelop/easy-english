import { HTTP_INTERCEPTORS } from '@angular/common/http'

import { CommonOptions } from './commonOptions'

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: CommonOptions, multi: true }
]
