import { OnInit, Component, OnDestroy, ViewChild, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';
import { QueryBuilderConfig, QueryBuilderClassNames, QueryBuilderComponent, RuleSet } from 'angular2-query-builder';
import { classNames } from './query-config';
import { SurveyBuilderEditorData } from '../services/survey-builder-editor-data.service';
import { QuestionPartView } from '../models/question-part-view.model';
import { Observable, concat, of, Subject } from 'rxjs';
import { QuestionOptionValueViewModel, SurveyBuilderClient } from '../services/survey-builder-client.service';
import { QuestionResponseType } from '../models/question-response-type.enum';
import { tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
@Component({
	selector: 'traisi-survey-logic-control',
	templateUrl: './survey-logic-control.component.html',
	styleUrls: ['./survey-logic-control.component.scss'],
	providers: [],
	animations: [],
	encapsulation: ViewEncapsulation.None,
})
export class SurveyLogicControlComponent implements OnInit, OnDestroy {
	public classNames: QueryBuilderClassNames;
	public config: QueryBuilderConfig;

	@ViewChildren('queryBuilder')
	public queryBuilder: QueryList<QueryBuilderComponent>;

	public options$: Observable<QuestionOptionValueViewModel[]>;

	public queryModels: Array<RuleSet & { message: string; id: number }> = [];

	public modelChanged$: Subject<RuleSet & { message: string; id: number }> = new Subject<
		RuleSet & { message: string; id: number }
	>();

	public optionsMap: Map<string, Observable<QuestionOptionValueViewModel[]>> = new Map<
		string,
		Observable<QuestionOptionValueViewModel[]>
	>();

	/**
	 *Creates an instance of SurveyLogicControlComponent.
	 * @param {SurveyBuilderEditorData} _editor
	 */
	public constructor(private _editor: SurveyBuilderEditorData, private _builder: SurveyBuilderClient) {
		this.config = { fields: { tmp: { name: 'temp', type: 'number' } } };
		this.classNames = classNames;
	}

	/**
	 *
	 * @param $event
	 * @param index
	 */
	public onModelChange($event: RuleSet & { message: string; id: number }, index: number): void {
		this.queryModels[index] = $event;
		this.modelChanged$.next($event);
	}

	public onValidationMessageModelChange($event: string, index: number): void {
		this.queryModels[index].message = $event;
		this.modelChanged$.next(this.queryModels[index]);
	}

	public addLogic(): void {
		let logic = { condition: 'and', rules: [], message: '', id: 0 };
		this.queryModels.push(logic);
		this._builder.addSurveyLogic(this._editor.surveyId, logic).subscribe((v) => {
			logic.id = v;
		});
		console.log(this.queryModels);
	}

	/**
	 *
	 * @param i
	 */
	public deleteLogic(i: number): void {
		this._builder.deleteSurveyLogic(this._editor.surveyId, this.queryModels[i].id).subscribe((v) => {
			this.queryModels.splice(i, 1);
		});
	}

	public ngOnInit(): void {
		// load survey state
		this._editor.questionListChanged.subscribe((questionList) => {
			this.buildConfig(questionList);
		});

		// only send an update to the server every 500 ms of a model change
		this.modelChanged$.pipe(debounceTime(500)).subscribe((model) => {
			this._builder.updateSurveyLogic(this._editor.surveyId, model).subscribe((v) => {
				console.log(model);
			});
		});
	}
	ngOnDestroy(): void {}

	/**
	 * @param {string} questionName
	 * @returns {Observable<QuestionOptionValueViewModel[]>}
	 */
	public getQuestionOptions(questionName: string): Observable<QuestionOptionValueViewModel[]> {
		return this._editor.getQuestionOptions(
			this._editor.questionList.find((q) => q.questionPart.name == questionName)
		);
	}

	/**
	 * Maps question name to a query for of its option values
	 * @param questionName
	 */
	private initQuestionOptionsQuery(questionList: Array<QuestionPartView>, questionId: string): void {
		this.optionsMap.set(
			questionId,
			concat(
				of([]),
				this._editor
					.getQuestionOptions(questionList.find((q) => q.questionPart.id === Number(questionId)))
					.pipe(
						distinctUntilChanged(),
						tap((v) => {})
					)
			)
		);
	}

	/**
	 *
	 * @param questionList
	 */
	private buildConfig(questionList: Array<QuestionPartView>): void {
		this.config = { fields: { tmp: { name: 'temp', type: 'number' } } };
		for (let question of questionList) {
			let responseType = this._editor.questionTypeMap.get(question.questionPart.questionType).responseType;
			if (responseType == QuestionResponseType.Integer) {
				this.config.fields[question.questionPart.id] = {
					name: question.questionPart.name,
					type: 'number',
				};
			} else if (
				responseType == QuestionResponseType.OptionSelect ||
				responseType == QuestionResponseType.OptionList
			) {
				this.initQuestionOptionsQuery(questionList, String(question.questionPart.id));
				this.config.fields[question.questionPart.id] = {
					name: question.questionPart.name,
					type: 'option',
					operators: ['Any Of', 'All Of', 'None Of'],
				};
			} else {
				this.config.fields[question.questionPart.id] = {
					name: question.questionPart.name,
					type: 'string',
				};
			}
		}

		console.log(this.optionsMap);
	}
}
