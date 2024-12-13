//board rendering
window.onload = () => {

    const board = document.getElementById("board");
    const ctx = board.getContext("2d");
    const boardW = board.width;
    const boardH = board.height;
    
    ctx.fillStyle = "#f0d9b5";
    ctx.fillRect(0, 0, boardW, boardH);

    const barW = boardW / 15;

    ctx.fillStyle = "#7b4123";
    ctx.fillRect((boardW - barW) / 2, 0, barW, boardH);

    const triangleW = boardW / 13;
    const triangleH = boardH / 2;
    const triangleColors = ["#d2691e", "#ffffff"];

    var positions = [
        { nr: 6, color: 'white', col: 19 },
        { nr: 3, color: 'white', col: 17 },
        { nr: 6, color: 'white', col: 1 },
        { nr: 2, color: 'white', col: 12 },
        { nr: 6, color: 'black', col: 7 },
        { nr: 3, color: 'black', col: 5 },
        { nr: 6, color: 'black', col: 13 },
        { nr: 2, color: 'black', col: 24 },
    ];

    for (let i = 0; i < 6; i++) {
        const x = i * triangleW;
        drawTriangle(ctx, x, 0, true, triangleColors[i % 2 + 1], triangleH, triangleW);
        drawTriangle(ctx, x, boardH, false, triangleColors[i % 2], triangleH, triangleW);
    }
    for (let i = 6; i < 12; i++) {
        const x = (i * triangleW) + triangleW;
        drawTriangle(ctx, x, 0, true, triangleColors[i % 2 + 1], triangleH, triangleW);
        drawTriangle(ctx, x, boardH, false, triangleColors[i % 2], triangleH, triangleW);
    }
    for (const p of positions) {
        let i = p.nr;
        while (i > 0) {
            if (p.col <= 6)
                drawPiece(ctx, triangleW * (p.col - 1), triangleW / 2 * (i - 0.98), p.color, triangleW);
            if (p.col > 6 && p.col <= 12)
                drawPiece(ctx, triangleW * (p.col), triangleW / 2 * (i - 0.98), p.color, triangleW);
            if (p.col > 12 && p.col <= 18)
                drawPiece(ctx, triangleW * (p.col - 13), triangleW / 2 * (14.62 - i), p.color, triangleW);
            if (p.col > 18 && p.col <= 24)
                drawPiece(ctx, triangleW * (p.col - 12), triangleW / 2 * (14.62 - i), p.color, triangleW);
            i -= 1;
        }
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
    ctx.arc(x + triangleW / 2, y + 6*6, (triangleW / 2) - 36, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth=5;
    if(color=='white')
        ctx.strokeStyle='black';
    else if(color=='black')
        ctx.strokeStyle='white'
    ctx.stroke();
}
function rollSingleDie() {
    return Math.floor(Math.random() * 6) + 1;
}

function rollDice() {
    const die1 = document.getElementById("die1");
    const die2 = document.getElementById("die2");

    const result1 = rollSingleDie();
    const result2 = rollSingleDie();

    switch (result1) {
        case 1:
            die1.style.backgroundImage = "url('images/dice1.png')";
            break;
        case 2:
            die1.style.backgroundImage = "url('images/dice2.png')";
            break;
        case 3:
            die1.style.backgroundImage = "url('images/dice3.png')";
            break;
        case 4:
            die1.style.backgroundImage = "url('images/dice4.png')";
            break;
        case 5:
            die1.style.backgroundImage = "url('images/dice5.png')";
            break;
        case 6:
            die1.style.backgroundImage = "url('images/dice6.png')";
            break;
    }

    switch (result2) {
        case 1:
            die2.style.backgroundImage = "url('images/dice1.png')";
            break;
        case 2:
            die2.style.backgroundImage = "url('images/dice2.png')";
            break;
        case 3:
            die2.style.backgroundImage = "url('images/dice3.png')";
            break;
        case 4:
            die2.style.backgroundImage = "url('images/dice4.png')";
            break;
        case 5:
            die2.style.backgroundImage = "url('images/dice5.png')";
            break;
        case 6:
            die2.style.backgroundImage = "url('images/dice6.png')";
            break;
    }

    die1.classList.add("roll");
    die2.classList.add("roll");

    setTimeout(() => {
        die1.classList.remove("roll");
        die2.classList.remove("roll");
    }, 500);


}
