import { Component, Input, OnInit } from '@angular/core'
import { Lecture, Article } from 'src/app/state/admin/models'

interface ArticleLesson extends Lecture {
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
