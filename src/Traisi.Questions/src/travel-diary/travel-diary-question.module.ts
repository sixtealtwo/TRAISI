import { NgModule, ModuleWithProviders } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { TravelDiaryQuestionComponent } from './travel-diary-question.component'
import {
  CalendarModule,
  DateAdapter,
  CalendarCommonModule,
  CalendarDayModule,
  CalendarView,
  CalendarUtils,
  CalendarTooltipDirective,
  CalendarTooltipWindowComponent,
} from 'angular-calendar'
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap'
import { FlatpickrModule } from 'angularx-flatpickr'
import { FormsModule } from '@angular/forms'

export const calendarProps = {
  provide: DateAdapter,
  useFactory: adapterFactory,
}
export const calModule: ModuleWithProviders = CalendarModule.forRoot(
  calendarProps,
)
console.log(CalendarTooltipWindowComponent);
@NgModule({
  declarations: [TravelDiaryQuestionComponent],
  entryComponents: [TravelDiaryQuestionComponent],
  providers: [
    {
      provide: 'widgets',
      useValue: [
        {
          name: 'traisi-travel-diary-question',
          id: 'travel-diary',
          component: TravelDiaryQuestionComponent,
        },
      ],
      multi: true,
    }
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot(calendarProps),
    CalendarCommonModule.forRoot(calendarProps),
    CalendarDayModule,
  ],
  exports: [CalendarDayModule, CalendarModule, CalendarCommonModule],
})
export default class TravelDiaryQuestionModule {
  static forRoot(): ModuleWithProviders<TravelDiaryQuestionComponent> {
    return {
      ngModule: TravelDiaryQuestionComponent,
      providers: [],
    }
  }
}
