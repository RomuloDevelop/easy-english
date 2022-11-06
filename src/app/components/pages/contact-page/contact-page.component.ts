import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {
  constructor() {}

  submit(form) {
    var name = form.name

    var email = form.email

    var number = form.number

    var subject = form.subject

    var message = form.message
  }
}
