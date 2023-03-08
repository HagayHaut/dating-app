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
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(
      private _accountService: AccountService, 
      private _router: Router,
      private _toastr: ToastrService,
      private _formBuilder: FormBuilder,
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
    const sanitizedFormValues = {
      ...this.registerForm.value, 
      dateOfBirth: this.sanitizeDate(this.registerForm.controls['dateOfBirth'].value),
    }
    
    this._accountService.register(sanitizedFormValues).subscribe({
      next: () => {
        this._router.navigateByUrl('/members');
      },
      error: (e: string[]) => {
        this.validationErrors = e;
      } ,
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private sanitizeDate(dob: string | undefined | Date): string | undefined{
    if (!dob) return;
    dob = new Date(dob);
    return new Date(dob.setMinutes(dob.getMinutes() - dob.getTimezoneOffset()))
      .toISOString()
      .slice(0, 10);
  }
}
