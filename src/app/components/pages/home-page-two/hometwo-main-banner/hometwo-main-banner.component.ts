import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-hometwo-main-banner',
    templateUrl: './hometwo-main-banner.component.html',
    styleUrls: ['./hometwo-main-banner.component.scss']
})
export class HometwoMainBannerComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    homeSlides: OwlOptions = {
		loop: true,
		nav: true,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		items: 1,
		autoHeight: true,
		navText: [
			"<i class='bx bx-chevron-left'></i>",
			"<i class='bx bx-chevron-right'></i>"
		]
    }

}