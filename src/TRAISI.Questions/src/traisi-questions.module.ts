import { NgModule } from '@angular/core';
import { TextQuestionComponent } from './text-question/text-question.component';
import { MapQuestionComponent } from './map-question/map-question.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { RadioQuestionComponent } from './radio-question/radio-question.component';

@NgModule({
  declarations: [TextQuestionComponent, MapQuestionComponent],
  entryComponents: [TextQuestionComponent, MapQuestionComponent],
  providers: [
    {
      provide: 'widgets',
      useValue: [
        {
          name: 'traisi-text-question',
          id: 'text',
          component: TextQuestionComponent
        },
        {
          name: 'traisi-map-question',
          id: 'map',
          component: MapQuestionComponent
        },
        {
          name: 'traisi-radio-question',
          id: 'radio',
          component: RadioQuestionComponent
        }
      ],
      multi: true
    }
  ],
  imports: [
    NgxMapboxGLModule.forRoot({
      accessToken:
        'pk.eyJ1IjoiYnJlbmRhbmJlbnRpbmciLCJhIjoiY2oyOTlwdjNjMDB5cTMzcXFsdmRyM3NnNCJ9.NXgWTnWfvGRnNgkWdd5wKg', // Can also be set per map (accessToken input of mgl-map)
		 // geocoderAccessToken: 'TOKEN' // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
    })
  ]
})
export default class TraisiQuestions {}
