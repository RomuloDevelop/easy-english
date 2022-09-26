import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import {
  ModalAction,
  ModalComponent
} from 'src/app/components/common/modal/modal.component'

@Component({
  selector: 'app-tip',
  template: `
    <app-modal acceptText="Next tip" (action)="getAction($event)">
      <ng-container title>
        <i style="font-size: 1.3rem" class="pi pi-exclamation-circle"></i>
        Tip!
      </ng-container>
      <ng-container description>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero,
        repellat rerum. Fugiat amet maiores corrupti aperiam! Quibusdam ad nulla
        similique magni in cum, accusamus incidunt quae id ratione libero est!
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
export class TipComponent implements OnChanges {
  @Input() show = false
  @ViewChild(ModalComponent) modal = new ModalComponent()

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.changeModalProp(changes, 'show')
  }

  getAction(value: ModalAction): void {
    this.modal.show = false
  }

  changeModalProp(changes: SimpleChanges, prop: string) {
    if (changes[prop].currentValue !== changes[prop].previousValue) {
      this.modal[prop] = changes[prop].currentValue
    }
  }
}
