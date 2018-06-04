import {
	Component,
	ViewEncapsulation,
	OnInit,
	Injector,
	OnDestroy,
	ViewChild,
	TemplateRef,
	AfterViewInit
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../services/alert.service';
import { AppTranslationService } from '../services/app-translation.service';
import { BootstrapSelectDirective } from '../directives/bootstrap-select.directive';
import { AccountService } from '../services/account.service';

import { Select2OptionData } from 'ng2-select2';

import { ItemListComponent } from '../shared/item-list/item-list.component';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SurveyService } from '../services/survey.service';
import { Survey } from '../models/survey.model';
import { Utilities } from '../services/utilities';

import { SurveysEditorComponent } from './surveys-editor/surveys-editor.component';

import { UserGroupService } from '../services/user-group.service';
import { UserGroup } from '../models/user-group.model';
import { GroupMember } from '../models/group-member.model';

@Component({
	selector: 'app-surveys-management',
	templateUrl: './surveys-management.component.html',
	styleUrls: ['./surveys-management.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SurveysManagementComponent implements OnInit, AfterViewInit {
	public bsConfig: Partial<BsDatepickerConfig> = Object.assign(
		{},
		{
			containerClass: 'theme-default',
			dateInputFormat: ''
		}
	);

	public soloSurveyColumns: any[] = [];
	public soloSurveyRows: Survey[] = [];
	public soloSurveyRowsCache: Survey[] = [];

	public groupSurveyColumns: any[] = [];
	public groupSurveyRows: Survey[] = [];
	public groupSurveyRowsCache: Survey[] = [];

	public allGroups: UserGroup[] = [];

	public model: Survey;
	public editModel: Survey;

	private surveyEditMode: boolean = false;
	public loadingIndicator: boolean;
	public groupBeingViewed: boolean = false;
	public groupActive: string;

	@ViewChild('editorModal') editorModal: ModalDirective;

	@ViewChild('surveyEditor') surveyEditor: SurveysEditorComponent;

	// @ViewChild('codeTemplate') codeTemplate: TemplateRef<any>;

	@ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;

	@ViewChild('surveyTagTemplate') surveyTagTemplate: TemplateRef<any>;

	@ViewChild('dateTemplate') dateTemplate: TemplateRef<any>;

	@ViewChild('buildTemplate') buildTemplate: TemplateRef<any>;

	/**
	 *
	 * @param {SurveyService} surveyService
	 */
	constructor(
		private surveyService: SurveyService,
		private alertService: AlertService,
		private translationService: AppTranslationService,
		private accountService: AccountService,
		private userGroupService: UserGroupService
	) {
		this.model = new Survey();
	}

	/**
	 * Initializer
	 */
	ngOnInit(): void {
		// retrieve surveys

		const gT = (key: string) => this.translationService.getTranslation(key);
		// columns for the display data table
		this.soloSurveyColumns = [
			{ prop: 'code', name: 'Code', midWidth: 20, flexGrow: 20 },
			{ prop: 'name', name: 'Survey Title', minWidth: 50, flexGrow: 50 },
			{ prop: 'group', name: 'Group', minWidth: 30, flexGrow: 30 },
			{ prop: 'startAt', minWidth: 50, flexGrow: 30, cellTemplate: this.dateTemplate },
			{ prop: 'endAt', minWidth: 50, flexGrow: 30, cellTemplate: this.dateTemplate },
			{ minWidth: 50, flexGrow: 30, cellTemplate: this.surveyTagTemplate, name: 'Status' },
			{ name: 'Actions', cellTemplate: this.actionsTemplate, minWidth: 50, flexGrow: 40, prop: 'id' }
		];

		this.groupSurveyColumns = [
			{ prop: 'code', name: 'Code', midWidth: 20, flexGrow: 20 },
			{ prop: 'name', name: 'Survey Title', minWidth: 50, flexGrow: 50 },
			{ prop: 'owner', name: 'Owner', minWidth: 30, flexGrow: 30 },
			{ prop: 'startAt', minWidth: 50, flexGrow: 30, cellTemplate: this.dateTemplate },
			{ prop: 'endAt', minWidth: 50, flexGrow: 30, cellTemplate: this.dateTemplate },
			{ minWidth: 30, flexGrow: 30, cellTemplate: this.surveyTagTemplate, name: 'Status' },
			{ name: 'Actions', cellTemplate: this.actionsTemplate, minWidth: 50, flexGrow: 40, prop: 'id' }
		];

		this.loadData();
	}

	ngAfterViewInit() {
		this.surveyEditor.changesSavedCallback = () => {
			Object.assign(this.model, this.editModel);
			this.editorModal.hide();
			this.surveyService.listSurveys().subscribe(surveys => {
				this.soloSurveyRows = surveys;
				this.soloSurveyRowsCache = [...surveys];
			});
		};

		this.surveyEditor.changesCancelledCallback = () => {
			this.model = null;
			this.editModel = null;
			this.editorModal.hide();
		};
	}

	/**
	 * Load initial survey info (surveys for user and group list)
	 */
	loadData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.surveyService.listSurveys().subscribe(
			(surveys: Survey[]) => {
				this.userGroupService
					.listUserGroups()
					.subscribe(
						userGroups => this.onDataLoadSuccessful(surveys, userGroups),
						error => this.onDataLoadFailed(error)
					);
			},
			error => this.onDataLoadFailed(error)
		);
	}

	onDataLoadSuccessful(surveys: Survey[], groups: UserGroup[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

		this.soloSurveyRows = surveys;
		this.soloSurveyRowsCache = [...surveys];

		this.allGroups = groups;
		this.surveyEditor.groupsOptions = [];
		this.allGroups.forEach( group => {
			this.surveyEditor.groupsOptions.push({ text: group.name, id: group.name });
		});
		this.surveyEditor.selectedGroup = this.surveyEditor.groupsOptions[0].id;
	}

	onDataLoadFailed(error: any) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

		this.alertService.showStickyMessage(
			'Load Error',
			`Unable to retrieve users from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
			MessageSeverity.error,
			error
		);
	}

	/**
	 * Launches the new survey modal.
	 */
	newSurvey(): void {
		this.surveyEditMode = false;
		this.surveyEditor.isNewSurvey = true;
		this.editorModal.show();
	}

	editSurvey(survey: Survey): void {
		this.surveyEditMode = true;
		this.surveyEditor.isNewSurvey = false;
		this.model = survey;
		this.editModel = new Survey();
		Object.assign(this.editModel, this.model);
		this.editorModal.show();
	}

	closeEditorModal(): void {
		this.editorModal.hide();
	}

	/**
	 *
	 */
	onEditorModalHidden(): void {}

	/**
	 * Called before new survey modal is displayed. The input data and model will be reset.
	 */
	public onEditorModalShow(): void {
		if (!this.surveyEditMode) {
			this.model = new Survey();
			this.model.startAt = new Date();
			this.model.endAt = new Date();
			this.model.group = this.surveyEditor.selectedGroup;
			this.editModel = new Survey();
			Object.assign(this.editModel, this.model);
			this.surveyEditor.editMode = false;
		} else {
			this.surveyEditor.editMode = true;
		}
		this.surveyEditor.model = this.editModel;
	}

	/**
	 * Called when the new survey form is submitted.
	 */
	public onNewSurveyFormSubmit(): void {
		this.surveyService.createSurvey(this.model).subscribe(value =>
			this.surveyService.listSurveys().subscribe(surveys => {
				this.soloSurveyRows = surveys;
				this.soloSurveyRowsCache = [...surveys];
			})
		);

		this.editorModal.hide();
	}

	/**
	 * Deletes the survey with the associated id.
	 * @param surveyId
	 */
	public onDeleteSurveyClicked(surveyId): void {
		this.surveyService.deleteSurvey(surveyId).subscribe(value =>
			this.surveyService.listSurveys().subscribe(surveys => {
				this.soloSurveyRows = surveys;
				this.soloSurveyRowsCache = [...surveys];
			})
		);
	}

	switchGroup(name: string) {
		if (name === 'unGrouped') {
			this.groupBeingViewed = false;
			this.groupActive = '';
		} else {
			this.alertService.startLoadingMessage('Loading ' + name + ' members...');
			this.loadingIndicator = true;
			const group = this.allGroups.filter(u => u.name === name)[0];
			this.surveyService.listGroupSurveys(group.id).subscribe(
				result => {
					let surveyInfo = result.map(u => u);
					this.groupSurveyRowsCache = [...surveyInfo];
					this.groupSurveyRows = surveyInfo;
					this.groupBeingViewed = true;
					this.groupActive = name;
					this.alertService.stopLoadingMessage();
					this.loadingIndicator = false;
				},
				error => {
					this.alertService.stopLoadingMessage();
					this.loadingIndicator = false;
					this.alertService.showStickyMessage(
						'Load Error',
						`An error occured whilst loading the group members.\r\nError: "${Utilities.getHttpResponseMessage(
							error
						)}"`,
						MessageSeverity.error,
						error
					);
				}
			);
		}
	}

	/**
	 *
	 * @param value
	 */
	public onSearchChanged(value: string): void {
		if (this.groupBeingViewed) {
			this.groupSurveyRows = this.groupSurveyRowsCache.filter(r => Utilities.searchArray(value, false, r.name));
		} else {
			this.soloSurveyRows = this.soloSurveyRowsCache.filter(r => Utilities.searchArray(value, false, r.name));
		}
	}
}
