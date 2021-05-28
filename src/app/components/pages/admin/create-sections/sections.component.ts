import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { SectionAction, Section, Lecture, VideoLectue, Article, Quiz, Answer } from '../admin.service';
import {ConfirmationService, PrimeNGConfig, Message} from 'primeng/api';
import memoize from '../../../../decorators/memoize'

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
  lectureId: number = undefined

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
  correctAnswer: number = null

  constructor(
      private confirmationService: ConfirmationService,
      private primengConfig: PrimeNGConfig,
      private cdr: ChangeDetectorRef
    ) { }

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
        const data = item.data as Quiz
        this.quizTitle = data.title
        this.question = data.question
        this.answers = data.answers
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

  // Quiz methods

  createQuiz() {
    console.log('answers', this.answers)
    const id = this.lectureId
    const data: Quiz = {
        title: this.quizTitle,
        question: this.question,
        answers: this.answers.map(answer => ({...answer, correct: this.correctAnswer === answer.id}))
    }
    this.addLectureOrEdit({id, data, type: 'Quiz'})
    this.displayQuiz = false
    this.quizTitle = ''
    this.question = ''
    this.answers = []
    this.lectureId = undefined
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
      const index = this.answers.findIndex(item => item.id === id)
      this.answers.splice(index, 1)
  }

  @memoize()
  disableAddAnswer(question: string) {
      return question.length <= 0
  }

  @memoize({
    normalizer: function(args) {
        return JSON.stringify(args);
    }
  })
  disabledCreateQuiz(answers: Answer[], id: number) {
      let result = true
      for(let answer of answers) {
        if(answer.id === id) {
            result = false
        }
        if(answer.text === '') {
            result = true
            break
          }
      }
      return result
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
