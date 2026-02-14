import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/common/DefaultResponse.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {User} from "../../../types/personal/user/user.type";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInfo():Observable<User | DefaultResponseType>{
    return this.http.get<User | DefaultResponseType>(environment.api + '/user');
  }

  updateUser(params:User ): Observable< DefaultResponseType> {
    return this.http.post< DefaultResponseType>(environment.api + '/user', params);
  }
}
