import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  OnInit,
  AfterViewInit
} from '@angular/core'
import { QuestionComponent } from '../question/question.component'
import { FinalQuiz, UserQuiz } from 'src/app/state/models'
import { MessageService } from 'primeng/api'
import { StudentService } from '../../student.service'

@Component({
  selector: 'app-final-quiz',
  templateUrl: './final-quiz.component.html',
  styleUrls: ['./final-quiz.component.scss']
})
export class FinalQuizComponent implements AfterViewInit {
  @ViewChildren(QuestionComponent) questions: QueryList<QuestionComponent>
  @Input() quiz: FinalQuiz
  @Input() title: string
  loading = false
  quizNotes: UserQuiz[] = []

  constructor(
    private messageService: MessageService,
    private studentService: StudentService
  ) {}

  ngAfterViewInit(): void {
    this.studentService.getUserQuizzes().subscribe((data) => {
      this.quizNotes = data.filter((dataItem) =>
        this.questions.find(
          (quiestionItem) =>
            quiestionItem.question.id === dataItem.course_quiz_id
        )
      )
    })
  }

  submit() {
    if (this.disabled(this.questions)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: "Answers can't be empty"
      })
    } else {
      this.loading = true
      const userQuizzes: Omit<UserQuiz, 'user_id'>[] = []
      this.questions.forEach((item) => {
        userQuizzes.push({
          course_quiz_id: item.question.id,
          total_bad: item.message.correct ? 1 : 0,
          total_ok: item.message.correct ? 1 : 0,
          approved: item.message.correct
        })
      })
      this.studentService
        .insertUserQuizzes(userQuizzes, () => (this.loading = false))
        .subscribe(() => this.showResults())
    }
  }

  disabled(questions: QueryList<QuestionComponent>) {
    return !questions
      ? true
      : questions.find((item) => item.selected == null) != null
  }

  showResults() {
    this.questions.forEach((item) => {
      item.checkAnswer()
    })
  }
}
