import { Compiler, Component, Injector, SkipSelf, ViewChild, ViewContainerRef, Injectable, ComponentFactory } from '@angular/core';
import { QuestionLoaderEndpointService } from './question-loader-endpoint.service';
import { Observable, of, Operator, Subscriber, Observer } from 'rxjs';
import * as AngularCore from '@angular/core';
import * as AngularCommon from '@angular/common';
import 'rxjs/add/observable/of';
import * as _ from 'lodash';


declare const SystemJS;

@Injectable({
	providedIn: 'root'
})
export class QuestionLoaderService {


	/**
	 *
	 * @param questionType
	 */
	public getQuestionComponentFactory(questionType: string): Observable<any> {

		SystemJS.registry.set('@angular/core', SystemJS.newModule(AngularCore));
		SystemJS.registry.set('@angular/common', SystemJS.newModule(AngularCommon));


		// create and obserer and return the component factory after it has finished importing
		let obs: Observable<ComponentFactory<any>> = Observable.create((observer: Observer<ComponentFactory<any>>) => {
			SystemJS.import(this._questionLoaderEndpointService.getClientCodeEndpointUrl(questionType)).then((module) => {
				console.log(module);
				const moduleFactory = this.compiler.compileModuleSync(module.default);
				const moduleRef = moduleFactory.create(this.injector);
				const widgets = moduleRef.injector.get('widgets');
				const resolver = moduleRef.componentFactoryResolver;
				console.log(widgets);

				let widget = _.find(widgets[0], (item) => {
					return item.id.toLowerCase() === questionType.toLowerCase();
				});

				console.log(widget);

				const componentFactory: ComponentFactory<any> = resolver.resolveComponentFactory(widget.component);
				console.log(componentFactory);
				observer.next(componentFactory);
				observer.complete();
			}).catch(error => {
				console.log(error);
				console.log('Error: ' + error);
			});
		});

		return obs;
	}


	/**
	 *
	 * @param _questionLoaderEndpointService
	 * @param compiler
	 * @param injector
	 * @param moduleLoader
	 */
	constructor(private _questionLoaderEndpointService: QuestionLoaderEndpointService,
		private compiler: Compiler, @SkipSelf() private injector: Injector,
	) {


	}
}
