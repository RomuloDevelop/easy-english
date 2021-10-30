import { Component, OnInit } from '@angular/core'
import { LoaderService } from '../loader.service'
import { Subscription } from 'rxjs'
import { RouterAnimations } from 'src/app/utils/Animations'

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [RouterAnimations.fadeTransition()]
})
export class LoaderComponent implements OnInit {
  show = false
  loaderSubscriber: Subscription

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.loaderSubscriber = this.loaderService.loader$.subscribe((action) => {
      this.show = action
    })
  }

  ngDestroy() {
    this.loaderSubscriber.unsubscribe()
  }
}
