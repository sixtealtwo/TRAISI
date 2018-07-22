import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { SurveyBuilderService } from './services/survey-builder.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfigurationService } from '../services/configuration.service';
import { UploadPath } from './models/upload-path';
import { QuestionTypeDefinition } from './models/question-type-definition';
import { AlertService, DialogType, MessageSeverity } from '../services/alert.service';
import { NestedDragAndDropListComponent } from './components/nested-drag-and-drop-list/nested-drag-and-drop-list.component';
import { QuestionPartView } from './models/question-part-view.model';
import { WelcomePage } from './models/welcome-page.model';
import { TermsAndConditionsPage } from './models/terms-and-conditions-page.model';
import { ThankYouPage } from './models/thank-you-page.model';

@Component({
	selector: 'traisi-survey-builder',
	templateUrl: './survey-builder.component.html',
	styleUrls: ['./survey-builder.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SurveyBuilderComponent implements OnInit, OnDestroy {
	public surveyId: number;
	public froalaOptions: any;
	public allPages: QuestionPartView[] = [];
	public newPageTitle: string;
	public currentLanguage: string = 'en';

	public welcomePage: WelcomePage;
	public termsAndConditionsPage: TermsAndConditionsPage;
	public thankYouPage: ThankYouPage;

	private currentPage: string = 'welcome';
	private deletedImages: UploadPath[] = [];

	@ViewChild('surveyPageDragAndDrop') surveyPage: NestedDragAndDropListComponent;

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
		this.froalaOptions = this.generateFroalaOptions();
		this.loadPageStructure();
		this.switchPage('welcome');
	}

	ngOnDestroy() {}

	loadPageStructure(): void {
		this.surveyBuilderService.getStandardViewPageStructure(this.surveyId, this.currentLanguage).subscribe(
			page => {
				this.allPages = page.pages;
				this.welcomePage = page.welcomePage;
				this.termsAndConditionsPage = page.termsAndConditionsPage;
				this.thankYouPage = page.surveyCompletionPage;
			}
		);
	}
	generateFroalaOptions() {
		return {
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
				'Times New Roman,Times,serif': 'Times New Roman',
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
			saveInterval: 5000,

			events: {
				'froalaEditor.image.removed': (e, editor, img) => this.deleteImage(e, editor, img),
				'froalaEditor.video.removed': (e, editor, vid) => this.deleteVideo(e, editor, vid),
				'froalaEditor.save.before': (e, editor, data) => this.saveMandatoryPages(e, editor, data),
				'froalaEditor.commands.after': (e, editor, cmd) => this.imageInserted(e, editor, cmd)
			}
		};
	}

	imageInserted(e, editor, cmd) {
		console.log(editor);
		console.log(e);
	}

	deleteImage(e, editor, img) {
		let uploadPath = new UploadPath(img.attr('src'));
		this.deletedImages.push(uploadPath);
		this.surveyBuilderService.deleteUploadedFile(uploadPath).subscribe();
	}

	deleteVideo(e, editor, vid) {
		if (vid[0].localName === 'video') {
			let uploadPath = new UploadPath(vid.attr('src'));
			this.deletedImages.push(uploadPath);
			this.surveyBuilderService.deleteUploadedFile(uploadPath).subscribe();
		}
	}

	saveWelcomePage() {
		this.surveyBuilderService.updateStandardWelcomePage(this.surveyId, this.welcomePage).subscribe(
			result => {
				this.alertService.showMessage(
					'Success',
					`Welcome page was saved successfully!`,
					MessageSeverity.success
				);
			},
			error => {}
		);
	}

	saveTAndCPage() {
		this.surveyBuilderService
			.updateStandardTermsAndConditionsPage(this.surveyId, this.termsAndConditionsPage)
			.subscribe(
				result => {
					this.alertService.showMessage(
						'Success',
						`Terms and conditions page was saved successfully!`,
						MessageSeverity.success
					);
				},
				error => {}
			);
	}

	saveThankYouPage() {
		this.surveyBuilderService.updateStandardThankYouPage(this.surveyId, this.thankYouPage).subscribe(
			result => {
				this.alertService.showMessage(
					'Success',
					`Thank you page was saved successfully!`,
					MessageSeverity.success
				);
			},
			error => {}
		);
	}

	saveMandatoryPages(e, editor, data) {
		if (this.currentPage === 'welcome') {
			this.surveyBuilderService
				.updateStandardWelcomePage(this.surveyId, this.welcomePage)
				.subscribe(result => {}, error => {});
		} else if (this.currentPage === 'termsAndConditions') {
			this.surveyBuilderService
				.updateStandardTermsAndConditionsPage(this.surveyId, this.termsAndConditionsPage)
				.subscribe(result => {}, error => {});
		} else if (this.currentPage === 'thank-you') {
			this.surveyBuilderService
				.updateStandardThankYouPage(this.surveyId, this.thankYouPage)
				.subscribe(result => {}, error => {});
		}
	}

	addQuestionTypeToList(qType) {
		this.surveyPage.addQuestionTypeToList(qType);
	}

	switchPage(pageName: string): void {
		this.currentPage = pageName;
		/*if (this.currentPage === 'welcome') {
			this.surveyBuilderService.getStandardWelcomePage(this.surveyId, this.currentLanguage).subscribe(result => {
				this.welcomePage = result;
			});
		} else if (this.currentPage === 'termsAndConditions') {
			this.surveyBuilderService.getStandardTermsAndConditionsPage(this.surveyId, this.currentLanguage).subscribe(result => {
				this.termsAndConditionsPage = result;
			});
		} else if (this.currentPage === 'thank-you') {
			this.surveyBuilderService.getStandardThankYouPage(this.surveyId, this.currentLanguage).subscribe(result => {
				this.thankYouPage = result;
			});
		}*/
	}

	switchSurveyPage(pageId: number): void {
		this.surveyPage.pageQuestions = [];
		this.currentPage = 'surveyPage';
	}

	createPage(title: string): void {
		let newPage: QuestionPartView = new QuestionPartView(0, title);
		this.surveyBuilderService.addStandardPage(this.surveyId, this.currentLanguage, newPage).subscribe(
			result => {
				this.loadPageStructure();
				this.alertService.showMessage(
					'Success',
					`Page was added successfully!`,
					MessageSeverity.success
				);
			},
			error => {
				this.alertService.showMessage(
					'Error',
					`Problem adding page!`,
					MessageSeverity.error
				);
			}
		);
	}
}
