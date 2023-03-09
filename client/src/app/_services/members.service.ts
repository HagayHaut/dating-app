import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  API = environment.apiUrl;
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>;

  constructor(private _http: HttpClient) { }

  getMembers(page?: number, itemsPerPage?: number) {
    let params = new HttpParams();

    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    
    return this._http.get<Member[]>(`${this.API}/users`, { observe: 'response', params }).pipe(
      map(({ body, headers }) => {
        if (body) this.paginatedResult.result = body;
        const pagination = headers.get('Pagination');
        if (pagination) this.paginatedResult.pagination = JSON.parse(pagination);
        return this.paginatedResult;
      })
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

  setMainPhoto(photoId: number) {
    return this._http.put(`${this.API}/users/set-main-photo/${photoId}`, {});
  }

  deletePhoto(photoId: number) {
    return this._http.delete(`${this.API}/users/delete-photo/${photoId}`);
  }
}
