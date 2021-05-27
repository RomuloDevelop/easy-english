import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-instructors-style-one',
    templateUrl: './instructors-style-one.component.html',
    styleUrls: ['./instructors-style-one.component.scss']
})
export class InstructorsStyleOneComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    instructorSlides: OwlOptions = {
		loop: false,
		nav: true,
		dots: false,
		autoplayHoverPause: true,
		autoplay: true,
		margin: 30,
		navText: [
			"<i class='bx bx-left-arrow-alt'></i>",
			"<i class='bx bx-right-arrow-alt'></i>"
		],
		responsive: {
			0: {
				items: 1
			},
			576: {
				items: 2
			},
			768: {
				items: 2
			},
			1200: {
				items: 3
			}
		}
    }

}