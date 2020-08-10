import { NgModule, ModuleWithProviders } from '@angular/core'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { MapEndpointService } from '../services/mapservice.service'
import { TravelDiaryQuestionComponent } from './travel-diary-question.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
// export const ngxMapWithConfig = NgxMapboxGLModule

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
    },
  ],
  imports: [
    
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CommonModule,
    HttpClientModule,
  ],
})
export default class TravelDiaryQuestionModule {
  static forRoot(): ModuleWithProviders<TravelDiaryQuestionComponent> {
    return {
      ngModule: TravelDiaryQuestionComponent,
      providers: [],
    }
  }
}
