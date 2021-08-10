import { Component, OnInit } from '@angular/core'
import ContactInfo from '../../../../data/networks'
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
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
