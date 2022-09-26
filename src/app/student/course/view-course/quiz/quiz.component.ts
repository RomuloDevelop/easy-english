import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { Quiz, UserAnswer } from 'src/app/state/models'
import { selectUserAnswers } from 'src/app/state/session/session.selectors'
import { StudentService } from '../../student.service'
import { QuestionComponent } from '../question/question.component'

interface QuizLesson {
  id: number
  title: string
  quiz: Quiz
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  @ViewChild(QuestionComponent) question: QuestionComponent
  @Input() lesson: QuizLesson = null
  @Output() answered = new EventEmitter()
  userAnswer: UserAnswer = null
  loading = false

  constructor(private studentService: StudentService, private store: Store) {}

  ngOnInit(): void {
    this.store.pipe(select(selectUserAnswers)).subscribe((data) => {
      this.userAnswer = data.find(
        (item) => item.course_lesson_id === this.lesson?.id
      )
    })
  }

  submit() {
    this.question.checkAnswer()
    this.loading = true
    const userAnswer = {
      course_lesson_id: this.lesson.id,
      quiz_option_id: this.question.selected,
      is_valid_option: this.question.message.correct
    }

    this.studentService
      .insertUserQuizzes(userAnswer, () => (this.loading = false))
      .subscribe(() => {
        this.answered.emit()
      })
  }
}
