import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { MessageService } from 'primeng/api'
import { NavigationService } from '../../../services/navigation.service'
import { UserService } from 'src/app/services/user.service'
import { User } from 'src/app/state/models'
import * as moment from 'moment'

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  userId = parseInt(this.route.snapshot.paramMap.get('id'))
  role = parseInt(this.route.snapshot.paramMap.get('role'))
  actualUrl = this.route.snapshot.url.map((segment) => segment.path).join('/')
  loading = false

  roles = [
    {
      id: 2,
      name: 'Student'
    },
    {
      id: 3,
      name: 'Teaher'
    }
  ]

  form = this.formBuilder.group({
    role: [this.role, Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    dob: ['', Validators.required],
    is_supervised: [false, Validators.required],
    parent_name: [null],
    parent_email: [null],
    parent_phone: [null],
    parent_phone_two: [null],
    description: [null]
  })

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.actualUrl.includes('edit')) {
      this.loading = true
      this.userService
        .getUser(this.userId, () => (this.loading = false))
        .subscribe((user) => {
          this.form.controls.role.setValue(user.role)
          this.form.controls.name.setValue(user.name)
          this.form.controls.email.setValue(user.email)
          this.form.controls.phone.setValue(user.phone)
          this.form.controls.dob.setValue(moment(user.dob).toDate())
          this.form.controls.is_supervised.setValue(user.is_supervised)
          this.form.controls.parent_name.setValue(user.parent_name)
          this.form.controls.parent_email.setValue(user.parent_email)
          this.form.controls.parent_phone.setValue(user.parent_phone)
          this.form.controls.parent_phone_two.setValue(user.parent_phone_two)
          this.form.controls.description.setValue(user.description)
        })
    }
    console.log('init')
  }
  updateUser() {
    const user: Partial<User> = {
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
      description: this.form.get('description').value
    }
    this.loading = true
    this.userService
      .updateUser(user, () => (this.loading = false))
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'The user has been updated'
          })
          this.navigationService.back(
            `../../../../users/${this.role}`,
            this.route
          )
        },
        (err) => {
          console.error(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurs while updating the user'
          })
        }
      )
  }
}
