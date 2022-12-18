import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core'
import * as moment from 'moment'
import { ModalAction } from 'src/app/components/common/modal/modal.component'
import { STATUS_LIST, UserService } from 'src/app/services/user.service'
import { User } from 'src/app/state/models'

@Component({
  selector: 'app-user-status',
  template: `<app-modal
    acceptText="Edit"
    (action)="getAction($event)"
    [(show)]="show"
    [loading]="loading"
    [disableAccept]="!selectedStatus"
  >
    <ng-container title> Edit user status </ng-container>
    <ng-container description>
      <div class="p-d-flex p-flex-column p-align-stretch p-3 user-status-form">
        <p-dropdown
          [options]="statuses"
          [(ngModel)]="selectedStatus"
          placeholder="Select status"
          optionLabel="description"
        ></p-dropdown>
        <p-calendar
          [monthNavigator]="true"
          [yearNavigator]="true"
          [yearRange]="'1900:' + actualYear"
          placeholder="End date"
          class="p-inputtext-sm"
          [(ngModel)]="endSub"
        ></p-calendar>
      </div>
    </ng-container>
  </app-modal>`,
  styles: [
    `
      .user-status-form {
        gap: 1rem;
      }
      :host ::ng-deep .user-status-form .p-calendar,
      :host ::ng-deep .user-status-form .p-dropdown {
        width: 100% !important;
      }
    `
  ]
})
export class UserStatusComponent implements OnChanges {
  @Input() user: User
  @Input() show = false
  @Output() showChange = new EventEmitter<boolean>()
  @Output() modified = new EventEmitter()
  selectedStatus: typeof STATUS_LIST[0]
  endSub: Date
  statuses = STATUS_LIST
  loading = false
  actualYear = new Date().getFullYear()

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      const user = changes['user'].currentValue
      this.selectedStatus = STATUS_LIST.find(
        (status) => user?.status === status.id
      )
      this.endSub = user?.end_sub && moment(user.end_sub).toDate()
    }
  }

  getAction(event: ModalAction) {
    if (event === ModalAction.accept) {
      this.loading = true
      this.userService
        .updateUser({
          id: this.user.id as number,
          status: this.selectedStatus.id,
          end_sub: moment(this.endSub).format('YYYY-MM-DD')
        })
        .subscribe(
          () => {
            this.modified.emit()
          },
          (err) => {
            console.error(err)
          },
          () => {
            this.loading = false
            this.showChange.emit(false)
          }
        )
    } else {
      this.showChange.emit(false)
    }
  }
}
