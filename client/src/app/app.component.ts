import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Dating App';

  constructor(private _accountService: AccountService) {}

  ngOnInit(): void {
    this.setCurrentUser();
  }


  setCurrentUser(): void {
    const jsonUser = localStorage.getItem('user');
    if(!jsonUser) return;
    const user: User = JSON.parse(jsonUser);
    this._accountService.setCurrentUser(user);
  }  
}
