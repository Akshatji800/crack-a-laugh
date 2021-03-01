import React, {useState} from "react";
import Cell from "./Cell";
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

export const Board = (props) => {

  //setting initial state
  const [chanceLeft, setChanceLeft] = useState(20)
  const decrementor = () => {
    setChanceLeft(prevchanceLeft => prevchanceLeft-1);
  }
  
  const [hasWon, setHasWon] = useState(false)
  const setHasWonSet = (HasWon) => {
    setHasWon(hasWon => HasWon);
  }

  

  /** creating a board nrows high/ncols wide, each cell randomly lit or unlit */

  const createBoard = () => {
    let board = [];
    //creating array-of-arrays of true/false values
    for(let i=0;i<props.nrows;i++){
      let row=[]
      for(let j=0;j<props.ncols;j++){
        row[j]=(Math.random()<props.chanceLightStartsOn); 
      }
      board.push(row)
    }
    return board
  }
  const [board, setBoard] = useState(createBoard())
  const setBoardSet = (board) => {
    setBoard(board =>board);
  }

  /** handling changing a cell: update board & determine if winner */

  const flipCellsAround = (coord) => {
    let {ncols, nrows} = props;
    let Board = board;
    let [y, x] = coord.split("-").map(Number);


    const flipCell = (y, x) => {
      // if this coord is actually on board, flipping it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        Board[y][x] = !Board[y][x];
      }
    }

    //flipping this cell and the cells around it
    flipCell(y,x)
    flipCell(y-1,x);
    flipCell(y,x+1);
    flipCell(y+1,x);
    flipCell(y,x-1);
    //no. of triesLeft change
    decrementor();
    
    // win when every cell is turned off
    let hasWon = board.every((row) =>
			row.every((cell) => {
				return cell === false;
			})
		);
    setHasWonSet(hasWon);
    //re-rendering the board after every click
    setBoardSet(Board);

  }

  // determining is the game has been won
  const renderBoard = () => {
    let tableBoard = [];
    for (let y = 0; y < props.nrows; y++) {
      let row = [];
      for (let x = 0; x < props.ncols; x++) {
        let coord = `${y}-${x}`;
        row.push(
          <Cell
            key={coord}
            isLit={board[y][x]}
            flipCellsAroundMe={() => flipCellsAround(coord)}
          />
        );
      }
      tableBoard.push(<tr key={y}>{row}</tr>);
    }
    return tableBoard; 
  }


  /** Rendering game board or winning message. */

  return (

      //heading: LIGHTS OUT
      //rendering board
      //smaller heading: TRIES LEFT: {triesLeft}

      //if all cells off, rendering heading: YOU WON
      //when tries left==0, rendering heading: YOU LOST
      
      <div>
      {
        hasWon? 
          <div><h1>YOU WON</h1></div>:
          chanceLeft>0?
          <div><h2>LIGHTS OUT</h2>
            <table className="Board">
            {renderBoard()}
          </table>
          <br></br>
          Chances Left: {chanceLeft}
            </div>:
            <div>
              <h1>GAME OVER</h1>
            </div>  
      }
    </div>

    //[2]TODO:
    //if the game is won, just show a winning msg along with the leaderboard
      // make table board
      // render leaderboard when won or lost

    // TODO
  );
}
