import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { RouterAnimations } from 'src/app/utils/Animations'

export enum ModalAction {
  close,
  accept,
  cancel
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [RouterAnimations.fadeTransition()]
})
export class ModalComponent {
  @Input() show = false
  @Input() showClose = true
  @Input() acceptText = 'Ok'
  @Input() cancelText = 'Cancel'
  @Input() footer = true
  @Input() loading = false
  @Input() disableAccept = false
  @Output() showChange = new EventEmitter<boolean>()
  @Output() action = new EventEmitter<ModalAction>()

  modalAction = ModalAction

  ngOnChanges(event) {
    console.log(event)
  }
  constructor() {}

  emitAction(value: ModalAction) {
    this.action.emit(value)

    if (value === ModalAction.close) this.showChange.emit(false)
  }
}
