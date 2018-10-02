import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { SurveyBuilderService } from './services/survey-builder.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { UploadPath } from './models/upload-path';
import { QuestionTypeDefinition } from './models/question-type-definition';
import { AlertService, DialogType, MessageSeverity } from '../../../shared/services/alert.service';
import { NestedDragAndDropListComponent } from './components/nested-drag-and-drop-list/nested-drag-and-drop-list.component';
import { QuestionPartView } from './models/question-part-view.model';
import { WelcomePage } from './models/welcome-page.model';
import { TermsAndConditionsPage } from './models/terms-and-conditions-page.model';
import { ThankYouPage } from './models/thank-you-page.model';
import { Utilities } from '../../../shared/services/utilities';
import { Subject } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { QuestionTypeChooserComponent } from './components/question-type-chooser/question-type-chooser.component';
import { QuestionPartViewLabel } from './models/question-part-view-label.model';
import { Order } from './models/order.model';
import { Survey } from '../models/survey.model';
import { SurveyService } from '../services/survey.service';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import { SpecialPageBuilderComponent } from './components/special-page-builder/special-page-builder.component';

// override p with div tag
const Parchment = Quill.import('parchment');
let Block = Parchment.query('block');

class NewBlock extends Block {}
NewBlock.tagName = 'DIV';
Quill.register(NewBlock, true);
Quill.register('modules/blotFormatter', BlotFormatter);

// expand fonts available
// Add fonts to whitelist
let Font = Quill.import('formats/font');
// We do not add Sans Serif since it is the default
Font.whitelist = ['montserrat',  'sofia', 'roboto'];
Quill.register(Font, true);

@Component({
	selector: 'traisi-survey-builder',
	templateUrl: './survey-builder.component.html',
	styleUrls: ['./survey-builder.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SurveyBuilderComponent implements OnInit, OnDestroy {
	public surveyId: number;
	public survey: Survey = new Survey();

	public allPages: QuestionPartView[] = [];
	public newPageTitle: string;
	public currentLanguage: string = 'en';

	public pageThemeInfo: any = {};

	public welcomePage: WelcomePage = new WelcomePage();
	public termsAndConditionsPage: TermsAndConditionsPage = new TermsAndConditionsPage();
	public thankYouPage: ThankYouPage = new ThankYouPage();
	public loadedSpecialPages: boolean = false;

	public welcomePagePreview: any = { value: false };
	public privacyPagePreview: any = { value: false };
	public thankYouPagePreview: any = { value: false };

	public currentSurveyPage: QuestionPartView;
	public currentSurveyPageEdit: QuestionPartView;

	private currentPage: string = 'welcome';

	private lastDragEnter: string[] = [];
	private lastDragLeave: string[] = [];
	private dragResult: Subject<boolean>;

	@ViewChild('surveyPageDragAndDrop')
	surveyPage: NestedDragAndDropListComponent;
	@ViewChild('questionChooser')
	questionChooser: QuestionTypeChooserComponent;
	@ViewChild('createPageModal')
	createPageModal: ModalDirective;
	@ViewChild('editPageModal')
	editPageModal: ModalDirective;
	@ViewChild('welcomeEditor')
	welcomeEditor: SpecialPageBuilderComponent;
	@ViewChild('privacyPolicyEditor')
	privacyPolicyEditor: SpecialPageBuilderComponent;
	@ViewChild('thankYouEditor')
	thankYouEditor: SpecialPageBuilderComponent;

	constructor(
		private surveyBuilderService: SurveyBuilderService,
		private configurationService: ConfigurationService,
		private surveyService: SurveyService,
		private authService: AuthService,
		private route: ActivatedRoute,
		private alertService: AlertService
	) {
		this.route.params.subscribe(params => {
			this.surveyId = params['id'];
			this.surveyService.getSurvey(this.surveyId).subscribe(survey => {
				this.survey = survey;
			});
		});
		this.getPagePayload = this.getPagePayload.bind(this);

		// initialize to avoid accessing null object
		this.welcomePage = new WelcomePage();
		this.termsAndConditionsPage = new TermsAndConditionsPage();
		this.thankYouPage = new ThankYouPage();
	}

	ngOnInit() {
		this.loadPageStructure();
		this.switchPage('welcome');
	}

	ngOnDestroy() {}

	loadPageStructure(): void {
		this.surveyBuilderService.getSurveyStyles(this.surveyId).subscribe(styles => {
			try {
				this.pageThemeInfo = JSON.parse(styles);
				if (this.pageThemeInfo === null) {
					this.pageThemeInfo = {};
				}
			} catch (e) {	}

			this.surveyBuilderService.getStandardViewPageStructure(this.surveyId, this.currentLanguage).subscribe(page => {
				this.allPages = page.pages;
				this.welcomePage = page.welcomePage;
				this.termsAndConditionsPage = page.termsAndConditionsPage;
				this.thankYouPage = page.surveyCompletionPage;
				this.loadedSpecialPages = true;
			});
		});
	}

	mapQuestionTypeDefinitions() {
		this.questionChooser.questionTypeDefinitions.forEach(q => {
			this.surveyPage.qTypeDefinitions.set(q.typeName, q);
		});
	}

	saveWelcomePage(showMessage: boolean) {
		this.welcomeEditor.updatePageData();
		this.surveyBuilderService.updateStandardWelcomePage(this.surveyId, this.welcomePage).subscribe(
			result => {
				if (showMessage) {
					this.alertService.showMessage(
						'Success',
						`Welcome page was saved successfully!`,
						MessageSeverity.success
					);
				}
			},
			error => {}
		);
		this.surveyBuilderService.updateSurveyStyles(this.surveyId, JSON.stringify(this.pageThemeInfo)).subscribe();
	}

	saveTAndCPage(showMessage: boolean) {
		this.privacyPolicyEditor.updatePageData();
		this.surveyBuilderService
			.updateStandardTermsAndConditionsPage(this.surveyId, this.termsAndConditionsPage)
			.subscribe(
				result => {
					if (showMessage) {
						this.alertService.showMessage(
							'Success',
							`Terms and conditions page was saved successfully!`,
							MessageSeverity.success
						);
					}
				},
				error => {}
			);
			this.surveyBuilderService.updateSurveyStyles(this.surveyId, JSON.stringify(this.pageThemeInfo)).subscribe();
	}

	saveThankYouPage(showMessage: boolean) {
		this.thankYouEditor.updatePageData();
		this.surveyBuilderService.updateStandardThankYouPage(this.surveyId, this.thankYouPage).subscribe(
			result => {
				if (showMessage) {
					this.alertService.showMessage(
						'Success',
						`Thank you page was saved successfully!`,
						MessageSeverity.success
					);
				}
			},
			error => {}
		);
		this.surveyBuilderService.updateSurveyStyles(this.surveyId, JSON.stringify(this.pageThemeInfo)).subscribe();
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

	resetThemeColors() {
		this.alertService.showDialog('Are you sure you want to reset all custom colours?', DialogType.confirm, () => {
			this.pageThemeInfo = {};
			this.surveyBuilderService.updateSurveyStyles(this.surveyId, JSON.stringify(this.pageThemeInfo)).subscribe();
		}
		);
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
						this.surveyBuilderService
							.getQuestionPartViewPageStructure(this.surveyId, qc.id, this.currentLanguage)
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
		this.currentSurveyPage = undefined;
		this.currentPage = 'welcome';
	}

	public editCurrentPage(): void {
		this.currentSurveyPageEdit = new Survey();
		Object.assign(this.currentSurveyPageEdit, this.currentSurveyPage);
		this.editPageModal.show();
	}

	savePage(): void {
		this.surveyBuilderService.updateQuestionPartViewData(this.surveyId, this.currentSurveyPageEdit).subscribe(
			result => {
				Object.assign(this.currentSurveyPage, this.currentSurveyPageEdit);
				let pageTab = this.allPages.filter(p => p.id === this.currentSurveyPageEdit.id)[0];
				pageTab.label.value = this.currentSurveyPageEdit.label.value;
				this.editPageModal.hide();
			},
			error => {
				this.alertService.showMessage(
					'Error',
					`Problem updating page!\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
					MessageSeverity.error
				);
			}
		);
	}

	deletePage(pageId: number): void {
		this.alertService.showDialog('Are you sure you want to delete the page?', DialogType.confirm, () =>
			this.continueDelete(pageId)
		);
	}

	continueDelete(pageId: number): void {
		this.surveyBuilderService.deleteStandardPage(this.surveyId, pageId).subscribe(
			result => {
				this.loadPageStructure();
				if (pageId === this.currentSurveyPage.id) {
					this.navigateToFirst();
				}
				this.alertService.showMessage('Success', `Page was removed successfully!`, MessageSeverity.success);
				this.editPageModal.hide();
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
				this.createPageModal.hide();
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
		if (dropResult.addedIndex !== dropResult.removedIndex) {
			this.alertService.showDialog(
				'Are you sure you want to move the page?',
				DialogType.confirm,
				() => this.dragResult.next(true),
				() => this.dragResult.next(false)
			);

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
						this.surveyBuilderService
							.updateStandardViewPageOrder(this.surveyId, pagesOrder, dropResult.payload.id)
							.subscribe(
								result => {},
								error => {
									this.loadPageStructure();
								}
							);
					}
					this.dragResult = undefined;
				});
			}
		}
	}

	getPagePayload(index) {
		return this.allPages[index];
	}

	toggleSidebarForPreview() {
		if (this.welcomePagePreview.value === true || this.privacyPagePreview.value === true || this.thankYouPagePreview.value === true) {
			$('.content-wrap-builder').addClass('ml-0');
			$('.content-wrap-builder').addClass('remove-left-margin');
			$('.page-controls').addClass('d-none');
			$('.content').addClass('eliminate-content-padding');
			$('.tab-pane').css('margin-top', '-50px');
			$('.tab-pane').addClass('remove-padding');
			$('.nav').addClass('hide-using-height');
			$('.sidebar-toggle-button').addClass('invisible');
			$('.nav-user').addClass('invisible');
			$('.survey-builder-header').addClass('hide-overflow');
		} else {
			$('.content-wrap-builder').removeClass('ml-0');
			$('.content-wrap-builder').removeClass('remove-left-margin');
			$('.page-controls').removeClass('d-none');
			$('.content').removeClass('eliminate-content-padding');
			$('.tab-pane').css('margin-top', 'unset');
			$('.tab-pane').removeClass('remove-padding');
			$('.nav').removeClass('hide-using-height');
			$('.sidebar-toggle-button').removeClass('invisible');
			$('.nav-user').removeClass('invisible');
			$('.survey-builder-header').removeClass('hide-overflow');
		}
	}

	/**
	 *
	 */
	public previewSurvey(event: any) {
		window.open(`/survey/${this.survey.code}/terms`, '_blank');
		event.stopPropagation();
	}
}
