import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css']
})
export class TestErrorComponent implements OnInit {
  API = 'http://localhost:5000/api';
  validationErrors: string[] = [];

  constructor(private _http: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error() {
    this._http.get(`${this.API}/buggy/not-found`).subscribe({
      next: console.log,
      error: console.log
    })
  }

  get400Error() {
    this._http.get(`${this.API}/buggy/bad-request`).subscribe({
      next: console.log,
      error: console.log
    })
  }

  get500Error() {
    this._http.get(`${this.API}/buggy/server-error`).subscribe({
      next: console.log,
      error: console.log
    })
  }

  get401Error() {
    this._http.get(`${this.API}/buggy/auth`).subscribe({
      next: console.log,
      error: console.log
    })
  }

  get400ValidationError() {
    this._http.post(`${this.API}/account/register`, {}).subscribe({
      next: console.log,
      error: (errors) => {
        this.validationErrors = errors;
      }
    })
  }
}
