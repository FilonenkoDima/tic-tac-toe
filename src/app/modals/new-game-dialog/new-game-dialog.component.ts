import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-game-dialog',
  imports: [MatFormFieldModule, MatInput, MatButton, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './new-game-dialog.component.html',
  styleUrl: './new-game-dialog.component.css'
})
export class NewGameDialogComponent {
  readonly dialogRef = inject(MatDialogRef<NewGameDialogComponent>);
  private readonly form = inject(FormBuilder);

  players = this.form.group({
    player1: ['', [Validators.required]],
    player2: ['', [Validators.required]],
  })

  onSubmit(): void {
    if (this.players.valid) {
      this.dialogRef.close(this.players.value);
    }
  }
}
