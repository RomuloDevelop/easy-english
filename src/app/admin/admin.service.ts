import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

export type SectionAction = 'update' | 'cancel' | 'delete'

@Injectable()
export class AdminService {
  sectionEdit = null

  constructor(private http: HttpClient) {}
}
