import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export type SectionAction = 'update' | 'cancel' | 'delete'

@Injectable()
export class AdminService {
  private subSectionToEdit = new BehaviorSubject<number>(null)
  private viewMwnu = new BehaviorSubject<boolean>(false)
  sectionToEdit$ = this.subSectionToEdit.asObservable()
  viewMenu$ = this.viewMwnu.asObservable()

  constructor() {}

  nextMessage(id: number) {
    this.subSectionToEdit.next(id)
  }

  toggleNav() {
    this.viewMwnu.next(!this.viewMwnu.value)
  }
}
