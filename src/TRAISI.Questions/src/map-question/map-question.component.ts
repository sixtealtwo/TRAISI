import { Component, OnInit } from '@angular/core';

/**
 *
 */
@Component({
  selector: 'traisi-map-question',
  template: <string>require('./map-question.component.html'),
  styles: [
    `
    mgl-map {
      height: 100%;
      width: 100%;
    }
  `
  ]
})
export class MapQuestionComponent implements OnInit {
  readonly QUESTION_TYPE_NAME: string = 'Map Question';

  typeName: string;
  icon: string;
  constructor() {
    this.typeName = this.QUESTION_TYPE_NAME;
    this.icon = 'map';
    console.log('loaded');
  }

  /**
   *
   */
  ngOnInit() {
    console.log('init');
  }
}
