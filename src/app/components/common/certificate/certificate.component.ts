import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent {
  @ViewChild('certificate') certificateRef: ElementRef
  title = ''
  id: string = ''
  name: string = ''

  constructor(private renderer: Renderer2) {}

  getDocument(title: string, id: string | number, name: string) {
    const parsedId = typeof id === 'number' ? id.toString() : id

    this.id =
      parsedId.length < 6
        ? new Array(6 - parsedId.length).fill('0').join('') + parsedId
        : parsedId

    this.title = title
    this.name = name

    this.renderer.addClass(
      this.certificateRef.nativeElement,
      'certificate-show'
    )

    setTimeout(() => {
      this.createPDF()
    }, 0)
  }

  createPDF() {
    const DATA: any = document.getElementById('certificate')

    html2canvas(DATA).then((canvas) => {
      const fileWidth = 297
      const fileHeight = (canvas.height * fileWidth) / canvas.width
      const FILE_URI = canvas.toDataURL('image/png')
      const PDF = new jsPDF({
        orientation: 'l',
        unit: 'mm',
        format: 'a4'
      })
      PDF.addImage(FILE_URI, 'PNG', 0, 0, fileWidth, fileHeight)
      PDF.save('angular-demo.pdf')
    })
  }
}
