import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { NgxScrollTopModule } from 'ngx-scrolltop'
import ContactInfo from '../../../../data/networks'
@Component({
  imports: [CommonModule, NgxScrollTopModule],
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true
})
export class FooterComponent implements OnInit {
  constructor() {}

  rrss = ContactInfo.getNetworks()
  phones = ContactInfo.getPhones()

  year: number = null

  ngOnInit(): void {
    this.year = new Date().getFullYear()
  }
}
