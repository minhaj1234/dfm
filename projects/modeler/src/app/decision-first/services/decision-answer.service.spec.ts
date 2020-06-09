import { DatePipe } from '@angular/common';
import { async, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularHalModule } from 'angular4-hal';
import { of, Observable } from 'rxjs';
import { DecisionAnswerService } from '.';
import { Answer, AnswerType } from '../models/decision.model';

class CustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of({
      'resources': {
        'yesNo': 'Yes / No',
        'definedList': 'Defined List',
        'externalValueList': 'External value list',
        'numberInRange': 'Number in range',
        'text': 'Text',
        'dateTime': 'Date / Time',
        'other': 'Other',
        'collectionOf': 'Collection of',
        'yes': 'Yes',
        'no': 'No',
        'min': 'Min',
        'max': 'Max',
        'default': 'Default',
        'supportingInformation': 'Supporting information'
      }
    });
  }
}

function getAnswerObject(): Answer {
  const answer = new Answer();
  answer.answerItems = [{ id: 'answerItem1', value: 'Answer Item 1' }, { id: 'answerItem2', value: 'Answer Item 2' }];
  answer.defaultAnswerItemId = 'answerItem1';
  answer.externalValueList = 'external\nvalue\nlist';
  answer.minimumNumber = 1;
  answer.defaultNumber = 5;
  answer.maximumNumber = 10;
  answer.text = 't\ne\nx\nt';
  answer.minimumDateTime = new Date('2026-02-20 10:10');
  answer.defaultDateTime = new Date('2026-06-20 10:10');
  answer.maximumDateTime = new Date('2026-10-20 10:10');
  answer.other = 'o\nt\nh\ne\nr';
  answer.isCollection = false;

  return answer;
}

describe('DecisionAnswerService', () => {
  let service: DecisionAnswerService;
  let translateService: TranslateService;
  let decisionAnswerService: DecisionAnswerService;
  let answer = getAnswerObject();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot(), TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: CustomLoader }
      })],
      providers: [DatePipe, DecisionAnswerService],
    });
  }));

  beforeEach(() => {
    translateService = TestBed.get(TranslateService);
    decisionAnswerService = TestBed.get(DecisionAnswerService);
    service = TestBed.get(DecisionAnswerService);
    translateService.use('en');
    answer = getAnswerObject()
  });

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  describe('getAnswerTextValue', () => {
    describe('Defined List', (() => {
      beforeEach(() => {
        answer.answerTypeId = AnswerType.DefinedList;
      });

      it('should correct set', async(() => {
        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('<u>Answer Item 1</u>, Answer Item 2');
        });
      }));
    }));

    describe('External value list', (() => {
      beforeEach(() => {
        answer.answerTypeId = AnswerType.ExternalValueList;
      });

      it('should correct set', async(() => {
        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('external<br>value<br>list');
        });
      }));
    }));

    describe('Number in range', (() => {
      beforeEach(() => {
        answer.answerTypeId = AnswerType.NumberInRange;
      });

      it('should set all values', async(() => {
        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('Min: 1<br><u>Default: 5</u><br>Max: 10<br>');
        });
      }));

      it('should set only minimum number', async(() => {
        answer.minimumNumber = 100;
        answer.defaultNumber = null;
        answer.maximumNumber = null;

        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('Min: 100<br>');
        });
      }));

      it('should set only default number', async(() => {
        answer.minimumNumber = null;
        answer.defaultNumber = 100;
        answer.maximumNumber = null;

        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('<u>Default: 100</u><br>');
        });
      }));

      it('should set only default number', async(() => {
        answer.minimumNumber = null;
        answer.defaultNumber = null;
        answer.maximumNumber = 100;

        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('Max: 100<br>');
        });
      }));

      it('should return empty strings without values', async(() => {
        answer.minimumNumber = null;
        answer.defaultNumber = null;
        answer.maximumNumber = null;

        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('');
        });
      }));
    }));

    describe('Text', () => {
      beforeEach(() => {
        answer.answerTypeId = AnswerType.Text;
      });
  
      it('should correct set', async(() => {
        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('t<br>e<br>x<br>t');
        });
      }));
    });
  
    describe('Date / Time', () => {
      beforeEach(() => {
        answer.answerTypeId = AnswerType.DateTime;
      });
  
      it('should set all values', async(() => {
        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('Min: 02-20-2026 10:10<br><u>Default: 06-20-2026 10:10</u><br>Max: 10-20-2026 10:10<br>');
        });
      }));

      it('should set only min value', async(() => {
        answer.minimumDateTime = new Date('2026-02-20 12:10');
        answer.defaultDateTime = null;
        answer.maximumDateTime = null;

        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('Min: 02-20-2026 12:10<br>');
        });
      }));

      it('should set only default value', async(() => {
        answer.minimumDateTime = null;
        answer.defaultDateTime = new Date('2026-02-20 12:10');
        answer.maximumDateTime = null;

        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('<u>Default: 02-20-2026 12:10</u><br>');
        });
      }));

      it('should set only max value', async(() => {
        answer.minimumDateTime = null;
        answer.defaultDateTime = null;
        answer.maximumDateTime = new Date('2026-02-20 12:10');

        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('Max: 02-20-2026 12:10<br>');
        });
      }));

      it('should return empty strings without values', async(() => {
        answer.minimumDateTime = null;
        answer.defaultDateTime = null;
        answer.maximumDateTime = null;

        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('');
        });
      }));
    });

    describe('Other', (() => {
      beforeEach(() => {
        answer.answerTypeId = AnswerType.Other;
      });
  
      it('should correct set', async(() => {
        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('o<br>t<br>h<br>e<br>r');
        });
      }));
    }));

    describe('Yes No', (() => {
      beforeEach(() => {
        answer.answerTypeId = AnswerType.YesNo;
      });
  
      it('should set no', async(() => {
        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('Yes / No: No');
        });
      }));

      it('should set yes', async(() => {
        answer.yesNo = true;

        const result = decisionAnswerService.getAnswerTextValue(answer);

        result.subscribe((value) => {
          expect(value).toEqual('Yes / No: Yes');
        });
      }));
    }));
  });

  describe('getNameAnswerType', (() => {
    beforeEach(() => {
      answer.answerTypeId = AnswerType.Text;
    });

    it('should correct set if collection', () => {
      answer.isCollection = true;

      const result = decisionAnswerService.getNameAnswerType(answer);

      result.subscribe((value) => {
        expect(value).toEqual('<p>Collection of Text</p>');
      });
    });

    it('should correct set if not collection', () => {
      const result = decisionAnswerService.getNameAnswerType(answer);

      result.subscribe((value) => {
        expect(value).toEqual('<p>Text</p>');
      });
    });

    it('should return empty string if is YesNo', () => {
      answer.answerTypeId = AnswerType.YesNo;

      const result = decisionAnswerService.getNameAnswerType(answer);

      result.subscribe((value) => {
        expect(value).toEqual('');
      });
    });
  }));

  describe('getAnswerSupportingInformation', (() => {
    beforeEach(() => {
      answer.supportingInformation = 'test supporting information';
    });

    it('should correct set', () => {
      const result = decisionAnswerService.getAnswerSupportingInformation(answer);

      result.subscribe((value) => {
        expect(value).toEqual('<p>Supporting information: test supporting information</p>');
      });
    });
  }));

  describe('getDecisionAnswerPlainText', () => {
    it('should remove <u> and </u>', () => {
      answer.answerTypeId = AnswerType.DefinedList;

      const result = decisionAnswerService.getDecisionAnswerPlainText(answer);

      result.subscribe((value) => {
        expect(value).toEqual('Answer Item 1, Answer Item 2');
      });
    });

    it('should replase <br> with new line', () => {
      answer.answerTypeId = AnswerType.DateTime;
      const result = decisionAnswerService.getDecisionAnswerPlainText(answer);

      result.subscribe((value) => {
        expect(value).toEqual('Min: 02-20-2026 10:10\nDefault: 06-20-2026 10:10\nMax: 10-20-2026 10:10\n');
      });
    });
  });
});
