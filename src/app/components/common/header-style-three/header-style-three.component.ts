import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { selectActualUser } from 'src/app/state/session/session.selectors'
import { getScreenPathFromRole } from 'src/app/utils/GetScreenPathFromRole'
import { TOKEN_KEY } from 'src/data/constants'
import ContactInfo from '../../../../data/networks'

@Component({
  selector: 'app-header-style-three',
  templateUrl: './header-style-three.component.html',
  styleUrls: ['./header-style-three.component.scss']
})
export class HeaderStyleThreeComponent implements OnInit {
  phones = ContactInfo.getPhones()
  isLogged = localStorage.getItem(TOKEN_KEY)
  screenPathFromRole = null
  classApplied = false
  classApplied2 = false
  classApplied3 = false

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectActualUser).subscribe((user) => {
      this.screenPathFromRole = getScreenPathFromRole(user)
    })
  }

  toggleClass() {
    this.classApplied = !this.classApplied
  }

  toggleClass2() {
    this.classApplied2 = !this.classApplied2
  }

  toggleClass3() {
    this.classApplied3 = !this.classApplied3
  }
}
