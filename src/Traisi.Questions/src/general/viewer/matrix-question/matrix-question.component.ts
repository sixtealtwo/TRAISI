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

  }


  public ngOnInit(): void {}
}
