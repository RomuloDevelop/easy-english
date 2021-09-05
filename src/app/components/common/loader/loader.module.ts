import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { LoaderComponent } from './loader/loader.component'
import { LoaderService } from './loader.service'

@NgModule({
  declarations: [LoaderComponent],
  imports: [CommonModule, ProgressSpinnerModule],
  providers: [LoaderService],
  exports: [LoaderComponent]
})
export class LoaderModule {}
