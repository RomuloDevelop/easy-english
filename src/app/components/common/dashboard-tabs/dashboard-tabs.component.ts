import {
  Component,
  Input,
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
  display = true

  constructor() {}

  showTab() {
    this.display = true
  }

  hideTab() {
    this.display = false
  }
}

export interface Tab {
  icon: string
  text: string
}
@Component({
  selector: 'app-dashboard-tabs',
  templateUrl: './dashboard-tabs.component.html',
  styleUrls: ['./dashboard-tabs.component.scss']
})
export class DashboardTabsComponent implements OnChanges, AfterContentInit {
  @ContentChildren(TabComponent) tabsTemp: QueryList<TabComponent>
  tabs: Tab[] = []

  selected: number = 0

  constructor() {}

  ngOnChanges(...event) {
    console.log(event)
  }

  ngAfterContentInit() {
    this.tabsTemp.forEach((item, i) => {
      this.tabs.push({
        icon: item.icon,
        text: item.label
      })

      if (i !== this.selected) {
        item.hideTab()
      }
    })
  }

  getTabForChange(index: number) {
    this.selected = index
    this.tabsTemp.forEach((item, i) => {
      if (index === i) {
        item.showTab()
      } else {
        item.hideTab()
      }
    })
  }
}
