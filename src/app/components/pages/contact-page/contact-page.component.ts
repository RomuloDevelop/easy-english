import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-contact-page',
    templateUrl: './contact-page.component.html',
    styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

    submit(form){
        var name = form.name;
        console.log(name);
        
        var email = form.email;
        console.log(email);

        var number = form.number;
        console.log(number);
        
        var subject = form.subject;
        console.log(subject);
        
        var message = form.message;
        console.log(message);
    }

}