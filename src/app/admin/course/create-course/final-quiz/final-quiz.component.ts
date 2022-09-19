import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AdminService } from '../../../admin.service'
import {
  ConfirmationService,
  PrimeNGConfig,
  MessageService,
  Message
} from 'primeng/api'
import { select, Store } from '@ngrx/store'
import { Quiz, FinalQuiz } from '../../../../state/models'
import { selectCoursesTable } from '../../../../state/admin/admin.selectores'
import { QuizzService } from '../../../../services/quizz.service'
import { CourseService } from '../../../../services/course.service'
import memoize from '../../../../decorators/memoize'
import { FinalQuizService } from 'src/app/services/final-quiz.service'

@Component({
  selector: 'app-final-quiz',
  templateUrl: './final-quiz.component.html',
  styleUrls: ['./final-quiz.component.scss'],
  providers: [ConfirmationService]
})
export class FinalQuizComponent implements OnInit {
  @ViewChild('editor') editor
  loadingTitle = false
  creatingDeletingQuiz = false
  updatingQuiz = false
  finalQuiz: FinalQuiz = null
  title: string = ''
  questions: Quiz[] = []
  courseId = parseInt(this.route.snapshot.paramMap.get('id'))
  msgs: Message[] = []
  quillOptions = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ]
  }

  constructor(
    public adminService: AdminService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private store: Store,
    private finalQuizService: FinalQuizService,
    private quizService: QuizzService,
    private courseService: CourseService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.store.pipe(select(selectCoursesTable)).subscribe((courses) => {
      const { final_quiz, final_quizz_title } = courses.find(
        (course) => course.id === this.courseId
      )
      this.questions =
        final_quiz == null
          ? []
          : final_quiz.map((item) => ({
              ...item.quiz,
              correctAnswer: item.quiz.options?.find((item) => !!item.is_valid)
                ?.id,
              options: item.quiz.options
                ? [...item.quiz.options.map((item) => ({ ...item }))]
                : [],
              course_id: item.course_id
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
        { id: this.courseId, final_quizz_title: this.title },
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
    this.creatingDeletingQuiz = true
    const quiz: Quiz = {
      title: 'Temporal title',
      options: [],
      question: 'Temporal description',
      correctAnswer: null,
      course_id: this.courseId
    }
    this.finalQuizService.addQuiz(quiz).subscribe(
      () => {
        this.creatingDeletingQuiz = false
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The quiz has been created'
        })
      },
      (err) => {
        this.creatingDeletingQuiz = false
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
    this.updatingQuiz = true

    if (quiz.correctAnswer != null) {
      quiz.options = quiz.options.map((option) => {
        return { ...option, is_valid: option.id === quiz.correctAnswer ? 1 : 0 }
      })
    }

    this.finalQuizService.updateQuiz(quiz).subscribe(
      () => {
        this.updatingQuiz = false
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'The quiz has been updated!'
        })
      },
      (err) => {
        this.updatingQuiz = false
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
    if (this.creatingDeletingQuiz) return
    this.deleteDialog(() => {
      this.creatingDeletingQuiz = true
      this.quizService.deleteQuiz(quiz).subscribe(
        () => {
          this.creatingDeletingQuiz = false
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The quiz has been updated!'
          })
        },
        (err) => {
          this.creatingDeletingQuiz = false
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
    if (question.options.length)
      id = question.options[question.options.length - 1].id + 1
    question.options.push({
      id,
      description: '',
      is_valid: 0,
      quiz_id: question.id
    })
  }

  deleteQuestion(id: number) {
    this.questions = this.questions.filter((item) => item.id !== id)
  }

  deleteaAnswer(questionId: number, id: number) {
    for (let question of this.questions) {
      if (question.id === questionId) {
        question.options = question.options.filter((item) => item.id !== id)
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
    const { options, correctAnswer } = quiz
    let result = true
    for (let option of options) {
      if (option.id === correctAnswer) {
        result = false
      }
      if (option.description === '') {
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
