import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core'
import { Quiz, UserQuiz } from 'src/app/state/models'
import { LessonToShow, StudentService } from '../../student.service'
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
  quizNote: UserQuiz = null
  loading = false

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getUserQuizzes().subscribe((data) => {
      this.quizNote = data.find(
        (item) => item.course_quiz_id === this.lesson?.data.id
      )
    })
  }

  submit() {
    this.loading = true
    const userQuiz = {
      course_quiz_id: this.question.question.id,
      total_bad: this.question.message.correct ? 1 : 0,
      total_ok: this.question.message.correct ? 1 : 0,
      approved: this.question.message.correct
    }
    this.studentService
      .insertUserQuizzes([userQuiz], () => (this.loading = false))
      .subscribe(() => {
        this.question.checkAnswer()
      })
  }
}
