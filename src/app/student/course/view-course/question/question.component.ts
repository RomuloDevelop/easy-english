import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Quiz } from 'src/app/state/admin/models'

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {
  @Input() question: Quiz = null
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
    console.log(this.question)
    const correctAnswer = this.question.answers.find((item) => item.correct)
    this.message.correct = this.selected === correctAnswer.id
    this.message.text =
      correctAnswer.id === this.selected
        ? 'The answer is correct!'
        : `Incorrect answer!`
    this.showAnswer = true
  }
}
