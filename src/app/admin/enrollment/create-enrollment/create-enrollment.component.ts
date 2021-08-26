import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { EnrollmentService } from '../../../services/enrollment.service'
import { CoursesTableRow } from '../../../state/admin/admin.selectores'
import { ConfirmationService, PrimeNGConfig, Message } from 'primeng/api'
import { User } from 'src/app/state/models'
import { zip } from 'rxjs'

@Component({
  selector: 'app-create-enrollment',
  templateUrl: './create-enrollment.component.html',
  styleUrls: ['./create-enrollment.component.scss']
})
export class CreateEnrollmentComponent implements OnInit {
  loadingDelete = false
  loadingEnrollment = false
  showModal = false
  loadingUsers = false
  msgs: Message[] = []

  usersNotEnrolled: User[] = []
  usersToEnroll: User[] = []
  usersEnrolled: User[] = []

  courseId = parseInt(this.route.snapshot.paramMap.get('id'))
  userCols = ['Id', 'Name', 'Email', 'Enrollment Date']
  userRows = ['id', 'name', 'email', 'enrollmentDateFormated']

  courses: CoursesTableRow[]

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private primengConfig: PrimeNGConfig,
    private enrollmentService: EnrollmentService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true
    this.getTable()
  }

  enrollUser() {
    this.loadingEnrollment = true
    this.enrollmentService
      .insertEnrollments(
        this.courseId,
        this.usersToEnroll,
        () => (this.loadingEnrollment = false)
      )
      .subscribe(
        (response) => {
          this.usersEnrolled = this.usersEnrolled.concat(response as User[])
          this.showModal = false
        },
        (err) => {
          this.showModal = false
          console.error(err)
        }
      )
  }

  getTable() {
    this.loadingUsers = true
    zip(
      this.enrollmentService.getUsersEnrolled(this.courseId),
      this.enrollmentService.getUsersNotEnrolled(this.courseId)
    ).subscribe(
      (responses) => {
        this.usersEnrolled = responses[0] as User[]
        this.usersNotEnrolled = responses[1] as User[]
        this.loadingUsers = false
      },
      (err) => {
        this.loadingUsers = false
        console.error(err)
      }
    )
  }

  editCourse(course: CoursesTableRow) {
    this._router.navigate(['edit', course.id], {
      relativeTo: this.route
    })
  }

  deleteUser(user) {
    this.loadingDelete = true
    this.enrollmentService
      .deleteUser(user.id, () => (this.loadingDelete = false))
      .subscribe(
        () => {
          this.usersEnrolled = this.usersEnrolled.filter(
            (item) => item.id !== user.id
          )
        },
        (err) => console.error(err)
      )
    console.log(user)
  }

  confirmDeleteUser(user: User) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.msgs = [
          { severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }
        ]
        this.deleteUser(user)
      },
      reject: () => {
        this.msgs = [
          { severity: 'info', summary: 'Rejected', detail: 'You have rejected' }
        ]
        console.error(this.msgs)
      }
    })
  }
}
