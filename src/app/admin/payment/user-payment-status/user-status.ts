import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core'
import { ModalAction } from 'src/app/components/common/modal/modal.component'
import { STATUS_LIST, UserService } from 'src/app/services/user.service'
import { User } from 'src/app/state/models'

@Component({
  selector: 'app-user-status',
  template: `<app-modal
    acceptText="Edit"
    (action)="getAction($event)"
    [(show)]="show"
    [disableAccept]="!selectedStatus"
  >
    <ng-container title> Edit user status </ng-container>
    <ng-container description>
      <div class="p-d-flex p-justify-center p-3">
        <p-dropdown
          [options]="statuses"
          [(ngModel)]="selectedStatus"
          placeholder="Select status"
          optionLabel="description"
        ></p-dropdown>
      </div>
    </ng-container>
  </app-modal>`,
  styles: []
})
export class UserStatusComponent implements OnChanges {
  @Input() user: User
  @Input() show = false
  @Output() showChange = new EventEmitter<boolean>()
  selectedStatus: typeof STATUS_LIST[0]
  statuses = STATUS_LIST
  loading = false

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.selectedStatus = STATUS_LIST.find(
        (status) => changes['user'].currentValue.status === status.id
      )
    }
  }

  getAction(event: ModalAction) {
    if (event === ModalAction.accept) {
      this.loading = true
      this.userService
        .updateUser({
          id: this.user.id as number,
          status: this.selectedStatus.id
        })
        .subscribe(
          () => {
            this.loading = false
            this.show = false
          },
          (err) => {
            this.loading = false
            console.error(err)
          }
        )
    }
  }
}
