import { Component, OnInit } from '@angular/core'
import { OwlOptions } from 'ngx-owl-carousel-o'

@Component({
  selector: 'app-homeone-main-banner',
  templateUrl: './homeone-main-banner.component.html',
  styleUrls: ['./homeone-main-banner.component.scss']
})
export class HomeoneMainBannerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  missionSlides: OwlOptions = {
    loop: true,
    nav: true,
    dots: false,
    autoplayHoverPause: true,
    autoplay: true,
    items: 1,
    navText: [
      "<i class='bx bx-left-arrow-alt'></i>",
      "<i class='bx bx-right-arrow-alt'></i>"
    ]
  }
}
