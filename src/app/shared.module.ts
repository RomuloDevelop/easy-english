import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from '@angular/cdk/layout'
import { RouterModule } from '@angular/router'
import { HeaderStyleOneComponent } from './components/common/header-style-one/header-style-one.component'
import { HeaderStyleTwoComponent } from './components/common/header-style-two/header-style-two.component'
import { HeaderStyleThreeComponent } from './components/common/header-style-three/header-style-three.component'
import { HeaderStyleFourComponent } from './components/common/header-style-four/header-style-four.component'
import { YouTubePlayerModule } from '@angular/youtube-player'
import { HttpClientModule } from '@angular/common/http'
import { StickyNavModule } from 'ng2-sticky-nav'
import { RippleModule } from 'primeng/ripple'
import { ButtonModule } from 'primeng/button'
import { AccordionModule } from 'primeng/accordion'
import {
  DashboardTabsComponent,
  TabComponent
} from './components/common/dashboard-tabs/dashboard-tabs.component'

@NgModule({
  declarations: [
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent,
    HeaderStyleThreeComponent,
    HeaderStyleFourComponent,
    DashboardTabsComponent,
    TabComponent
  ],
  imports: [RouterModule, HttpClientModule, StickyNavModule, CommonModule],
  exports: [
    LayoutModule,
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent,
    HeaderStyleThreeComponent,
    HeaderStyleFourComponent,
    YouTubePlayerModule,
    HttpClientModule,
    StickyNavModule,
    RippleModule,
    ButtonModule,
    AccordionModule,
    DashboardTabsComponent,
    TabComponent,
    CommonModule
  ]
})
export class SharedModule {}
