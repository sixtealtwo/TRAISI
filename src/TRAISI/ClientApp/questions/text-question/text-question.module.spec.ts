import {TextQuestionModule} from './text-question.module';

describe('TextQuestionModule', () => {
  let textQuestionModule: TextQuestionModule;

  beforeEach(() => {
    textQuestionModule = new TextQuestionModule();
  });

  it('should create an instance', () => {
    expect(textQuestionModule).toBeTruthy();
  });
});
