import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class LoaderService {
  subLoader = new Subject<boolean>()
  loader$ = this.subLoader.asObservable()

  constructor() {}

  show(action: boolean = true) {
    this.subLoader.next(action)
  }
}
