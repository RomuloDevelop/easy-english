import { Component } from '@angular/core'

@Component({
  selector: 'app-home',
  template: `
    <app-page-layout>
      <app-header-style-three></app-header-style-three>
      <app-homethree-main-banner></app-homethree-main-banner>
      <app-homethree-about></app-homethree-about>
      <app-offer></app-offer>
      <div class="instructor-area pt-100 pb-70">
        <div class="container">
          <div class="section-title">
            <h2>Así funciona nuestro curso</h2>
          </div>
          <app-categories-style-one></app-categories-style-one>
        </div>
      </div>
      <div class="instructor-area pt-100 pb-70">
        <div class="container">
          <div class="section-title">
            <h2>Equipo de Instructores</h2>
            <p>
              Caracterizados por su paciencia, amabilidad y dedicación nuestros
              teachers harán todo lo posible para que alcances la fluidez y
              balance en el idioma que tanto anhelas.
            </p>
          </div>
          <app-instructors-style-one></app-instructors-style-one>
        </div>
      </div>
      <div class="testimonials-area ptb-100">
        <div class="container">
          <div class="section-title">
            <span class="sub-title">Testimonials</span>
            <h2>Lo que dicen los estudiantes</h2>
          </div>
          <app-feedback-style-two></app-feedback-style-two>
        </div>
      </div>
      <app-our-mission></app-our-mission>
    </app-page-layout>
  `
})
export class HomeComponent {
  constructor() {}
}
