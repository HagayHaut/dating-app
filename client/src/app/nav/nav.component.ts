import { Component } from '@angular/core';
import { User } from '../models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  model: {[key: string]: string} = {};

  constructor(public accountService: AccountService) { }


  login(){
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        
      },
      error: console.error,

    })
  }

  logout(): void {
    this.accountService.logout();
   
  }
}
