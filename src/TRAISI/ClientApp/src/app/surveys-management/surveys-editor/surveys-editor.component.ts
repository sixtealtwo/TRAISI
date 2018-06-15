import { Component, ViewEncapsulation, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { SurveyService } from '../../services/survey.service';
import { Survey } from '../../models/survey.model';
import { UserGroupService } from '../../services/user-group.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Select2OptionData } from 'ng2-select2';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
	selector: 'app-surveys-editor',
	templateUrl: './surveys-editor.component.html',
	styleUrls: ['./surveys-editor.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SurveysEditorComponent implements OnInit {
	public changesSavedCallback: () => void;
	public changesCancelledCallback: () => void;
	public changesFailedCallback: () => void;
	public deleteSurveyCallback: () => void;

	public model: Survey = new Survey();
	public editMode: boolean = false;
	public isNewSurvey = false;
	public isSaving = false;

	public groupsOptions: Array<Select2OptionData>;
	public selectedGroup: string;
	public select2Options: any = {
		theme: 'bootstrap'
	};

	public bsConfig: Partial<BsDatepickerConfig> = Object.assign(
		{},
		{
			containerClass: 'theme-default',
			dateInputFormat: ''
		}
	);


	@ViewChild('f') private form;

	constructor(private alertService: AlertService, private userGroupService: UserGroupService, private surveyService: SurveyService) {}

	ngOnInit() {}

	/**
	 * Called when the new survey form is submitted.
	 */
	public onNewSurveyFormSubmit(): void {
		this.isSaving = true;
		if (!this.editMode) {
			this.surveyService.createSurvey(this.model).subscribe(value => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
		} else {
			this.surveyService.editSurvey(this.model).subscribe(value => this.saveSuccessHelper(), error => this.saveFailedHelper(error));
		}
	}

	private saveSuccessHelper() {
		this.alertService.stopLoadingMessage();
		this.isSaving = false;
		if (this.isNewSurvey) {
			this.alertService.showMessage('Success', `Survey \"${this.model.name}\" was created successfully`, MessageSeverity.success);
		} else {
			this.alertService.showMessage(
				'Success',
				`Changes to survey \"${this.model.name}\" was saved successfully`,
				MessageSeverity.success
			);
		}
		this.model = new Survey();
		this.form.reset();
		if (this.changesSavedCallback) {
			this.changesSavedCallback();
		}
	}

	private saveFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage(
			'Save Error',
			'The below errors occured whilst saving your changes:',
			MessageSeverity.error,
			error
		);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);

		if (this.changesFailedCallback) {
			this.changesFailedCallback();
		}
	}

	public cancel() {
		this.model = new Survey();

		this.form.reset();

		this.alertService.showMessage('Cancelled', 'Operation cancelled by user', MessageSeverity.default);
		this.alertService.resetStickyMessage();

		if (this.changesCancelledCallback) {
			this.changesCancelledCallback();
		}
	}

	private delete() {
		if (this.deleteSurveyCallback) {
			this.deleteSurveyCallback();
		}
	}

	public updateGroup(e: any): void {
		this.model.group = e.value;
		this.selectedGroup = e.value;
	}
}
