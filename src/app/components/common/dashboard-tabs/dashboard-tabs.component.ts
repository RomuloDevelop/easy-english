import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core'

@Component({
  selector: 'tab',
  template: `
    <div class="tab-content" [class]="{ visible: display, hidden: !display }">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./dashboard-tabs.component.scss']
})
export class TabComponent {
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
          item.showTab()
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
  }
}
