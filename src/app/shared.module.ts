import { NgModule } from '@angular/core'
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

@NgModule({
  declarations: [
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent,
    HeaderStyleThreeComponent,
    HeaderStyleFourComponent
  ],
  imports: [RouterModule, HttpClientModule, StickyNavModule],
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
    AccordionModule
  ]
})
export class SharedModule {}
