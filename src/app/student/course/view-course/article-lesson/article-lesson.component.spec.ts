import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ArticleLessonComponent } from './article-lesson.component'

describe('ArticleLessonComponent', () => {
  let component: ArticleLessonComponent
  let fixture: ComponentFixture<ArticleLessonComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleLessonComponent]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleLessonComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
