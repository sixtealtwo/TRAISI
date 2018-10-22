import { Injectable, OnInit } from '@angular/core';
import { SurveyViewerEndpointService } from './survey-viewer-endpoint.service';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import 'rxjs/add/observable/of';
import { SurveyStart } from '../models/survey-start.model';
import { SurveyViewType } from '../models/survey-view-type.enum';
import { SurveyViewTermsModel } from '../models/survey-view-terms.model';
import { QuestionConfiguration, QuestionOption, SurveyViewer } from 'traisi-question-sdk';
import { AuthService } from '../../../shared/services/index';
import { User } from 'shared/models/user.model';
import { SurveyViewPage } from '../models/survey-view-page.model';
import { SurveyViewQuestionOption } from '../models/survey-view-question-option.model';
import { ActivatedRoute, Router, RouterEvent, ActivationStart } from '@angular/router';
import { SurveyResponderService } from './survey-responder.service';
import { SurveyViewerTheme } from '../models/survey-viewer-theme.model';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerService implements SurveyViewer, OnInit {
	public configurationData: Subject<QuestionConfiguration[]>;
	public options: Subject<QuestionOption[]>;

	public activeSurveyTitle: string;

	private _activeSurveyId: number;

	public activeSurveyCode: string;

	public activeSurveyId: ReplaySubject<number> = new ReplaySubject<number>(1);

	private _navigationState: boolean = true;

	public navigationActiveState: Subject<boolean>;

	public pageThemeInfo: ReplaySubject<SurveyViewerTheme>;

	public pageThemeInfoJson: ReplaySubject<any>;

	private _pageThemeInfo: SurveyViewerTheme;

	private _pageThemeInfoJson: any;

	/**
	 *
	 */
	public get accessToken(): string {
		return this.authService.accessToken;
	}

	/**
	 *Creates an instance of SurveyViewerService.
	 * @param {SurveyViewerEndpointService} _surveyViewerEndpointService
	 * @param {AuthService} authService
	 * @param {Router} router
	 * @param {SurveyResponderService} _responderService
	 * @memberof SurveyViewerService
	 */
	constructor(
		private _surveyViewerEndpointService: SurveyViewerEndpointService,
		private authService: AuthService,
		private router: Router,
		private _responderService: SurveyResponderService
	) {
		this._activeSurveyId = -1;

		this.configurationData = new Subject<QuestionConfiguration[]>();
		this.options = new Subject<QuestionOption[]>();

		this.pageThemeInfo = new ReplaySubject<SurveyViewerTheme>(1);

		this.pageThemeInfoJson = new ReplaySubject<any>(1);

		let sub = this.router.events.subscribe((value: any) => {
			if (value instanceof ActivationStart) {
				let route: ActivationStart = <ActivationStart>value;

				this.activeSurveyCode = route.snapshot.paramMap.get('surveyName');

				if (this._activeSurveyId < 0) {
					this.restoreStatus();
					sub.unsubscribe();
				}
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
		});
	}

	/**
	 * Restores theme info
	 * @param surveyId
	 */
	private restoreThemeInfo(surveyId: number): void {
		this.getSurveyStyles(surveyId).subscribe((styles) => {
			try {
				this._pageThemeInfoJson = JSON.parse(styles);
				if (this._pageThemeInfoJson === null) {
					this._pageThemeInfoJson.viewerTemplate = '';
				}
				console.log(this._pageThemeInfoJson);
				this.pageThemeInfoJson.next(this._pageThemeInfoJson);

				this.loadPageThemeInfo(this._pageThemeInfoJson);
			} catch (e) {}
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
		if (!this.authService.isLoggedIn) {
			return false;
		}

		return this.authService.currentUser.roles.includes('super administrator');
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
	 * Authenticates the current user using the specified shortcode
	 * @param surveyId
	 * @param shortcode
	 */
	public surveyLogin(surveyId: number, shortcode: string): Observable<User> {
		return this.authService.login(`${surveyId}_${shortcode}`, shortcode, true);
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
		if (this.authService.isLoggedIn && this.authService.currentUser.roles.includes('respondent')) {
			this._activeSurveyId = +this.authService.currentSurveyUser.surveyId;

			this.activeSurveyId.next(this._activeSurveyId);
		}

		if (this._activeSurveyId < 0 && this.authService.isLoggedIn) {
			this._surveyViewerEndpointService.getSurveyIdFromCodeEndpoint(this.activeSurveyCode).subscribe(
				(value) => {
					this._activeSurveyId = <number>value;
					this.activeSurveyId.next(this._activeSurveyId);
				},
				(error) => {
					this.authService.logout();

					this.router.navigate(['/', this.activeSurveyCode, 'error']);
				}
			);
		}
	}

	/**
	 *
	 * @param canNavigate
	 */
	public updateNavigationState(canNavigate: boolean): void {
		this._navigationState = canNavigate;
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
