import {
  Component,
  OnInit,
  Input,
  ViewChildren,
  QueryList
} from '@angular/core'
import { QuestionComponent } from '../question/question.component'
import { FinalQuiz } from 'src/app/state/admin/models'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-final-quiz',
  templateUrl: './final-quiz.component.html',
  styleUrls: ['./final-quiz.component.scss']
})
export class FinalQuizComponent implements OnInit {
  @ViewChildren(QuestionComponent) questions: QueryList<QuestionComponent>
  @Input() quiz: FinalQuiz

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    console.log('final-quiz')
  }

  submit() {
    if (this.disabled(this.questions)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Answers can't be empty"
      })
    } else {
      this.questions.forEach((item) => {
        item.checkAnswer()
      })
    }
  }

  disabled(questions: QueryList<QuestionComponent>) {
    return !questions
      ? true
      : questions.find((item) => item.selected == null) != null
  }
}
