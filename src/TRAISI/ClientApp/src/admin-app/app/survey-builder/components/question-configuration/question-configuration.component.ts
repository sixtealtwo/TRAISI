import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	ViewChildren,
	ViewContainerRef,
	QueryList,
	ComponentFactoryResolver,
	ChangeDetectorRef,
	AfterViewInit,
	ViewChild,
	ViewEncapsulation,
	Input
} from '@angular/core';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { QuestionPartView } from '../../models/question-part-view.model';
import { AuthService } from '../../../../../shared/services/auth.service';
import { ConfigurationService } from '../../../../../shared/services/configuration.service';
import { CheckboxComponent } from './checkbox-field/checkbox.component';
import { QuestionConfigurationDefinition } from '../../models/question-configuration-definition.model';
import { DateInputComponent } from './date-input-field/date-input.component';
import { DropdownListComponent } from './dropdown-list-field/dropdown-list.component';
import { MultiSelectComponent } from './multi-select-field/multi-select.component';
import { TextboxComponent } from './textbox-field/textbox.component';
import { TextAreaComponent } from './textarea-field/textarea.component';
import { NumericTextboxComponent } from './numeric-textbox-field/numeric-textbox.component';
import { SliderComponent } from './slider-field/slider.component';
import { SwitchComponent } from './switch-field/switch.component';
import { TimeInputComponent } from './time-input-field/time-input.component';
import { LocationFieldComponent } from './location-field/location.component';
import { RadioComponent } from './radio-field/radio.component';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { QuestionConfigurationValue } from '../../models/question-configuration-value.model';
import { TreeviewItem, TreeviewI18nDefault, TreeviewSelection } from 'ngx-treeview';
import { QuestionConditional } from '../../models/question-conditional.model';
import { QuestionOptionConditional } from '../../models/question-option-conditional.model';
import { QuestionConditionalsComponent } from './question-conditionals/question-conditionals.component';
import Quill from 'quill';
import { DropdownTreeviewSelectComponent } from '../../../shared/dropdown-treeview-select/dropdown-treeview-select.component';
import { DropdownTreeviewSelectI18n } from '../../../shared/dropdown-treeview-select/dropdown-treeview-select-i18n';
import { QuestionOptionValue } from '../../models/question-option-value.model';

// override p with div tag
const Parchment = Quill.import('parchment');
let Block = Parchment.query('block');

class NewBlock extends Block {}
NewBlock.tagName = 'DIV';
Quill.register(NewBlock, true);

@Component({
	selector: 'app-question-configuration',
	templateUrl: './question-configuration.component.html',
	styleUrls: ['./question-configuration.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class QuestionConfigurationComponent implements OnInit, AfterViewInit {
	public surveyId: number;

	public questionType: QuestionTypeDefinition;
	public questionBeingEdited: QuestionPartView;
	public editing: boolean = false;

	public newQuestion: boolean = true;

	public configurations: QuestionConfigurationDefinition[] = [];

	public configurationValues: QuestionConfigurationValue[] = [];

	public sourceQuestionConditionals: QuestionConditional[] = [];

	public sourceQuestionOptionConditionals: QuestionOptionConditional[] = [];

	public questionOptions: Map<string, QuestionOptionValue[]> = new Map<string, QuestionOptionValue[]>();

	public childrenComponents = [];

	public fullStructure: TreeviewItem[] = [];
	public questionOptionsAfter: TreeviewItem[] = [];
	public questionsBefore: TreeviewItem[] = [];
	public repeatSourcesBefore: TreeviewItem[] = [];
	public thisQuestion: TreeviewItem[] = [];
	public householdExistsBefore: boolean = false;

	public treedropdownSingleConfig = {
		hasAllCheckBox: false,
		hasFilter: false,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500
	};

	public cursorPosition: number;
	public catiCursorPosition: number;

	public conditionalsLoaded: boolean = false;
	public isSaving: boolean = false;

	public quillQuestionTextModules = {
		toolbar: [
			['bold', 'italic', 'underline'], // toggled buttons
			[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			[{ color: [] }], // dropdown with defaults from theme
			[{ align: [] }],
			['clean'] // remove formatting button
		]
	};

	@Input()
	public qTypeDefinitions: Map<string, QuestionTypeDefinition> = new Map<string, QuestionTypeDefinition>();

	@Input()
	public language: string;

	@Output()
	public configResult = new EventEmitter<string>();

	@ViewChild('conditionals')
	public conditionalsComponent: QuestionConditionalsComponent;

	@ViewChild('pipeTreeSelect')
	public pipeTreeSelect: DropdownTreeviewSelectComponent;

	@ViewChild('catiPipeTreeSelect')
	public catiPipeTreeSelect: DropdownTreeviewSelectComponent;

	@ViewChild('repeatTreeSelect')
	public repeatTreeSelect: DropdownTreeviewSelectComponent;

	private questionQuillEditor: any;
	private catiQuestionQuillEditor: any;

	@ViewChildren('dynamic', { read: ViewContainerRef })
	public configTargets: QueryList<ViewContainerRef>;

	constructor(
		private builderService: SurveyBuilderService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private cDRef: ChangeDetectorRef
	) {}

	public ngOnInit() {}

	public pipeDropdown(e: TreeviewSelection): string {
		let selected = (<DropdownTreeviewSelectI18n>this.pipeTreeSelect.i18n).selectedItem;
		return selected !== undefined && selected !== null ? selected.text : 'Pipe Question';
	}

	public catiPipeDropdown(e: TreeviewSelection): string {
		let selected = (<DropdownTreeviewSelectI18n>this.catiPipeTreeSelect.i18n).selectedItem;
		return selected !== undefined && selected !== null ? selected.text : 'Pipe Question';
	}

	public repeatDropdown(e: TreeviewSelection): string {
		let selected = (<DropdownTreeviewSelectI18n>this.repeatTreeSelect.i18n).selectedItem;
		return selected !== undefined && selected !== null ? selected.text : 'Select Question';
	}

	public ngAfterViewInit() {
		// this.updateAdvancedParams();
		setTimeout(() => {
			this.configTargets.changes.subscribe(item => {
				this.updateAdvancedParams();
			});
		}, 200);
	}

	public questiontextEditorCreated(quillInstance: any) {
		this.questionQuillEditor = quillInstance;
	}

	public catiQuestiontextEditorCreated(quillInstance: any) {
		this.catiQuestionQuillEditor = quillInstance;
	}

	public updateAdvancedParams() {
		const paramComponents = this.parameterComponents();
		this.childrenComponents = [];
		if (this.configurations.length > 0) {
			this.builderService
				.getQuestionPartConfigurations(this.surveyId, this.questionBeingEdited.questionPart.id)
				.subscribe(configurationValues => {
					for (let i = 0; i < this.configTargets.toArray().length; i++) {
						let conf = this.configurations[i];
						let component = paramComponents[conf.builderType];

						if (component) {
							let target = this.configTargets.toArray()[i];
							target.clear();
							let paramComponent = this.componentFactoryResolver.resolveComponentFactory(component);

							let cmpRef: any = target.createComponent(paramComponent);

							cmpRef.instance.id = i;
							cmpRef.instance.questionConfiguration = conf;
							if (configurationValues.has(conf.name)) {
								cmpRef.instance.processPriorValue(configurationValues.get(conf.name));
							}
							this.childrenComponents.push(cmpRef);
						}
					}
				});
		}
		// this.cDRef.detectChanges();
	}

	public parameterComponents() {
		let widgetComponents = {
			Checkbox: CheckboxComponent,
			Date: DateInputComponent,
			SingleSelect: DropdownListComponent,
			MultiSelect: MultiSelectComponent,
			Text: TextboxComponent,
			TextArea: TextAreaComponent,
			NumericText: NumericTextboxComponent,
			Slider: SliderComponent,
			Switch: SwitchComponent,
			Time: TimeInputComponent,
			Location: LocationFieldComponent,
			Radio: RadioComponent
		};

		return widgetComponents;
	}

	public advancedConfig() {
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 0);
	}

	public saveConfiguration(): void {
		this.configurationValues = [];
		this.childrenComponents.forEach(compRef => {
			this.configurationValues.push(
				new QuestionConfigurationValue(compRef.instance.questionConfiguration.name, compRef.instance.getValue())
			);
		});
		this.isSaving = true;
		this.configResult.emit('save');
	}

	public getUpdatedConditionals(): [QuestionConditional[], QuestionOptionConditional[]] {
		return this.conditionalsComponent.getUpdatedConditionals();
	}

	public cancel() {
		this.configResult.emit('cancel');
	}

	public delete() {
		this.configResult.emit('delete');
	}

	public pipeQuestion() {
		let pipeQSelected = (<DropdownTreeviewSelectI18n>this.pipeTreeSelect.i18n).selectedItem;
		if (pipeQSelected) {
			let currentCursorPosition = this.cursorPosition;
			if (currentCursorPosition === undefined) {
				currentCursorPosition = this.questionQuillEditor.getLength() - 1;
			}
			this.questionQuillEditor.insertText(currentCursorPosition, `{{ ${pipeQSelected.text} }}`);
			this.cursorPosition += pipeQSelected.text.length + 6;
			this.questionQuillEditor.setSelection(this.cursorPosition);
			this.questionQuillEditor.focus();
			(<DropdownTreeviewSelectI18n>this.pipeTreeSelect.i18n).selectedItem = undefined;
			this.pipeTreeSelect.value = undefined;
		}
	}

	public pipeCatiQuestion() {
		let pipeQSelected = (<DropdownTreeviewSelectI18n>this.catiPipeTreeSelect.i18n).selectedItem;
		if (pipeQSelected) {
			let currentCursorPosition = this.catiCursorPosition;
			if (currentCursorPosition === undefined) {
				currentCursorPosition = this.catiQuestionQuillEditor.getLength() - 1;
			}
			this.catiQuestionQuillEditor.insertText(currentCursorPosition, `{{ ${pipeQSelected.text} }}`);
			this.catiCursorPosition += pipeQSelected.text.length + 6;
			this.catiQuestionQuillEditor.setSelection(this.catiCursorPosition);
			this.catiQuestionQuillEditor.focus();
			(<DropdownTreeviewSelectI18n>this.catiPipeTreeSelect.i18n).selectedItem = undefined;
			this.catiPipeTreeSelect.value = undefined;
		}
	}

	public repeatQuestion(enabled: boolean) {
		if (!enabled) {
			this.questionBeingEdited.repeatSourceQuestionName = null;
		} else {
			let repeatQSelected = (<DropdownTreeviewSelectI18n>this.repeatTreeSelect.i18n).selectedItem;
			if (repeatQSelected) {
				this.questionBeingEdited.repeatSourceQuestionName = repeatQSelected.value;
			} else {
				this.questionBeingEdited.repeatSourceQuestionName = null;
			}
		}
	}

	public recordCursor(selection: any) {
		let newPosition = selection.range;
		if (newPosition !== null) {
			this.cursorPosition = newPosition.index;
		}
	}

	public recordCatiCursor(selection: any) {
		let newPosition = selection.range;
		if (newPosition !== null) {
			this.catiCursorPosition = newPosition.index;
		}
	}

	public updateCursorOnType() {
		let selection = this.questionQuillEditor.getSelection();
		if (selection) {
			this.cursorPosition = this.questionQuillEditor.getSelection().index;
		}
	}

	public updateCatiCursorOnType() {
		let selection = this.catiQuestionQuillEditor.getSelection();
		if (selection) {
			this.catiCursorPosition = this.catiQuestionQuillEditor.getSelection().index;
		}
	}

	public processConfigurations() {
		this.configurations = Object.values(this.questionType.questionConfigurations);

		this.processQuestionTree();
		if (this.questionType.typeName !== 'Survey Part') {
			this.loadPastConditionals();
		}
		this.repeatTreeSelect.value = this.questionBeingEdited.repeatSourceQuestionName;
		setTimeout(() => {
			if (this.pipeTreeSelect) {
				this.pipeTreeSelect.i18n.getText = e => this.pipeDropdown(e);
			}
			if (this.catiPipeTreeSelect) {
				this.catiPipeTreeSelect.i18n.getText = e => this.pipeDropdown(e);
			}
			if (this.repeatTreeSelect) {
				this.repeatTreeSelect.i18n.getText = e => this.repeatDropdown(e);
			}
		}, 0);

		this.questionOptions = new Map<string, QuestionOptionValue[]>();

		if (this.questionBeingEdited.questionPart) {
			let qOptions = this.qTypeDefinitions.get(this.questionBeingEdited.questionPart.questionType).questionOptions;
			Object.keys(qOptions).forEach(q => {
				this.questionOptions.set(q, []);
			});

			this.builderService.getQuestionPartOptions(this.surveyId, this.questionBeingEdited.questionPart.id, this.language).subscribe(
				options => {
					console.log(options);
					if (options !== null) {
						options.forEach(option => {
							this.questionOptions.get(option.name).push(option);
						});
					}
				},
				error => {}
			);
		}
	}

	private loadPastConditionals() {
		this.builderService.getQuestionPartConditionals(this.surveyId, this.questionBeingEdited.questionPart.id).subscribe(conditionals => {
			this.builderService
				.getQuestionPartOptionConditionals(this.surveyId, this.questionBeingEdited.questionPart.id)
				.subscribe(oConditionals => {
					this.sourceQuestionConditionals = conditionals.filter(
						c => c.sourceQuestionId === this.questionBeingEdited.questionPart.id
					);
					this.sourceQuestionOptionConditionals = oConditionals.filter(
						c => c.sourceQuestionId === this.questionBeingEdited.questionPart.id
					);
					this.conditionalsLoaded = true;
				});
		});
	}

	private getQuestionResponseType(typeValue: string): string {
		let questionType = typeValue.split('~')[1];
		return this.qTypeDefinitions.get(questionType).responseType;
	}

	private getQuestionType(typeValue: string): string {
		let questionType = typeValue.split('~')[1];
		return this.qTypeDefinitions.get(questionType).typeName;
	}

	private allowAsRepeatSource(typeValue: string): boolean {
		let responseType = this.getQuestionResponseType(typeValue);
		if (responseType === 'Integer') {
			return true;
		} else {
			return false;
		}
	}

	private isHouseholdSource(typeValue: string): boolean {
		let questionType = this.getQuestionType(typeValue);
		if (questionType === 'household') {
			return true;
		} else {
			return false;
		}
	}

	/**
	 *
	 */
	public allowConditionals(): boolean {
		if (this.questionType.typeName === 'Survey Part' || this.questionType.responseType === 'None') {
			return false;
		} else if (this.questionType.responseType === 'OptionSelect' || this.questionType.responseType === 'OptionList') {

			if (this.thisQuestion[0] && this.thisQuestion[0].children) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}

	// private getOptionResponseType(questionTypeValue: string, optionTypeValue: string): string {}

	private processQuestionTree() {
		this.questionsBefore = [];
		this.questionOptionsAfter = [];
		this.repeatSourcesBefore = [];
		this.householdExistsBefore = false;
		this.thisQuestion = [];
		let questionHitThisPage: boolean = false;
		let questionBreak = '';
		if (this.questionType.typeName === 'Survey Part' && this.questionBeingEdited.questionPartViewChildren.length > 0) {
			questionBreak = `question~${this.questionBeingEdited.questionPartViewChildren[0].questionPart.questionType}~${
				this.questionBeingEdited.questionPartViewChildren[0].questionPart.id
			}`;
		} else if (this.questionType.typeName !== 'Survey Part') {
			questionBreak = `question~${this.questionType.typeName}~${this.questionBeingEdited.questionPart.id}`;
		}

		// if (questionBreak !== '') {

		this.fullStructure.forEach(treeElement => {
			let page = {
				value: treeElement.value,
				text: treeElement.text,
				checked: false,
				children: []
			};

			if (treeElement.children) {
				let sectionName = '';
				if (this.questionType.typeName === 'Survey Part') {
					sectionName = `part~${this.questionBeingEdited.id}`;
				}
				let { pageReturn, questionHitReturn } = this.processQuestionPageIntoTree(
					page,
					treeElement,
					questionHitThisPage,
					questionBreak,
					sectionName
				);
				page = pageReturn;
				questionHitThisPage = questionHitReturn;
			}
			if (questionHitThisPage && page.children.length > 0) {
				this.questionOptionsAfter.push(new TreeviewItem(page));
			} else if (page.children.length > 0) {
				this.questionsBefore.push(new TreeviewItem(page));
			}
		});
		// }
	}

	private processQuestionPageIntoTree(
		page: any,
		treeElement: TreeviewItem,
		questionHit: boolean,
		questionBreak: string,
		sectionBreak: string
	) {
		let repeatSources = [];
		for (let element of treeElement.children) {
			if (element.value === questionBreak) {
				this.thisQuestion = [element];

				this.repeatSourcesBefore = repeatSources;
				if (page.children.length > 0) {
					this.questionsBefore.push(new TreeviewItem(page));
					page = {
						value: treeElement.value,
						text: treeElement.text,
						checked: false,
						children: []
					};
				}
				questionHit = true;
			} else {
				if (element.value === sectionBreak) {
					this.repeatSourcesBefore = repeatSources;
					if (page.children.length > 0) {
						this.questionsBefore.push(new TreeviewItem(page));
						page = {
							value: treeElement.value,
							text: treeElement.text,
							checked: false,
							children: []
						};
					}
					questionHit = true;
				}

				if (!questionHit && element.children) {
					if ((<string>element.children[0].value).startsWith('option')) {
						this.clearOptionsFromElement(element);
					}
				}

				let elementCopy = {
					value: element.value,
					text: element.text,
					checked: false,
					children: []
				};
				if (element.children) {
					let { pageReturn, partReturn, questionHitReturn } = this.processQuestionPartIntoTree(
						page,
						element,
						elementCopy,
						questionHit,
						questionBreak,
						element.value === sectionBreak
					);
					page = pageReturn;
					elementCopy = partReturn;
					questionHit = questionHitReturn;
				}
				if (!((<string>element.value).startsWith('part') && elementCopy.children.length === 0)) {
					page.children.push(new TreeviewItem(elementCopy));
				}
				if (!(<string>element.value).startsWith('part') && !questionHit && this.allowAsRepeatSource(element.value)) {
					repeatSources.push(new TreeviewItem(elementCopy));
				}
				if (!(<string>element.value).startsWith('part') && !questionHit && this.isHouseholdSource(element.value)) {
					this.householdExistsBefore = true;
				}
			}
		}
		return { pageReturn: page, questionHitReturn: questionHit };
	}

	private processQuestionPartIntoTree(
		page: any,
		partSource: TreeviewItem,
		part,
		questionHit: boolean,
		questionBreak: string,
		ignoreRepeat: boolean
	) {
		let repeatSources = [];
		for (let element of partSource.children) {
			if (element.value === questionBreak) {
				this.thisQuestion = [element];
				if (!ignoreRepeat) {
					this.repeatSourcesBefore = repeatSources;
				}
				if (page.children.length > 0 || part.children.length > 0) {
					if (part.children.length > 0) {
						page.children.push(part);
					}
					this.questionsBefore.push(new TreeviewItem(page));
					page = {
						value: page.value,
						text: page.text,
						checked: false,
						children: []
					};
					part = {
						value: partSource.value,
						text: partSource.text,
						checked: false,
						children: []
					};
				}
				questionHit = true;
			} else {
				if (!questionHit && element.children) {
					if ((<string>element.children[0].value).startsWith('option')) {
						this.clearOptionsFromElement(element);
					}
				}
				part.children.push(element);
				if (!questionHit && this.allowAsRepeatSource(element.value)) {
					repeatSources.push(element);
				}
			}
		}
		return { pageReturn: page, partReturn: part, questionHitReturn: questionHit };
	}

	private clearOptionsFromElement(element: TreeviewItem) {
		if (element.children && element.children.length > 0) {
			if ((<string>element.children[0].value).startsWith('option')) {
				element.children = undefined;
			} else {
				element.children.forEach(child => {
					this.clearOptionsFromElement(child);
				});
			}
		}
	}
}
