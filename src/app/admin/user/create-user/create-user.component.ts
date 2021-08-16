import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { PrimeNGConfig, MessageService } from 'primeng/api'
import { UserService } from 'src/app/services/user.service'
import { User } from 'src/app/state/models'

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  loading = false

  form = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    is_supervised: [false, Validators.required],
    dob: ['', Validators.required]
  })

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('init')
  }
  updateUser() {
    const user: User = {
      name: 'Temporal name',
      email: 'example@email.com',
      phone: '',
      is_supervised: false,
      dob: ''
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
