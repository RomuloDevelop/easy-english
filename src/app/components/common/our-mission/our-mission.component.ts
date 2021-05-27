import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-our-mission',
    templateUrl: './our-mission.component.html',
    styleUrls: ['./our-mission.component.scss']
})
export class OurMissionComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

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