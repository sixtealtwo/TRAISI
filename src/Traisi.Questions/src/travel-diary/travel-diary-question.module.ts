import { NgModule, ModuleWithProviders } from '@angular/core'
import { NgxMapboxGLModule } from 'ngx-mapbox-gl'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { MapEndpointService } from '../services/mapservice.service'
import { TravelDiaryQuestionComponent } from './travel-diary-question.component'

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
    MapEndpointService,
  ],
  imports: [CommonModule, NgxMapboxGLModule, HttpClientModule],
})
export default class TravelDiaryQuestionModule {
  static forRoot(): ModuleWithProviders<TravelDiaryQuestionComponent> {
    return {
      ngModule: TravelDiaryQuestionComponent,
      providers: [],
    }
  }
}
