import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import { AdminService, SectionAction } from '../../../admin.service'
import { ConfirmationService, PrimeNGConfig, Message } from 'primeng/api'
import { select, Store } from '@ngrx/store'
import {
  Section,
  Lecture,
  VideoLectue,
  Article,
  Quiz,
  Question,
  FinalQuiz,
  Answer
} from '../../../../state/admin/models'
import {
  SectionData,
  selectLectures
} from '../../../../state/admin/admin.selectores'
import memoize from '../../../../decorators/memoize'
import {
  setLecture,
  updateLecture,
  deleteLecture
} from 'src/app/state/admin/lectures/lecture.actions'
import { YoutubeComponent } from '../../../../components/common/youtube/youtube.component'

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
  videoUrl = ''
  videoDetail = ''

  // Article variables
  articleDetail = ''

  //Quiz
  question = ''
  answers: Answer[] = []
  correctAnswer: number = null

  //All lectures
  allLectures: Lecture[]

  constructor(
    public adminService: AdminService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private store: Store
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.store
      .pipe(select(selectLectures))
      .subscribe((lectures) => (this.allLectures = lectures))
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const name in changes) {
      if (name === 'data') {
        const section = changes[name].currentValue as SectionData
        this.title = section.title
        this.description = section.description
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
      courseId: this.courseId,
      title: this.title,
      description: this.description
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
    this.addLectureOrEdit(lecture)
    this.clearResourceModal()
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
      this.answers = data.answers
      this.correctAnswer = this.answers.find((item) => item.correct).id
      this.displayQuiz = true
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
      this.store.dispatch(deleteLecture({ id }))
    })
  }

  createVideo() {
    const id = this.lectureId
    const sectionId = this.data.id
    const video: VideoLectue = {
      url: this.videoUrl,
      detail: this.videoDetail
    }
    this.addLectureOrEdit({
      title: this.lectureTitle,
      sectionId,
      id,
      data: video,
      type: 'Video'
    })
    this.clearVideoModal()
  }

  clearVideoModal() {
    this.displayVideo = false
    this.videoDetail = ''
    this.videoUrl = ''
    this.clearCommonModalData()
  }

  @memoize()
  disableCreateVideo(url: string) {
    return url === ''
  }

  createArticle() {
    const id = this.lectureId
    const sectionId = this.data.id
    const data: Article = {
      detail: this.articleDetail
    }
    this.addLectureOrEdit({
      title: this.lectureTitle,
      sectionId,
      id,
      data,
      type: 'Article'
    })
    this.clearArticleModal()
  }

  clearArticleModal() {
    this.displayArticle = false
    this.articleDetail = ''
    this.clearCommonModalData()
  }

  // Quiz methods
  createQuiz() {
    const id = this.lectureId
    const sectionId = this.data.id
    const data: Quiz = {
      question: this.question,
      answers: this.answers.map((answer) => ({
        ...answer,
        correct: this.correctAnswer === answer.id
      }))
    }
    this.addLectureOrEdit({
      title: this.lectureTitle,
      sectionId,
      id,
      data,
      type: 'Quiz'
    })
    this.clearQuizModal()
  }

  clearQuizModal() {
    this.displayQuiz = false
    this.question = ''
    this.answers = []
    this.correctAnswer = null
    this.clearCommonModalData()
  }

  addAnswer() {
    let id = 0
    if (this.answers.length) id = this.answers[this.answers.length - 1].id + 1
    this.answers.push({
      id,
      text: '',
      correct: false
    })
  }

  deleteaAnswer(id: number) {
    this.answers = this.answers.filter((item) => item.id !== id)
  }

  @memoize()
  disableAddAnswer(question: string) {
    return question.length <= 0
  }

  @memoize({
    normalizer: function (args) {
      return JSON.stringify(args)
    }
  })
  disabledCreateQuiz(answers: Answer[], id: number) {
    let result = true
    for (let answer of answers) {
      if (answer.id === id) {
        result = false
      }
      if (answer.text === '') {
        result = true
        break
      }
    }
    return result
  }

  // General methods
  clearCommonModalData() {
    this.lectureTitle = ''
    this.lectureId = undefined
    this.resources = []
  }

  addLectureOrEdit(lecture: Lecture) {
    const index = this.lectures.findIndex((item) => item.id === lecture.id)
    if (index > -1) {
      this.store.dispatch(updateLecture({ lecture }))
    } else {
      const id = this.allLectures.length
        ? this.allLectures[this.allLectures.length - 1].id + 1
        : 1
      this.store.dispatch(setLecture({ lecture: { ...lecture, id } }))
    }
    //this.emitEvent()
  }

  setEdit() {
    this.adminService.nextMessage(this.data.id)
  }

  deleteDialog(cb: () => void = null) {
    let func = cb == null ? () => this.emitEvent('delete') : cb
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.msgs = [
          { severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }
        ]
        func()
      },
      reject: () => {
        this.msgs = [
          { severity: 'info', summary: 'Rejected', detail: 'You have rejected' }
        ]
        console.error(this.msgs)
      }
    })
  }
}
