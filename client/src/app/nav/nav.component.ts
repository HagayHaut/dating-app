import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  model: any = {};

  constructor(
      public accountService: AccountService, 
      private _router: Router, 
      private _toastr: ToastrService
  ) { }


  login(){
    this.accountService.login(this.model).subscribe({
      next: _ => this._router.navigateByUrl('/members'),
      error: e => this._toastr.error(e.error),
    })
  }

  logout(): void {
    this.accountService.logout();
    this._router.navigateByUrl('/');
  }
}
