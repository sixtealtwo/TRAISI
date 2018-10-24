import {
	Compiler,
	Component,
	Injector,
	SkipSelf,
	ViewChild,
	ViewContainerRef,
	Injectable,
	ComponentFactory,
	NgModuleRef,
	ComponentRef,
	ElementRef
} from '@angular/core';
import { QuestionLoaderEndpointService } from './question-loader-endpoint.service';
import { Observable, of, Operator, Subscriber, Observer, ReplaySubject } from 'rxjs';
import * as AngularCore from '@angular/core';
import * as AngularCommon from '@angular/common';
import * as AngularHttp from '@angular/common/http';
import * as AngularForms from '@angular/forms';
import * as Upgrade from '@angular/upgrade/static';
import * as popover from 'ngx-bootstrap/popover';
import * as alert from 'ngx-bootstrap/alert';
import * as buttons from 'ngx-bootstrap/buttons';
import * as modal from 'ngx-bootstrap/modal';
import * as dropdown from 'ngx-bootstrap/dropdown';
import * as carousel from 'ngx-bootstrap/carousel';
import * as datepicker from 'ngx-bootstrap/datepicker';
import * as BrowserModule from '@angular/platform-browser';
import * as tooltip from 'ngx-bootstrap/tooltip';
import * as icons from '@fortawesome/angular-fontawesome';
import 'rxjs/add/observable/of';
import { find } from 'lodash';
import { SurveyResponderService } from './survey-responder.service';
import { SurveyQuestion, SurveyModule } from 'traisi-question-sdk';
import { SurveyViewQuestion as ISurveyQuestion } from '../models/survey-view-question.model';
import { UpgradeModule } from '@angular/upgrade/static';
import { SurveyQuestionComponent } from '../models/survey-question-component';

declare const SystemJS;

@Injectable({
	providedIn: 'root'
})
export class QuestionLoaderService {
	private _componentFactories: { [type: string]: ComponentFactory<any> } = {};

	public get componentFactories(): { [type: string]: ComponentFactory<any> } {
		return this._componentFactories;
	}

	private _moduleRefs: { [type: string]: NgModuleRef<any> } = {};

	public componentFactories$: ReplaySubject<ComponentFactory<SurveyQuestion<any>>>;

	/**
	 *Creates an instance of QuestionLoaderService.
	 * @param {QuestionLoaderEndpointService} _questionLoaderEndpointService
	 * @param {Compiler} compiler
	 * @param {Injector} injector
	 * @param {SurveyResponderService} _responderService
	 * @memberof QuestionLoaderService
	 */
	constructor(
		private _questionLoaderEndpointService: QuestionLoaderEndpointService,
		private compiler: Compiler,
		private injector: Injector,
		private _responderService: SurveyResponderService
	) {
		SystemJS.config({ transpiler: false });
		this.componentFactories$ = new ReplaySubject(Number.MAX_VALUE);
		this.init();
	}

	private init(): void {
		SystemJS.registry.set('@angular/core', SystemJS.newModule(AngularCore));
		SystemJS.registry.set('@angular/common', SystemJS.newModule(AngularCommon));
		SystemJS.registry.set('@angular/common/http', SystemJS.newModule(AngularHttp));
		SystemJS.registry.set('@angular/forms', SystemJS.newModule(AngularForms));
		SystemJS.registry.set('@angular/platform-browser', SystemJS.newModule(BrowserModule));
		SystemJS.registry.set('@angular/upgrade/static', SystemJS.newModule(Upgrade));
		SystemJS.registry.set('@angular/upgrade', SystemJS.newModule(UpgradeModule));
		SystemJS.registry.set('ngx-bootstrap/popover', SystemJS.newModule(popover));
		SystemJS.registry.set('ngx-bootstrap/alert', SystemJS.newModule(alert));
		SystemJS.registry.set('ngx-bootstrap/datepicker', SystemJS.newModule(datepicker));
		SystemJS.registry.set('ngx-bootstrap/buttons', SystemJS.newModule(buttons));
		SystemJS.registry.set('ngx-bootstrap/modal', SystemJS.newModule(modal));
		SystemJS.registry.set('ngx-bootstrap/dropdown', SystemJS.newModule(dropdown));
		SystemJS.registry.set('ngx-bootstrap/carousel', SystemJS.newModule(carousel));
		SystemJS.registry.set('ngx-bootstrap/tooltip', SystemJS.newModule(tooltip));
		SystemJS.registry.set('@fortawesome/angular-fontawesome', SystemJS.newModule(icons));
	}

	/**
	 *
	 */
	public getQuestionComponentModule(questionType: string): NgModuleRef<any> {
		return this._moduleRefs[questionType];
	}

	/**
	 *
	 *
	 * @param {string} questionType
	 * @returns {Observable<any>}
	 * @memberof QuestionLoaderService
	 */
	public getQuestionComponentFactory(questionType: string): Observable<any> {
		// reuse the preloaded component factory
		if (questionType in this._componentFactories) {
			return Observable.create((observer: Observer<ComponentFactory<any>>) => {
				observer.next(this._componentFactories[questionType]);

				observer.complete();
			});
		}

		// if the module has already loaded.. but the question does not exist yet
		else if (questionType in this._moduleRefs) {
			return Observable.create((observer: Observer<ComponentFactory<any>>) => {
				const componentFactory: ComponentFactory<any> = this.createComponentFactory(this._moduleRefs[questionType], questionType);

				if (!(questionType in this._componentFactories)) {
					this._componentFactories[questionType] = componentFactory;

					this.componentFactories$.next(componentFactory);
				}
				observer.next(componentFactory);

				observer.complete();
			});
		} else {
			// load and compile the module
			return Observable.create((observer: Observer<ComponentFactory<any>>) => {
				SystemJS.import(this._questionLoaderEndpointService.getClientCodeEndpointUrl(questionType))
					.then((module) => {
						const moduleFactory = this.compiler.compileModuleAndAllComponentsSync(module.default);
						const moduleRef: NgModuleRef<any> = moduleFactory.ngModuleFactory.create(this.injector);

						const moduleInstance = <SurveyModule>module.default;

						this._moduleRefs[<string>questionType] = moduleRef;

						const componentFactory: ComponentFactory<any> = this.createComponentFactory(moduleRef, questionType);
						if (!(questionType in this._componentFactories)) {
							this._componentFactories[questionType] = componentFactory;
							console.log('Adding component factory: ' + questionType);
							this.componentFactories$.next(componentFactory);
						}
						observer.next(componentFactory);

						observer.complete();
					})
					.catch((error) => {
						console.log(error);
					});
			});
		}
	}

	/**
	 *
	 * @param moduleRef
	 * @param questionType
	 */
	private createComponentFactory(moduleRef: NgModuleRef<any>, questionType: string): ComponentFactory<any> {
		const widgets = moduleRef.injector.get('widgets', 'notFound');
		const resolver = moduleRef.componentFactoryResolver;

		let widget = find(widgets[0], (item) => {
			return item.id.toLowerCase() === questionType.toLowerCase();
		});

		const componentFactory: ComponentFactory<any> = resolver.resolveComponentFactory(widget.component);

		if (!(questionType in this._componentFactories)) {
			this._componentFactories[questionType] = componentFactory;

			this.componentFactories$.next(componentFactory);
		}
		return componentFactory;
	}

	/**
	 *
	 * @param questionType
	 * @param viewContainerRef
	 */
	public loadQuestionComponent(question: ISurveyQuestion, viewContainerRef: ViewContainerRef): Observable<ComponentRef<any>> {
		return Observable.create((observer: Observer<ComponentRef<any>>) => {
			this.getQuestionComponentFactory(question.questionType).subscribe((componentFactory) => {
				let componentRef = viewContainerRef.createComponent(componentFactory, undefined, this.injector);
				const moduleRef = this._moduleRefs[question.questionType];

				observer.next(componentRef);
				observer.complete();
			});
		});
	}
}
