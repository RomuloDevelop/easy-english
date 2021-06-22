import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { Quiz } from 'src/app/state/admin/models'
import { LessonToShow } from '../../course.service'

interface QuizLesson extends LessonToShow {
  data: Quiz
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {
  @Input() lesson: QuizLesson = null
  selected: number = null
  message = {
    correct: false,
    text: ''
  }
  showAnswer = false

  constructor() {}

  ngOnInit(): void {
    console.log('quiz')
  }

  ngOnDestroy() {
    this.showAnswer = false
    this.message = {
      correct: false,
      text: ''
    }
  }

  checkAnswer() {
    const correctAnswer = this.lesson.data.answers.find((item) => item.correct)
    this.message.correct = this.selected === correctAnswer.id
    this.message.text =
      correctAnswer.id === this.selected
        ? 'The answer is correct!'
        : `Incorrect answer!`
    this.showAnswer = true
  }
}
