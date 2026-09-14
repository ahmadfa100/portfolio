const canvas = document.getElementById("hero_canvas");
const hero = document.getElementById("hero");
const ctx = canvas.getContext("2d");

let particles = [];

const normalParticlesCount = 30;
const maxConnectionDistance = 110;

function resizeCanvas() {
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createParticle(x, y, burst = false) {
  const angle = Math.random() * Math.PI * 2;
  const burstSpeed = Math.random() * 1.2 + 0.4;

  return {
    x: x,
    y: y,
    size: Math.random() * 2 + 1.5,
    speedX: burst ? Math.cos(angle) * burstSpeed : (Math.random() - 0.5) * 0.35,
    speedY: burst ? Math.sin(angle) * burstSpeed : (Math.random() - 0.5) * 0.35,
    alpha: burst ? 0 : 0.45,
    maxAlpha: burst ? 0.7 : 0.45,
    life: burst ? 45 : null,
    burst: burst,
  };
}

function createParticles() {
  particles = [];

  for (let i = 0; i < normalParticlesCount; i++) {
    particles.push(
      createParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
      ),
    );
  }
}

createParticles();

function updateParticles() {
  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];

    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.burst) {
      if (particle.alpha < particle.maxAlpha && particle.life > 25) {
        particle.alpha += 0.04;
      }

      if (particle.life <= 20) {
        particle.alpha -= 0.035;
      }

      particle.speedX *= 0.98;
      particle.speedY *= 0.98;
      particle.life--;
    } else {
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX = -particle.speedX;
      }

      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY = -particle.speedY;
      }
    }
  }

  particles = particles.filter(function (particle) {
    if (!particle.burst) {
      return true;
    }

    return particle.life > 0 && particle.alpha > 0;
  });
}

function drawParticles() {
  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(8, 126, 164, " + particle.alpha + ")";
    ctx.fill();
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxConnectionDistance) {
        let opacity = (1 - distance / maxConnectionDistance) * 0.12;

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = "rgba(37, 195, 230, " + opacity + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateParticles();
  drawParticles();
  connectParticles();

  requestAnimationFrame(animate);
}

animate();

canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (let i = 0; i < 4; i++) {
    particles.push(createParticle(mouseX, mouseY, true));
  }
});
