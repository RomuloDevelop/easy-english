import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  Validators,
  ValidationErrors
} from '@angular/forms'
import { MessageService } from 'primeng/api'
import { UserService } from 'src/app/services/user.service'
import { User } from 'src/app/state/models'
import * as moment from 'moment'
import { select, Store } from '@ngrx/store'
import { selectActualUser } from 'src/app/state/session/session.selectors'
import { of } from 'rxjs'
import { finalize, map, mergeMap } from 'rxjs/operators'
import { updateActualUser } from 'src/app/state/session/profile/session.actions'

const passwordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')
  const repeat_password = control.get('repeat_password')

  return password && repeat_password && password.value !== repeat_password.value
    ? { notEqual: true }
    : null
}
@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
  willUpdate = false
  loading = false
  user: User

  form = this.formBuilder.group(
    {
      name: ['', Validators.required],
      email: ['', Validators.required],
      // phone: ['', Validators.required],
      dob: ['', Validators.required],
      description: [null],
      password: ['', [Validators.minLength(8)]],
      repeat_password: ['']
    },
    { validators: passwordValidator }
  )

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.pipe(select(selectActualUser)).subscribe((user) => {
      this.user = user
      this.form.controls.name.setValue(user.name)
      this.form.controls.email.setValue(user.email)
      // this.form.controls.phone.setValue(user.phone)
      this.form.controls.dob.setValue(moment(user.dob).toDate())
      this.form.controls.description.setValue(user.description)
    })
  }
  updatePassword() {
    return this.userService.updatePassword(
      this.user.id,
      this.form.get('password').value
    )
  }
  updateUser() {
    this.loading = true
    const password = this.form.get('password').value
    const user: Partial<User> & { id: number } = {
      id: this.user.id,
      name: this.form.get('name').value,
      email: this.form.get('email').value,
      // phone: this.form.get('phone').value,
      dob: moment(this.form.get('dob').value).format('YYYY-MM-DD'),
      description: this.form.get('description').value
    }
    this.userService
      .updateUser(user)
      .pipe(
        mergeMap((user) => {
          if (password && password !== '') {
            return this.updatePassword().pipe(map(() => user))
          } else {
            return of(user)
          }
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (user) => {
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'The user has been updated'
          })
          this.store.dispatch(updateActualUser({ user }))
        },
        (err) => {
          console.error(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err
          })
        }
      )
  }
}
