import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  model: any = {};

  constructor(public accountService: AccountService, private _router: Router) { }


  login(){
    this.accountService.login(this.model).subscribe({
      next: _ => this._router.navigateByUrl('/members'),
      error: console.error,
    })
  }

  logout(): void {
    this.accountService.logout();
    this._router.navigateByUrl('/');
  }
}
