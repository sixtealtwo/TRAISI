import {
  SurveyQuestion,
  ResponseTypes,
  OnVisibilityChanged,
  TimelineResponseData,
} from 'traisi-question-sdk'
import {
  Component,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core'
import templateString from './travel-diary-question.component.html'
import styleString from './travel-diary-question.component.scss'
import { TravelDiaryService } from './travel-diary.service'
import {
  CalendarEvent,
  CalendarView,
  CalendarDayViewComponent,
} from 'angular-calendar'
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'traisi-travel-diary-edit-dialog',
  template: '' + templateString,
  encapsulation: ViewEncapsulation.None,
  providers: [TravelDiaryService],
  styles: ['' + styleString],
})
export class TravelDiaryEditDialog {
  @Output() saved: EventEmitter<TimelineResponseData> = new EventEmitter()

  public constructor(public modalRef: BsModalRef) {}

  public hide(): void {}
}
