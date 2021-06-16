import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalQuizComponent } from './final-quiz.component';

describe('FinalQuizComponent', () => {
  let component: FinalQuizComponent;
  let fixture: ComponentFixture<FinalQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalQuizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
