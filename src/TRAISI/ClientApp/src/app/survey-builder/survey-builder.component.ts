import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SurveyBuilderService } from './services/survey-builder.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfigurationService } from '../services/configuration.service';
import { UploadPath } from './models/upload-path';
import { QuestionTypeDefinition } from './models/question-type-definition';
import { AlertService, DialogType } from '../services/alert.service';

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
		this.getQuestionPayload = this.getQuestionPayload.bind(this);
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

		//this.alertService.showDialog('Are you sure you want to add the question?', DialogType.confirm, () =>
		if (qType.typeName === 'Survey Part') {
			qType.partId = this.elementUniqueIndex;
			this.qPartQuestions.set(this.elementUniqueIndex++,[]);
		}
		this.testTargets.push(qType)
		//);

	}

	getQuestionPayload(index) {
		return this.testTargets[index];
	}

	getQuestionInPartPayload(partId:number) {
		return (index) => {
			return this.qPartQuestions.get(partId)[index];
		}
	}

	onDrop(dropResult:any) {
		
		if (dropResult.payload.typeName === 'Survey Part' && dropResult.removedIndex === null) {
			if (dropResult.payload.partId === undefined) {
				dropResult.payload.partId = this.elementUniqueIndex++;
			}
			if (!this.qPartQuestions.has(dropResult.payload.partId)){
				this.qPartQuestions.set(dropResult.payload.partId,[]);
			}
		}
		this.testTargets = this.applyDrag(this.testTargets, dropResult);
	}

	onDropInPart(partId:number, dropResult: any) {
		if (partId !== dropResult.payload.partId) {
			//if (dropResult.addedIndex !== null || dropResult.removedIndex !== null) {
				let questionParts = this.qPartQuestions.get(partId);
				questionParts = this.applyDrag(questionParts,dropResult);
				this.qPartQuestions.set(partId, questionParts);
			//}
		} else {
			/*if (dropResult.addedIndex !== null) {
				this.testTargets.push(dropResult.payload);
			}*/
		}
	}

	shouldAcceptDrop(sourceContainerOptions, payload) {
		return true;
	}

	shouldAcceptDropPart(sourceContainerOptions, payload) {
		if (payload.typeName === 'Survey Part') {
			return false;
		}
		else {
			return true;
		}
		
		/*let thisContainer: any = this;
		
		let groupName: string = thisContainer.groupName;
		if (groupName.startsWith('builder-part-')) {
			let split: string[] = groupName.split('-');
			let partNum: number = +split[split.length -1];
			if (partNum === payload.partId) {
				return false;
			}
		}
		return true;*/

		/*if (sourceContainerOptions.groupName === 'builder-questions' || sourceContainerOptions.groupName === thisContainer) {
			return true;
		}
		return false;
*/
	}

	applyDrag = (arr, dragResult) => {
		const { removedIndex, addedIndex, payload } = dragResult;
		if (removedIndex === null && addedIndex === null) return arr;
	
		const result = [...arr];
		let itemToAdd = payload;
	
		if (removedIndex !== null) {
			itemToAdd = result.splice(removedIndex, 1)[0];
		}
	
		if (addedIndex !== null) {
			result.splice(addedIndex, 0, itemToAdd);
		}
	
		return result;
	}
}
