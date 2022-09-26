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
  @Output() action = new EventEmitter<ModalAction>()

  modalAction = ModalAction

  constructor() {}

  emitAction(value: ModalAction) {
    this.action.emit(value)
  }
}
