import { Component } from '@angular/core'
import { FooterComponent } from '../components/common/footer/footer.component'

@Component({
  imports: [FooterComponent],
  selector: 'app-page-layout',
  template: `
    <div style="min-height: 100vh">
      <ng-content></ng-content>
    </div>
    <app-footer style="z-index: 0"></app-footer>
  `,
  standalone: true
})
export class PageComponent {
  constructor() {}
}
