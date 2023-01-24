import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCounts = 0;

  constructor(private _spinnerService: NgxSpinnerService) { }

  busy() {
    this.busyRequestCounts++;
    this._spinnerService.show(undefined, {
      type: 'line-scale',
      bdColor: 'rgba(255,255,255,0)',
      color: '#333333'
    });
  }

  idle() {
    this.busyRequestCounts--;
    if (this.busyRequestCounts <= 0) {
      this.busyRequestCounts = 0;
      this._spinnerService.hide();
    }
  }

}
