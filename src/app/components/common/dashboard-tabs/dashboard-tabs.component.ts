import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ContentChildren,
  QueryList,
  AfterContentInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core'
import { RouterAnimations } from 'src/app/utils/Animations'

@Component({
  selector: 'tab',
  template: `
    <div
      #tabContent
      class="tab-content"
      [@fadeInOutTab]="display ? 'in-tab' : 'out-tab'"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./dashboard-tabs.component.scss'],
  animations: [RouterAnimations.tabTransition()]
})
export class TabComponent {
  @ViewChild('tabContent') element: ElementRef
  @Input() label: string = ''
  @Input() icon: string = ''
  @Input() notDisplay: boolean = false
  @Output() tabClick = new EventEmitter()
  display = true

  constructor() {}

  showTab() {
    this.display = true
    this.tabClick.emit()
  }

  hideTab() {
    this.display = false
  }

  getHeight() {
    const height = this.element.nativeElement.clientHeight
    return height
  }
}

export interface Tab {
  icon: string
  text: string
  notDisplay: boolean
  tabClick?: EventEmitter<any>
}
@Component({
  selector: 'app-dashboard-tabs',
  templateUrl: './dashboard-tabs.component.html',
  styleUrls: ['./dashboard-tabs.component.scss']
})
export class DashboardTabsComponent implements OnChanges, AfterContentInit {
  @Input() tabLoading: number = null
  @ContentChildren(TabComponent) tabsTemp: QueryList<TabComponent>
  tabs: Tab[] = []

  nextHeight: number = null
  prevHeight: number = null
  tabHeight: number = null

  selected: number = 0

  constructor() {}

  ngOnChanges(...event) {
    console.log('TabComponent', event)
  }

  ngAfterContentInit() {
    this.tabsTemp.forEach((item, i) => {
      this.tabs.push({
        icon: item.icon,
        text: item.label,
        notDisplay: item.notDisplay
      })

      if (i !== this.selected) {
        item.hideTab()
      } else {
        setTimeout(() => {
          this.tabHeight = item.getHeight()
        })
      }
    })

    this.tabsTemp.changes.subscribe((event) => {
      console.log('TabComponent', event)
    })
  }

  getTabForChange(index: number) {
    if (!this.tabs[index].notDisplay) {
      this.selected = index
      this.tabsTemp.forEach((item, i) => {
        if (index === i) {
          if (index > this.selected) {
            this.tabHeight = this.nextHeight
          } else if (index < this.selected) {
            this.tabHeight = this.prevHeight
          } else {
            this.tabHeight = item.getHeight()
          }
          item.showTab()
          this.nextHeight = this.tabsTemp
            .find((item, index) => index === i + 1)
            ?.getHeight()
          this.prevHeight = this.tabsTemp
            .find((item, index) => index === i - 1)
            ?.getHeight()
        } else {
          item.hideTab()
        }
      })
    } else {
      this.tabsTemp.forEach((item, i) => {
        if (index === i) {
          item.tabClick.emit()
        }
      })
    }
    console.log(this.tabHeight)
  }
}
