import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SurveyBuilderService } from './services/survey-builder.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfigurationService } from '../services/configuration.service';
import { UploadPath } from './models/upload-path';
import { QuestionTypeDefinition } from './models/question-type-definition';
import { AlertService, DialogType } from '../services/alert.service';
import { NestedDragAndDropListComponent } from './components/nested-drag-and-drop-list/nested-drag-and-drop-list.component';

@Component({
	selector: 'traisi-survey-builder',
	templateUrl: './survey-builder.component.html',
	styleUrls: ['./survey-builder.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SurveyBuilderComponent implements OnInit {
	public surveyId: number;
	public testTargets = [];
	public qPartQuestions: Map<number, any[]> = new Map<number, any[]>(); 
	public froalaOptions: any;
	private elementUniqueIndex: number = 0;

	@ViewChild('surveyPageDragAndDrop') surveyPage: NestedDragAndDropListComponent;

	deleteImage(e, editor, img) {
		let uploadPath = new UploadPath(img.attr('src'));
		this.surveyBuilderService.deleteUploadedFile(uploadPath).subscribe();
	}

	deleteVideo(e, editor, vid) {
		if (vid[0].localName === 'video') {
			let uploadPath = new UploadPath(vid.attr('src'));
			this.surveyBuilderService.deleteUploadedFile(uploadPath).subscribe();
		}
	}

	constructor(
		private surveyBuilderService: SurveyBuilderService,
		private configurationService: ConfigurationService,
		private authService: AuthService,
		private route: ActivatedRoute,
		private alertService: AlertService
	) {
		this.route.params.subscribe(params => {
			this.surveyId = params['id'];
		});
	}

	ngOnInit() {
		this.froalaOptions = {
			toolbarInline: true,
			charCounterCount: false,
			toolbarVisibleWithoutSelection: true,
			placeholderText: 'Welcome Message',
			fontFamilySelection: true,
			fontFamily: {
				'Source Sans Pro,sans-serif': 'Source Sans Pro',
				'Arial,Helvetica,sans-serif': 'Arial',
				'Georgia,serif': 'Georgia',
				'Impact,Charcoal,sans-serif': 'Impact',
				'Tahoma,Geneva,sans-serif': 'Tahoma',
				"'Times New Roman',Times,serif": 'Times New Roman',
				'Verdana,Geneva,sans-serif': 'Verdana'
			},
			toolbarButtonsSM: [
				'fullscreen',
				'bold',
				'italic',
				'underline',
				'strikeThrough',
				'subscript',
				'superscript',
				'-',
				'fontFamily',
				'fontSize',
				'color',
				'inlineStyle',
				'paragraphStyle',
				'-',
				'paragraphFormat',
				'align',
				'formatOL',
				'formatUL',
				'outdent',
				'indent',
				'quote',
				'-',
				'insertLink',
				'insertImage',
				'insertVideo',
				'embedly',
				'insertFile',
				'insertTable',
				'-',
				'emoticons',
				'specialCharacters',
				'insertHR',
				'selectAll',
				'clearFormatting',
				'-',
				'print',
				'spellChecker',
				'help',
				'html',
				'|',
				'undo',
				'redo'
			],
			requestHeaders: {
				Authorization: 'Bearer ' + this.authService.accessToken
			},
			videoUploadURL: this.configurationService.baseUrl + '/api/Upload',
			videoUploadMethod: 'POST',
			imageUploadURL: this.configurationService.baseUrl + '/api/Upload',
			imageUploadMethod: 'POST',
			events: {
				'froalaEditor.image.removed': (e, editor, img) => this.deleteImage(e, editor, img),
				'froalaEditor.video.removed': (e, editor, vid) => this.deleteVideo(e, editor, vid)
			}
		};
	}

	addQuestionTypeToList(qType) {
		this.surveyPage.addQuestionTypeToList(qType);
	}
}
