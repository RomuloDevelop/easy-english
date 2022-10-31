import {
  Component,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit
} from '@angular/core'
import { Quiz } from 'src/app/state/models'

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() question: Quiz = null
  @Input() answer: number = null
  @Input() id: number = null
  selected: number = null
  message = {
    correct: false,
    text: ''
  }

  ngOnInit(): void {
    this.checkAnswerIfDefined(this.answer)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkAnswerIfDefined(changes['answer']?.currentValue)
  }

  ngOnDestroy() {
    this.message = {
      correct: false,
      text: ''
    }
  }

  checkAnswerIfDefined(answer: number) {
    if (answer) {
      this.selected = answer
      this.checkAnswer()
    }
  }

  checkAnswer() {
    const correctAnswer = this.question.options.find((item) => !!item.is_valid)
    this.message.correct = this.selected === correctAnswer.id
    this.message.text =
      correctAnswer.id === this.selected
        ? 'The answer is correct!'
        : `Incorrect answer!`
  }
}
