import {
	Component,
	ComponentFactory,
	ComponentFactoryResolver,
	OnInit,
	TemplateRef,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import {SurveyViewerService} from "../../services/survey-viewer.service";
import {QuestionLoaderService} from "../../services/question-loader.service";
import {ActivatedRoute} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {SurveyErrorComponent} from "../survey-error/survey-error.component";
import {NgTemplateOutlet} from "@angular/common";
import {SurveyWelcomePageComponent} from "../survey-welcome-page/survey-welcome-page.component";


@Component({
	selector: 'app-survey-viewer-container',
	templateUrl: './survey-viewer-container.component.html',
	styleUrls: ['./survey-viewer-container.component.scss'],
	entryComponents: [SurveyErrorComponent,SurveyWelcomePageComponent]
})
export class SurveyViewerContainerComponent implements OnInit {
	get surveyName(): string {
		return this._surveyName;
	}

	set surveyName(value: string) {
		this._surveyName = value;
	}


	private sub: any;

	private welcomeView: any;



	private _surveyName: string;

	@ViewChild('content', {read: ViewContainerRef}) content;


	/**
	 *
	 * @param surveyViewerService
	 * @param questionLoaderService
	 * @param route
	 * @param componentFactoryResolver
	 */
	constructor(private surveyViewerService: SurveyViewerService,
				private questionLoaderService: QuestionLoaderService,
				private route: ActivatedRoute,
				private componentFactoryResolver: ComponentFactoryResolver
	) {

	}

	ngOnInit() {


		this.sub = this.route.params.subscribe(params => {


			this._surveyName = params['surveyName'];

			//get the welcome view
			this.surveyViewerService.getWelcomeView(params['surveyName']).subscribe((value) => {

				console.log("success");
				this.displaySurveyWelcomePageComponent();
			}, (error) => {

				// show the error component if there is an error loading the survey
				this.displaySurveyErrorComponent();
			})

		});

	}

	/**
	 * Loads the survey error component in the content display.
	 */
	private displaySurveyErrorComponent(): void {
		let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SurveyErrorComponent);
		let viewContainerRef = this.content;
		//viewContainerRef.clear();

		let componentRef = viewContainerRef.createComponent(componentFactory);
		(<SurveyErrorComponent>componentRef.instance).surveyName = this._surveyName;

	}


	/**
	 *
	 */
	private displaySurveyWelcomePageComponent(): void {
		let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SurveyWelcomePageComponent);
		let viewContainerRef = this.content;
		//viewContainerRef.clear();

		let componentRef = viewContainerRef.createComponent(componentFactory);
		(<SurveyWelcomePageComponent>componentRef.instance).surveyName = this._surveyName;
	}

}
