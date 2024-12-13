const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const page1Btn = document.getElementById('page1Btn');
const page2Btn = document.getElementById('page2Btn');
const contentDiv = document.getElementById('content');

function updateContent(page) {
    let htmlContent = '';
    switch (page) {
        case 'page1':
            htmlContent = '<h3>Прикольно</h3>';
            break;
        case 'page2':
            htmlContent = '<h3>Ничего себе</h3>';
            break;
        default:
            htmlContent = '<h3>Кликай скорее</h3>';
    }
    contentDiv.innerHTML = htmlContent;
}

page1Btn.addEventListener('click', () => {
    history.pushState({ page: 'page1' }, 'Прикольно', '?page=1');
    updateContent('page1');
});

page2Btn.addEventListener('click', () => {
    history.pushState({ page: 'page2' }, 'Ничего себе', '?page=2');
    updateContent('page2');
});

backBtn.addEventListener('click', () => {
    history.back();
});

forwardBtn.addEventListener('click', () => {
    history.forward();
});

window.addEventListener('popstate', (event) => {
    updateContent(event.state ? event.state.page : null);
});


const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: 'blue', 
    dx: 2,
    dy: 3,
};

const speedControl = document.getElementById('speed');

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function updateBallPosition() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    updateBallPosition();
    requestAnimationFrame(animate);
}

speedControl.addEventListener('input', (event) => {
    const speed = parseInt(event.target.value, 10);
    ball.dx = ball.dy = speed / 2; 
});

animate();

const worker = new Worker(URL.createObjectURL(new Blob([`
    onmessage = function(e) {
        const num = e.data;
        const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
        postMessage(factorial(num));
    }
`], 
{ type: 'application/javascript' })));

const factorialInput = document.getElementById('factorialInput');
const calculateButton = document.getElementById('calculate');
const outputDiv = document.getElementById('output');

calculateButton.addEventListener('click', () => {
    const num = parseInt(factorialInput.value);
    if (isNaN(num) || num < 0) {
        outputDiv.textContent = 'Введите положительное число!';
        return;
    }
    outputDiv.textContent = 'Вычисления...';
    worker.postMessage(num);
});

worker.onmessage = function(e) {
    outputDiv.textContent = `Результат: ${e.data}`;
};
