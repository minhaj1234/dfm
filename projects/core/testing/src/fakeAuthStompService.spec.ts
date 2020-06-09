import { ISocketMessage } from 'core/models';
import { ReplaySubject } from 'rxjs';

export class FakeAuthStompService {
  subject = new ReplaySubject<{ body: string }>();

  subscribe(router: string) {
    return this.subject.asObservable();
  }

  _next(message: ISocketMessage) {
    this.subject.next({
      body: JSON.stringify(message),
    });
  }
}
