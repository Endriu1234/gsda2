import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProgressBarSpinnerService } from './progress-bar-spinner.service';

@Component({
  selector: 'app-progress-bar-spinner',
  templateUrl: './progress-bar-spinner.component.html',
  styleUrls: ['./progress-bar-spinner.component.scss']
})
export class ProgressBarSpinnerComponent implements OnInit {
  showProgress = false;
  showCancel = true;
  value = 0;
  label = '';

  constructor(private progressBarService: ProgressBarSpinnerService, private cdRef: ChangeDetectorRef) {
    
  }

  ngOnInit(): void {
    this.progressBarService.getSpinnerObserver().subscribe((prgBarObj) => {
      this.showProgress = (prgBarObj.behaviourSubjectState === 'start');
      this.value = prgBarObj.value;
      this.label = prgBarObj.label;
      this.showCancel = prgBarObj.showCancel;
      this.cdRef.detectChanges();
    });
  }

  setCancel() {
    this.progressBarService.setCanceled();
  }
}
