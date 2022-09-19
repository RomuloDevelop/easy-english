import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core'
import { AdminService, SectionAction } from '../../../../admin.service'
import { ConfirmationService, PrimeNGConfig, Message } from 'primeng/api'
import { select, Store } from '@ngrx/store'
import {
  Section,
  Lecture,
  VideoLectue,
  Article,
  Quiz,
  QuizOption
} from '../../../../../state/models'
import {
  SectionData,
  selectLectures
} from '../../../../../state/admin/admin.selectores'
import memoize from '../../../../../decorators/memoize'
import { LessonService } from '../../../../../services/lesson.service'
import { YoutubeComponent } from '../../../../../components/common/youtube/youtube.component'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
  providers: [ConfirmationService]
})
export class SectionsComponent implements OnInit, OnChanges {
  @ViewChild(YoutubeComponent) youtube: YoutubeComponent

  @Output('save') saveEvent = new EventEmitter<{
    section: Section
    type: SectionAction
  }>()
  @Input('count') count: number = null
  @Input('data') data: SectionData = null
  @Input('course') courseId: number = null
  edit = false
  title = ''
  description = ''
  lectures: Lecture[] = []
  lectureId: number = undefined
  resources: File[] = []

  // Modals
  displayResource = false
  displayDelete = false
  displayArticle = false
  displayVideo = false
  displayQuiz = false
  msgs: Message[] = []
  lectureTitle = ''

  // Video variables
  loadingVideo = false
  videoUrl = ''
  videoDetail = ''

  // Article variables
  loadingArticle = false
  articleDetail = ''

  //Quiz
  loadingQuiz = false
  question = ''
  options: QuizOption[] = []
  correctAnswer: number = null
  questionId: number

  //All lectures
  allLectures: Lecture[]

  constructor(
    public adminService: AdminService,
    private lessonService: LessonService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.store.pipe(select(selectLectures)).subscribe((lectures) => {
      this.allLectures = lectures
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const name in changes) {
      if (name === 'data') {
        const section = changes[name].currentValue as SectionData
        this.title = section.title
        this.description = section.subtitle
        this.lectures = section.lectures
      }
    }
  }

  onOpen() {
    this.youtube.triggerRezise()
  }

  emitEvent(type: SectionAction = 'update') {
    const section: Section = {
      id: this.data.id,
      title: this.title,
      course_id: this.data.course_id,
      subtitle: this.description
    }
    this.saveEvent.emit({ section, type })
  }

  // Lectures methods
  showResources($event, item: Lecture) {
    $event.stopPropagation()
    console.log(item)
    this.lectureId = item.id
    let lecture = this.lectures.find((item) => item.id === this.lectureId)
    this.resources = lecture.resources
    this.displayResource = true
  }

  createResource() {
    console.log(this.resources)
    let lecture = this.lectures.find((item) => item.id === this.lectureId)
    lecture = {
      ...lecture,
      resources: this.resources
    }
    this.addLectureOrEdit(lecture).subscribe(() => this.clearResourceModal())
  }

  onUpload(event) {
    console.log(event)
    this.resources = event.files
    this.createResource()
    //this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  clearResourceModal() {
    this.displayResource = false
    this.clearCommonModalData()
  }

  updateLecture($event, item: Lecture) {
    $event.stopPropagation()
    if (item.type === 'Article') {
      const data = item.data as Article
      this.articleDetail = data.detail
      this.displayArticle = true
    } else if (item.type === 'Quiz') {
      const data = item.data as Quiz
      this.question = data.question
      this.options = data.options.length
        ? data.options.map<QuizOption>((item) => ({ ...item }))
        : []
      this.correctAnswer = this.options.find((item) => item.is_valid)?.id
      this.displayQuiz = true
      this.questionId = data.id
    } else if (item.type === 'Video') {
      const data = item.data as VideoLectue
      this.videoDetail = data.detail
      this.videoUrl = data.url
      this.displayVideo = true
    }
    this.lectureTitle = item.title
    this.lectureId = item.id
    this.resources = item?.resources
  }

  deleteLecture($event, lecture: Lecture) {
    $event.stopPropagation()
    this.deleteDialog(() => {
      const { id } = this.lectures.find((item) => item.id === lecture.id)
      return this.lessonService.deleteLesson(id)
    })
  }

  newVideo() {
    this.loadingVideo = true
    const section_id = this.data.id
    this.addLectureOrEdit({
      id: null,
      title: 'Temporal title',
      section_id,
      is_quiz: false,
      data: {
        url: 'LljIeFJQ7xY',
        detail: 'Temporal description'
      },
      type: 'Video'
    }).subscribe(() => {
      this.displayVideo = true
      this.loadingVideo = false
    })
  }

  createVideo() {
    this.loadingVideo = true
    const id = this.lectureId
    const section_id = this.data.id
    const video: VideoLectue = {
      url: this.videoUrl,
      detail: this.videoDetail
    }
    this.addLectureOrEdit({
      title: this.lectureTitle,
      is_quiz: false,
      section_id,
      id,
      data: video,
      type: 'Video'
    }).subscribe(() => this.clearVideoModal())
  }

  clearVideoModal() {
    this.loadingVideo = false
    this.displayVideo = false
    this.videoDetail = ''
    this.videoUrl = ''
    this.clearCommonModalData()
  }

  @memoize()
  disableCreateVideo(title: string, url: string, detail: string) {
    return !title || title == '' || url == '' || detail == null || detail == ''
  }

  newArticle() {
    this.loadingArticle = true
    const section_id = this.data.id
    this.addLectureOrEdit({
      title: 'Temporal title',
      section_id,
      is_quiz: false,
      id: null,
      data: {
        detail: 'Temporal detail'
      },
      type: 'Article'
    }).subscribe(() => {
      this.loadingArticle = false
      this.displayArticle = true
    })
  }

  createArticle() {
    this.loadingArticle = true
    const id = this.lectureId
    const section_id = this.data.id
    const data: Article = {
      detail: this.articleDetail
    }
    this.addLectureOrEdit({
      title: this.lectureTitle,
      section_id,
      is_quiz: false,
      id,
      data,
      type: 'Article'
    }).subscribe(() => this.clearArticleModal())
  }

  clearArticleModal() {
    this.loadingArticle = false
    this.displayArticle = false
    this.articleDetail = ''
    this.clearCommonModalData()
  }

  @memoize()
  disableCreateArticle(title: string) {
    return !title || title == ''
  }

  // Quiz methods
  newQuiz() {
    this.options = []
    this.displayQuiz = true
  }

  createQuiz() {
    this.loadingQuiz = true
    const section_id = this.data.id
    this.lessonService
      .addLessonQuiz({
        quiz: {
          question: this.question,
          title: this.lectureTitle
        },
        quiz_options: this.options.map((answer) => ({
          description: answer.description,
          is_valid: this.correctAnswer === answer.id ? 1 : 0
        })),
        course_lesson: {
          title: this.lectureTitle,
          description: 'Descripcion',
          section_id,
          is_quiz: true
        }
      })
      .subscribe(() => {
        this.loadingQuiz = false
        this.displayQuiz = false
        this.cdr.markForCheck()
      })
  }
  updateQuiz() {
    this.loadingQuiz = true
    const id = this.lectureId
    const section_id = this.data.id
    const data: Quiz = {
      title: this.lectureTitle,
      id: this.questionId,
      question: this.question,
      options: this.options.map((option) => ({
        ...option,
        is_valid: this.correctAnswer === option.id ? 1 : 0
      }))
    }
    this.addLectureOrEdit({
      title: this.lectureTitle,
      section_id,
      is_quiz: true,
      id,
      data,
      type: 'Quiz'
    }).subscribe(() => this.clearQuizModal())
  }

  clearQuizModal() {
    this.loadingQuiz = false
    this.displayQuiz = false
    this.question = ''
    this.options = []
    this.correctAnswer = null
    this.clearCommonModalData()
  }

  addAnswer() {
    let id = 0
    if (this.options.length) id = this.options[this.options.length - 1].id + 1
    this.options.push({
      id,
      description: '',
      is_valid: 0,
      quiz_id: this.questionId
    })
  }

  deleteaAnswer(id: number) {
    this.options = this.options.filter((item) => item.id !== id)
  }

  @memoize()
  disableAddAnswer(question: string) {
    return question != null && question.length <= 0
  }

  @memoize({
    normalizer: function (args) {
      return JSON.stringify(args)
    }
  })
  disabledCreateQuiz(title: string, answers: QuizOption[], id: number) {
    let result = true
    for (let answer of answers) {
      if (answer.id === id) {
        result = false
      }
      if (answer.description === '') {
        result = true
        break
      }
    }
    return result || !title || title == ''
  }

  // General methods
  clearCommonModalData() {
    this.lectureTitle = ''
    this.lectureId = undefined
    this.resources = []
  }

  addLectureOrEdit(lecture: Lecture) {
    let request: Observable<any>
    if (lecture.id != null) {
      request = this.lessonService.updateLesson(lecture)
    } else {
      delete lecture.id
      request = this.lessonService.addLesson(lecture)
    }
    return request
    //this.emitEvent()
  }

  setEdit() {
    this.adminService.nextMessage(this.data.id)
  }

  deleteDialog(cb: () => any = null) {
    const showMessage = (err = false) => {
      if (!err) {
        this.msgs = [
          { severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }
        ]
      } else {
        this.msgs = [
          { severity: 'info', summary: 'Rejected', detail: 'You have rejected' }
        ]
        console.error(err)
      }
    }
    let func = cb == null ? () => this.emitEvent('delete') : cb
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        const cbResult = func()
        if (cbResult?.subscribe) {
          cbResult.subscribe(
            () => showMessage(),
            (err) => () => showMessage(err)
          )
        } else {
          showMessage()
        }
      },
      reject: () => {
        showMessage(true)
      }
    })
  }
}
