import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import { Store } from '@ngrx/store'
import {
  ModalAction,
  ModalComponent
} from 'src/app/components/common/modal/modal.component'
import { setFinalQuizReminder } from 'src/app/state/session/profile/session.actions'

@Component({
  selector: 'app-start-final-quiz-modal',
  template: `
    <app-modal
      acceptText="Continue"
      cancelText="Not now"
      showClose="false"
      (action)="getAction($event)"
    >
      <ng-container title>
        <i style="font-size: 1.3rem" class="pi pi-exclamation-circle"></i>
        All right!
      </ng-container>
      <ng-container description>
        You have completed the material for this course. Would you like to start
        the final quiz?
      </ng-container>
    </app-modal>
  `,
  styles: [
    `
      :host ::ng-deep .app-modal-container h3 i {
        color: var(--mainColor);
      }
    `
  ]
})
export class StartFinalQuizModalComponent implements OnChanges {
  @Input() show = false
  @Output() accept = new EventEmitter()
  @ViewChild(ModalComponent) modal = new ModalComponent()

  constructor(private store: Store) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.changeModalProp(changes, 'show')
  }

  getAction(value: ModalAction): void {
    if (value === ModalAction.accept) {
      this.store.dispatch(
        setFinalQuizReminder({ showFinalQuizReminder: false })
      )
      this.accept.emit()
    }
    this.modal.show = false
  }

  changeModalProp(changes: SimpleChanges, prop: string) {
    if (changes[prop].currentValue !== changes[prop].previousValue) {
      this.modal[prop] = changes[prop].currentValue
    }
  }
}
