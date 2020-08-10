import {
  SurveyQuestion,
  ResponseTypes,
  OnVisibilityChanged,
} from 'traisi-question-sdk'
import {
  Component,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
} from '@angular/core'
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  setHours,
  isSameMonth,
  setMinutes,
  addHours,
} from 'date-fns'
import templateString from './travel-diary-question.component.html'
import styleString from './travel-diary-question.component.scss'
import { TravelDiaryService } from './travel-diary.service'
import { CalendarEvent, CalendarView } from 'angular-calendar'

@Component({
  selector: 'traisi-travel-diary-question',
  template: '' + templateString,
  encapsulation: ViewEncapsulation.None,
  providers: [TravelDiaryService],
  styles: ['' + styleString],
})
export class TravelDiaryQuestionComponent
  extends SurveyQuestion<ResponseTypes.Location>
  implements OnInit, AfterViewInit, OnVisibilityChanged {
  public viewDate: Date = new Date()


  events: CalendarEvent[] =     [{
    title: 'No event end date',
    start: setHours(setMinutes(new Date(), 9), 12),
    color: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
      },
  }]

  public ngOnInit(): void {}
  public ngAfterViewInit(): void {}
  public onQuestionShown(): void {}
  public onQuestionHidden(): void {}
}
