import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { finalize, map } from 'rxjs/operators'
import Endpoints from '../../data/endpoints'

export interface Tip {
  id?: number
  description: string
}

const { tipsUrl } = Endpoints

@Injectable({
  providedIn: 'root'
})
export class TipsService {
  constructor(private http: HttpClient) {}

  getTips(finalizeCb = () => {}) {
    return this.http.get<{ data: Tip[] }>(tipsUrl).pipe(
      map(({ data }) => data),
      finalize(finalizeCb)
    )
  }
  getTip(id: number, finalizeCb = () => {}) {
    return this.http.get<{ data: Tip }>(`${tipsUrl}/${id}`).pipe(
      map(({ data }) => data),
      finalize(finalizeCb)
    )
  }
  getRandomTip(finalizeCb = () => {}) {
    return this.http.get<{ data: Tip }>(`get_a_tip`).pipe(
      map(({ data }) => data),
      finalize(finalizeCb)
    )
  }
  createTip(description: string, finalizeCb = () => {}) {
    return this.http.post<{ data: Tip }>(tipsUrl, { description }).pipe(
      map(({ data }) => data),
      finalize(finalizeCb)
    )
  }
  updateTip(id: number, description: string, finalizeCb = () => {}) {
    return this.http
      .patch<{ data: Tip }>(`${tipsUrl}/${id}`, { description })
      .pipe(
        map(({ data }) => data),
        finalize(finalizeCb)
      )
  }
  deleteTip(id: number, finalizeCb = () => {}) {
    return this.http.delete(`${tipsUrl}/${id}`).pipe(finalize(finalizeCb))
  }
}
