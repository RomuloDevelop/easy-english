import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
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
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { CalendarModule } from 'primeng/calendar'

import {
  DashboardTabsComponent,
  TabComponent
} from './components/common/dashboard-tabs/dashboard-tabs.component'
import { YoutubeComponent } from './components/common/youtube/youtube.component'

import { httpInterceptorProviders } from './interceptors/base'
import { LoaderModule } from './components/common/loader/loader.module'
import { ModalComponent } from './components/common/modal/modal.component'

import { SnowEditorDirective } from './directives/snow-editor.directive'
import { PageComponent } from './layouts/page.component'

@NgModule({
  declarations: [
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent,
    HeaderStyleThreeComponent,
    HeaderStyleFourComponent,
    DashboardTabsComponent,
    TabComponent,
    YoutubeComponent,
    SnowEditorDirective,
    ModalComponent
  ],
  imports: [
    RouterModule,
    HttpClientModule,
    StickyNavModule,
    CommonModule,
    YouTubePlayerModule,
    ProgressSpinnerModule,
    LoaderModule,
    ButtonModule,
    PageComponent
  ],
  exports: [
    FormsModule,
    LayoutModule,
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent,
    HeaderStyleThreeComponent,
    HeaderStyleFourComponent,
    HttpClientModule,
    StickyNavModule,
    RippleModule,
    ButtonModule,
    AccordionModule,
    DashboardTabsComponent,
    TabComponent,
    CommonModule,
    YoutubeComponent,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    LoaderModule,
    SnowEditorDirective,
    CalendarModule,
    InputTextareaModule,
    ModalComponent,
    PageComponent
  ],
  providers: [httpInterceptorProviders]
})
export class SharedModule {}
