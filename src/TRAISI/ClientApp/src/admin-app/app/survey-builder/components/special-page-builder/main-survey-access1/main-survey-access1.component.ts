import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ConfigurationService } from '../../../../../../shared/services/configuration.service';
import { AuthService } from '../../../../../../shared/services';
import { AlertService, MessageSeverity } from '../../../../../../shared/services/alert.service';
import { Utilities } from '../../../../../../shared/services/utilities';
import { SurveyBuilderService } from '../../../services/survey-builder.service';
import { UploadPath } from '../../../models/upload-path';

@Component({
	selector: 'app-main-survey-access1',
	templateUrl: './main-survey-access1.component.html',
	styleUrls: ['./main-survey-access1.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MainSurveyAccess1Component implements OnInit {
	public quillVideoModules = {
		blotFormatter: {
		},
		toolbar: [
			['video'], // link and image, video
			[{ align: [] }]
		]
	};
	public quillModules = {
		toolbar: [
			['bold', 'italic', 'underline', 'strike'], // toggled buttons
			['blockquote', 'code-block'],

			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
			[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
			[{ direction: 'rtl' }], // text direction

			[{ header: [1, 2, 3, 4, 5, 6, false] }],

			[{ color: [] }, { background: [] }], // dropdown with defaults from theme
			[{ font: [] }],
			[{ size: [] }],
			[{ align: [] }],

			['clean'], // remove formatting button

			['link'] // link and image, video
		]
	};

	private baseUrl: string;
	public videoSource: string;
	public imageSource: string;

	public imageVideoDropZoneconfig: DropzoneConfigInterface = {
		// Change this to your upload POST address:
		maxFilesize: 50,
		maxFiles: 1,
		acceptedFiles: 'video/*, image/*',
		autoReset: 2000,
		errorReset: 2000,
		cancelReset: 2000,
		timeout: 3000000
	};

	public quillMinimalModules = {
		toolbar: []
	};

	public introTextHTML: string;
	public accessCodeHTML: string;
	public beginSurveyHTML: string;

	private pageHTMLJson: any;
	@Input()
	public pageHTML: string;
	@Output()
	public pageHTMLChange = new EventEmitter();

	@Output() public forceSave = new EventEmitter();

	constructor(
		private configurationService: ConfigurationService,
		private authService: AuthService,
		private alertService: AlertService,
		private surveyBuilderService: SurveyBuilderService
	) {
		this.baseUrl = configurationService.baseUrl;
		this.imageVideoDropZoneconfig.url = this.baseUrl + '/api/Upload';
		this.imageVideoDropZoneconfig.headers = {
			Authorization: 'Bearer ' + this.authService.accessToken
		};
	}

	ngOnInit() {
		try {
			let pageData = JSON.parse(this.pageHTML);
			this.pageHTMLJson = pageData;
			this.videoSource = pageData.video;
			this.introTextHTML = pageData.introText;
			this.accessCodeHTML = pageData.accessCode;
			this.beginSurveyHTML = pageData.beginSurvey;
		} catch (e) {
			this.pageHTMLJson = {};
			this.videoSource = undefined;
			this.introTextHTML = '';
			this.accessCodeHTML = 'Enter Access Code';
			this.beginSurveyHTML = 'Begin Survey';
		}
	}

	onUploadError(error: any) {
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage(
			'Generation Error',
			`An error occured while uploading the video.\r\nError: "${Utilities.getHttpResponseMessage(
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
		console.log(event);
		if ((<string>event[0].type).startsWith('video')) {
			this.videoSource = event[1].link;
		} else {
			this.imageSource = event[1].link;
		}
		this.updateImageVideoContent();
	}

	deleteImageVideo() {
		let uploadPath;
		if (this.videoSource) {
			uploadPath = new UploadPath(this.videoSource);
		} else if (this.imageSource) {
			uploadPath = new UploadPath(this.imageSource);
		}
		if (uploadPath) {
			this.surveyBuilderService.deleteUploadedFile(uploadPath).subscribe();
			this.videoSource = undefined;
			this.imageSource = undefined;
			this.updateImageVideoContent();
		}
	}

	clearUploads() {
		this.deleteImageVideo();
	}

	updateImageVideoContent() {
		this.pageHTMLJson.media = this.videoSource ? this.videoSource : this.imageSource;
		this.updatePageHTML();
		this.forceSave.emit();
	}

	updateContent(contentInfo: any) {
		this.pageHTMLJson.introText = this.introTextHTML;
		this.updatePageHTML();
	}

	updateAccessCodeContent(contentInfo: any) {
		this.pageHTMLJson.accessCode = this.accessCodeHTML;
		this.updatePageHTML();
	}

	updateBeginSurveyContent(contentInfo: any) {
		this.pageHTMLJson.beginSurvey = this.beginSurveyHTML;
		this.updatePageHTML();
	}

	private updatePageHTML() {
		this.pageHTML = JSON.stringify(this.pageHTMLJson);
		this.pageHTMLChange.emit(this.pageHTML);
	}
}
