import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core'
import { Lecture, VideoLectue } from 'src/app/state/models'
import { YoutubeComponent } from '../../../../components/common/youtube/youtube.component'
import { StudentService, LessonToShow } from '../../student.service'

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
  @Output() videoEnded = new EventEmitter<Lecture>()
  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.hideMenu$.subscribe(
      (hideMenu) => {
        this.resize()
      },
      (error) => console.error(error)
    )
  }

  ngAfterViewInit() {
    this.resize()
  }

  videoChange(event: YT.OnStateChangeEvent) {
    if (event.data === YT.PlayerState.ENDED) {
      this.videoEnded.emit(this.lesson)
    }
  }

  resize() {
    this.youtube.triggerRezise()
  }
}
