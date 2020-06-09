import { HttpHeaders } from '@angular/common/http';
import { TestBed } from "@angular/core/testing";
import { ExternalService } from 'angular4-hal';
import { anything, matchingArgument, FakeExternalService, MockProvider } from 'core/testing';
import { Spy } from 'jasmine-auto-spies';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { of } from 'rxjs';
import { AuthUserService } from './auth-user.service';
import { UsersService } from './users.service';

describe(`AuthUserService`, () => {
    let service: AuthUserService;
    let externalService: FakeExternalService;
    let usersService: Spy<UsersService>;
    const testUserId = '1337-best-user';
    const testAccountId = '1337-best-account';
    const testEmail = 'iamemail@email.com';
    const testApiUrl = 'apiUrl/';
    const correctUrl = 'apiUrl/administration/users/search/findUserByEmail?email=iamemail@email.com'

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthUserService,
                {
                    provide: ExternalService,
                    useClass: FakeExternalService
                },
                MockProvider(UsersService),
            ]
        }).compileComponents();

        service = TestBed.get(AuthUserService);
        externalService = TestBed.get(ExternalService);
        usersService = TestBed.get(UsersService);
    })

    describe(`Given a user, and that ExtarnalService returns this user by an email`, () => {
        beforeEach(() => {
            externalService._get.and.returnValue(of({
                id: testUserId
            }));
            externalService.getURL = () => testApiUrl;

            usersService.get.and.returnValue(of({
                id: testUserId
            }));

            usersService.withRelatedObject.and.returnValue(of({
                id: testUserId,
                account: {
                    id: testAccountId
                }
            }));
        });

        it(`should call ExternalService with the correct URL`, () => {
            const request = service.getUserInfoByEmail(testEmail);

            expect(externalService._get).toHaveBeenCalledWith(correctUrl, anything);
        });

        it(`should call ExternalService with no-auth header`, () => {
            const noJwtHeaderKey = 'no-auth';

            const request = service.getUserInfoByEmail(testEmail);

            expect(externalService._get).toHaveBeenCalledWith(anything, matchingArgument<{ headers: HttpHeaders }>((it) => it.headers.has(noJwtHeaderKey)));
        });

        it(`should return a correct observable with recieved user and account ids`, (done) => {
            const request = service.getUserInfoByEmail(testEmail);

            request.subscribe(result => {
                expect(result).toBeTruthy();
                expect(result.userId).toEqual(testUserId);
                expect(result.accountId).toEqual(testAccountId);
                done();
            })
        });
    });
});