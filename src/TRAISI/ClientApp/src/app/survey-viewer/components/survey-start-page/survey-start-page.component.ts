import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AlertService, MessageSeverity} from "../../../services/alert.service";
import {SurveyViewerService} from "../../services/survey-viewer.service";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'traisi-survey-start-page',
	templateUrl: './survey-start-page.component.html',
	styleUrls: ['./survey-start-page.component.scss']
})
export class SurveyStartPageComponent implements OnInit {

	surveyName: string;

	isLoading: boolean = false;

	shortcode: string;


	/**
	 *
	 * @param alertService
	 * @param surveyViewerService
	 * @param route
	 */
	constructor(private alertService: AlertService,
				private surveyViewerService: SurveyViewerService,
				private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.shortcode = "";
		this.route.parent.params.subscribe(params => {


			this.surveyName = params['surveyName'];

			console.log(params);

			console.log(this.route);

			console.log("start page:  " + this.surveyName);
		});
	}

	showErrorAlert(caption: string, message: string): void {
		this.alertService.showMessage(caption, message, MessageSeverity.error);
	}

	startSurvey(): void {
		console.log("start survey");
		this.isLoading = true;
		this.surveyViewerService.surveyStart(1, this.shortcode).subscribe((value) => {

				console.log(value);
			},
			(error) => {
				console.log(error);
			});
	}

}
