import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { HeaderStyleOneComponent } from './components/common/header-style-one/header-style-one.component';
import { HeaderStyleTwoComponent } from './components/common/header-style-two/header-style-two.component';
import { HeaderStyleThreeComponent } from './components/common/header-style-three/header-style-three.component';
import { HeaderStyleFourComponent } from './components/common/header-style-four/header-style-four.component';
import { YouTubePlayerModule } from "@angular/youtube-player";

@NgModule({
  declarations: [
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent,
    HeaderStyleThreeComponent,
    HeaderStyleFourComponent
  ],
  imports: [RouterModule],
  exports: [
    LayoutModule,
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent,
    HeaderStyleThreeComponent,
    HeaderStyleFourComponent,
    YouTubePlayerModule
  ]
})
export class SharedModule { }
