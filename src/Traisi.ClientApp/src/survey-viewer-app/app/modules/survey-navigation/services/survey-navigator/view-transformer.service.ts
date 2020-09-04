import { Injectable, Injector } from '@angular/core';
import { ViewTransformation } from '../../view-transformers/view-transformation';
import { NavigationState } from 'app/models/navigation-state.model';
import { RepeatTransformer } from '../../view-transformers/repeat-transformer';
import { QuestionInstance } from 'app/models/question-instance.model';

@Injectable({
	providedIn: 'root',
})
export class ViewTransformer {
	private _viewTransformations: ViewTransformation[] = [];

	public constructor(private _injector: Injector) {
		this.registerViewTransformation(_injector.get(RepeatTransformer));
	}

	/**
	 *
	 * @param viewTransform
	 */
	public registerViewTransformation(viewTransform: ViewTransformation): void {
		this._viewTransformations.push(viewTransform);
	}

	/**
	 *
	 * @param viewTransform
	 */
	public unRegisterViewTransformation(viewTransform: ViewTransformation): void {
		const idx = this._viewTransformations.findIndex((v) => (v = viewTransform));
		if (idx >= 0) {
			this._viewTransformations.splice(idx, 1);
		}
	}

	/**
	 *
	 * @param state
	 */
	public applyViewTransformations(state: NavigationState, instances: QuestionInstance[]): QuestionInstance[] {
		let newState: NavigationState;
		for (let t of this._viewTransformations) {
			instances = t.transformNavigationState(state, instances);
		}
		return instances;
	}
}
