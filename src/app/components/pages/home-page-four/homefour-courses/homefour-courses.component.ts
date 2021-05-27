import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-homefour-courses',
    templateUrl: './homefour-courses.component.html',
    styleUrls: ['./homefour-courses.component.scss']
})
export class HomefourCoursesComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    coursesSlides: OwlOptions = {
		loop: false,
		nav: true,
		dots: true,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		],
		responsive: {
			0: {
				items: 1,
			},
			768: {
				items: 2,
			},
			1200: {
				items: 3,
			}
		}
    }

}