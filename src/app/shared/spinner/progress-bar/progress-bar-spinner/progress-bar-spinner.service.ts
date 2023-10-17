import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProgressBarSpinner } from './models/progress-bar-spinner.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarSpinnerService {

  private currElement = 1;
  private amntElemenst = 0;
  private count = 0;
  private isCanceled = false;
  private showCancel = true;
  private spinner$ = new BehaviorSubject<ProgressBarSpinner>({value: 0, label: '', behaviourSubjectState: '', showCancel: true});

  constructor() { }

  getSpinnerObserver(): Observable<ProgressBarSpinner> {
    return this.spinner$.asObservable();
  }

  startProgress(amntElemenst: number, showCancel: boolean) {
    if (++this.count === 1) {
      this.amntElemenst = amntElemenst;
      this.showCancel = showCancel;
      const prgSpinn: ProgressBarSpinner = {value: (100/this.amntElemenst) * this.currElement, label: `1/${this.amntElemenst}`, behaviourSubjectState: 'start', showCancel};
      this.spinner$.next(prgSpinn);
    }
  }

  nextElement() {
    this.currElement++;
    const prgSpinn: ProgressBarSpinner = {value: (100/this.amntElemenst) * this.currElement, 
                                          label: `${this.currElement}/${this.amntElemenst}`, 
                                          behaviourSubjectState: 'start',
                                          showCancel: this.showCancel};
    this.spinner$.next(prgSpinn);
  }

  stopProgress() {
    if (this.count === 0 || --this.count === 0) {
      const prgSpinn: ProgressBarSpinner = {value: 100, label: `${this.amntElemenst}/${this.amntElemenst}`, behaviourSubjectState: 'stop', showCancel: this.showCancel};
      this.currElement = 1;
      this.amntElemenst = 0;
      this.isCanceled = false;
      this.showCancel = true;
      this.spinner$.next(prgSpinn);
    }
  }

  setCanceled() {
    this.isCanceled = true;
  }

  checkIsCanceled() {
    return this.isCanceled;
  }

  resetProgress() {
    this.count = 0;
    this.currElement = 1;
    this.amntElemenst = 0;
    this.isCanceled = false;
    this.showCancel = true;
    const prgSpinn: ProgressBarSpinner = {value: 0, label: '', behaviourSubjectState: 'stop', showCancel: this.showCancel};
    this.spinner$.next(prgSpinn);
  }
}
