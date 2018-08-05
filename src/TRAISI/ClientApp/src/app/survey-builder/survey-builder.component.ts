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
import { Utilities } from '../services/utilities';
import { Subject } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { QuestionTypeChooserComponent } from './components/question-type-chooser/question-type-chooser.component';
import { QuestionPartViewLabel } from './models/question-part-view-label.model';
import { Order } from './models/order.model';

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

	public currentSurveyPage: QuestionPartView;

	private currentPage: string = 'welcome';
	private deletedImages: UploadPath[] = [];

	private lastDragEnter: string[] = [];
	private lastDragLeave: string[] = [];
	private dragResult: Subject<boolean>;

	@ViewChild('surveyPageDragAndDrop') surveyPage: NestedDragAndDropListComponent;
	@ViewChild('questionChooser') questionChooser: QuestionTypeChooserComponent;

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
		this.getPagePayload = this.getPagePayload.bind(this);
	}

	ngOnInit() {
		this.froalaOptions = this.generateFroalaOptions();
		this.loadPageStructure();
		this.switchPage('welcome');
	}

	ngOnDestroy() {}

	loadPageStructure(): void {
		this.surveyBuilderService.getStandardViewPageStructure(this.surveyId, this.currentLanguage).subscribe(page => {
			this.allPages = page.pages;
			this.welcomePage = page.welcomePage;
			this.termsAndConditionsPage = page.termsAndConditionsPage;
			this.thankYouPage = page.surveyCompletionPage;
		});
	}

	mapQuestionTypeDefinitions() {
		this.questionChooser.questionTypeDefinitions.forEach(q => {
			this.surveyPage.qTypeDefinitions.set(q.typeName, q);
		});
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
				this.alertService.showMessage('Success', `Welcome page was saved successfully!`, MessageSeverity.success);
			},
			error => {}
		);
	}

	saveTAndCPage() {
		this.surveyBuilderService.updateStandardTermsAndConditionsPage(this.surveyId, this.termsAndConditionsPage).subscribe(
			result => {
				this.alertService.showMessage('Success', `Terms and conditions page was saved successfully!`, MessageSeverity.success);
			},
			error => {}
		);
	}

	saveThankYouPage() {
		this.surveyBuilderService.updateStandardThankYouPage(this.surveyId, this.thankYouPage).subscribe(
			result => {
				this.alertService.showMessage('Success', `Thank you page was saved successfully!`, MessageSeverity.success);
			},
			error => {}
		);
	}

	saveMandatoryPages(e, editor, data) {
		if (this.currentPage === 'welcome') {
			this.surveyBuilderService.updateStandardWelcomePage(this.surveyId, this.welcomePage).subscribe(result => {}, error => {});
		} else if (this.currentPage === 'termsAndConditions') {
			this.surveyBuilderService
				.updateStandardTermsAndConditionsPage(this.surveyId, this.termsAndConditionsPage)
				.subscribe(result => {}, error => {});
		} else if (this.currentPage === 'thank-you') {
			this.surveyBuilderService.updateStandardThankYouPage(this.surveyId, this.thankYouPage).subscribe(result => {}, error => {});
		}
	}

	addQuestionTypeToList(qType) {
		this.surveyPage.addQuestionTypeToList(qType);
	}

	switchPage(pageName: string): void {
		this.currentPage = pageName;
		let priorPageId = this.currentSurveyPage ? this.currentSurveyPage.id : -1;
		this.currentSurveyPage = undefined;
		this.surveyPage.currentPage = new QuestionPartView();
		setTimeout(() => {
			if (priorPageId !== -1) {
				let thisPage = <any>$('#' + priorPageId + '-tab');
				thisPage.removeClass('active');
				thisPage.removeClass('show');
			}
		}, 0);
	}

	switchSurveyPage(pageId: number): void {
		this.currentPage = 'surveyPage';
		let priorPageId = this.currentSurveyPage ? this.currentSurveyPage.id : -1;
		setTimeout(() => {
			if (priorPageId !== -1) {
				let thisPage = <any>$('#' + priorPageId + '-tab');
				thisPage.removeClass('active');
				thisPage.removeClass('show');
			}
			let nextPage = <any>$('#' + pageId + '-tab');
			nextPage.tab('show');
		}, 0);

		this.surveyBuilderService
			.getQuestionPartViewPageStructure(this.surveyId, pageId, this.currentLanguage)
				.subscribe(page => {
					this.currentSurveyPage = page;
					this.surveyPage.currentPage = page;
					this.surveyPage.qPartQuestions = new Map<number, QuestionPartView>();
					page.questionPartViewChildren.forEach(qc => {
						if (qc.questionPart === null) {
							this.surveyPage.qPartQuestions.set(qc.id, qc);
							this.surveyBuilderService.getQuestionPartViewPageStructure(this.surveyId, qc.id, this.currentLanguage)
								.subscribe(qPart => {
									qc.questionPartViewChildren = qPart.questionPartViewChildren;
								});
						}
					});
				});
	}

	private navigateToFirst(): void {
		let firstTab = <any>$('#welcome-tab');
		firstTab.tab('show');
	}

	deletePage(pageId: number): void {
		this.alertService.showDialog('Are you sure you want to delete the page?', DialogType.confirm, () => this.continueDelete(pageId));
	}

	continueDelete(pageId: number): void {
		this.surveyBuilderService.deleteStandardPage(this.surveyId, pageId).subscribe(
			result => {
				this.loadPageStructure();
				if (pageId === this.currentSurveyPage.id) {
					this.navigateToFirst();
				}
				this.alertService.showMessage('Success', `Page was removed successfully!`, MessageSeverity.success);
			},
			error => {
				this.alertService.showMessage(
					'Error',
					`Problem removing page!\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
					MessageSeverity.error
				);
			}
		);
	}

	createPage(title: string): void {
		let newlabel: QuestionPartViewLabel = new QuestionPartViewLabel(0, title, this.currentLanguage);
		let newPage: QuestionPartView = new QuestionPartView(0, newlabel);
		this.surveyBuilderService.addStandardPage(this.surveyId, this.currentLanguage, newPage).subscribe(
			result => {
				this.loadPageStructure();
				this.alertService.showMessage('Success', `Page was added successfully!`, MessageSeverity.success);
			},
			error => {
				this.alertService.showMessage(
					'Error',
					`Problem adding page!\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
					MessageSeverity.error
				);
			}
		);
	}

	updatePageOrder() {
		this.allPages.forEach((page, index) => {
			page.order = index;
		});
	}

	onDragEnd(event) {
		if (this.lastDragEnter.length !== this.lastDragLeave.length) {
			this.dragResult = new Subject<boolean>();
			this.alertService.showDialog(
				'Are you sure you want to move the page?',
				DialogType.confirm,
				() => this.dragResult.next(true),
				() => this.dragResult.next(false)
			);
		}
		this.lastDragEnter = [];
		this.lastDragLeave = [];
	}

	onDragEnter() {
		this.lastDragEnter.push('page-container');
	}

	onDragLeave() {
		this.lastDragLeave.push('page-container');
	}

	onDrop(dropResult: any) {
		if (this.dragResult) {
			// create shadow list to give illusion of transfer before decision made
			let pageCache = [...this.allPages];
			this.allPages = Utilities.applyDrag(this.allPages, dropResult);
			this.dragResult.subscribe(proceed => {
				if (proceed === false) {
					this.allPages = pageCache;
				} else {
					this.updatePageOrder();
					let pagesOrder: Order[] = this.allPages.map(ap => new Order(ap.id, ap.order));
					this.surveyBuilderService.updateStandardViewPageOrder(this.surveyId, pagesOrder).subscribe(
						result => {
						},
						error => {
							this.loadPageStructure();
						}
					);
				}
				this.dragResult = undefined;
			});
		}
	}

	getPagePayload(index) {
		return this.allPages[index];
	}
}
