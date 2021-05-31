import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { HeaderStyleOneComponent } from './components/common/header-style-one/header-style-one.component';
import { HeaderStyleTwoComponent } from './components/common/header-style-two/header-style-two.component';
import { YouTubePlayerModule } from "@angular/youtube-player";

@NgModule({
  declarations: [
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent
  ],
  imports: [RouterModule],
  exports: [
    LayoutModule,
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent,
    YouTubePlayerModule
  ]
})
export class SharedModule { }
