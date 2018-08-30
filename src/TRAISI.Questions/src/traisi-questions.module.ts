import {NgModule} from '@angular/core';
import {TextQuestionComponent} from './text-question/text-question.component';
import {MapQuestionComponent} from './map-question/map-question.component';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {RadioQuestionComponent} from './radio-question/radio-question.component';
import {HttpClientModule} from '@angular/common/http';
import {MapEndpointService} from './services/mapservice.service';
import {CheckboxQuestionComponent} from './checkbox-question/checkbox-question.component';
import {LikertQuestionComponent} from './likert-question/likert-question.component';
import {MatrixQuestionComponent} from './matrix-question/matrix-question.component';
import {NumberQuestionComponent} from './number-question/number-question.component';
import {RangeQuestionComponent} from './range-question/range-question.component';
import {SelectQuestionComponent} from './select-question/select-question.component';
import {HeadingQuestionComponent} from './heading-question/heading-question.component';
import {DateQuestionComponent} from './date-question/date-question.component';
import {TimeQuestionComponent} from './time-question/time-question.component';
import {CommonModule} from "@angular/common";

@NgModule({
	declarations: [TextQuestionComponent, MapQuestionComponent, RadioQuestionComponent, NumberQuestionComponent, RangeQuestionComponent, CheckboxQuestionComponent],
	entryComponents: [TextQuestionComponent, MapQuestionComponent, RadioQuestionComponent, NumberQuestionComponent, RangeQuestionComponent, CheckboxQuestionComponent],
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
                    id: 'location',
                    component: MapQuestionComponent
                },
                {
                    name: 'traisi-radio-question',
                    id: 'Radio Select',
                    component: RadioQuestionComponent
                },
                {
                    name: 'traisi-checkbox-question',
                    id: 'checkbox',
                    component: CheckboxQuestionComponent
                },
                {
                    name: 'traisi-likert-question',
                    id: 'likert',
                    component: LikertQuestionComponent
                },
                {
                    name: 'traisi-matrix-question',
                    id: 'matrix',
                    component: MatrixQuestionComponent
                },
                {
                    name: 'traisi-number-question',
                    id: 'Number',
                    component: NumberQuestionComponent
                },
                {
                    name: 'traisi-range-question',
                    id: 'Range',
                    component: RangeQuestionComponent
                },
                {
                    name: 'traisi-select-question',
                    id: 'select',
                    component: SelectQuestionComponent
                },
                {
                    name: 'traisi-heading-question',
                    id: 'heading',
                    component: HeadingQuestionComponent
                },
                {
                    name: 'traisi-date-question',
                    id: 'date',
                    component: DateQuestionComponent
                }
                ,
                {
                    name: 'traisi-time-question',
                    id: 'time',
                    component: TimeQuestionComponent
                }
            ],
            multi: true
        },
        MapEndpointService
    ],
    imports: [
        CommonModule,
        NgxMapboxGLModule.forRoot({
            accessToken:
                'pk.eyJ1IjoiYnJlbmRhbmJlbnRpbmciLCJhIjoiY2oyOTlwdjNjMDB5cTMzcXFsdmRyM3NnNCJ9.NXgWTnWfvGRnNgkWdd5wKg' // Can also be set per map (accessToken input of mgl-map)
            // geocoderAccessToken: 'TOKEN' // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
        }),
        HttpClientModule
    ]
})
export default class TraisiQuestions {
}
