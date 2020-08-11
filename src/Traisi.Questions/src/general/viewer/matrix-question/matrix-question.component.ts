import { Component, OnInit } from '@angular/core'
import {
  SurveyQuestion,
  ResponseTypes,
  QuestionConfiguration,
  SurveyViewer,
} from 'traisi-question-sdk'
import templateString from './matrix-question.component.html'
import styleString from './matrix-question.component.scss'
@Component({
  selector: 'traisi-matrix-question',
  template: '' + templateString,
  styles: ['' + styleString],
})
export class MatrixQuestionComponent extends SurveyQuestion<ResponseTypes.Json>
  implements OnInit {
  data: QuestionConfiguration[]

  /**
   *
   * @param surveyViewerService
   */
  constructor(private surveyViewerService: SurveyViewer) {
    super()

    this.surveyViewerService.configurationData.subscribe(
      this.loadConfigurationData,
    )
  }

  /**
   * Loads configuration data once it is available.
   * @param data
   */
  loadConfigurationData(data: QuestionConfiguration[]) {
    console.log(data)
    this.data = data
  }

  ngOnInit() {}
}
