import { Injectable } from "@angular/core";
import { Observable, EMPTY, forkJoin, Observer } from "rxjs";
import { SurveyBuilderClient } from "./survey-builder-client.service";
import { QuestionClient } from "./survey-builder-client.service";
import { QuestionTypeDefinition } from "../models/question-type-definition";
@Injectable()
export class SurveyBuilderEditorData {
	public surveyId: number;

	public questionTypeDefinitions: QuestionTypeDefinition[];

	public questionTypeMap: Map<string, QuestionTypeDefinition> = new Map<
		string,
		QuestionTypeDefinition
	>();

	/**
	 * Initializes required config data and related information for the survey builder
	 * editing session.
	 * @param surveyId
	 */
	public initialize(surveyId: number): Observable<void> {
		this.surveyId = surveyId;
		return Observable.create((obs: Observer<void>) => {
			forkJoin(this._questionClient.questionTypes()).subscribe({
				next: result => {
					this.questionTypeDefinitions = result[0];
					this.mapQuestionTypeDefinitions();
				},
				complete: () => {
					obs.complete();
				}
			});
		});
	}

	/**
	 *
	 */
	private mapQuestionTypeDefinitions(): void {
		this.questionTypeDefinitions.forEach(q => {
			this.questionTypeMap.set(q.typeName, q);
		});
	}

	public constructor(
		private _client: SurveyBuilderClient,
		private _questionClient: QuestionClient
	) {}
}
