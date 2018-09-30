import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ConfigurationService } from '../../../../../../shared/services/configuration.service';
import { AuthService } from '../../../../../../shared/services';
import { AlertService, MessageSeverity } from '../../../../../../shared/services/alert.service';
import { Utilities } from '../../../../../../shared/services/utilities';
import { SurveyBuilderService } from '../../../services/survey-builder.service';
import { UploadPath } from '../../../models/upload-path';


@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.scss']
})
export class Header2Component implements OnInit {

	private baseUrl: string = '';
	public imageSource1: string;
	public imageSource2: string;

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
			this.imageSource1 = pageData.image1;
			this.imageSource2 = pageData.image2;
		} catch (e) {
			this.pageHTMLJson = {};
			this.imageSource1 = undefined;
			this.imageSource2 = undefined;
		}
		if (!('headerColour' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerColour = 'rgb(240,239,240)';
		}
		if (!('headerMaxHeightScale1' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerMaxHeightScale1 = 1.0;
		}
		if (!('headerMaxHeightScale2' in this.pageThemeInfo)) {
			this.pageThemeInfo.headerMaxHeightScale2 = 1.0;
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

	onUploadSuccess(event: any, imageIndex: number) {
		if (imageIndex === 1) {
			this.imageSource1 = event[1].link;
			this.pageHTMLJson.image1 = this.imageSource1;
		} else if (imageIndex === 2) {
			this.imageSource2 = event[1].link;
			this.pageHTMLJson.image2 = this.imageSource2;
		}
		this.updateImageContent();
		this.forceSave.emit();
	}

	deleteImage(imageIndex: number) {
		if (imageIndex === 1) {
			let uploadPath = new UploadPath(this.imageSource1);
			this.surveyBuilderService.deleteUploadedFile(uploadPath).subscribe();
			this.imageSource1 = undefined;
			this.pageHTMLJson.image1 = undefined;
		} else if (imageIndex === 2) {
			let uploadPath = new UploadPath(this.imageSource2);
			this.surveyBuilderService.deleteUploadedFile(uploadPath).subscribe();
			this.imageSource2 = undefined;
			this.pageHTMLJson.image2 = undefined;
		}
		this.updateImageContent();
		this.forceSave.emit();
	}

	updateImageContent() {
		this.pageHTML = JSON.stringify(this.pageHTMLJson);
		this.pageHTMLChange.emit(this.pageHTML);
	}

	headerColourChange(newColour: string) {
		this.pageThemeInfo.headerColour = newColour;
		this.pageThemeInfoChange.emit(this.pageThemeInfo);
	}

	headerMaxHeightChange1(newHeight: any) {
		this.pageThemeInfo.headerMaxHeightScale1 = newHeight.newValue;
		this.pageThemeInfoChange.emit(this.pageThemeInfo);
	}

	headerMaxHeightChange2(newHeight: any) {
		this.pageThemeInfo.headerMaxHeightScale2 = newHeight.newValue;
		this.pageThemeInfoChange.emit(this.pageThemeInfo);
	}

	clearUploads() {
		if (this.imageSource1) {
			this.deleteImage(1);
		}
		if (this.imageSource2) {
			this.deleteImage(2);
		}
	}
}
