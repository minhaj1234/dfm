import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Answer, AnswerItem, AnswerType, AnswerTypeTranslationString } from '../models/decision.model';

@Injectable()
export class DecisionAnswerService {
  constructor(
    private translateService: TranslateService,
    private datePipe: DatePipe,
  ) { }

  getAnswerTextValue(answer: Answer): Observable<string> {
    switch (answer.answerTypeId) {
      case AnswerType.YesNo:
        return this.getYesNoAnswerTextValue(answer);
      case AnswerType.DefinedList:
        return this.getDefinedListAnswerTextValue(answer);
      case AnswerType.ExternalValueList:
        return this.getExternalValueListAnswerTextValue(answer);
      case AnswerType.NumberInRange:
        return this.getNumberInRangeAnswerTextValue(answer);
      case AnswerType.Text:
        return this.getTextAnswerTextValue(answer);
      case AnswerType.DateTime:
        return this.getDateTimeAnswerTextValue(answer);
      case AnswerType.Other:
        return this.getOtherAnswerTextValue(answer);
    }
  }
  getDecisionAnswerPlainText(answer: Answer): Observable<string> {
    return this.getAnswerTextValue(answer).pipe(
      map((html) => this.transformHtmltoPlainText(html))
    );
  }

  getYesNoAnswerTextValue(answer: Answer): Observable<string> {
    return this.translateService.get(['resources.yes', 'resources.no']).
      pipe(map((result: Object) => {
        return (answer.yesNo) ?
          `${result['resources.yes']} / ${result['resources.no']}: ${result['resources.yes']}` :
          `${result['resources.yes']} / ${result['resources.no']}: ${result['resources.no']}`
      }));
  }

  getDefinedListAnswerTextValue(answer: Answer): Observable<string> {
    let answerTextValue = '';
    const answerItems: AnswerItem[] = answer.answerItems;
    const defaultAnswerItemId: string = answer.defaultAnswerItemId;

    answerTextValue = answerItems
      .map((item: AnswerItem) => {
        return item.id !== defaultAnswerItemId ? `${item.value}` : `<u>${item.value}</u>`;
      })
      .join(', ');

    return of(answerTextValue);
  }

  getExternalValueListAnswerTextValue(answer: Answer): Observable<string> {
    return of(this.replaceNewLineCharacters(answer.externalValueList as string));
  }

  getNumberInRangeAnswerTextValue(answer: Answer): Observable<string> {
    return this.translateService.get(['resources.min', 'resources.default', 'resources.max']).pipe(map((result) => {
      let answerTextValue = '';
      const minimumNumber = answer.minimumNumber;
      const defaultNumber = answer.defaultNumber;
      const maximumNumber = answer.maximumNumber;

      answerTextValue += minimumNumber ? `${result['resources.min']}: ${minimumNumber}<br>` : '';
      answerTextValue += defaultNumber ? `<u>${result['resources.default']}: ${defaultNumber}</u><br>` : '';
      answerTextValue += maximumNumber ? `${result['resources.max']}: ${maximumNumber}<br>` : '';
      return answerTextValue;
    }));
  }

  getTextAnswerTextValue(answer: Answer): Observable<string> {
    return of(this.replaceNewLineCharacters(answer.text as string));
  }

  getDateTimeAnswerTextValue(answer: Answer): Observable<string> {
    return this.translateService.get(['resources.min', 'resources.default', 'resources.max']).pipe(map((result) => {
      let answerTextValue = '';

      const minimumDateTime = this.transformDateTimeToEuropeanFormat(answer.minimumDateTime);
      const defaultDateTime = this.transformDateTimeToEuropeanFormat(answer.defaultDateTime);
      const maximumDateTime = this.transformDateTimeToEuropeanFormat(answer.maximumDateTime);

      answerTextValue += minimumDateTime ? `${result['resources.min']}: ${minimumDateTime}<br>` : '';
      answerTextValue += defaultDateTime ? `<u>${result['resources.default']}: ${defaultDateTime}</u><br>` : '';
      answerTextValue += maximumDateTime ? `${result['resources.max']}: ${maximumDateTime}<br>` : '';
      return answerTextValue;
    }));
  }

  getOtherAnswerTextValue(answer: Answer): Observable<string> {
    return of(this.replaceNewLineCharacters(answer.other));
  }

  getAnswerSupportingInformation(answer: Answer): Observable<string> {
    return this.translateService.get(['resources.supportingInformation']).pipe(map((result) => {
      const supportingInformation = answer.supportingInformation;

      return supportingInformation
        ? `<p>${result['resources.supportingInformation']}: ${supportingInformation}</p>`
        : '';
    }));
  }

  replaceNewLineCharacters(value: string): string {
    return value ? value.replace(/\n/g, '<br>') : '';
  }

  transformDateTimeToEuropeanFormat(value: Date): string {
    return this.datePipe.transform(value, 'MM-dd-yyyy hh:mm');
  }

  transformHtmltoPlainText(html: string): string {
    return html.replace(/<u>|<\/u>/g, '')
      .replace(/<br>/g, '\n');
  }

  getNameAnswerType(answer: Answer): Observable<string> {
    const answerTypeId = answer.answerTypeId;
   
    if (answerTypeId && answerTypeId !== AnswerType.YesNo) {
      return this.translateService.get(['resources.collectionOf', AnswerTypeTranslationString[answer.answerTypeId]])
        .pipe(map((result: Object) => {
            return answer.isCollection
            ? `<p>${result['resources.collectionOf']} ${result[AnswerTypeTranslationString[answer.answerTypeId]]}</p>`
            : `<p>${result[AnswerTypeTranslationString[answer.answerTypeId]]}</p>`
        }));
    } else {
      return of('');
    }
  }
}
