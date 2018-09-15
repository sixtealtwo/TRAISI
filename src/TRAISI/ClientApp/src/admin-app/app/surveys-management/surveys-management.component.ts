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

import { AlertService, DialogType, MessageSeverity } from '../../../shared/services/alert.service';
import { AppTranslationService } from '../../../shared/services/app-translation.service';
import { BootstrapSelectDirective } from '../directives/bootstrap-select.directive';
import { AccountService } from '../services/account.service';

import { Select2OptionData } from 'ng2-select2';

import { ItemListComponent } from '../shared/item-list/item-list.component';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SurveyService } from '../services/survey.service';
import { Survey } from '../models/survey.model';
import { Utilities } from '../../../shared/services/utilities';

import { SurveysEditorComponent } from './surveys-editor/surveys-editor.component';

import { UserGroupService } from '../services/user-group.service';
import { UserGroup } from '../models/user-group.model';
import { GroupMember } from '../models/group-member.model';
import { SurveyPermissions } from '../models/survey-permissions.model';

@Component({
	selector: 'app-surveys-management',
	templateUrl: './surveys-management.component.html',
	styleUrls: ['./surveys-management.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SurveysManagementComponent implements OnInit, AfterViewInit {

	public soloSurveyColumns: any[] = [];
	public soloSurveyRows: Survey[] = [];
	public soloSurveyRowsCache: Survey[] = [];

	public sharedSurveyColumns: any[] = [];
	public sharedSurveyRows: Survey[] = [];
	public sharedSurveyRowsCache: Survey[] = [];

	public groupSurveyColumns: any[] = [];
	public groupSurveyRows: Survey[] = [];
	public groupSurveyRowsCache: Survey[] = [];

	public allGroups: UserGroup[] = [];

	public model: Survey;
	public editModel: Survey;

	public surveyEditMode: boolean = false;
	public loadingIndicator: boolean;
	public sharedBeingViewed: boolean = false;
	public groupBeingViewed: boolean = false;
	public groupActive: string;

	@ViewChild('soloTable') table: any;

	@ViewChild('sharedTable') sTable: any;

	@ViewChild('groupTable') gTable: any;

	@ViewChild('editorModal') editorModal: ModalDirective;

	@ViewChild('surveyEditor') surveyEditor: SurveysEditorComponent;

	@ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;

	@ViewChild('surveyTagTemplate') surveyTagTemplate: TemplateRef<any>;

	@ViewChild('dateTemplate') dateTemplate: TemplateRef<any>;

	@ViewChild('expandTemplate') expandTemplate: TemplateRef<any>;

	@ViewChild('textTemplate') textTemplate: TemplateRef<any>;

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
			{ width: 50, cellTemplate: this.expandTemplate, sortable: false, resizeable: false, draggable: false, canAutoResize: false},
			{ prop: 'code', name: 'Code', midWidth: 20, flexGrow: 20, cellTemplate: this.textTemplate },
			{ prop: 'name', name: 'Survey Title', minWidth: 50, flexGrow: 50, cellTemplate: this.textTemplate },
			{ prop: 'group', name: 'Group', minWidth: 30, flexGrow: 30, cellTemplate: this.textTemplate },
			{ prop: 'startAt', minWidth: 50, flexGrow: 30, cellTemplate: this.dateTemplate },
			{ prop: 'endAt', minWidth: 50, flexGrow: 30, cellTemplate: this.dateTemplate },
			{ minWidth: 50, flexGrow: 30, cellTemplate: this.surveyTagTemplate, name: 'Status', sortable: false },
			{ name: 'Actions', cellTemplate: this.actionsTemplate, minWidth: 50, flexGrow: 40, prop: 'id' }
		];

		this.sharedSurveyColumns = [
			{ width: 50, cellTemplate: this.expandTemplate, sortable: false, resizeable: false, draggable: false, canAutoResize: false},
			{ prop: 'code', name: 'Code', midWidth: 20, flexGrow: 20, cellTemplate: this.textTemplate },
			{ prop: 'name', name: 'Survey Title', minWidth: 50, flexGrow: 50, cellTemplate: this.textTemplate },
			{ prop: 'owner', name: 'Owner', minWidth: 30, flexGrow: 30, cellTemplate: this.textTemplate },
			{ prop: 'group', name: 'Group', minWidth: 30, flexGrow: 30, cellTemplate: this.textTemplate },
			{ prop: 'startAt', minWidth: 50, flexGrow: 30, cellTemplate: this.dateTemplate },
			{ prop: 'endAt', minWidth: 50, flexGrow: 30, cellTemplate: this.dateTemplate },
			{ minWidth: 50, flexGrow: 30, cellTemplate: this.surveyTagTemplate, name: 'Status', sortable: false },
			{ name: 'Actions', cellTemplate: this.actionsTemplate, minWidth: 50, flexGrow: 40, prop: 'id' }
		];

		this.groupSurveyColumns = [
			{ width: 50, cellTemplate: this.expandTemplate, sortable: false, resizeable: false, draggable: false, canAutoResize: false},
			{ prop: 'code', name: 'Code', midWidth: 20, flexGrow: 20, cellTemplate: this.textTemplate },
			{ prop: 'name', name: 'Survey Title', minWidth: 50, flexGrow: 50, cellTemplate: this.textTemplate },
			{ prop: 'owner', name: 'Owner', minWidth: 30, flexGrow: 30, cellTemplate: this.textTemplate },
			{ prop: 'startAt', minWidth: 50, flexGrow: 30, cellTemplate: this.dateTemplate },
			{ prop: 'endAt', minWidth: 50, flexGrow: 30, cellTemplate: this.dateTemplate },
			{ minWidth: 30, flexGrow: 30, cellTemplate: this.surveyTagTemplate, name: 'Status', sortable: false },
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
			this.surveyService.listSharedSurveys().subscribe(surveys => {
				this.sharedSurveyRows = surveys;
				this.sharedSurveyRowsCache = [...surveys];
			});
		};

		this.surveyEditor.changesCancelledCallback = () => {
			this.model = null;
			this.editModel = null;
			this.editorModal.hide();
		};

		this.surveyEditor.deleteSurveyCallback = () => {
			this.editorModal.hide();
			this.deleteSurvey(this.model);
		};

	}

	/**
	 * Load initial survey info (surveys for user and group list)
	 */
	loadData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.surveyService.listSurveys().subscribe(
			(soloSurveys: Survey[]) => {
				this.surveyService.listSharedSurveys().subscribe(
					(sharedSurveys: Survey[]) => {
						this.userGroupService
						.listUserGroups()
						.subscribe(
							userGroups => this.onDataLoadSuccessful(soloSurveys, sharedSurveys, userGroups),
							error => this.onDataLoadFailed(error)
						);
					}
				);
			},
			error => this.onDataLoadFailed(error)
		);
	}

	onDataLoadSuccessful(soloSurveys: Survey[], sharedSurveys: Survey[], groups: UserGroup[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

		this.soloSurveyRows = soloSurveys;
		this.soloSurveyRowsCache = [...soloSurveys];

		this.sharedSurveyRows = sharedSurveys;
		this.sharedSurveyRowsCache = [...sharedSurveys];

		this.allGroups = groups;
		this.surveyEditor.groupsOptions = [];
		this.allGroups.forEach( group => {
			this.surveyEditor.groupsOptions.push({ text: group.name, id: group.name });
		});
		if (this.allGroups.length > 0) {
			this.surveyEditor.selectedGroup = this.surveyEditor.groupsOptions[0].id;
		}
	}

	onDataLoadFailed(error: any) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

		this.alertService.showStickyMessage(
			'Load Error',
			`Unable to retrieve surveys from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
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
		this.surveyEditor.canDeleteSurvey = (survey.owner === this.accountService.currentUser.userName) || this.canDelete(survey);
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

	public deleteSurvey(row: Survey) {
		this.alertService.showDialog(
			'Are you sure you want to delete "' + row.name + '"?',
			DialogType.confirm,
			() => this.deleteSurveyHelper(row.id)
		);
	}

	/**
	 * Deletes the survey with the associated id.
	 * @param surveyId
	 */
	private deleteSurveyHelper(surveyId: number): void {
		this.surveyService.deleteSurvey(surveyId).subscribe(value => {
			if (this.sharedBeingViewed) {
				this.surveyService.listSharedSurveys().subscribe(surveys => {
					this.sharedSurveyRows = surveys;
					this.sharedSurveyRowsCache = [...surveys];
				});
			}	else if (this.groupBeingViewed) {
				this.switchGroup(this.groupActive);
			}	else {
				this.surveyService.listSurveys().subscribe(surveys => {
					this.soloSurveyRows = surveys;
					this.soloSurveyRowsCache = [...surveys];
				});
			}
		}
		);
	}

	switchGroup(name: string) {
		if (name === 'unGrouped') {
			this.groupBeingViewed = false;
			this.sharedBeingViewed = false;
			this.groupActive = '';
		} else if (name === 'shared') {
			this.groupBeingViewed = false;
			this.sharedBeingViewed = true;
			this.groupActive = '';
		}	else {
			this.alertService.startLoadingMessage('Loading ' + name + ' members...');
			this.loadingIndicator = true;
			const group = this.allGroups.filter(u => u.name === name)[0];
			this.surveyService.listGroupSurveys(group.id).subscribe(
				result => {
					let surveyInfo = result.map(u => u);
					this.groupSurveyRowsCache = [...surveyInfo];
					this.groupSurveyRows = surveyInfo;
					this.groupBeingViewed = true;
					this.sharedBeingViewed = false;
					this.groupActive = name;
					this.alertService.stopLoadingMessage();
					this.loadingIndicator = false;
				},
				error => {
					this.alertService.stopLoadingMessage();
					this.loadingIndicator = false;
					this.alertService.showStickyMessage(
						'Load Error',
						`An error occured whilst loading the group surveys.\r\nError: "${Utilities.getHttpResponseMessage(
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
		} else if (this.sharedBeingViewed) {
			this.sharedSurveyRows = this.sharedSurveyRowsCache.filter(r => Utilities.searchArray(value, false, r.name));
		}	else {
			this.soloSurveyRows = this.soloSurveyRowsCache.filter(r => Utilities.searchArray(value, false, r.name));
		}
	}

	public toggleExpandRow(row) {
		if (this.groupBeingViewed) {
			this.gTable.rowDetail.toggleExpandRow(row);
		} else if (this.sharedBeingViewed) {
			this.sTable.rowDetail.toggleExpandRow(row);
		}	else {
			this.table.rowDetail.toggleExpandRow(row);
		}
	}

	/**
	 *
	 *
	 * @param {*} event
	 * @param {Survey} row
	 * @memberof SurveysManagementComponent
	 */
	public previewSurvey(event: any, row: Survey) {

		window.open(`/survey/${row.code}/start`, '_blank');
		event.stopPropagation();
	}

	public rowExpand(event: any) {
		if (event.type === 'click') {
			this.toggleExpandRow(event.row);
		}
	}

	public rowCursor(row: any) {
		return 'cursor-pointer';
	}

	public canEdit(row: Survey): boolean {
		return row.surveyPermissions && row.surveyPermissions.length > 0 && row.surveyPermissions[0].permissions.includes('survey.modify');
	}
	public canDelete(row: Survey): boolean {
		return row.surveyPermissions && row.surveyPermissions.length > 0 && row.surveyPermissions[0].permissions.includes('survey.delete');
	}
	public canAnalyze(row: Survey): boolean {
		return row.surveyPermissions && row.surveyPermissions.length > 0 && row.surveyPermissions[0].permissions.includes('survey.analyze');
	}
	public canShare(row: Survey): boolean {
		return row.surveyPermissions && row.surveyPermissions.length > 0 && row.surveyPermissions[0].permissions.includes('survey.share');
	}

	public noAccess(row: Survey): boolean {
		return !row.surveyPermissions || row.surveyPermissions.length === 0;
	}
}
