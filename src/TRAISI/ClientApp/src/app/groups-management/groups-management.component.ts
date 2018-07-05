import {
	Component,
	ViewEncapsulation,
	OnInit,
	Injector,
	OnDestroy,
	ViewChild,
	TemplateRef,
	AfterViewInit,
	ChangeDetectorRef
} from '@angular/core';

import { AlertService, DialogType, MessageSeverity } from '../services/alert.service';
import { AccountService } from '../services/account.service';
import { AppTranslationService } from '../services/app-translation.service';

import { Utilities } from '../services/utilities';

import { UserGroupService } from '../services/user-group.service';
import { UserGroup } from '../models/user-group.model';
import { UserGroupAPIKeys } from '../models/user-group-apikeys.model';
import { EmailTemplate } from '../models/email-template.model';
import { ModalDirective } from 'ngx-bootstrap';



@Component({
	selector: 'app-groups-management',
	templateUrl: './groups-management.component.html',
	styleUrls: ['./groups-management.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GroupsManagementComponent implements OnInit {
	public emailColumns: any[] = [];
	public emailRows: EmailTemplate[] = [];
	
	public loadingIndicator: boolean;

	public apiModel: UserGroupAPIKeys;

	public allGroups: UserGroup[] = [];
	public groupActive: string;

	public isSaving: boolean = false;

	public editingTemplate: boolean;

	editorOptions = {theme: 'vs-dark', language: 'html'};
	code: string= `<html>
		<head></head>
		<body>
			Testing
		</body>
	</html>`;

	@ViewChild('indexTemplate') indexTemplate: TemplateRef<any>;
	@ViewChild('actionsTemplate') actionsTemplate: TemplateRef<any>;

	@ViewChild('editorModal') editorModal: ModalDirective;

	constructor(
		private alertService: AlertService,
		private translationService: AppTranslationService,
		private accountService: AccountService,
		private userGroupService: UserGroupService,
		private changeDetect: ChangeDetectorRef
	) {
		this.apiModel = new UserGroupAPIKeys();
	}

	ngOnInit(): void {
		this.emailColumns = [
			{
				prop: 'index',
				name: '#',
				width: 30,
				cellTemplate: this.indexTemplate,
				canAutoResize: false
			},
			{
				prop: 'name',
				name: 'Name',
				minWidth: 90,
				flexGrow: 60
			},
			{
				name: 'Actions',
				width: 150,
				cellTemplate: this.actionsTemplate,
				resizeable: false,
				canAutoResize: false,
				sortable: false,
				draggable: false
			}
		];

		let test: EmailTemplate = new EmailTemplate (0,'test','test',0);
		this.emailRows.push(test);

		this.loadData();
	}

	/**
	 * Load initial survey info (surveys for user and group list)
	 */
	loadData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.userGroupService
			.listUserGroups()
			.subscribe(userGroups => this.onDataLoadSuccessful(userGroups), error => this.onDataLoadFailed(error));
	}

	onDataLoadSuccessful(groups: UserGroup[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;

		this.allGroups = groups;
		this.groupActive = this.allGroups[0].name;
		this.switchGroup(this.groupActive);
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

	switchGroup(name: string) {
		this.alertService.startLoadingMessage('Loading ' + name + ' members...');
		this.loadingIndicator = true;
		const group = this.allGroups.filter(u => u.name === name)[0];
		this.userGroupService.getUserGroupApiKeys(group.id).subscribe(
			result => {
				this.apiModel = result;
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

	public saveKeys() {
		this.isSaving = true;
		this.userGroupService
			.updateUserGroupApiKeys(this.apiModel)
			.subscribe(value => this.saveKeysSuccessHelper(), error => this.saveKeysFailedHelper(error));
	}

	private saveKeysSuccessHelper() {
		this.alertService.stopLoadingMessage();
		this.isSaving = false;

		this.alertService.showMessage(
			'Success',
			`API Keys updated for group \"${this.groupActive}\"`,
			MessageSeverity.success
		);

	}

	private saveKeysFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage(
			'Save Error',
			'The below errors occured whilst saving your changes:',
			MessageSeverity.error,
			error
		);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
	}

	editTemplate(row: EmailTemplate) {
	
		this.editorModal.show();

	}
	onEditorModalShow() {
		this.editingTemplate = true;
		//this.editingUserName = null;
		//this.userEditor.resetForm(true);
	}

	onEditorModalHidden() {
		this.editingTemplate = false;
		//this.editingUserName = null;
		//this.userEditor.resetForm(true);
	}
}
