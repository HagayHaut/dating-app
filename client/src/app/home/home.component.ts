import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;

  constructor(private _http: HttpClient) { }

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle(): void {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(cancelEvent: boolean): void {
    this.registerMode = cancelEvent;
  }

  
  getUsers(): void {
    this._http.get('http://localhost:5000/api/users')
      .subscribe({
        next: (response) => this.users = response,
        error: console.error,
        complete: () => console.log('Request has completed'),
      })
  }
}
