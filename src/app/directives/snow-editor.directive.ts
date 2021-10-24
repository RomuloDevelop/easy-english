import {
  AfterViewChecked,
  AfterViewInit,
  Directive,
  ElementRef
} from '@angular/core'

@Directive({
  selector: '[appSnowEditor]'
})
export class SnowEditorDirective implements AfterViewInit {
  element: ElementRef
  constructor(el: ElementRef) {
    this.element = el
  }

  ngAfterViewInit() {
    console.log(this.element.nativeElement.childNodes[0].childNodes[1])
    this.element.nativeElement.childNodes[0].childNodes[1].classList.remove(
      'p-editor-toolbar'
    )
  }
}
