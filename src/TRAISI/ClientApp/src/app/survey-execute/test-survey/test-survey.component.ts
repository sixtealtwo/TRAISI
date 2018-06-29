import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Survey } from '../../models/survey.model';
import { SurveyService } from '../../services/survey.service';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { ConfigurationService } from '../../services/configuration.service';
import { ShortCode } from '../../models/short-code.model';
import { CodeGenerator } from '../../models/code-generator.model';
import { SurveyExecuteService } from '../../services/survey-execute.service';

@Component({
	selector: 'app-test-survey',
	templateUrl: './test-survey.component.html',
	styleUrls: ['./test-survey.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TestSurveyComponent implements OnInit {
	public surveyId: number;
	public survey: Survey;
	public codeGenParams: CodeGenerator;

	public codeProperties = 'pattern';
	public generateType: string = 'numberCodes';
	public codeNumber: number = 0;
	public baseUrl: string = '';

	public individualCodeBeingViewed: boolean = true;
	public indivCodeRows: ShortCode[];
	public indivCodeColumns: any[] = [];
	public totalIndivCodes: number = 100;
	public currentIndivPage: number = 1;

	config: DropzoneConfigInterface = {
		// Change this to your upload POST address:
		url: 'https://traisi.dmg.utoronto.ca',
		maxFilesize: 50,
		maxFiles: 1,
		acceptedFiles: '.csv',
		addRemoveLinks: true
	};

	constructor(
		private surveyService: SurveyService,
		private surveyExecuteService: SurveyExecuteService,
		private route: ActivatedRoute,
		private configurationService: ConfigurationService
	) {
		this.survey = new Survey();
		this.codeGenParams = new CodeGenerator();
		this.baseUrl = configurationService.baseUrl;
		this.route.params.subscribe(params => {
			this.surveyId = params['id'];
			this.codeGenParams.surveyId = this.surveyId;
			this.codeGenParams.isGroupCode = false;
			this.codeGenParams.isTest = true;
		});
	}

	ngOnInit() {
		this.indivCodeColumns = [
			{
				width: 30,
				sortable: false,
				canAutoResize: false,
				draggable: false,
				resizable: false,
				headerCheckboxable: false,
				checkboxable: true
			},
			{
				prop: 'index',
				name: '#',
				width: 30,
				canAutoResize: false
			},
			{
				prop: 'code',
				name: 'code',
				minWidth: 90,
				flexGrow: 60,
				sortable: false
			}
		];

		this.survey = this.surveyService.getLastSurvey();
		if (!this.survey || this.survey == null) {
			this.survey = new Survey();
			this.surveyService.getSurvey(this.surveyId).subscribe(
				result => {
					this.survey = result;
				},
				error => {}
			);
		}
	}

	setIndivPage(pageInfo: any) {}

	generateIndivCodes() {
		this.codeGenParams.isGroupCode = false;
		this.codeGenParams.usePattern = this.codeProperties === 'pattern';
	}
}
