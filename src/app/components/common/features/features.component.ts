import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-features',
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    slideShowSlides: OwlOptions = {
		loop: true,
		nav: false,
		dots: false,
		animateOut: 'fadeOut',
		autoplayHoverPause: false,
		autoplay: true,
		smartSpeed: 400,
		mouseDrag: false,
		autoHeight: true,
		items: 1,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		]
    }

}