import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export type SectionAction = 'update' | 'cancel' | 'delete'

@Injectable()
export class AdminService {
  private subSectionToEdit = new BehaviorSubject<number>(null)
  sectionToEdit$ = this.subSectionToEdit.asObservable()

  constructor(private http: HttpClient) {}

  nextMessage(id: number) {
    this.subSectionToEdit.next(id)
  }
}