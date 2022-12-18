import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormControl,
  ValidatorFn,
  AbstractControl,
  Validators,
  ValidationErrors
} from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MessageService } from 'primeng/api'
import { NavigationService } from '../../../services/navigation.service'
import {
  ROLE_LIST,
  STATUS_LIST,
  UserService
} from 'src/app/services/user.service'
import { User } from 'src/app/state/models'
import * as moment from 'moment'

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
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  actualYear = new Date().getFullYear()
  userId = parseInt(this.route.snapshot.paramMap.get('id'))
  role = parseInt(this.route.snapshot.data.role)
  actualUrl = this.route.snapshot.url.map((segment) => segment.path).join('/')
  willUpdate = false
  loading = false
  loadingPassword = false

  roles = []

  statuses = STATUS_LIST

  form = this.formBuilder.group(
    {
      role: [this.roles, Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: [''],
      dob: ['', Validators.required],
      start_sub: ['', Validators.required],
      end_sub: ['', Validators.required],
      is_active: [false],
      is_supervised: [false],
      parent_name: [null],
      parent_email: [null],
      parent_phone: [null],
      parent_phone_two: [null],
      description: [null],
      status: [null]
    },
    { validators: passwordValidator }
  )

  form2 = this.formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeat_password: ['', [Validators.required]]
    },
    { validators: passwordValidator }
  )

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const allRoles = [...ROLE_LIST]
    allRoles.shift()
    this.roles = allRoles

    this.willUpdate = this.actualUrl.includes('edit')

    if (this.willUpdate) {
      this.loading = true
      this.userService
        .getUser(this.userId, () => (this.loading = false))
        .subscribe((user) => {
          this.form.controls.role.setValue(user.role)
          this.form.controls.name.setValue(user.name)
          this.form.controls.email.setValue(user.email)
          this.form.controls.phone.setValue(user.phone)
          this.form.controls.dob.setValue(moment(user.dob).toDate())
          this.form.controls.is_active.setValue(user.is_active)
          this.form.controls.is_supervised.setValue(user.is_supervised)
          this.form.controls.parent_name.setValue(user.parent_name)
          this.form.controls.parent_email.setValue(user.parent_email)
          this.form.controls.parent_phone.setValue(user.parent_phone)
          this.form.controls.parent_phone_two.setValue(user.parent_phone_two)
          this.form.controls.description.setValue(user.description)
          this.form.controls.status.setValue(user.status)
          this.form.controls.start_sub.setValue(moment(user.start_sub).toDate())
          this.form.controls.end_sub.setValue(moment(user.end_sub).toDate())
        })
    } else {
      this.form.addControl(
        'password',
        new FormControl('', [Validators.required, Validators.minLength(8)])
      )
      this.form.addControl(
        'repeat_password',
        new FormControl('', [Validators.required])
      )
    }
  }
  updatePassword() {
    this.loadingPassword = true
    this.userService
      .updatePassword(
        this.userId,
        this.form2.get('password').value,
        () => (this.loadingPassword = false)
      )
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'The password has been updated'
          })
        },
        (err) => {
          console.error(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error ocurred when updating password'
          })
        }
      )
  }
  updateUser() {
    this.loading = true

    const user: User & { id: number } = {
      id: this.userId,
      role: this.form.get('role').value,
      name: this.form.get('name').value,
      email: this.form.get('email').value,
      phone: this.form.get('phone').value,
      dob: moment(this.form.get('dob').value).format('YYYY-MM-DD'),
      is_supervised: this.form.get('is_supervised').value,
      parent_name: this.form.get('parent_name').value,
      parent_email: this.form.get('parent_email').value,
      parent_phone: this.form.get('parent_phone').value,
      parent_phone_two: this.form.get('parent_phone_two').value,
      description: this.form.get('description').value,
      is_active: this.form.get('is_active').value,
      status: this.form.get('status').value,
      start_sub: moment(this.form.get('start_sub').value).format('YYYY-MM-DD'),
      end_sub: moment(this.form.get('end_sub').value).format('YYYY-MM-DD')
    }

    if (this.willUpdate) {
      this.userService
        .updateUser(user, () => (this.loading = false))
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'The user has been updated'
            })
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
    } else {
      user.password = this.form.get('password').value
      this.userService
        .insertUser(user, () => (this.loading = false))
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Success',
              detail: 'The user has been created'
            })
            this.navigationService.back(`../`, this.route)
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
}
