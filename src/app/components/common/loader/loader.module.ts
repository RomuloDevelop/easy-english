import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { LoaderComponent } from './loader/loader.component'

@NgModule({
  declarations: [LoaderComponent],
  imports: [CommonModule, ProgressSpinnerModule],
  exports: [LoaderComponent]
})
export class LoaderModule {}
