import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { StudentService, CourseToShow } from '../student.service'
import { Lecture } from 'src/app/state/models'
import { LoaderService } from '../../../components/common/loader/loader.service'
import { SessionService } from 'src/app/services/session.service'
import { RouterAnimations } from 'src/app/utils/Animations'

@Component({
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.scss'],
  animations: [RouterAnimations.viewCourseTransition()]
})
export class ViewCourseComponent implements OnInit {
  loadingCourse = false
  course: CourseToShow = null
  showFinalQuiz = false
  lessonList: Lecture[] = []
  actualLesson: Lecture = null
  sectionPanel = true
  sectionTabs: boolean[] = []
  firstLoad = false

  constructor(
    private loader: LoaderService,
    private sessionService: SessionService,
    private studentService: StudentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.firstLoad = false
    this.loader.show()
    this.studentService.hideMenu$.subscribe((hideMenu) => {
      this.sectionPanel = hideMenu
    })
    this.studentService.getCourseData(this.route, true).subscribe((data) => {
      if (!this.firstLoad) {
        this.loader.show(false)
        this.firstLoad = true
      }
      this.course = data
      let lessonList: Lecture[] = []
      data.sections.map((section) => {
        lessonList = lessonList.concat(section.lectures)
      })
      this.lessonList = lessonList
      this.sectionTabs = new Array(data.sections.length).fill(true)
      this.actualLesson = lessonList[0]
    })
  }

  getLecture(lesson) {
    this.actualLesson = lesson
  }

  nextLesson(lesson: Lecture) {
    for (let i = 0; i <= this.lessonList.length; i++) {
      if (this.lessonList[i].id === lesson.id) {
        this.actualLesson = this.lessonList[i + 1]
        break
      }
    }
  }

  toggleSectionPanel() {
    this.studentService.hideMenuMesage(!this.sectionPanel)
  }

  logout() {
    this.loader.show()
    this.sessionService.logout(() => this.loader.show(false)).subscribe()
  }
}
