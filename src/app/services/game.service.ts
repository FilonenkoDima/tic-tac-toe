import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public board: { id: number, state: string | null }[] = [];
  activePlayer: WritableSignal<string> = signal("X");
  turnCount: number = 0;
  isGameOver: boolean = false;
  lastWinner: string = "X";
  player1Score: WritableSignal<number> = signal(0);
  player2Score: WritableSignal<number> = signal(0);
  drawScore: WritableSignal<number> = signal(0);

  private winnerSubject = new BehaviorSubject<boolean>(false);
  winner$ = this.winnerSubject.asObservable();

  newGame() {
    this.activePlayer.set(this.lastWinner);
    this.turnCount = 0;
    this.isGameOver = false;
    this.winnerSubject.next(false);
    this.board = this.createBoard();
  }

  createBoard() {
    let board = [];
    for (let i = 0; i < 9; i++) {
      board.push({ id: i, state: null })
    }
    return board;
  }

  changePlayerTurn(squareClicked: { id: number, state: string | null }): void {
    this.updateBoard(squareClicked);

    if (this.isGameOver) return;

    this.activePlayer.set(this.activePlayer() === "X" ? "O" : "X");
    this.turnCount++;

    // Check for normal draw (all cells filled)
    if (this.gameOver() && !this.isWinner) {
      this.handleDraw();
    }
    // Check for early draw (cells remain but no possible wins)
    else if (this.isEarlyDraw()) {
      this.handleDraw();
    }
  }

  updateBoard(squareClicked: { id: number, state: string | null }) {
    this.board[squareClicked.id].state = squareClicked.state;
    if (this.isWinner) {
      this.isGameOver = true;
      this.lastWinner = this.activePlayer();
      this.winnerSubject.next(true);
    }
    console.log(this.board);
  }

  gameOver: Signal<boolean> = computed(() => this.turnCount >= 8 || this.isGameOver);

  get isWinner(): boolean {
    return this.checkDiag() || this.checkRows(this.board, "row") || this.checkRows(this.board, "col");
  }

  private checkRows(board: { id: number, state: string | null }[], mode: any): boolean {
    const ROW = mode === "row";
    const DIST = ROW ? 1 : 3;
    const INC = ROW ? 3 : 1;
    const NUMTIMES = ROW ? 7 : 3;

    for (let i = 0; i < NUMTIMES; i += INC) {
      let firstSquare = board[i].state;
      let secondSquare = board[i + DIST].state;
      let thirdSquare = board[i + (DIST * 2)].state;

      if (firstSquare && secondSquare && thirdSquare) {
        if (firstSquare === secondSquare && secondSquare === thirdSquare) {
          this.addScore();
          return true;
        }
      }
    }
    return false;
  }

  private checkDiag() {
    const timesRun = 2;
    const midSquare = this.board[4].state;

    for (let i = 0; i <= timesRun; i += 2) {
      let upperCorner = this.board[i].state;
      let lowerCorner = this.board[8 - i].state;

      if (midSquare && upperCorner && lowerCorner) {
        if (midSquare === upperCorner && upperCorner === lowerCorner) {
          this.addScore();
          return true;
        }
      }
    }
    return false;
  }

  private addScore() {
    if (this.activePlayer() === "X") {
      this.player1Score.update(x => x + 1);
    } else if (this.activePlayer() === "O") {
      this.player2Score.update(x => x + 1);
    }
  }

  private isEarlyDraw(): boolean {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
      [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    for (const line of lines) {
      const values = line.map(index => this.board[index].state);
      const hasX = values.includes('X');
      const hasO = values.includes('O');
      if (!(hasX && hasO)) {
        return false; // This line can still be won
      }
    }
    return true; // All lines blocked, early draw
  }

  private handleDraw() {
    this.isGameOver = true;
    this.drawScore.update(d => d + 1);
    this.winnerSubject.next(false);
    this.newGame();
  }
}
