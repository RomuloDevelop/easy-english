import { Component, OnInit } from '@angular/core'
import { Store, select } from '@ngrx/store'
import { User } from '../../state/models'
import {
  ConfirmationService,
  PrimeNGConfig,
  Message,
  MessageService
} from 'primeng/api'
import { selectActualUser } from 'src/app/state/session/session.selectors'
import { Tip, TipsService } from 'src/app/services/tips.service'

enum ModalAction {
  create = 1,
  update = 2
}

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss']
})
export class TipsComponent implements OnInit {
  actualUser: User
  loadingTips = false
  loadingTip = false
  msgs: Message[] = []
  tips: Tip[]
  tip: Tip
  tipModal = false
  modalAction: ModalAction = ModalAction.create

  tipCols = ['Id', 'Description']
  tipRows = ['id', 'description']

  constructor(
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private store: Store,
    private tipService: TipsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.getTable()
    this.store.pipe(select(selectActualUser)).subscribe((actualUser) => {
      this.actualUser = actualUser
    })
  }

  getTable() {
    this.loadingTips = true
    this.tipService
      .getTips(() => (this.loadingTips = false))
      .subscribe(
        (tips) => (this.tips = tips),
        (err) => {
          console.error(err)
        }
      )
  }

  editTip(tip: Tip) {
    this.tip = tip
    this.tipModal = true
    this.modalAction = ModalAction.update
  }

  newTip() {
    this.tip = {
      description: ''
    }
    this.tipModal = true
    this.modalAction = ModalAction.create
  }

  submitTip() {
    this.loadingTip = true
    const actions = {
      [ModalAction.create]: this.createTip,
      [ModalAction.update]: this.updateTip
    }

    actions[this.modalAction]()
  }

  createTip() {
    this.tipService
      .insertTip(this.tip.description, () => (this.loadingTip = false))
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'The tip has been created'
          })
        },
        (err) => {
          console.error(err)
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'An error ocurred when creating the tip'
          })
        }
      )
  }

  updateTip() {
    this.tipService
      .updateTip(
        this.tip.id,
        this.tip.description,
        () => (this.loadingTip = false)
      )
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'The tip has been updated'
          })
        },
        (err) => {
          console.error(err)
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'An error ocurred when updating the tip'
          })
        }
      )
  }

  confirmDeleteTip(tip: Tip) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.msgs = [
          { severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }
        ]
        this.deleteTip(tip)
      },
      reject: () => {
        this.msgs = [
          { severity: 'info', summary: 'Rejected', detail: 'You have rejected' }
        ]
        console.error(this.msgs)
      }
    })
  }

  deleteTip(tip: Tip) {
    this.tipService.deleteTip(tip.id).subscribe(
      () => {},
      (err) => {
        console.error(err)
      }
    )
  }
}
