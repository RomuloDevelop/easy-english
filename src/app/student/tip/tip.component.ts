import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { RouterAnimations } from 'src/app/utils/Animations'

@Component({
  selector: 'app-tip',
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.scss'],
  animations: [RouterAnimations.fadeTransition()]
})
export class TipComponent implements OnInit {
  @Input() show = false
  @Output() showChange = new EventEmitter<boolean>()

  constructor() {}

  ngOnInit(): void {
    console.log('Init tip')
  }
}
