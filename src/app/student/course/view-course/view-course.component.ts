import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { StudentService, CourseToShow, LessonToShow } from '../student.service'
import { Enrollment, Lecture } from 'src/app/state/models'
import { LoaderService } from '../../../components/common/loader/loader.service'
import memoize from '../../../decorators/memoize'
import { SessionService } from 'src/app/services/session.service'
import { RouterAnimations } from 'src/app/utils/Animations'
import { VideoLessonComponent } from './video-lesson/video-lesson.component'
import { combineLatest } from 'rxjs'
@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss'],
  animations: [RouterAnimations.viewCourseTransition()]
})
export class ViewCourseComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(VideoLessonComponent, { static: false })
  video: VideoLessonComponent = null
  loadingCourse = false
  course: CourseToShow = null
  showFinalQuiz = false
  lessonList: LessonToShow[] = []
  lastLesson: LessonToShow
  actualLesson: LessonToShow = null
  sectionPanel = true
  sectionTabs: boolean[] = []
  firstLoad = false
  enrollment: Enrollment
  navPosition = 'calc(50vh - 16px)'
  scrollListener: (this: Window, ev: Event) => any
  constructor(
    private loader: LoaderService,
    private sessionService: SessionService,
    private studentService: StudentService,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollListener)
  }

  ngOnInit() {
    this.firstLoad = false
    this.loader.show()
    this.studentService.hideMenu$.subscribe((hideMenu) => {
      this.sectionPanel = hideMenu
    })
    combineLatest([
      this.studentService.getCourseData(this.route, true),
      this.studentService.getEnrollment()
    ]).subscribe(([data, enrollment]) => {
      if (!this.firstLoad) {
        this.loader.show(false)
        this.firstLoad = true
      }
      this.course = data
      let lessonList: LessonToShow[] = []
      data.sections.forEach((section) => {
        lessonList = lessonList.concat(section.lectures)
      })
      console.log(enrollment, data.sections)
      this.lessonList = lessonList
      this.sectionTabs = new Array(data.sections.length).fill(true)
      const lastLessonToView = lessonList.find(
        (lesson) =>
          enrollment != null && lesson.id === enrollment.last_lesson_id
      )
      this.actualLesson = lastLessonToView || lessonList[0]
      this.lastLesson = lastLessonToView || lessonList[0]
    })
  }

  ngAfterViewInit() {
    this.scrollEvent()
  }

  scrollEvent() {
    this.navPosition = window.innerHeight / 2 - 20 + 'px'
    this.scrollListener = (e) => {
      const offset =
        document.querySelector('.view-course__lesson').getBoundingClientRect()
          .top - document.body.getBoundingClientRect().top
      const scrollY = window.scrollY
      const top = window.innerHeight / 2 - 20 + scrollY - offset
      const footerHeight = document
        .querySelector('.footer-area')
        .getBoundingClientRect().height
      const maxTop = document.body.scrollHeight - footerHeight - 41
      console.log(top, maxTop, footerHeight)
      if (top + offset < maxTop) {
        this.navPosition = top + 'px'
      }
    }
    window.addEventListener('scroll', this.scrollListener)
  }

  getLecture(lesson) {
    this.actualLesson = lesson
  }

  nextLesson(lesson: Lecture) {
    for (let i = 0; i <= this.lessonList.length; i++) {
      if (this.lessonList[i].id === lesson.id) {
        if (this.lessonList[i + 1].count > this.lastLesson.count) {
          this.loader.show()
          this.studentService
            .updateLastLessonCompleted(this.lessonList[i + 1].id, () =>
              this.loader.show(false)
            )
            .subscribe(() => (this.actualLesson = this.lessonList[i + 1]))
        } else {
          this.actualLesson = this.lessonList[i + 1]
        }
        break
      }
    }
  }

  prevLesson(lesson: Lecture) {
    for (let i = 0; i <= this.lessonList.length; i++) {
      if (this.lessonList[i].id === lesson.id) {
        this.actualLesson = this.lessonList[i - 1]
        break
      }
    }
  }

  selectLesson(lesson: LessonToShow) {
    if (lesson.count <= this.lastLesson.count) {
      this.actualLesson = lesson
      this.showFinalQuiz = false
    }
  }

  toggleSectionPanel() {
    this.studentService.hideMenuMesage(!this.sectionPanel)
  }

  animationDone(event) {
    if (this.actualLesson?.type === 'Video') {
      this.video.resize()
    }
  }

  canShowFinalQuiz() {
    if (
      this.lastLesson?.count ===
      this.lessonList[this.lessonList.length - 1].count
    ) {
      this.actualLesson = null
      this.showFinalQuiz = true
    }
  }

  getNextLesson(lesson: LessonToShow, forward = true) {
    const index = this.lessonList.findIndex((item) => lesson.id === item.id)
    if (index > -1) {
      const nextIndex = forward ? index + 1 : index - 1
      if (nextIndex > -1) {
        const nextLesson = this.lessonList[nextIndex]
        return `${
          nextLesson.type !== 'Quiz' ? nextLesson.countToShow + '. ' : ''
        }${nextLesson.title}`
      }
    }
    return ''
  }

  @memoize({
    normalizer: function (args) {
      return JSON.stringify(args)
    }
  })
  hasPrevButton(actualLesson: LessonToShow) {
    return actualLesson !== null && actualLesson?.count !== 1
  }

  @memoize({
    normalizer: function (args) {
      return JSON.stringify(args)
    }
  })
  hasNextButton(actualLesson: LessonToShow, lessonList: LessonToShow[]) {
    return (
      (actualLesson !== null &&
        actualLesson?.count < lessonList[lessonList.length - 1].count &&
        actualLesson?.type !== 'Quiz') ||
      (actualLesson?.type === 'Quiz' && actualLesson?.answered)
    )
  }

  logout() {
    this.loader.show()
    this.sessionService.logout(() => this.loader.show(false)).subscribe()
  }
}
