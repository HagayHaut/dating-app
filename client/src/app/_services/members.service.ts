import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  API = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getMembers(): Observable<Member[]> {
    return this._http.get<Member[]>(`${this.API}/users`);
  }

  getMember(username: string): Observable<Member> {
    return this._http.get<Member>(`${this.API}/users/${username}`);
  }

  updateMember(member: Member) {
    return this._http.put(`${this.API}/users`, member);
  }
}
