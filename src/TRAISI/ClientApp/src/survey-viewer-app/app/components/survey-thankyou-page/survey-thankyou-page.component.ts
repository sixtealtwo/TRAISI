import { Component, OnInit, ViewChild, ViewContainerRef, Inject, ViewEncapsulation, ElementRef } from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyStart } from '../../models/survey-start.model';
import { User } from 'shared/models/user.model';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'traisi-survey-thankyou-page',
	templateUrl: './survey-thankyou-page.component.html',
	styleUrls: ['./survey-thankyou-page.component.scss'],
	encapsulation: ViewEncapsulation.None

})
export class SurveyThankYouPageComponent implements OnInit {


	public ngOnInit(): void {

	}

}
