import { Component, Input, OnInit } from '@angular/core'
import { Article } from 'src/app/state/models'
import { LessonToShow } from '../../student.service'

interface ArticleLesson extends LessonToShow {
  data: Article
}

@Component({
  selector: 'app-article-lesson',
  templateUrl: './article-lesson.component.html',
  styleUrls: ['./article-lesson.component.scss']
})
export class ArticleLessonComponent implements OnInit {
  @Input() lesson: ArticleLesson = null
  constructor() {}

  ngOnInit(): void {
    console.log('article init')
  }
}
