import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core'
import { Lecture, VideoLectue } from 'src/app/state/admin/models'
import { YoutubeComponent } from '../../../../components/common/youtube/youtube.component'
import { CourseService, LessonToShow } from '../../course.service'

interface VideoLesson extends LessonToShow {
  data: VideoLectue
}

@Component({
  selector: 'app-video-lesson',
  templateUrl: './video-lesson.component.html',
  styleUrls: ['./video-lesson.component.scss']
})
export class VideoLessonComponent implements OnInit, AfterViewInit {
  @ViewChild(YoutubeComponent) youtube: YoutubeComponent
  @Input() lesson: VideoLesson = null
  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.hideMenu$.subscribe(
      (hideMenu) => {
        console.log(hideMenu, 'video')
        this.youtube.triggerRezise()
      },
      (error) => console.error(error)
    )
  }

  ngAfterViewInit() {
    this.youtube.triggerRezise()
  }
}
