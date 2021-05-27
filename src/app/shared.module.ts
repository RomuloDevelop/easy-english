import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderStyleOneComponent } from './components/common/header-style-one/header-style-one.component';
import { HeaderStyleTwoComponent } from './components/common/header-style-two/header-style-two.component';

@NgModule({
  declarations: [
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent
  ],
  imports: [RouterModule],
  exports: [
    HeaderStyleOneComponent,
    HeaderStyleTwoComponent
  ]
})
export class SharedModule { }
