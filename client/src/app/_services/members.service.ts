import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  API = environment.apiUrl;
  members: Member[] = [];

  constructor(private _http: HttpClient) { }

  getMembers(): Observable<Member[]> {
    if (this.members.length) return of(this.members);
    return this._http.get<Member[]>(`${this.API}/users`).pipe(
      tap(members => this.members = members)
    );
  }

  getMember(username: string): Observable<Member> {
    const member = this.members.find(u => u.userName === username);
    if (member) return of(member);
    return this._http.get<Member>(`${this.API}/users/${username}`);
  }

  updateMember(member: Member) {
    return this._http.put(`${this.API}/users`, member).pipe(
      // update state
      tap(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }
}
