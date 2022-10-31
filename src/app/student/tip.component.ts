import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import {
  ModalAction,
  ModalComponent
} from 'src/app/components/common/modal/modal.component'
import { TipsService } from '../services/tips.service'

@Component({
  selector: 'app-tip',
  template: `
    <app-modal acceptText="Next tip" (action)="getAction($event)">
      <ng-container title>
        <i style="font-size: 1.3rem" class="pi pi-exclamation-circle"></i>
        Tip!
      </ng-container>
      <ng-container description>
        <p-progressSpinner
          *ngIf="loading"
          styleClass="custom-spinner blue"
          strokeWidth="7"
          [style]="{
            width: '50px',
            height: '50px'
          }"
        ></p-progressSpinner>
        <ng-container *ngIf="!loading">
          {{ description }}
        </ng-container>
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
export class TipComponent implements OnInit, OnChanges {
  @Input() show = false
  @ViewChild(ModalComponent) modal = new ModalComponent()

  loading = true
  description = ''

  constructor(private tipsService: TipsService) {}

  ngOnInit(): void {
    this.getTip()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeModalProp(changes, 'show')
  }

  getAction(value: ModalAction): void {
    if (value === ModalAction.accept) {
      this.getTip()
      return
    }
    this.modal.show = false
  }

  changeModalProp(changes: SimpleChanges, prop: string) {
    if (changes[prop].currentValue !== changes[prop].previousValue) {
      this.modal[prop] = changes[prop].currentValue
    }
  }

  getTip() {
    this.loading = true
    this.tipsService
      .getRandomTip(() => (this.loading = false))
      .subscribe((tip) => {
        this.description = tip.description
      })
  }
}
