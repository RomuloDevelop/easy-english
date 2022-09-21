import { Component } from '@angular/core'

@Component({
  selector: 'app-home',
  template: ` <app-header-style-three></app-header-style-three>
    <app-homethree-main-banner></app-homethree-main-banner>
    <app-homethree-about></app-homethree-about>
    <app-offer></app-offer>
    <div class="instructor-area pt-100 pb-70">
      <div class="container">
        <div class="section-title">
          <span class="sub-title">Make Connections</span>
          <h2>Team of Instructors</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut nisi
            ut aliquip ex ea.
          </p>
        </div>
        <app-instructors-style-one></app-instructors-style-one>
      </div>
    </div>`
})
export class HomeComponent {
  constructor() {}
}
