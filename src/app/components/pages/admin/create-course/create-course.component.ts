import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Section, SectionAction } from '../admin.service';
import memoize from '../../../../decorators/memoize'

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  title = ''
  subtitle = ''
  description = ''
  sections: Section[] = []

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  add() {
    this.sections.push({
        id: this.getLastId(),
        edit: true,
        title: '',
        description: '',
        lectures: []
    })
  }

  edit (id) {
    const index = this.sections.findIndex(item => item.id === id)
    this.sections[index].edit = true
  }

  getLastId () {
    let lastId = 1
    if(this.sections[this.sections.length - 1]) {
        lastId = this.sections[this.sections.length - 1].id + 1
    }
    return lastId
  }

  updateSection(item: {section: Section, type: SectionAction}) {
      const {section: newSection, type} = item
      const index = this.sections.findIndex(section => section.id === newSection.id)
      if(type === 'cancel' || type === 'delete') {
        this.sections.splice(index, 1)
      } else {
        this.sections[index] = newSection
      }
  }

  @memoize({
    normalizer: function(args) {
        return JSON.stringify(args);
    }
  })
  disableAdd(sections: Section[]) {
    const item = sections.find(item => item.edit)
    return item != null
  }
}
