import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public board: { id: number, state: string | null }[] = [];
  activePlayer: string = "X";
  turnCount: number = 0;
  isGameOver: boolean = false;
  lastWinner: string = "X";
  player1Score: WritableSignal<number> = signal(0);
  player2Score: WritableSignal<number> = signal(0);
  drawScore: WritableSignal<number> = signal(0);

  private winnerSubject = new BehaviorSubject<boolean>(false);
  winner$ = this.winnerSubject.asObservable();  // Потік змін переможця

  newGame() {
    this.activePlayer = this.lastWinner; // Гра починається з того, хто переміг у минулому раунді
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

    return board
  }

  changePlayerTurn(squareClicked: { id: number, state: string | null }): void {
    this.updateBoard(squareClicked);

    if (this.isGameOver) return; // Якщо гра закінчилася, не змінюємо гравця

    this.activePlayer = this.activePlayer === "X" ? "O" : "X";
    this.turnCount++;
  }

  updateBoard(squareClicked: { id: number, state: string | null }) {
    this.board[squareClicked.id].state = squareClicked.state;
    if (this.isWinner) {
      this.isGameOver = true;
      this.lastWinner = this.activePlayer; // Зберігаємо переможця
      this.winnerSubject.next(true);
    }
  }

  get gameOver(): boolean {
    return this.turnCount > 8 || this.winnerSubject.value;
  }

  get isWinner(): boolean {
    return this.checkDiag() || this.checkRows(this.board, "row") || this.checkRows(this.board, "col");
  }

  checkRows(board: { id: number, state: string | null }[], mode: any): boolean {
    const ROW = mode === "row";
    const DIST = ROW ? 1 : 3;
    const INC = ROW ? 3 : 1;
    const NUMTIMES = ROW ? 7 : 3;

    for (let i = 0; i < NUMTIMES; i += INC) {

      let firstSquare = board[i].state;
      let secondSquare = board[i + DIST].state;
      let thirdSquare = board[i + (DIST * 2)].state;

      if (firstSquare && secondSquare && thirdSquare) {
        this.addScore();

        if (firstSquare === secondSquare && secondSquare === thirdSquare) return true
      }
    }
    return false;
  }

  checkDiag() {
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
    if (this.activePlayer === "X") {
      this.player1Score.update(x => x + 1)
    } else if (this.activePlayer === "O") {
      this.player2Score.update(x => x + 1)
    }
  }
}
