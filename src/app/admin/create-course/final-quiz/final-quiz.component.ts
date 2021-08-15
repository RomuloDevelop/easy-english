import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AdminService } from '../../admin.service'
import {
  ConfirmationService,
  PrimeNGConfig,
  MessageService,
  Message
} from 'primeng/api'
import { select, Store } from '@ngrx/store'
import { Quiz, FinalQuiz, Answer } from '../../../state/models'
import { selectCoursesTable } from '../../../state/admin/admin.selectores'
import { QuizzService } from '../../../services/quizz.service'
import { CourseService } from '../../../services/course.service'
import memoize from '../../../decorators/memoize'
import { zip } from 'rxjs'

@Component({
  selector: 'app-final-quiz',
  templateUrl: './final-quiz.component.html',
  styleUrls: ['./final-quiz.component.scss'],
  providers: [ConfirmationService]
})
export class FinalQuizComponent implements OnInit {
  loadingTitle = false
  loadingQuiz = false
  finalQuiz: FinalQuiz = null
  title: string = ''
  questions: Quiz[] = []
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))
  msgs: Message[] = []

  constructor(
    public adminService: AdminService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private store: Store,
    private quizService: QuizzService,
    private courseService: CourseService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.store.pipe(select(selectCoursesTable)).subscribe((courses) => {
      const { quiz, final_quizz_title } = courses.find(
        (course) => course.id === this.courseId
      )
      console.log('final quiz', quiz)
      this.questions =
        quiz == null
          ? []
          : quiz.questions.map((item) => ({
              ...item,
              correctAnswer: item.answers.find((item) => item.correct)?.id,
              answers: [...item.answers.map((item) => ({ ...item }))]
            }))
      this.title = final_quizz_title == null ? '' : final_quizz_title
      this.cdr.markForCheck()
    })
  }

  updateTitleOrAddQuiz() {
    if (!this.questions?.length) {
      this.addQuestion()
    } else {
      this.updateTitle()
    }
  }

  updateTitle() {
    this.loadingTitle = true
    this.courseService
      .updateCourse(
        { id: this.courseId, title: this.title },
        () => (this.loadingTitle = false)
      )
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The quiz has been updated!'
          })
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurs while updating quiz'
          })
          console.error(err)
        }
      )
  }

  addQuestion() {
    this.loadingQuiz = true
    const quiz = {
      question: 'Temporal description',
      answers: [],
      correctAnswer: null,
      course_id: this.courseId
    }
    this.quizService
      .addQuizz(quiz, true, true, null, 'Temporal title')
      .subscribe(
        (quiz) => {
          this.loadingQuiz = false
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The quiz has been created'
          })
        },
        (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurs while adding question'
          })
          console.error(err)
        }
      )
  }

  updateQuiz(quiz: Quiz) {
    this.loadingQuiz = true
    if (quiz.correctAnswer != null) {
      quiz.answers = quiz.answers.map((answer) => {
        return { ...answer, correct: answer.id === quiz.correctAnswer }
      })
    }
    this.quizService.updateQuizz(quiz, true, null).subscribe(
      (quiz) => {
        this.loadingQuiz = false
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The quiz has been updated!'
        })
      },
      (err) => {
        this.loadingQuiz = false
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurs while updating question'
        })
        console.error(err)
      }
    )
  }

  deleteQuizz(quiz: Quiz) {
    if (this.loadingQuiz) return
    this.deleteDialog(() => {
      this.loadingQuiz = true
      this.quizService.deleteQuiz(quiz).subscribe(
        () => {
          this.loadingQuiz = false
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The quiz has been updated!'
          })
        },
        (err) => {
          this.loadingQuiz = false
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurs while deleting question'
          })
          console.error(err)
        }
      )
    })
  }

  addFinalAnswer(questionId) {
    let id = 0
    const question = this.questions.find((item) => item.id === questionId)
    if (question.answers.length)
      id = question.answers[question.answers.length - 1].id + 1
    question.answers.push({
      id,
      text: '',
      correct: false
    })
  }

  deleteQuestion(id: number) {
    this.questions = this.questions.filter((item) => item.id !== id)
  }

  deleteaAnswer(questionId: number, id: number) {
    for (let question of this.questions) {
      if (question.id === questionId) {
        question.answers = question.answers.filter((item) => item.id !== id)
        break
      }
    }
  }

  @memoize()
  disableAddQuestion(title: string) {
    return title.length <= 0
  }

  @memoize()
  disableAddAnswer(question: string | null) {
    return question == null || question.length <= 0
  }
  @memoize({
    normalizer: function (args) {
      return JSON.stringify(args)
    }
  })
  disabledUpdateQuiz(quiz: Quiz) {
    const { answers, correctAnswer } = quiz
    let result = true
    for (let answer of answers) {
      if (answer.id === correctAnswer) {
        result = false
      }
      if (answer.text === '') {
        result = true
        break
      }
    }
    return result
  }

  deleteDialog(cb: () => any = null) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        cb()
      },
      reject: () => {}
    })
  }
}
