import { Component, Input, OnInit } from '@angular/core'
import { trigger, style, animate, transition } from '@angular/animations'
import { LoaderService } from '../loader.service'
import { Subscriber, Subscription } from 'rxjs'

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [
    trigger('listFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s 0.1s ease', style({ opacity: 1 }))
      ]),
      transition(':leave', [animate('0.3s 0.1s ease', style({ opacity: 0 }))])
    ])
  ]
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
