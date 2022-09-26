import {
  Component,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core'
import { Quiz } from 'src/app/state/models'

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnChanges, OnDestroy {
  @Input() question: Quiz = null
  @Input() answer: number = null
  selected: number = null
  message = {
    correct: false,
    text: ''
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['answer']?.currentValue != null) {
      this.selected = changes['answer'].currentValue
      this.checkAnswer()
    }
  }

  ngOnDestroy() {
    this.message = {
      correct: false,
      text: ''
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
