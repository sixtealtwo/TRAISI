import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ConfigurationService } from '../../../../../../shared/services/configuration.service';
import { AuthService } from '../../../../../../shared/services';
import { AlertService, MessageSeverity } from '../../../../../../shared/services/alert.service';
import { Utilities } from '../../../../../../shared/services/utilities';
import { SurveyBuilderService } from '../../../services/survey-builder.service';
import { UploadPath } from '../../../models/upload-path';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class Header1Component implements OnInit {

	private baseUrl: string = '';
	public imageSource: string;

	public imageDropZoneconfig: DropzoneConfigInterface = {
		// Change this to your upload POST address:
		maxFilesize: 50,
		maxFiles: 1,
		acceptedFiles: 'image/*',
		autoReset: 2000,
		errorReset: 2000,
		cancelReset: 2000,
		timeout: 3000000,
		createImageThumbnails: false
	};

	private pageHTMLJson: any;
	@Input() public pageHTML: string;
	@Input() public pageThemeInfo: any;
	@Output() public pageHTMLChange = new EventEmitter();
	@Output()	public pageThemeInfoChange = new EventEmitter();
	@Output() public forceSave = new EventEmitter();

  constructor(
		private configurationService: ConfigurationService,
		private authService: AuthService,
		private alertService: AlertService,
		private surveyBuilderService: SurveyBuilderService
	) {
		this.baseUrl = configurationService.baseUrl;
		this.imageDropZoneconfig.url = this.baseUrl + '/api/Upload';
		this.imageDropZoneconfig.headers = {
			Authorization: 'Bearer ' + this.authService.accessToken
		};
	}

  ngOnInit() {
		try {
			let pageData = JSON.parse(this.pageHTML);
			this.pageHTMLJson = pageData;
			this.imageSource = pageData.image;
		} catch (e) {
			this.pageHTMLJson = {};
			this.imageSource = undefined;
		}
		if (!('headerColour' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerColour = 'rgb(240,239,240)';
		}
	}

	onUploadError(error: any) {
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage(
			'Generation Error',
			`An error occured while uploading the logo.\r\nError: "${Utilities.getHttpResponseMessage(
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

	onUploadSuccess(event: any) {
		this.imageSource = event[1].link;
		this.updateImageContent();
		this.forceSave.emit();
	}

	deleteImage() {
		let uploadPath = new UploadPath(this.imageSource);
		this.surveyBuilderService.deleteUploadedFile(uploadPath).subscribe();
		this.imageSource = undefined;
		this.updateImageContent();
		this.forceSave.emit();
	}

	updateImageContent() {
		this.pageHTMLJson.image = this.imageSource;
		this.pageHTML = JSON.stringify(this.pageHTMLJson);
		this.pageHTMLChange.emit(this.pageHTML);
	}

	headerColourChange(newColour: string) {
		this.pageThemeInfo.headerColour = newColour;
		this.pageThemeInfoChange.emit(this.pageThemeInfo);
	}

	clearUploads() {
		if (this.imageSource) {
			this.deleteImage();
		}
	}

}
