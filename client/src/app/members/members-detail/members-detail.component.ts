import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-members-detail',
  templateUrl: './members-detail.component.html',
  styleUrls: ['./members-detail.component.css']
})
export class MembersDetailComponent implements OnInit {
  member: Member | undefined;

  constructor(private _memberService: MembersService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const username = this._route.snapshot.paramMap.get('username');
    if (!username) return;
    this._memberService.getMember(username).subscribe({
      next: member => this.member = member,
    })
  }
}
