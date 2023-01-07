import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  constructor(
      private _accountService: AccountService, 
      private _router: Router,
      private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  register(): void {
    this._accountService.register(this.model).subscribe({
      next: () => {
        this.cancel();
        this._router.navigateByUrl('/members')
      },
      error: e => {
        console.log(e)
        this._toastr.error(e.error);
      } ,
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
