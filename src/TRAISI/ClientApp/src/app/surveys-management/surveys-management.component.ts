import {Component, ViewEncapsulation, OnInit, Injector, OnDestroy, ViewChild, TemplateRef} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';

import {AlertService, DialogType, MessageSeverity} from '../services/alert.service';

import {Select2OptionData} from 'ng2-select2';

import {ItemListComponent} from '../shared/item-list/item-list.component';

import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {SurveyService} from '../services/survey.service';
import {Survey} from '../models/survey.model';
import {Utilities} from '../services/utilities';

@Component({
	selector: 'app-surveys-management',
	templateUrl: './surveys-management.component.html',
	styleUrls: ['./surveys-management.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SurveysManagementComponent implements OnInit {

	public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, {
		containerClass: 'theme-default',
		dateInputFormat: ''
	});

	@ViewChild('editorModal')
	editorModal: ModalDirective;


	@ViewChild('actionsTemplate')
	actionsTemplate: TemplateRef<any>;

	@ViewChild('surveyTagTemplate')
	surveyTagTemplate: TemplateRef<any>;

	@ViewChild('dateTemplate')
	dateTemplate: TemplateRef<any>;


	@ViewChild('buildTemplate')
	buildTemplate: TemplateRef<any>;

	public surveys;

	public model: Survey;

	public columns: Array<any>;

	public surveysCache: Array<Survey>;

	/**
	 *
	 * @param {SurveyService} surveyService
	 */
	constructor(private surveyService: SurveyService) {
		this.model = new Survey();

	}


	/**
	 * Initializer
	 */
	ngOnInit(): void {

		// retrieve surveys
		this.surveyService.listSurveys().subscribe((value: Survey[]) => {
		this.surveys = value;
		this.surveysCache = value;
		});

		// columns for the display data table
		this.columns = [
			{ prop: 'name', name: 'Survey Title', minWidth: 50, flexGrow: 1 },
			{ prop: 'startAt', minWidth: 50, flexGrow: 1, cellTemplate: this.dateTemplate },
			{ prop: 'endAt', minWidth: 50, flexGrow: 1, cellTemplate: this.dateTemplate },
			{ minWidth: 50, flexGrow: 1, cellTemplate: this.surveyTagTemplate, name: 'Info' },
			{ minWidth: 50, flexGrow: 1, cellTemplate: this.buildTemplate, name: 'Build' },
			{name: 'Actions', cellTemplate: this.actionsTemplate, minWidth: 30, flexGrow: 1, prop: 'id' }
		];

	}

	/**
	 * Launches the new survey modal.
	 */
	newSurvey(): void {
		this.editorModal.show();

	}

	closeEditorModal(): void {
		this.editorModal.hide();
	}

	/**
	 *
	 */
	onEditorModalHidden(): void {
	}

	/**
	 * Called before new survey modal is displayed. The input data and model will be reset.
	 */
	public onEditorModalShow(): void {
		this.model = new Survey();
		this.model.startAt = new Date();
		this.model.endAt = new Date();
	}

	/**
	 * Called when the new survey form is submitted.
	 */
	public onNewSurveyFormSubmit(): void {

		this.surveyService.createSurvey(this.model).subscribe(value =>
			this.surveyService.listSurveys().subscribe((surveys) => {
				this.surveys = surveys;
				this.surveysCache = this.surveys;
			}));

		this.editorModal.hide();
	}

	/**
	 * Deletes the survey with the associated id.
	 * @param surveyId
	 */
	public onDeleteSurveyClicked(surveyId): void {

		this.surveyService.deleteSurvey(surveyId).subscribe(value =>
			this.surveyService.listSurveys().subscribe((surveys) => {
				this.surveys = surveys;
				this.surveysCache = this.surveys;
		}));
	}

	/**
	 *
	 * @param value
	 */
	public onSearchChanged(value: string): void {
		console.log('in search');
		this.surveys = this.surveysCache.filter(r => Utilities.searchArray(value, false, r.name));

	}


}
