import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();

  constructor(
      private _accountService: AccountService, 
      private _router: Router,
      private _toastr: ToastrService,
      private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    const { required, minLength, maxLength } = Validators;
    this.registerForm = this._formBuilder.group({
      gender: ['male'],
      username: ['', required],
      knownAs: ['', required],
      dateOfBirth: ['', required],
      city: ['', required],
      country: ['', required],
      password: ['', [required, minLength(4), maxLength(8)]],
      confirmPassword: ['', [required, this.matchValues('password')]],
    });

    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value 
        ? null 
        : { notMatching: true };
    }
  }

  register(): void {
    console.log(this.registerForm?.value)
    // this._accountService.register(this.model).subscribe({
    //   next: () => {
    //     this.cancel();
    //     this._router.navigateByUrl('/members')
    //   },
    //   error: e => {
    //     console.log(e)
    //     this._toastr.error(e.error);
    //   } ,
    // });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
