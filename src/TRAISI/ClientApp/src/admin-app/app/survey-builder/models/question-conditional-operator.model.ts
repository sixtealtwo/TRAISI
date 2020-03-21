import { QuestionPartView } from './question-part-view.model';
import { QuestionConditional } from './question-conditional.model';
import { QuestionCondtionalOperatorType } from './question-conditional-operator-type.enum';

export interface QuestionConditionalOperator {
    id?: number;
    order?: number;
    operatorType?: QuestionCondtionalOperatorType;
    lhs?: QuestionConditional | undefined;
    rhs?: QuestionConditional | undefined;
    targetQuestion?: QuestionPartView | undefined;
}
