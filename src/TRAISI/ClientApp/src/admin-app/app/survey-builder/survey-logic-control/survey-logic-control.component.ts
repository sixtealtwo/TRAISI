import { OnInit, Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { QueryBuilderConfig, QueryBuilderClassNames, QueryBuilderComponent, RuleSet } from 'angular2-query-builder';
import { classNames } from './query-config';
import { SurveyBuilderEditorData } from '../services/survey-builder-editor-data.service';
import { QuestionPartView } from '../models/question-part-view.model';
import { Observable, concat, of } from 'rxjs';
import { QuestionOptionValueViewModel } from '../services/survey-builder-client.service';
import { QuestionResponseType } from '../models/question-response-type.enum';
import { tap, distinctUntilChanged } from 'rxjs/operators';
@Component({
	selector: 'traisi-survey-logic-control',
	templateUrl: './survey-logic-control.component.html',
	styleUrls: ['./survey-logic-control.component.scss'],
	providers: [],
    animations: [],
    encapsulation: ViewEncapsulation.None
})
export class SurveyLogicControlComponent implements OnInit, OnDestroy {
	public classNames: QueryBuilderClassNames;
	public config: QueryBuilderConfig;
	public model: RuleSet = { condition: 'and', rules: [] };

	@ViewChild('queryBuilder')
	public queryBuilder: QueryBuilderComponent;

	public options$: Observable<QuestionOptionValueViewModel[]>;

	/**
	 *Creates an instance of SurveyLogicControlComponent.
	 * @param {SurveyBuilderEditorData} _editor
	 */
	public constructor(private _editor: SurveyBuilderEditorData) {
		this.config = { fields: { tmp: { name: 'temp', type: 'number' } } };
		this.classNames = classNames;
	}

	ngOnInit(): void {
		// load survey state
		this._editor.questionListChanged.subscribe((questionList) => {
			this.buildConfig(questionList);
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
     * 
     * @param questionList 
     */
	private buildConfig(questionList: Array<QuestionPartView>): void {
		this.options$ = concat(
			of([]),
			this._editor.getQuestionOptions(
				this._editor.questionList.find((q) => q.questionPart.name === 'Age range')
			).pipe(
                distinctUntilChanged(),
                tap(v => {
                })
            )
		);

		this.config = { fields: { tmp:{ name: 'temp', type: 'number' }} };
		for (let question of questionList) {
			let responseType = this._editor.questionTypeMap.get(question.questionPart.questionType).responseType;
			if (responseType == QuestionResponseType.Integer) {
				this.config.fields[question.questionPart.name] = {
					name: question.questionPart.name,
					type: 'number',
				};
			} else if (
				responseType == QuestionResponseType.OptionSelect ||
				responseType == QuestionResponseType.OptionList
			) {
				this.config.fields[question.questionPart.name] = {
					name: question.questionPart.name,
					type: 'option',
					operators: ['Any Of', 'All Of', 'None Of'],
				};
			} else {
				this.config.fields[question.questionPart.name] = {
					name: question.questionPart.name,
					type: 'string',
				};
			}
		}
	}
}
