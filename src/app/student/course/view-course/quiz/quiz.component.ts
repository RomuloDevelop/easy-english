import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { Quiz } from 'src/app/state/admin/models'
import { LessonToShow } from '../../course.service'
import { QuestionComponent } from '../question/question.component'

interface QuizLesson extends LessonToShow {
  data: Quiz
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  @ViewChild(QuestionComponent) question: QuestionComponent
  @Input() lesson: QuizLesson = null

  constructor() {}

  ngOnInit(): void {
    console.log('quiz')
  }

  submit() {
    this.question.checkAnswer()
  }
}
