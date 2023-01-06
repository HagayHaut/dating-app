import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Dating App';
  users: any;

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this._http.get('http://localhost:5000/api/users')
      .subscribe({
        next: (response) => this.users = response,
        error: (error) => console.error(error),
        complete: () => console.log('Request has completed'),
      })
  }

  
}
