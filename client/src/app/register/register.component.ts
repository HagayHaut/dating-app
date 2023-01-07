import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  model: any = {};

  constructor(private _accountService: AccountService) { }

  ngOnInit(): void {
  }

  register(): void {
    this._accountService.register(this.model).subscribe({
      next: () => this.cancel(),
      error: console.error,
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
