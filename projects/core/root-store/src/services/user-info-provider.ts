import { Observable } from 'rxjs';

export const USER_INFO_PROVIDER = "userInfoProvider";
export interface IUserInfoProvider {
    getUserInfoByEmail(email: string): Observable<{ userId: string, accountId: string, accountDomains: string }>
}