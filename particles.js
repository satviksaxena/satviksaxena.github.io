const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;
let mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

window.addEventListener('click', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < particlesArray.length; i++) {
        let dx = particlesArray[i].x - mouse.x;
        let dy = particlesArray[i].y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (300 - distance) / 300;
            
            let directionX = forceDirectionX * force * 25;
            let directionY = forceDirectionY * force * 25;
            
            particlesArray[i].speedX += directionX;
            particlesArray[i].speedY += directionY;
        }
    }
});

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.speedX = directionX;
        this.speedY = directionY;
        this.size = size;
        this.color = color;
        this.friction = 0.92;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
            this.directionY = -this.directionY;
        }

        this.speedX *= this.friction;
        this.speedY *= this.friction;

        if (Math.abs(this.speedX) < Math.abs(this.directionX)) {
            this.speedX += (this.directionX * 0.1);
        }
        if (Math.abs(this.speedY) < Math.abs(this.directionY)) {
            this.speedY += (this.directionY * 0.1);
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            this.x -= forceDirectionX * 0.5;
            this.y -= forceDirectionY * 0.5;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 12000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1.5) - 0.75;
        let directionY = (Math.random() * 1.5) - 0.75;
        let color = 'rgba(0, 113, 227, 0.4)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distanceSq = (dx * dx) + (dy * dy);
            
            if (distanceSq < 15000) {
                opacityValue = 1 - (distanceSq / 15000);
                ctx.strokeStyle = 'rgba(0, 113, 227,' + (opacityValue * 0.4) + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
    
    if (mouse.x && mouse.y) {
        for (let a = 0; a < particlesArray.length; a++) {
            let dx = particlesArray[a].x - mouse.x;
            let dy = particlesArray[a].y - mouse.y;
            let distanceSq = (dx * dx) + (dy * dy);
            
            if (distanceSq < 20000) {
                opacityValue = 1 - (distanceSq / 20000);
                ctx.strokeStyle = 'rgba(0, 113, 227,' + (opacityValue * 0.6) + ')';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
}

canvas.width = innerWidth;
canvas.height = innerHeight;
init();
animate();
