//board rendering
// box shadowu futut dupa ce faci miscari la bar, fa-l sa se updateze.
var result1;
var result2;
var turn = 0;
var invalid=0;
var bar=[0,0];
let winColor;
let scor1=0;
let scor2=0;
const gameState = Object.freeze({
  GAME: "GAME",
  MENU: "MENU",
  RESTART: "RESTART",
});
var playerNames=[];
let gamePhase = gameState.MENU;
window.onload = () => {
  const board = document.getElementById("board");
  const ctx = board.getContext("2d");
  const boardW = board.width;
  const boardH = board.height;
 
  const barW = boardW / 15;
  const triangleW = boardW / 13;
  const triangleH = boardH / 2;
  const triangleColors = ["#d2691e", "#ffffff"];
  var positions = [
    { nr: 5, color: "white", col: 19 },
    { nr: 5, color: "white", col: 1 },
    { nr: 2, color: "white", col: 12 },
    { nr: 3, color: "white", col: 17 },
    { nr: 5, color: "black", col: 7 },
    { nr: 5, color: "black", col: 13 },
    { nr: 2, color: "black", col: 24 },
    { nr: 3, color: "black", col: 5 },

  ];
  
  function renderBoard() {
    ctx.clearRect(0, 0, boardW, boardH);
    ctx.fillStyle = "#f0d9b5";
    ctx.fillRect(0, 0, boardW, boardH);
    ctx.fillStyle = "#7b4123";
    ctx.fillRect((boardW - barW) / 2, 0, barW, boardH);
    for (let i = 0; i < 6; i++) {
      const x = i * triangleW;
      drawTriangle(
        ctx,
        x,
        0,
        true,
        triangleColors[(i % 2) + 1],
        triangleH,
        triangleW
      );
      drawTriangle(
        ctx,
        x,
        boardH,
        false,
        triangleColors[i % 2],
        triangleH,
        triangleW
      );
    }
    for (let i = 1; i <= bar[0];i++)
    {
        drawPiece(ctx,6*triangleW,(triangleW / 2) * (i - 0.98),'black',triangleW)
    }
    for (let i = 1; i <= bar[1];i++)
        {
            drawPiece(ctx,6*triangleW,(triangleW / 2) * (14.62-i),'white',triangleW)
        }
    for (let i = 6; i < 12; i++) {
      const x = i * triangleW + triangleW;
      drawTriangle(
        ctx,
        x,
        0,
        true,
        triangleColors[(i % 2) + 1],
        triangleH,
        triangleW
      );
      drawTriangle(
        ctx,
        x,
        boardH,
        false,
        triangleColors[i % 2],
        triangleH,
        triangleW
      );
    }

    for (const p of positions) {
      let i = p.nr;
      while (i > 0) {
        if (p.col <= 6)
          drawPiece(
            ctx,
            triangleW * (p.col - 1),
            (triangleW / 2) * (i - 0.98),
            p.color,
            triangleW
          );
        if (p.col > 6 && p.col <= 12)
          drawPiece(
            ctx,
            triangleW * p.col,
            (triangleW / 2) * (i - 0.98),
            p.color,
            triangleW
          );
        if (p.col > 12 && p.col <= 18)
          drawPiece(
            ctx,
            triangleW * (p.col - 13),
            (triangleW / 2) * (14.62 - i),
            p.color,
            triangleW
          );
        if (p.col > 18 && p.col <= 24)
          drawPiece(
            ctx,
            triangleW * (p.col - 12),
            (triangleW / 2) * (14.62 - i),
            p.color,
            triangleW
          );
        i -= 1;
      }
    }
  }

  function getColumnFromClick(mouseX, unscaled, unscaledY, rect) {
    let col =
      unscaled < rect.width / 2
        ? Math.floor(mouseX / triangleW)
        : Math.floor(mouseX / triangleW) - 1;
    if (unscaledY > rect.height / 2) col += 12;
    return col + 1;
  }
  function movePiece(color, die, col) {
    let destCol = 0;
    let indexColorBar= color==='white' ? 1 : 0 ;
    if(bar[indexColorBar]) destCol= color==='white' ? 12-die+1 : 24-die+1
    else if(checkHome(color,positions)){
      const index = positions.findIndex(
        (p) => p.color === color && p.col === col
      );
      if (index === -1) {
        alert("no piece found on pointer:", col);
        return 1;
      }
      if(color==='white'){
          if(die>25-col && positions.findIndex((p) => (p.col<col && p.col>18 && p.color==='white'))!=-1){
            alert("Exista o coloana prioritara in stanga")
            return 1;
          }
          if(die+col>=25){
            const index = positions.findIndex(
              (p) => p.color === color && p.col === col
            );
            positions[index].nr--;
            if (positions[index].nr === 0) positions.splice(index, 1);
            return 0;
          }
          else {
            destCol=col+die;
            if(positions[index]){
              if(positions.findIndex((p) => (p.col===destCol && p.nr>=2 && p.color==='black'))!=-1)
                return 1;
            }
            if(destCol===0) return;
            positions[index].nr--;
            if (positions[index].nr === 0) positions.splice(index, 1);          }      
      }
      else{
        if(die>13-col && positions.findIndex((p) => (p.col<col && p.col>6 && p.nr>0 && p.color==='black'))!=-1){
          alert("Exista o coloana prioritara in stanga")
          return 1;
        }
        if(die+col>=13){
          const index = positions.findIndex(
            (p) => p.color === color && p.col === col
          );
          positions[index].nr--;
          if (positions[index].nr === 0) positions.splice(index, 1);
          return 0;
        }
        else {
          destCol=col+die;
          if(positions[index]){
            if(positions.findIndex((p) => (p.col===destCol && p.nr>=2 && p.color==='white'))!=-1)
              return 1;
          }
          if(destCol===0) return; 
          positions[index].nr--;
          if (positions[index].nr === 0) positions.splice(index, 1);
    
      }   
      }
    }
    else {
        const index = positions.findIndex(
            (p) => p.color === color && p.col === col
          );
          if (index === -1) {
            alert("no piece found on pointer:", col);
            return 1;
          }
        if (color === "white") {
      if (col > 0 && col < 13) {
        destCol = col <= die ? 13 - col + die : col - die;
      } else if(col+die<=24) destCol = col + die;
    } else { //black
      if (col > 12 && col < 25)
        destCol = col - die < 13 ? 13 + die - col : col - die;
      else if(col>0 && col<13 && col+die<=12) {
        destCol = col + die;

      }
    }
    if(destCol===0) return 1;
    const destIndex = positions.findIndex((p) => p.col === destCol);
    if (destIndex !== -1) {
      const opponentColor = color === 'white' ? 'black' : 'white';
      if (positions[destIndex].color === opponentColor && positions[destIndex].nr >= 2) {
        alert("Cannot move, opponent's pieces block the destination.");
        renderBoard();
        return 1;
      }
    }

    positions[index].nr -= 1;
    if (positions[index].nr === 0) positions.splice(index, 1);
    }
   
    const destIndex = positions.findIndex((p) => p.col === destCol);
      if (destIndex === -1) {
        positions.push({ nr: 1, color: color, col: destCol });
        if(bar[indexColorBar])
            bar[indexColorBar]--;
    }
    else if (positions[destIndex].color === color) {
        positions[destIndex].nr += 1;
        if(bar[indexColorBar])
            bar[indexColorBar]--;
    }
    else {
      if (positions[destIndex].nr === 1) {
        positions[destIndex].color = color;
        positions[destIndex].nr = 1;
        if(color=='white')
            bar[0]+=1;  //0 is black
        else 
            bar[1]+=1; //1 is white
        if(bar[indexColorBar])
            bar[indexColorBar]--;
      } else {
        alert("mutare invalida, inamicul are poarta");
        renderBoard();
        if(bar[indexColorBar]){
            invalid++;
        }
        return 1;
      }
    }
    invalid=0;

    renderBoard();
    return 0;
  }
  function rollSingleDie() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function rollDice() {
    const die1 = document.getElementById("die1");
    const die2 = document.getElementById("die2");

    result1 = rollSingleDie();
    result2 = rollSingleDie();

    switch (result1) {
        case 1:
          die1.style.backgroundImage = "url('images/dice1.png')";
          die1.dataset.value = 1; 
          break;
        case 2:
          die1.style.backgroundImage = "url('images/dice2.png')";
          die1.dataset.value = 2;
          break;
        case 3:
          die1.style.backgroundImage = "url('images/dice3.png')";
          die1.dataset.value = 3;
          break;
        case 4:
          die1.style.backgroundImage = "url('images/dice4.png')";
          die1.dataset.value = 4;
          break;
        case 5:
          die1.style.backgroundImage = "url('images/dice5.png')";
          die1.dataset.value = 5;
          break;
        case 6:
          die1.style.backgroundImage = "url('images/dice6.png')";
          die1.dataset.value = 6;
          break;
      }
      
      switch (result2) {
        case 1:
          die2.style.backgroundImage = "url('images/dice1.png')";
          die2.dataset.value = 1;
          break;
        case 2:
          die2.style.backgroundImage = "url('images/dice2.png')";
          die2.dataset.value = 2;
          break;
        case 3:
          die2.style.backgroundImage = "url('images/dice3.png')";
          die2.dataset.value = 3;
          break;
        case 4:
          die2.style.backgroundImage = "url('images/dice4.png')";
          die2.dataset.value = 4;
          break;
        case 5:
          die2.style.backgroundImage = "url('images/dice5.png')";
          die2.dataset.value = 5;
          break;
        case 6:
          die2.style.backgroundImage = "url('images/dice6.png')";
          die2.dataset.value = 6;
          break;
      }

    die1.classList.add("roll");
    die2.classList.add("roll");

    setTimeout(() => {
      die1.classList.remove("roll");
      die2.classList.remove("roll");
    }, 500);
  }

    
  
  if(gamePhase===gameState.MENU){

      const playerForm = document.getElementById("playerForm");
    const container = document.getElementById("game");
    const startGameButton = document.getElementById("startGame");

    startGameButton.addEventListener("click", () => {
      const player1 = document.getElementById("player1").value.trim();
      const player2 = document.getElementById("player2").value.trim();
      playerNames[0]=player1;
      playerNames[1]=player2;
      if (player1 && player2) {

        playerForm.classList.add("fade-out");

        setTimeout(() => {
          playerForm.style.display = "none";
          container.classList.add("fade-in");
          container.style.display = "block";
          
        }, 500);
        document.getElementById("player1Info").innerText=`${player1}:  ${scor1}`;
        document.getElementById("player2Info").innerText=`${player2}:  ${scor2}`;
        document.getElementById("currentPlayer").innerText=`Current turn: ${playerNames[0]}`

      } else {
        alert("Please enter names for both players.");
      }
    });
    gamePhase = gameState.GAME;
    }
   if (gamePhase === gameState.GAME){
    console.log("game started"); 
    game();
   }
  

  function game(){
    renderBoard();
    let color;
    let dices=[]
    let diceUsed=[false,false];
    let diceChoice=-1;
    let diceRolled = false;
    document.getElementById("roll").addEventListener("click", () => {
      if(diceRolled) return;
      rollDice();
      diceChoice=-1;
      document.getElementById("die2").style.boxShadow=""
      document.getElementById("die1").style.boxShadow=""
      diceRolled = true;
      color = (turn++%2) ? 'black' : 'white';
      dices=[document.getElementById("die1").dataset.value,document.getElementById("die2").dataset.value];

    });
    
    document.getElementById("die1").addEventListener("click",() =>{
      if(diceUsed[0]===false){  
      if(diceChoice==-1)
            document.getElementById("die1").style.boxShadow="0 0 20px 5px aqua" 
        else {
            document.getElementById("die2").style.boxShadow=""
            document.getElementById("die1").style.boxShadow="0 0 20px 5px aqua"
        }
        diceChoice=0;}
    })
    document.getElementById("die2").addEventListener("click",() =>{
        if(diceUsed[1]===false){
        if(diceChoice==-1)
            document.getElementById("die2").style.boxShadow="0 0 20px 5px aqua"
        else{
            document.getElementById("die1").style.boxShadow=""
            document.getElementById("die2").style.boxShadow="0 0 20px 5px aqua"
        }
        diceChoice=1;}
    })
    board.addEventListener("click", (e) => {
      if (!diceRolled) {
        alert("Please roll the dice first");
        return;
      }
      if(diceChoice==-1){
        alert("Please select the die first!");
        return;
      }
      const rect = board.getBoundingClientRect();
      let mouseX = e.clientX - rect.left;
      let mouseY = e.clientY - rect.top;
      let canvasWidth = rect.width;
      //let canvasHeight = rect.height;
      let scaleX = canvasWidth / 1920;
      //let scaleY = canvasHeight / 1080;
      let scaledX = mouseX / scaleX;
      let col = getColumnFromClick(scaledX, mouseX, mouseY, rect);

      
      if(checkValidMoves(color,parseInt(dices[diceChoice]),positions)){
      
      if(!movePiece(color,parseInt(dices[diceChoice]),col)){
      
      renderBoard()
      diceUsed[diceChoice]=true;
      if(diceChoice===0) {
        diceChoice=1;
      }
      else diceChoice=0;
      if(diceChoice===0){
        document.getElementById("die2").style.boxShadow=""
        document.getElementById("die1").style.boxShadow="0 0 20px 5px aqua"
      }
      else if(diceChoice===1){
        document.getElementById("die1").style.boxShadow=""
        document.getElementById("die2").style.boxShadow="0 0 20px 5px aqua"
      }
      if(diceUsed[0] && diceUsed[1]){
        diceRolled = false;
        document.getElementById("die1").style.boxShadow=""
        document.getElementById("die2").style.boxShadow=""
        color==='white' ? document.getElementById("currentPlayer").innerText=`Current player: ${playerNames[1]}` : document.getElementById("currentPlayer").innerText=`Current player: ${playerNames[0]}`; 
        diceChoice=-1;
        i=0;
        diceUsed=[false,false]
        dices=[];
      }
      if(checkWin(color,positions)) {
          if (color==='white') ++scor1; 
          else ++scor2;
          
          document.getElementById("restart").style.display= ""; 
          document.getElementById("game").classList.add("fade-out");
            document.getElementById("game").style.display= "none"; 
            document.getElementById("restart").classList.add("fade-in");
            document.getElementById("restart").style.visibility = "visible"; 
          const playerName= color==='white' ? document.getElementById("player1").value : document.getElementById("player2").value;
          document.getElementById("output").textContent=`Congratulations ${playerName}, you won!`
          document.getElementById("restartGame").addEventListener("click", () =>{
              positions = [
                { nr: 5, color: "white", col: 19 },
                { nr: 5, color: "white", col: 1 },
                { nr: 2, color: "white", col: 12 },
                { nr: 3, color: "white", col: 17 },
                { nr: 5, color: "black", col: 7 },
                { nr: 5, color: "black", col: 13 },
                { nr: 2, color: "black", col: 24 },
                { nr: 3, color: "black", col: 5 },
          
            ];
            document.getElementById("game").classList.add("fade-in");
            document.getElementById("game").style.display= "block"; 
            document.getElementById("restart").classList.add("fade-out");
            document.getElementById("restart").style.visibility = "hidden";
            document.getElementById("restart").style.display = "none";
            diceChoice=-1;
            dices=[];
            diceUsed=[false,false];
            diceRolled = false;
            document.getElementById("die1").style.boxShadow="";
            document.getElementById("die2").style.boxShadow="";
            turn=0;
            renderBoard();
            document.getElementById("player1Info").innerText=`${playerNames[0]}:  ${scor1}`;
            document.getElementById("player2Info").innerText=`${playerNames[1]}:  ${scor2}`;    
            document.getElementById("currentPlayer").innerText=`Current player: ${playerNames[0]}`;
          });
          document.getElementById("refresh").addEventListener("click",() =>{
            location.reload();
          });
          
          return 0;
        
      }
    }
    
    }
    else{
        if((diceUsed[0]===false && diceUsed[1]===true) || (diceUsed[0]===true && diceUsed[1]===false) || (checkValidMoves(color,parseInt(dices[(diceChoice+1)%2]),positions)===false)){
            alert("nu exista mutari valide,trecem peste tura")
            diceRolled = false;
        document.getElementById("die1").style.boxShadow=""
        document.getElementById("die2").style.boxShadow=""
        diceChoice=-1;
        dices=[];
        diceUsed=[false,false];
        color==='white' ? document.getElementById("currentPlayer").innerText=`Current player: ${playerNames[1]}` : document.getElementById("currentPlayer").innerText=`Current player: ${playerNames[0]}`; 
        }
        else{
          if(diceChoice===0) {
          diceChoice=1;
          document.getElementById("die1").style.boxShadow=""
        document.getElementById("die2").style.boxShadow="0 0 20px 5px aqua"
        }
        else {
          diceChoice=0;
          document.getElementById("die2").style.boxShadow=""
          document.getElementById("die1").style.boxShadow="0 0 20px 5px aqua"
  
        }
      }
    }
    });
    }
    
};

function drawTriangle(ctx, x, y, isUp, color, triangleH, triangleW) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + triangleW / 2, isUp ? y + triangleH : y - triangleH);
  ctx.lineTo(x + triangleW, y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
function drawPiece(ctx, x, y, color, triangleW) {
  ctx.beginPath();
  ctx.arc(x + triangleW / 2, y + 6 * 6, triangleW / 2 - 36, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 5;
  if (color == "white") ctx.strokeStyle = "black";
  else if (color == "black") ctx.strokeStyle = "white";
  ctx.stroke();
}
function checkValidMoves(color, die, positions) {
  const barIndex = color === 'white' ? 1 : 0;
  const opponentColor = color === 'white' ? 'black' : 'white';
  if (bar[barIndex] > 0) {
    const targetCol = color === 'white' ? 13 - die : 25 - die;
    const targetIndex = positions.findIndex((p) => p.col === targetCol);

    if (
      targetIndex === -1 || 
      positions[targetIndex].color === color || 
      (positions[targetIndex].color === opponentColor && positions[targetIndex].nr === 1) 
    ) {
      return true;
    }
    return false; 
  }

  for (const p of positions) {
    if (p.color === color) {
      const targetCol = color === 'white' ? p.col>12 ? p.col+die : p.col-die : p.col>12 ? p.col - die : p.col +die;
      const targetIndex = positions.findIndex((s) => s.col === targetCol);

      if (
        targetIndex === -1 ||
        positions[targetIndex].color === color ||
        (positions[targetIndex].color === opponentColor && positions[targetIndex].nr === 1) 
      ) {
        return true; 
      }
    }
  }

  return false; // novalid moves
}
function checkHome(color,positions){
  for (let p of positions){
    if(p.color===color)
    {
      if(color==='white' && p.col<=18 && p.col>0) {
        return false;
        }
      else if (color==='black' && (p.col<=6 || p.col >=13) && p.col>0) return false;
    }
  }
  return true;
}
function checkWin(color,positions){
  for (let p of positions)
  {
    if(p.color===color){
      return false;
    }
  }
  return true;
}
