import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, Validators } from '@angular/forms'
import { Login, SessionService } from '../../../services/session.service'
import roles from '../../../../data/roles'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  errorMessage: string = null
  loading = false
  requiredRole = null

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(/^.+@.+\..+$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  })

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.getRole()
  }

  getRole() {
    const url = this.route.snapshot.pathFromRoot[1].url
    this.requiredRole =
      url[0].path === 'student' ? roles['student'] : roles['teacher']
  }

  submit() {
    this.loading = true
    const data: Login = {
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }
    this.sessionService
      .login(data, this.requiredRole, () => (this.loading = false))
      .subscribe(
        () => {
          this.router.navigate(['../'], {
            relativeTo: this.route
          })
        },
        (err: string) => {
          this.errorMessage = err
        }
      )
  }
}
