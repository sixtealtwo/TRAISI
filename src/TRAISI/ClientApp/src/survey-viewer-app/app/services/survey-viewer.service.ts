import { Injectable, OnInit } from '@angular/core';
import { SurveyViewerEndpointService } from './survey-viewer-endpoint.service';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import 'rxjs/add/observable/of';
import { SurveyStart } from '../models/survey-start.model';
import { SurveyViewType } from '../models/survey-view-type.enum';
import { SurveyViewTermsModel } from '../models/survey-view-terms.model';
import { QuestionConfiguration, QuestionOption, SurveyViewer } from 'traisi-question-sdk';
import { User } from 'shared/models/user.model';
import { SurveyViewPage } from '../models/survey-view-page.model';
import { SurveyViewQuestionOption } from '../models/survey-view-question-option.model';
import { ActivatedRoute, Router, RouterEvent, ActivationStart } from '@angular/router';
import { SurveyResponderService } from './survey-responder.service';
import { SurveyViewerTheme } from '../models/survey-viewer-theme.model';
import { SurveyViewThankYouModel } from '../models/survey-view-thankyou.model';
import { SurveyWelcomeModel } from '../models/survey-welcome.model';
import { AuthService } from 'shared/services/auth.service';
import { SurveyViewScreening } from 'app/models/survey-view-screening.model';
import { find as _find } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerService implements SurveyViewer, OnInit {
	public configurationData: Subject<QuestionConfiguration[]>;
	public options: Subject<QuestionOption[]>;

	private _activeSurveyTitle: string;

	private _activeSurveyId: number;

	public activeSurveyCode: string;

	public activeSurveyId: ReplaySubject<number> = new ReplaySubject<number>(1);

	public activeSurveyTitle: ReplaySubject<string> = new ReplaySubject<string>(1);

	public navigationActiveState: Subject<boolean>;

	public pageThemeInfo: ReplaySubject<SurveyViewerTheme>;

	public pageThemeInfoJson: ReplaySubject<any>;

	public surveyCode: ReplaySubject<string>;

	public termsModel: ReplaySubject<SurveyViewTermsModel>;

	public welcomeModel: ReplaySubject<SurveyStart>;

	public isLoggedIn: ReplaySubject<boolean>;

	public screeningQuestionsModel: ReplaySubject<SurveyViewScreening>;

	private _pageThemeInfo: SurveyViewerTheme;

	private _pageThemeInfoJson: any;

	public get currentUser(): any {
		return this._authService.currentSurveyUser;
	}

	/**
	 *
	 */
	public get accessToken(): string {
		return this._authService.accessToken;
	}

	/**
	 *Creates an instance of SurveyViewerService.
	 * @param {SurveyViewerEndpointService} _surveyViewerEndpointService
	 * @param {AuthService} _authService
	 * @param {Router} router
	 * @param {SurveyResponderService} _responderService
	 * @memberof SurveyViewerService
	 */
	constructor(
		private _surveyViewerEndpointService: SurveyViewerEndpointService,
		private _authService: AuthService,
		private router: Router,
		private _responderService: SurveyResponderService
	) {
		console.log(' in inside of init ');
		this._activeSurveyId = -1;

		this.configurationData = new Subject<QuestionConfiguration[]>();
		this.options = new Subject<QuestionOption[]>();

		this.pageThemeInfo = new ReplaySubject<SurveyViewerTheme>(1);
		this.isLoggedIn = new ReplaySubject<boolean>(1);
		this.surveyCode = new ReplaySubject<string>(1);
		this.pageThemeInfoJson = new ReplaySubject<any>(1);
		this.welcomeModel = new ReplaySubject<SurveyStart>(1);
		this.termsModel = new ReplaySubject<SurveyViewTermsModel>(1);
		this.screeningQuestionsModel = new ReplaySubject<SurveyViewScreening>(1);

		let sub = this.router.events.subscribe((value: any) => {
			if (value instanceof ActivationStart) {
				let route: ActivationStart = <ActivationStart>value;

				this.activeSurveyCode = route.snapshot.paramMap.get('surveyName');
				console.log('here: ' + this.activeSurveyCode);
				this.surveyCode.next(this.activeSurveyCode);

				if (this._activeSurveyId < 0) {
					this.restoreStatus();
					sub.unsubscribe();
				}

				this.isLoggedIn.next(this._authService.isLoggedIn);
			}
		});
		this.navigationActiveState = new Subject<boolean>();

		this._pageThemeInfo = {
			sectionBackgroundColour: '',
			questionViewerColour: '',
			viewerTemplate: null
		};

		this.pageThemeInfo.next(this._pageThemeInfo);

		this.activeSurveyId.subscribe((id) => {
			this.restoreThemeInfo(id);

			this.getWelcomeView(this.activeSurveyCode).subscribe((surveyStartModel: SurveyStart) => {
				this.welcomeModel.next(surveyStartModel);
			});
			this.getSurveyViewerTermsAndConditions(id).subscribe((surveyTermsModel: SurveyViewTermsModel) => {
				this.termsModel.next(surveyTermsModel);
			});

			this.getSurveyViewerScreeningQuestions(id).subscribe((result) => {
				if (result['screeningQuestionLabels'] !== undefined) {
					let screeningModel = this.parseScreeningQuestionsModel(result);
					this.screeningQuestionsModel.next(screeningModel);
				} else {
					this.screeningQuestionsModel.next({
						questionsList: [],
						rejectionLink: result.survey.rejectionLink
					});
				}
			});
		});
	}

	//

	/**
	 *
	 *
	 * @param {number} surveyId
	 * @param {string} groupcode
	 * @returns {Observable<any>}
	 * @memberof SurveyViewerService
	 */
	public validateSurveyGroupcode(surveyId: number, groupcode: string): Observable<any> {
		return this._surveyViewerEndpointService.getValidateSurveyGroupcodeUrlEndpoint(surveyId, groupcode);
	}
	/**
	 *
	 *
	 * @private
	 * @param {*} model
	 * @returns {SurveyViewScreening}
	 * @memberof SurveyViewerService
	 */
	private parseScreeningQuestionsModel(result: any): SurveyViewScreening {
		let model = JSON.parse(result.screeningQuestionLabels[0].value);
		let questions = null;
		let header1 = null;
		let footer1 = null;
		let header2 = null;
		let footer = _find(model, (p) => p['sectionType'] === 'footer1');
		let header = _find(model, (p) => p['sectionType'] === 'header1');
		let header2i = _find(model, (p) => p['sectionType'] === 'header2');
		let screenignQuestions = _find(model, (p) => p['sectionType'] === 'screeningQuestions');
		if (footer !== undefined) {
			footer1 = this.parseJson(footer.html).html;
		}
		if (header !== undefined) {
			header1 = this.parseJson(header.html);
		}
		if (header2i !== undefined) {
			header2 = this.parseJson(header2i.html);
		}
		if (screenignQuestions !== undefined) {
			questions = this.parseJson(screenignQuestions.html);
		}
		return {
			questionsList: questions == null ? [] : (questions.questionsList as Array<string>),
			header1: header1,
			footer1: footer1,
			header2: header2i,
			rejectionLink: result.survey.rejectionLink
		};
	}

	/**
	 *
	 *
	 * @private
	 * @param {string} jsonString
	 * @returns {*}
	 * @memberof SurveyViewerService
	 */
	private parseJson(jsonString: string): any {
		try {
			return JSON.parse(jsonString);
		} catch {
			return undefined;
		}
	}

	/**
	 * Restores theme info
	 * @param surveyId
	 */
	private restoreThemeInfo(surveyId: number): void {
		this.getSurveyStyles(surveyId).subscribe((styles) => {
			try {
				this._pageThemeInfoJson = styles;
				console.log(this._pageThemeInfoJson);
				if (this._pageThemeInfoJson === null) {
					this._pageThemeInfoJson.viewerTemplate = '';
				}

				this.pageThemeInfoJson.next(this._pageThemeInfoJson);

				this.loadPageThemeInfo(this._pageThemeInfoJson);
			} catch (e) {
				console.error(e);
			}
			// this.finishedLoading = true;
		});
	}

	/**
	 * Loads page theme info
	 * @param themeInfo
	 */
	public loadPageThemeInfo(themeInfo: any): void {
		this._pageThemeInfo.sectionBackgroundColour = themeInfo['householdHeaderColour'];
		this._pageThemeInfo.questionViewerColour = themeInfo['questionViewerColour'];
		this._pageThemeInfo.viewerTemplate = JSON.parse(themeInfo['viewerTemplate']);
		this.pageThemeInfo.next(this._pageThemeInfo);
	}

	/**
	 *
	 *
	 * @memberof SurveyViewerService
	 */
	public ngOnInit(): void {}

	public isAdminUser(): boolean {
		if (!this._authService.isLoggedIn) {
			return false;
		}

		return this._authService.currentUser.roles.includes('super administrator');
	}

	/**
	 *
	 * @param surveyId
	 * @param language
	 */
	public getDefaultSurveyView(surveyId: number, language?: string): Observable<SurveyViewer> {
		return this._surveyViewerEndpointService.getDefaultSurveyViewEndpoint(surveyId, language);
	}

	/**
	 * Gets survey styles
	 * @param surveyId
	 * @returns survey styles
	 */
	public getSurveyStyles(surveyId: number): Observable<string> {
		return this._surveyViewerEndpointService.getSurveyStylesEndpoint<string>(surveyId);
	}

	/**
	 *
	 * @param surveyName
	 */
	public getWelcomeView(surveyName: string): Observable<SurveyStart> {
		return this._surveyViewerEndpointService.getSurveyViewerWelcomeViewEndpoint<SurveyStart>(surveyName);
	}

	/**
	 *
	 * @param surveyId
	 * @param page
	 * @param language
	 */
	public getSurveyViewerRespondentPageQuestions(surveyId: number, page: number, language?: string): Observable<any> {
		return this._surveyViewerEndpointService.getSurveyViewerRespondentPageQuestionsEndpoint(surveyId, page, language);
	}

	/**
	 * Retrieves Terms and Conditions Text
	 * @param surveyId
	 * @param viewType
	 * @param language
	 */
	public getSurveyViewerTermsAndConditions(
		surveyId: number,
		viewType?: SurveyViewType,
		language?: string
	): Observable<SurveyViewTermsModel> {
		return this._surveyViewerEndpointService.getSurveyViewerTermsAndConditionsEndpoint(surveyId, viewType, language);
	}

	/**
	 *
	 *
	 * @param {number} surveyId
	 * @param {string} [language]
	 * @returns {Observable<any>}
	 * @memberof SurveyViewerService
	 */
	public getSurveyViewerScreeningQuestions(surveyId: number, language?: string): Observable<any> {
		return this._surveyViewerEndpointService.getSurveyViewerScreeningQuestionsEndpoint(surveyId, language);
	}

	/**
	 * Retrieves Thank You Text
	 * @param surveyId
	 * @param viewType
	 * @param language
	 */
	public getSurveyViewerThankYou(surveyId: number, viewType?: SurveyViewType, language?: string): Observable<SurveyViewThankYouModel> {
		return this._surveyViewerEndpointService.getSurveyViewerThankYouEndpoint<SurveyViewThankYouModel>(surveyId, viewType, language);
	}

	/**
	 * Start the specified survey with the provided shortcode. This will also have a login action.
	 * This will also set the active survey id
	 * @param surveyId
	 * @param shortcode
	 */
	public surveyStart(surveyId: number, shortcode: string): Observable<{}> {
		let result = this._surveyViewerEndpointService.getSurveyViewerStartSurveyEndpoint(surveyId, shortcode);

		result.subscribe(
			(value: SurveyViewer) => {
				this._activeSurveyId = surveyId;
			},
			(error) => {}
		);
		return result;
	}

	/**
	 * Starts the survey with the specified shortcode and groupcode. The created user account will be associated with
	 * both of the shortcodes.
	 * @param {number} surveyId
	 * @param {string} shortcode
	 * @param {string} groupcode
	 * @returns {Observable<any>}
	 * @memberof SurveyViewerService
	 */
	public startSurveyWithGroupcode(surveyId: number, groupcode: string): Observable<any> {
		const result = this._surveyViewerEndpointService.getSurveyViewerStartSurveyWithGroupcodeEndpoint(surveyId, groupcode);
		result.subscribe(
			(value: SurveyViewer) => {
				this._activeSurveyId = surveyId;
			},
			(error) => {}
		);
		return result;
	}

	/**
	 * Authenticates the current user using the specified shortcode
	 * @param surveyId
	 * @param shortcode
	 */
	public surveyLogin(surveyId: number, shortcode: string, userAgent: string): Observable<User> {
		return this._authService.surveyLogin(surveyId, shortcode, '', true, userAgent);
	}

	/**
	 * Returns the question configuration for specified question.
	 * @param questionId
	 */
	public getQuestionData(questionId: number): Observable<{}> {
		return this._surveyViewerEndpointService.getSurveyViewQuestionConfigurationEndpoint(questionId);
	}

	/**
	 * Restores the state of the service if the user is currently logged in.
	 */
	private restoreStatus(): void {
		if (this._authService.isLoggedIn && this._authService.currentUser.roles.includes('respondent')) {
			this._activeSurveyId = +this._authService.currentSurveyUser.surveyId;

			this.activeSurveyId.next(this._activeSurveyId);
		} else {
		}

		if (this._activeSurveyId < 0) {
			let id$ = this._surveyViewerEndpointService.getSurveyIdFromCodeEndpoint(this.activeSurveyCode);

			id$.subscribe(
				(value) => {
					this._activeSurveyId = <number>value[Object.keys(value)[0]];
					this._activeSurveyTitle = <string>value[Object.keys(value)[1]];
					this.activeSurveyId.next(this._activeSurveyId);
					this.activeSurveyTitle.next(this._activeSurveyTitle);
					// this.authService.logout();
				},
				(error) => {
					console.log(error);
					// this.authService.logout();

					this.router.navigate(['/', this.activeSurveyCode, 'error']);
				}
			);
		} else {
		}
	}

	/**
	 *
	 * @param canNavigate
	 */
	public updateNavigationState(canNavigate: boolean): void {
		// this._navigationState = canNavigate;
		this.navigationActiveState.next(canNavigate);
		return;
	}

	/**
	 *
	 * @param surveyId
	 * @param viewType
	 */
	public getSurveyViewPages(surveyId: number, viewType: SurveyViewType = SurveyViewType.RespondentView): Observable<SurveyViewPage[]> {
		return this._surveyViewerEndpointService.getSurveyViewPagesEndpoint(surveyId, viewType);
	}

	/**
	 *
	 * @param surveyId
	 * @param questionId
	 * @param language
	 * @param query
	 */
	public getQuestionOptions(
		surveyId: number,
		questionId: number,
		language?: string,
		query?: string
	): Observable<SurveyViewQuestionOption[]> {
		return this._surveyViewerEndpointService.getSurveyViewQuestionOptionsEndpoint(surveyId, questionId, language, query);
	}
}
