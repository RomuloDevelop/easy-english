import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component'
import { CoursesComponent } from './courses/courses.component';
import { CreateSectionComponent } from './create-course/create-section.component';
import { SectionsComponent } from './create-sections/sections.component';

import {SharedModule} from '../../../shared.module'

import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {EditorModule} from 'primeng/editor';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {AccordionModule} from 'primeng/accordion';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

import {ConfirmationService, MessageService} from 'primeng/api';

@NgModule({
  declarations: [
    AdminComponent,
    CoursesComponent,
    CreateSectionComponent,
    SectionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    EditorModule,
    CardModule,
    DialogModule,
    AccordionModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class AdminModule { }
