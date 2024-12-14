//board rendering
var result1;
var result2;
var turn = 0;
var invalid=0;
bar=[0,0];
const gameState = Object.freeze({
  GAME: "GAME",
  MENU: "MENU",
  RESTART: "RESTART",
});
var gamePhase = gameState.GAME;
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
    { nr: 6, color: "white", col: 19 },
    { nr: 3, color: "white", col: 17 },
    { nr: 6, color: "white", col: 1 },
    { nr: 2, color: "white", col: 12 },
    { nr: 6, color: "black", col: 7 },
    { nr: 3, color: "black", col: 5 },
    { nr: 6, color: "black", col: 13 },
    { nr: 2, color: "black", col: 24 },
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
      } else destCol = col + die;
    } else { //black
      if (col > 12 && col < 25)
        destCol = col - die < 13 ? 13 + die - col : col - die;
      else destCol = col + die;
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
        if (invalid===2) return 0;
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
  if (gamePhase === gameState.GAME) {
    renderBoard();
    let color;
    let i=0;
    let dices=[]
    let diceChoice=0;
    let diceRolled = false;
    document.getElementById("roll").addEventListener("click", () => {
      if(diceRolled) return;
      rollDice();
      diceChoice=0;
      document.getElementById("die2").style.boxShadow=""
      document.getElementById("die1").style.boxShadow=""
      diceRolled = true;
      color = (turn++%2) ? 'black' : 'white';
    });
    
    document.getElementById("die1").addEventListener("click",() =>{
        if(!diceChoice)
            document.getElementById("die1").style.boxShadow="0 0 20px 5px aqua" 
        else {
            document.getElementById("die2").style.boxShadow=""
            document.getElementById("die1").style.boxShadow="0 0 20px 5px aqua"
        }
        diceChoice=1;
        dices=[document.getElementById("die1").dataset.value,document.getElementById("die2").dataset.value];
    })
    document.getElementById("die2").addEventListener("click",() =>{
        
        if(!diceChoice)
            document.getElementById("die2").style.boxShadow="0 0 20px 5px aqua"
        else {
            document.getElementById("die1").style.boxShadow=""
            document.getElementById("die2").style.boxShadow="0 0 20px 5px aqua"
        }
        diceChoice=2;
        dices=[document.getElementById("die2").dataset.value,document.getElementById("die1").dataset.value];
    })
    board.addEventListener("click", (e) => {
      if (!diceRolled) {
        alert("Please roll the dice first");
        return;
      }
      if(!diceChoice){
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
      console.log(dices[i])
      if(!movePiece(color,parseInt(dices[i]),col)){
      renderBoard()
      ++i;
      if(i==2){
        diceRolled = false;
        document.getElementById("die1").style.boxShadow=""
        document.getElementById("die2").style.boxShadow=""
        diceChoice=0;
        i=0;
        dices=[];
      }
    }
    else{
        if (invalid==2)
            alert("nu exista mutari valide,trecem peste tura")
        else 
            alert("selecteaza alta combinatie")
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
