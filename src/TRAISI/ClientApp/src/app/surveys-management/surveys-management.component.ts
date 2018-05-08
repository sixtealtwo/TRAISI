import { Component, ViewEncapsulation, OnInit, Injector, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../services/alert.service';

import { Select2OptionData } from 'ng2-select2';

import { ItemListComponent} from "../shared/item-list/item-list.component";

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import {SurveyService} from "../services/survey.service";
import {Survey} from "../models/survey.model";

@Component({
	selector: 'app-surveys-management',
	templateUrl: './surveys-management.component.html',
	styleUrls: ['./surveys-management.component.scss'],
})
export class SurveysManagementComponent implements OnInit {

	public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-default' });

	@ViewChild('editorModal')
	editorModal: ModalDirective;


  @ViewChild('actionsTemplate')
  actionsTemplate: TemplateRef<any>;

	public surveys;

	public model : Survey;

	public columns : Array<any>;

	constructor(private surveyService: SurveyService)
  {


    this.model = new Survey();

    console.log(this.model);
  }



  /**
   *
   */
	ngOnInit(): void {

		this.surveyService.listSurveys().subscribe((value) =>{
      this.surveys = value;
      console.log(this.surveys);
    });

    console.log(this.actionsTemplate);

    this.columns = [
      { prop: 'name',name:'Survey Title',minWidth: 90, flexGrow: 1 },
      {prop:'startAt',minWidth: 50, flexGrow: 1},
      {prop:'endAt',minWidth: 50, flexGrow: 1},
      {name: 'Actions',cellTemplate:this.actionsTemplate,minWidth: 90, flexGrow: 1, prop:'id'}
    ];

	}

	newSurvey(): void
	{
		this.editorModal.show();

	}

	closeEditorModal(): void
	{
		this.editorModal.hide();
	}

	onEditorModalHidden(): void
	{
	}

  /**
   *
   */
	public onEditorModalShow() : void
  {
    this.model = new Survey();
  }

  /**
   *
   */
	public onNewSurveyFormSubmit(): void
  {

    this.surveyService.createSurvey(this.model).subscribe(value =>
      this.surveyService.listSurveys().subscribe((value) =>{
        this.surveys = value;
      }));

    this.editorModal.hide();
  }

  /**
   *
   * @param surveyId
   */
  public onDeleteSurveyClicked(surveyId) : void
  {
    console.log("delete clicked " + surveyId);
    this.surveyService.deleteSurvey(surveyId).subscribe(value =>
      this.surveyService.listSurveys().subscribe((value) =>{
        this.surveys = value;
      }));
  }


}
