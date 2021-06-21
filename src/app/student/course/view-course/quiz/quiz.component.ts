import { Component, Input, OnInit } from '@angular/core'
import { Lecture } from 'src/app/state/admin/models'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  @Input() lesson: Lecture = null
  constructor() {}

  ngOnInit(): void {}
}
