import { Component, Input, OnInit, OnDestroy } from '@angular/core'

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent implements OnInit, OnDestroy {
  @Input() url: string = ''
  videoHeight: number = 250
  videoWidth: number = 500

  constructor() {}

  ngOnInit(): void {
    // Add Youtube script
    const tag = document.createElement('script')

    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)

    // Logic for resize video
    window.addEventListener('resize', this.resizeWindow.bind(this))
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeWindow.bind(this))
  }

  resizeWindow() {
    const YTContainer: HTMLDivElement = document.querySelector(
      '#youtube-container'
    ) as HTMLDivElement
    this.videoWidth = YTContainer.clientWidth
    this.videoHeight = this.videoWidth / 2
    console.log(this.videoWidth, this.videoHeight)
  }

  triggerRezise() {
    setTimeout(this.resizeWindow.bind(this), 300)
  }
}
