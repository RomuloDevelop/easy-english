import { Component, ViewChildren, QueryList, OnInit } from '@angular/core'
import { QuestionComponent } from '../question/question.component'
import { UserFinalQuizAnswer } from 'src/app/state/models'
import { MessageService } from 'primeng/api'
import { StudentService } from '../../../student.service'
import { Store } from '@ngrx/store'
import { selectCourses } from 'src/app/state/admin/admin.selectores'
import { selectUserFinalQuizAnswers } from 'src/app/state/session/session.selectors'
import { combineLatest } from 'rxjs'
import { StoreUserFinalQuizAnswer } from 'src/app/services/user-quizz.service'

@Component({
  selector: 'app-final-quiz',
  templateUrl: './final-quiz.component.html',
  styleUrls: ['./final-quiz.component.scss']
})
export class FinalQuizComponent implements OnInit {
  @ViewChildren(QuestionComponent) questions: QueryList<QuestionComponent>
  modal = false
  title: string
  finalQuiz = []
  userFinalQuizAnswers: UserFinalQuizAnswer[] = []
  loading = false

  constructor(
    private messageService: MessageService,
    private studentService: StudentService,
    private store: Store
  ) {}

  ngOnInit() {
    combineLatest([
      this.store.select(selectCourses),
      this.store.select(selectUserFinalQuizAnswers)
    ]).subscribe(([courses, userFinalQuizAnswers]) => {
      this.title = courses[0].final_quizz_title
      this.userFinalQuizAnswers = userFinalQuizAnswers

      if (courses[0]?.final_quiz) {
        this.finalQuiz = courses[0].final_quiz.map((quiz) => ({
          ...quiz,
          answer: userFinalQuizAnswers.find(
            (answer) => answer.course_quiz_id === quiz.id
          ).quiz_option_id
        }))
      }

      if (this.finalQuiz[0].answer != null) {
        this.modal = true
      }
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
      const userQuizzes: Omit<StoreUserFinalQuizAnswer, 'user_id'>[] = []
      this.questions.forEach((item) => {
        userQuizzes.push({
          course_quiz_id: item.id,
          quiz_option_id: item.selected,
          is_valid_option: item.message.correct
        })
      })
      this.studentService
        .insertUserFinalQuizzes(userQuizzes, () => (this.loading = false))
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
    this.modal = true
  }
}
