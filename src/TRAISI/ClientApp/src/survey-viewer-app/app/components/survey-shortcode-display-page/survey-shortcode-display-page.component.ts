
import { Component, Input, OnInit, ChangeDetectorRef, Inject, ElementRef } from '@angular/core';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewerNavigationService } from '../../services/survey-viewer-navigation/survey-viewer-navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SurveyStart } from 'app/models/survey-start.model';
import { SurveyStartPageComponent } from '../survey-start-page/survey-start-page.component';

@Component({
	selector: 'traisi-survey-shortcode-display-page',
	templateUrl: './survey-shortcode-display-page.component.html',
	styleUrls: ['./survey-shortcode-display-page.component.scss']
})
export class SurveyShortcodeDisplayPageComponent implements OnInit {

	public startPageComponent: SurveyStartPageComponent;
	public ngOnInit(): void {
		throw new Error('Method not implemented.');
	}

}
