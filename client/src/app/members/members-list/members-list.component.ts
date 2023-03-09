import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
  // members$: Observable<Member[]> | undefined;
  members: Member[]  = [];
  pagination: Pagination | undefined;
  pageNumber = 1;
  pageSize = 5;

  constructor(private _memberService: MembersService) { }

  ngOnInit(): void {
    // this.members$ = this._memberService.getMembers();
    this.loadMembers();
  }

  loadMembers() {
    this._memberService.getMembers(this.pageNumber, this.pageSize).subscribe(({ result, pagination }) => {
      if (result && pagination) {
        this.members = result;
        this.pagination = pagination;
      }
    });
  }

  pageChanged(e: any) {
    if (this.pageNumber !== e.page) {
      this.pageNumber = e.page;
      this.loadMembers();
    }
  }
}
