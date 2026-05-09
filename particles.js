const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;
let mouse = {
    x: null,
    y: null,
    radius: 150
}

let isDarkMode = document.body.classList.contains('dark-mode');

// Listen for mode changes to re-init the game background
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            let wasDarkMode = isDarkMode;
            isDarkMode = document.body.classList.contains('dark-mode');
            if (wasDarkMode !== isDarkMode) {
                init(); // Reinitialize particles for new theme
            }
        }
    });
});
observer.observe(document.body, { attributes: true });

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
    
    // In Dark Mode, the blast is 2x stronger and radius is bigger!
    let blastRadius = isDarkMode ? 400 : 300;
    let blastStrength = isDarkMode ? 45 : 25;

    for (let i = 0; i < particlesArray.length; i++) {
        let dx = particlesArray[i].x - mouse.x;
        let dy = particlesArray[i].y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < blastRadius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (blastRadius - distance) / blastRadius;
            
            let directionX = forceDirectionX * force * blastStrength;
            let directionY = forceDirectionY * force * blastStrength;
            
            particlesArray[i].speedX += directionX;
            particlesArray[i].speedY += directionY;
            
            // In dark mode, clicking causes them to flash a bright color temporarily
            if (isDarkMode) {
                particlesArray[i].color = 'rgba(0, 255, 255, 0.8)'; // Neon Cyan blast flash
            }
        }
    }
});

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

class Particle {
    constructor(x, y, directionX, directionY, size, color, baseColor) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.speedX = directionX;
        this.speedY = directionY;
        this.size = size;
        this.color = color;
        this.baseColor = baseColor;
        this.friction = isDarkMode ? 0.95 : 0.92;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        // In dark mode, add a glow effect
        if (isDarkMode) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        } else {
            ctx.shadowBlur = 0;
        }
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
            // Dark mode pushes them away faster
            let repelMultiplier = isDarkMode ? 1.5 : 0.5;
            this.x -= forceDirectionX * repelMultiplier;
            this.y -= forceDirectionY * repelMultiplier;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        
        // Restore color slowly after a blast
        if (this.color !== this.baseColor) {
             this.color = this.baseColor;
        }

        this.draw();
    }
}

function init() {
    particlesArray = [];
    
    // In dark mode, slightly more particles for a denser space network
    let density = isDarkMode ? 9000 : 12000;
    let numberOfParticles = (canvas.height * canvas.width) / density;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        
        // Dark mode particles are faster
        let speedMultiplier = isDarkMode ? 2.5 : 1.5;
        let directionX = (Math.random() * speedMultiplier) - (speedMultiplier / 2);
        let directionY = (Math.random() * speedMultiplier) - (speedMultiplier / 2);
        
        let color = isDarkMode ? 'rgba(41, 151, 255, 0.8)' : 'rgba(0, 113, 227, 0.4)';
        let baseColor = color;

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color, baseColor));
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
    let connectionDistance = isDarkMode ? 20000 : 15000;
    
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distanceSq = (dx * dx) + (dy * dy);
            
            if (distanceSq < connectionDistance) {
                opacityValue = 1 - (distanceSq / connectionDistance);
                let strokeAlpha = isDarkMode ? (opacityValue * 0.8) : (opacityValue * 0.4);
                let rgb = isDarkMode ? '41, 151, 255' : '0, 113, 227';
                
                ctx.strokeStyle = `rgba(${rgb}, ${strokeAlpha})`;
                ctx.lineWidth = 1;
                // Remove shadow blur for lines for performance
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
    
    let mouseConnection = isDarkMode ? 30000 : 20000;
    if (mouse.x && mouse.y) {
        for (let a = 0; a < particlesArray.length; a++) {
            let dx = particlesArray[a].x - mouse.x;
            let dy = particlesArray[a].y - mouse.y;
            let distanceSq = (dx * dx) + (dy * dy);
            
            if (distanceSq < mouseConnection) {
                opacityValue = 1 - (distanceSq / mouseConnection);
                let strokeAlpha = isDarkMode ? (opacityValue * 0.9) : (opacityValue * 0.6);
                let rgb = isDarkMode ? '41, 151, 255' : '0, 113, 227';
                
                ctx.strokeStyle = `rgba(${rgb}, ${strokeAlpha})`;
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
