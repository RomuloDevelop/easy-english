import { TestBed } from '@angular/core/testing'

import { UserQuizzService } from './user_quizz.service'

describe('UserQuizzService', () => {
  let service: UserQuizzService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(UserQuizzService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
