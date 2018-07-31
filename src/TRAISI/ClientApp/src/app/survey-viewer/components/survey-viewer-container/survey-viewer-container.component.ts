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


@Component({
	selector: 'app-survey-viewer-container',
	templateUrl: './survey-viewer-container.component.html',
	styleUrls: ['./survey-viewer-container.component.scss'],
	entryComponents: [SurveyErrorComponent]
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

	private surveyExists: boolean = false;

	private _surveyName: string;

	@ViewChild('content', {read: ViewContainerRef}) content;

	/**
	 *
	 * @param surveyViewerService
	 * @param questionLoaderService
	 * @param route
	 */
	constructor(private surveyViewerService: SurveyViewerService,
				private questionLoaderService: QuestionLoaderService,
				private route: ActivatedRoute,
				private componentFactoryResolver: ComponentFactoryResolver
	) {

	}

	ngOnInit() {
		// loads the component into the view child slot
		// tests with the Map type currently
		/*this.questionLoaderService.getQuestionComponentFactory('Text').subscribe((value: ComponentFactory<any>) => {
            this.vc.createComponent(value);
        });

        this.questionLoaderService.getQuestionComponentFactory('Location').subscribe((value: ComponentFactory<any>) => {
            this.vcmap.createComponent(value);
        }); */

		this.sub = this.route.params.subscribe(params => {
			//this.id = +params['id']; // (+) converts string 'id' to a number

			this._surveyName = params['surveyName'];
			this.surveyViewerService.getWelcomeView(params['surveyName']).subscribe((value) => {

				console.log(value);
			}, (error) => {
				let errorResponse: HttpErrorResponse = error as HttpErrorResponse;

				this.loadErrorDisplay();
			})


			// In a real app: dispatch action to load the details here.
		});

	}

	/**
	 * Loads the survey error component in the content display.
	 */
	private loadErrorDisplay(): void {
		let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SurveyErrorComponent);
		let viewContainerRef = this.content;
		//viewContainerRef.clear();

		let componentRef = viewContainerRef.createComponent(componentFactory);
		(<SurveyErrorComponent>componentRef.instance).surveyName = this._surveyName;


		console.log(componentRef);
		console.log(this._surveyName);
		//(<SurveyErrorComponent>componentRef.instance).data = adItem.data;
	}

}
