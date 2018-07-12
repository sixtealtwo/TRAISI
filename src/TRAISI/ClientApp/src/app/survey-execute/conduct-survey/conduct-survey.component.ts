import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Survey } from '../../models/survey.model';
import { SurveyService } from '../../services/survey.service';
import { DROPZONE_CONFIG, DropzoneComponent } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ConfigurationService } from '../../services/configuration.service';
import { ShortCode } from '../../models/short-code.model';
import { CodeGenerator } from '../../models/code-generator.model';
import { SurveyExecuteService } from '../../services/survey-execute.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { AuthService } from '../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { TitleCasePipe } from '@angular/common';
import { RealTimeNotificationServce } from '../../services/real-time-notification.service';
import { DownloadNotification } from '../../models/download-notification';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-test-survey',
	templateUrl: './conduct-survey.component.html',
	styleUrls: ['./conduct-survey.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ConductSurveyComponent implements OnInit, AfterViewInit {
	public surveyId: number;
	public survey: Survey;
	public codeGenParams: CodeGenerator;
	public executeMode: string;

	public codeProperties = 'pattern';
	public generateType: string = 'numberCodes';
	public baseUrl: string = '';
	public loadingIndicator: boolean = false;
	public generatingIndicator: boolean = false;
	public downloadIndicator: boolean = false;
	public pageLimit: number = 20;

	public individualCodeBeingViewed: boolean = true;
	public groupCodeBeingViewed: boolean = false;
	public emailBeingViewed: boolean = false;
	public scheduleBeingViewed: boolean = false;

	public indivCodeRows: ShortCode[];
	public indivCodeColumns: any[] = [];

	public totalIndivCodes: number = 0;
	public currentIndivPage: number = 0;

	public groupCodeRows: ShortCode[];
	public groupCodeColumns: any[] = [];
	public totalGroupCodes: number = 0;
	public currentGroupPage: number = 0;

	private downloadProgress: DownloadNotification = null;
	private downloadNotifier: Subject<DownloadNotification>;

	public indivDropZoneconfig: DropzoneConfigInterface = {
		// Change this to your upload POST address:
		maxFilesize: 50,
		maxFiles: 1,
		acceptedFiles: '.csv',
		autoReset: 2000,
		errorReset: 2000,
		cancelReset: 2000,
		timeout: 3000000
	};

	public groupDropZoneconfig: DropzoneConfigInterface = {
		// Change this to your upload POST address:
		maxFilesize: 50,
		maxFiles: 1,
		acceptedFiles: '.csv',
		autoReset: 2000,
		errorReset: 2000,
		cancelReset: 2000,
		timeout: 3000000
	};

	@ViewChild('indivUpload') dropZoneIndiv: DropzoneComponent;
	@ViewChild('groupUpload') dropZoneGroup: DropzoneComponent;
	@ViewChild('dateTemplate') dateTemplate: TemplateRef<any>;

	constructor(
		private surveyService: SurveyService,
		private surveyExecuteService: SurveyExecuteService,
		private route: ActivatedRoute,
		private configurationService: ConfigurationService,
		private alertService: AlertService,
		private authService: AuthService,
		private router: Router,
		private title: Title,
		private titleCasePipe: TitleCasePipe,
		private notificationService: RealTimeNotificationServce,
	) {
		this.survey = new Survey();
		this.codeGenParams = new CodeGenerator();
		this.baseUrl = configurationService.baseUrl;

		this.indivDropZoneconfig.url = this.baseUrl + '/api/SurveyExecution/uploadIndividual';
		this.indivDropZoneconfig.headers = {
			Authorization: 'Bearer ' + this.authService.accessToken
		};

		this.groupDropZoneconfig.url = this.baseUrl + '/api/SurveyExecution/uploadGroup';
		this.groupDropZoneconfig.headers = {
			Authorization: 'Bearer ' + this.authService.accessToken
		};
		this.route.params.subscribe(params => {
			this.surveyId = params['id'];
			this.codeGenParams.surveyId = this.surveyId;
			this.codeGenParams.isGroupCode = false;
			this.executeMode = params['mode'];
			if (this.executeMode === 'test') {
				this.codeGenParams.isTest = true;
			} else if (this.executeMode === 'live')
			{
				this.codeGenParams.isTest = false;
			} else {
				this.router.navigate(['error']);
			}
		});
	}

	ngOnInit() {
		this.indivCodeColumns = [
			{
				prop: 'index',
				name: '#',
				width: 50,
				canAutoResize: false,
				cellClass: 'remove-padding'
			},
			{
				prop: 'code',
				name: 'code',
				minWidth: 90,
				flexGrow: 60,
				sortable: false,
				cellClass: 'remove-padding'
			},
			{
				prop: 'createdDate',
				name: 'Creation Date',
				minWidth: 90,
				flexGrow: 60,
				sortable: false,
				cellTemplate: this.dateTemplate,
				cellClass: 'remove-padding'
			}
		];

		this.groupCodeColumns = [
			{
				prop: 'index',
				name: '#',
				width: 50,
				canAutoResize: false,
				cellClass: 'remove-padding'
			},
			{
				prop: 'code',
				name: 'code',
				minWidth: 90,
				flexGrow: 60,
				sortable: false,
				cellClass: 'remove-padding'
			},
			{
				prop: 'name',
				name: 'Group Name',
				minWidth: 90,
				flexGrow: 60,
				sortable: false,
				cellClass: 'remove-padding'
			},
			{
				prop: 'createdDate',
				name: 'Creation Date',
				minWidth: 90,
				flexGrow: 60,
				sortable: false,
				cellTemplate: this.dateTemplate,
				cellClass: 'remove-padding'
			}
		];

		this.survey = this.surveyService.getLastSurvey();
		if (!this.survey || this.survey == null) {
			this.survey = new Survey();
			this.surveyService.getSurvey(this.surveyId).subscribe(
				result => {
					this.survey = result;
					this.loadIndivCodeData(1);
					this.loadIndivCodeCount();
				},
				error => {
					this.router.navigate(['error']);
				}
			);
		} else {
			this.loadIndivCodeData(1);
			this.loadIndivCodeCount();
		}
		this.title.setTitle(`Execute ${this.titleCasePipe.transform(this.executeMode)} Survey - TRAISI`);
	}

	ngAfterViewInit() {
		this.dropZoneIndiv.DZ_SENDING.subscribe(data => this.onSendingIndiv(data));
		this.dropZoneGroup.DZ_SENDING.subscribe(data => this.onSendingGroup(data));
	}

	switchTab(tab: string): void {
		if (tab === 'indivCode') {
			this.individualCodeBeingViewed = true;
			this.groupCodeBeingViewed = false;
			this.emailBeingViewed = false;
			this.scheduleBeingViewed = false;
			this.generateType = 'numberCodes';
			this.loadIndivCodeData(1);
			this.loadIndivCodeCount();
		} else if (tab === 'groupCode') {
			this.individualCodeBeingViewed = false;
			this.groupCodeBeingViewed = true;
			this.emailBeingViewed = false;
			this.scheduleBeingViewed = false;
			this.generateType = 'single';
			this.loadGroupCodeData(1);
			this.loadGroupCodeCount();
		} else if (tab === 'email') {
			this.individualCodeBeingViewed = false;
			this.groupCodeBeingViewed = false;
			this.emailBeingViewed = true;
			this.scheduleBeingViewed = false;
		} else {
			this.individualCodeBeingViewed = false;
			this.groupCodeBeingViewed = false;
			this.emailBeingViewed = false;
			this.scheduleBeingViewed = true;
		}
	}

	setIndivPage(pageInfo: any) {
		this.loadIndivCodeData(pageInfo.offset + 1);
		this.currentIndivPage = pageInfo.offset;
	}

	setGroupPage(pageInfo: any) {
		this.loadGroupCodeData(pageInfo.offset + 1);
		this.currentGroupPage = pageInfo.offset;
	}

	loadGroupCodeData(pageNum: number) {
		this.alertService.startLoadingMessage('Loading codes...');
		this.loadingIndicator = true;

		this.surveyExecuteService.listSurveyGroupCodes(this.surveyId, this.executeMode, pageNum, this.pageLimit).subscribe(
			results => {
				this.groupCodeRows = results;
				this.groupCodeRows.forEach((code, index) => {
					(<any>code).index = (pageNum - 1) * this.pageLimit + index + 1;
				});
				this.alertService.stopLoadingMessage();
			},
			error => {
				this.alertService.stopLoadingMessage();
				this.generatingIndicator = false;

				this.alertService.showStickyMessage(
					'Loading Error',
					`An error occured whilst loading the codes.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
					MessageSeverity.error,
					error
				);
			}
		);
	}

	loadIndivCodeData(pageNum: number) {
		this.alertService.startLoadingMessage('Loading codes...');
		this.loadingIndicator = true;

		this.surveyExecuteService.listSurveyShortCodes(this.surveyId, this.executeMode, pageNum, this.pageLimit).subscribe(
			results => {
				this.indivCodeRows = results;
				this.indivCodeRows.forEach((code, index) => {
					(<any>code).index = (pageNum - 1) * this.pageLimit + index + 1;
				});
				this.alertService.stopLoadingMessage();
			},
			error => {
				this.alertService.stopLoadingMessage();
				this.generatingIndicator = false;

				this.alertService.showStickyMessage(
					'Loading Error',
					`An error occured whilst loading the codes.\r\nError: "${Utilities.getHttpResponseMessage(error)}"`,
					MessageSeverity.error,
					error
				);
			}
		);
	}

	loadIndivCodeCount() {
		this.surveyExecuteService.totalSurveyShortCodes(this.surveyId, this.executeMode).subscribe(result => {
			this.totalIndivCodes = result;
		});
	}

	loadGroupCodeCount() {
		this.surveyExecuteService.totalSurveyGroupCodes(this.surveyId, this.executeMode).subscribe(result => {
			this.totalGroupCodes = result;
		});
	}

	generateIndivCodes() {
		this.generatingIndicator = true;
		this.alertService.startLoadingMessage('Generating codes...');

		this.codeGenParams.isGroupCode = false;
		this.codeGenParams.usePattern = this.codeProperties === 'pattern';

		if (this.generateType === 'numberCodes') {
			this.surveyExecuteService.createSurveyShortCodes(this.codeGenParams).subscribe(
				results => {
					this.alertService.stopLoadingMessage();
					this.alertService.showMessage('Success', 'Successfully generated codes', MessageSeverity.success);
					this.generatingIndicator = false;
					this.loadIndivCodeData(1);
					this.currentIndivPage = 0;
					this.loadIndivCodeCount();
				},
				error => {
					this.alertService.stopLoadingMessage();
					this.generatingIndicator = false;

					this.alertService.showStickyMessage(
						'Generation Error',
						`An error occured whilst generating the codes.\r\nError: "${Utilities.getHttpResponseMessage(
							error
						)}"`,
						MessageSeverity.error,
						error
					);
				}
			);
		} else {
			this.alertService.stopLoadingMessage();
			this.generatingIndicator = false;

			this.alertService.showStickyMessage(
				'Generation Error',
				`Importing via CSV is not yet available.`,
				MessageSeverity.error
			);
		}
	}

	generateGroupCodes() {
		this.generatingIndicator = true;
		this.alertService.startLoadingMessage('Generating group codes...');

		this.codeGenParams.isGroupCode = true;
		this.codeGenParams.usePattern = this.codeProperties === 'pattern';

		if (this.generateType === 'single') {
			this.surveyExecuteService.createSurveyGroupCodes(this.codeGenParams).subscribe(
				results => {
					this.alertService.stopLoadingMessage();
					this.alertService.showMessage('Success', 'Successfully generated codes', MessageSeverity.success);
					this.generatingIndicator = false;
					this.loadGroupCodeData(1);
					this.currentGroupPage = 0;
					this.loadGroupCodeCount();
				},
				error => {
					this.alertService.stopLoadingMessage();
					this.generatingIndicator = false;

					this.alertService.showStickyMessage(
						'Generation Error',
						`An error occured whilst generating the codes.\r\nError: "${Utilities.getHttpResponseMessage(
							error
						)}"`,
						MessageSeverity.error,
						error
					);
				}
			);
		} else {
			this.alertService.stopLoadingMessage();
			this.generatingIndicator = false;

			this.alertService.showStickyMessage(
				'Generation Error',
				`Importing via CSV is not yet available.`,
				MessageSeverity.error
			);
		}
	}

	onUploadError(error: any) {
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage(
			'Generation Error',
			`An error occured whilst generating the codes.\r\nError: "${Utilities.getHttpResponseMessage(
				this.processDZError(error[1])
			)}"`,
			MessageSeverity.error
		);
	}

	private processDZError(errors: any): string {
		let errorString: string = '';
		for (const error of errors['']) {
			errorString += error + '\n';
		}
		return errorString;
	}

	onUploadSuccessIndiv(event: any) {
		this.alertService.stopLoadingMessage();
		this.alertService.showMessage('Success', 'Successfully generated codes', MessageSeverity.success);
		this.loadIndivCodeData(1);
		this.currentIndivPage = 0;
		this.loadIndivCodeCount();
	}

	onUploadSuccessGroup(event: any) {
		this.alertService.showMessage('Success', 'Successfully generated codes', MessageSeverity.success);
		this.loadGroupCodeData(1);
		this.currentGroupPage = 0;
		this.loadGroupCodeCount();
	}

	onSendingIndiv(data) {
		this.alertService.startLoadingMessage('Generating codes...');
		this.codeGenParams.isGroupCode = false;
		this.codeGenParams.usePattern = this.codeProperties === 'pattern';
		data[2].append('parameters', JSON.stringify(this.codeGenParams));
	}

	onSendingGroup(data) {
		this.alertService.startLoadingMessage('Generating codes...');
		this.codeGenParams.isGroupCode = true;
		this.codeGenParams.usePattern = this.codeProperties === 'pattern';
		data[2].append('parameters', JSON.stringify(this.codeGenParams));
	}

	downloadGroupCodes() {
		this.downloadIndicator = true;
		this.surveyExecuteService.downloadSurveyGroupCodes(this.surveyId, this.executeMode).subscribe(
			result => {
				this.downloadProgress = new DownloadNotification(result);
				this.downloadNotifier = this.notificationService.registerDownloadChannel(result);
				this.downloadNotifier.subscribe(
					update => {
						this.downloadProgress = update;
						if (update.progress === 100) {
							this.downloadIndicator = false;
							//download file and unsubscribe
							
							window.open(this.downloadProgress.url, '_self');
							this.downloadNotifier.unsubscribe();
							
						}
					},
					error => {
						this.downloadIndicator = false;
						this.downloadNotifier.unsubscribe();
					}
				);
			},
			error => {

			}
		);
	}

	downloadIndividualCodes() {
		this.alertService.startLoadingMessage('Creating codes file...');
		this.downloadIndicator = true;
		this.surveyExecuteService.downloadSurveyShortCodes(this.surveyId, this.executeMode).subscribe(
			result => {
				this.downloadProgress = new DownloadNotification(result);
				this.downloadNotifier = this.notificationService.registerDownloadChannel(result);
				this.downloadNotifier.subscribe(
					update => {
						this.downloadProgress = update;
						if (update.progress === 100) {
							this.alertService.stopLoadingMessage();
							this.downloadIndicator = false;
							//download file and unsubscribe
							window.open(this.downloadProgress.url, '_self');
							this.downloadNotifier.unsubscribe();
						}
					},
					error => {
						this.downloadErrorHelper(error);
					}
				);
			},
			error => {
				this.downloadErrorHelper(error);
			}
		);
	}

	downloadErrorHelper(error: any) {
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage(
			'Download Error',
			`An error occured whilst downloading the codes.\r\nError: "${Utilities.getHttpResponseMessage(
				this.processDZError(error[1])
			)}"`,
			MessageSeverity.error
		);
	}

	getFormattedTimeZone() {
		return new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1].split(' (')[0].replace(/[A-Z]+/,'')
	 }
}
