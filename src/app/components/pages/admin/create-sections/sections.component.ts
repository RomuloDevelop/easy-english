import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SectionAction, Section, Lecture, VideoLectue, Article, Quiz, Answer } from '../admin.service';
import {ConfirmationService, PrimeNGConfig, Message} from 'primeng/api';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
  providers: [ConfirmationService]
})
export class SectionsComponent implements OnInit, OnChanges {

  @Output('save') saveEvent = new EventEmitter<{section: Section, type: SectionAction}>();
  @Input('data') data: Section = null
  edit = false
  id = 1
  title = ''
  description = ''
  lectures: Lecture[] = []

  // Modals
  displayDelete = false
  displayArticle = false
  displayVideo = false
  displayQuiz = false
  msgs: Message[] = [];

  // Video variables
  videoUrl = ''
  videoDetail = ''

  // Article variables
  articleTitle = ''
  articleDetail = ''

  //Quiz
  quizTitle = ''
  question = ''
  answers: Answer[] = []

  lectureId: number = undefined

  constructor(private confirmationService: ConfirmationService, private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    for(const name in changes) {
        if (name === 'data') {
            const section = changes[name].currentValue as Section
            this.edit = section.edit
            this.id = section.id
            this.title = section.title
            this.description = section.description
            this.lectures = section.lectures
        }
    }
  }

  emitEvent(type: SectionAction = 'update') {
    const section: Section = {
        edit: false,
        id: this.id,
        title: this.title,
        description: this.description,
        lectures: this.lectures
    }
    this.saveEvent.emit({section, type})
  }

  // Lectures methods
  updateLecture(item: Lecture) {
    if (item.type === 'Article') {
        const data = item.data as Article
        this.articleDetail = data.detail
        this.articleTitle = data.title
        this.lectureId = item.id
        this.displayArticle = true
    } else if (item.type === 'Quiz') {
        this.displayQuiz = true
    } else if (item.type === 'Video') {
        const data = item.data as VideoLectue
        this.videoDetail = data.detail
        this.videoUrl = data.url
        this.lectureId = item.id
        this.displayVideo = true
    }
  }

  deleteLecture(lecture: Lecture) {
    this.deleteDialog(() => {
        const index = this.lectures.findIndex(item => item.id === lecture.id)
        this.lectures.splice(index, 1)
    })
  }

  createVideo() {
    const id = this.lectureId
    const video: VideoLectue = {
        url: this.videoUrl,
        detail: this.videoDetail
    }
    this.addLectureOrEdit({id, data: video, type: 'Video'})
    this.displayVideo = false
    this.videoDetail = ''
    this.videoUrl = ''
    this.lectureId = undefined
  }

  createArticle() {
    const id = this.lectureId
    const data: Article = {
        title: this.articleTitle,
        detail: this.articleDetail
    }
    this.addLectureOrEdit({id, data, type: 'Article'})
    this.displayArticle = false
    this.articleDetail = ''
    this.articleTitle = ''
    this.lectureId = undefined
  }

  addLectureOrEdit(lecture: Lecture) {
    const index = this.lectures.findIndex(item => item.id === lecture.id)
    if (index > -1) {
        this.lectures[index] = lecture
    } else {
        const newId = this.lectures.length ? this.lectures[this.lectures.length - 1].id + 1 : 1
        this.lectures.push({...lecture, id: newId})
    }
    this.emitEvent()
  }

  deleteDialog(cb: () => void = null) {
      let func = cb == null ? () => this.emitEvent('delete') : cb
      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
            this.msgs = [{severity:'info', summary:'Confirmed', detail:'Record deleted'}];
            func()
        },
        reject: () => {
            this.msgs = [{severity:'info', summary:'Rejected', detail:'You have rejected'}];
            console.error(this.msgs)

        }
    });
  }
}
