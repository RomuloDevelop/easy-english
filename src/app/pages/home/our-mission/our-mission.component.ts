import { Component } from '@angular/core'

@Component({
  selector: 'app-our-mission',
  template: `
    <div class="mission-area ptb-100">
      <div class="container">
        <div class="mission-content">
          <div class="section-title text-start">
            <span class="sub-title">Discover Mission</span>
            <h2>Why our platform in better</h2>
          </div>
          <div class="mission-slides">
            <h3>Quality can be better than quantity in this platform</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <a routerLink="/" class="default-btn"
              ><i class="bx bx-book-reader icon-arrow before"></i
              ><span class="label">Ver testimonio</span
              ><i class="bx bx-book-reader icon-arrow after"></i
            ></a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./our-mission.component.scss']
})
export class OurMissionComponent {
  constructor() {}
}
