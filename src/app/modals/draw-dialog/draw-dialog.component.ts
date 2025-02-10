import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { timer, Subscription } from 'rxjs';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-draw-dialog',
  templateUrl: './draw-dialog.component.html',
  imports: [
    MatProgressBar,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton
  ],
  styleUrls: ['./draw-dialog.component.css']
})
export class DrawDialogComponent implements OnInit, OnDestroy {
  progress = 0;
  private timerSub!: Subscription;
  private countdownSub!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<DrawDialogComponent>
  ) {}

  ngOnInit() {
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
