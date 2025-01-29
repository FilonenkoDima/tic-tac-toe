import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { timer, Subscription } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-congratulation-dialog',
  templateUrl: './congratulation-dialog.component.html',
  imports: [
    MatProgressBar,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton
  ],
  styleUrls: ['./congratulation-dialog.component.css']
})
export class CongratulationDialogComponent implements OnInit, OnDestroy {
  progress = 0;
  private timerSub!: Subscription;
  private countdownSub!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<CongratulationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { playerName: string }
  ) {}

  ngOnInit(): void {
    this.timerSub = timer(0, 50).subscribe(() => {
      this.progress += 1;
      if (this.progress >= 100) this.progress = 100;
    });

    this.countdownSub = timer(5000).subscribe(() => {
      this.dialogRef.close();
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.timerSub) this.timerSub.unsubscribe();
    if (this.countdownSub) this.countdownSub.unsubscribe();
  }
}
