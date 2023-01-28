import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { UntypedFormBuilder, Validators } from '@angular/forms'
import { Login, SessionService } from '../../services/session.service'
import { PATH_FROM_LOGIN_KEY } from 'src/data/constants'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  errorMessage: string = null
  loading = false
  toUrl = localStorage.getItem(PATH_FROM_LOGIN_KEY)

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(/^.+@.+\..+$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private sessionService: SessionService
  ) {}

  submit() {
    this.loading = true
    const data: Login = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }
    this.sessionService
      .login(data, () => (this.loading = false))
      .subscribe(
        ({ roleScreen }) => {
          this.router.navigate([`../${roleScreen}`], {
            relativeTo: this.route
          })
        },
        (err: string) => {
          this.errorMessage = err
        }
      )
  }
}
