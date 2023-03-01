import { Component } from '@angular/core'

@Component({
  selector: 'app-our-mission',
  template: `
    <div class="mission-area ptb-100">
      <div class="container">
        <div class="mission-content">
          <div class="section-title text-start">
            <h2>Escucha a nuestros estudiantes</h2>
          </div>
          <div class="mission-slides">
            <h3>Comprueba por ti mismo nuestro trabajo.</h3>
            <p>
              Que mejor manera de dar a conocer nuestros servicios que a través
              de los mismos estudiantes que han hecho vida en la academia. Ellos
              representan todo el esfuerzo que hacemos día a día para ayudarte a
              alcanzar ese nivel de ingles que tanto anhelas.
            </p>
            <p>
              Recuerda que no hay limite de edad, lo mas importante es la
              voluntad que tengas para incluir el inglés en tu vida diaria. No
              solo verlo como una asignatura sino como una nueva manera de
              experimentar la cotidianidad. Siempre con un propósito que nos
              permita mantener el foco.
            </p>
            <a
              href="https://www.youtube.com/watch?v=6zIqkxd2lc0"
              target="_blank"
              class="default-btn"
              ><i class="bx bx-book-reader icon-arrow before"></i
              ><span class="label">Ver testimonio</span
              ><i class="bx bx-book-reader icon-arrow after"></i
            ></a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./our-mission.component.scss']
})
export class OurMissionComponent {
  constructor() {}
}
