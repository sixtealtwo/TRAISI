import {Routes} from "@angular/router";
import {SurveyViewerContainerComponent} from "../../components/survey-viewer-container/survey-viewer-container.component";
import {AppComponent} from "../../app.component";
import {SurveyStartPageComponent} from "../../components/survey-start-page/survey-start-page.component";

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'start',
		pathMatch: 'full'

	},
	{
		path: 'start',
		component: SurveyStartPageComponent,

	}

];

export default routes;
