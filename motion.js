const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
sections.forEach((section) => observer.observe(section));

const launchFireworks = (centers, particlesPerBurst = 13) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'fireworks-layer';
  layer.setAttribute('aria-hidden', 'true');
  const symbols = ['✦', '✧', '✿', '♥', '●', '✦', '❀'];
  const colors = ['#ff623f', '#d8ed67', '#ffcd62', '#f29aa0', '#8cc8dd', '#bd9cf3', '#ff8bb4'];
  centers.forEach(([x, y], burst) => {
    for (let index = 0; index < particlesPerBurst; index += 1) {
      const angle = (Math.PI * 2 * index) / particlesPerBurst;
      const distance = 42 + Math.random() * 72;
      const particle = document.createElement('span');
      particle.className = 'firework-particle';
      particle.textContent = symbols[(index + burst) % symbols.length];
      particle.style.setProperty('--x', `${x}px`);
      particle.style.setProperty('--y', `${y}px`);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const fall = 62 + Math.round(Math.random() * 98);
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.setProperty('--dx-drift', `${dx * 1.08}px`);
      particle.style.setProperty('--fall-early', `${Math.round(fall * .35)}px`);
      particle.style.setProperty('--dy-fall', `${dy + fall}px`);
      particle.style.setProperty('--spin', `${Math.round(Math.random() * 300 - 150)}deg`);
      particle.style.setProperty('--size', `${13 + Math.round(Math.random() * 12)}px`);
      particle.style.setProperty('--color', colors[(index + burst) % colors.length]);
      particle.style.setProperty('--delay', `${burst * 70 + Math.random() * 180}ms`);
      layer.appendChild(particle);
    }
  });
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 1850);
};

const launchFullScreenFireworks = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const centers = Array.from({ length: 16 }, () => [
    width * (.06 + Math.random() * .88),
    height * (.08 + Math.random() * .76),
  ]);
  launchFireworks(centers, 20);
};

const runAfterFullScreenFireworks = (action) => {
  launchFullScreenFireworks();
  window.setTimeout(action, 1550);
};

const contactCta = document.querySelector('.contact-cta');
if (contactCta) {
  contactCta.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    launchFullScreenFireworks();
  });
}

document.querySelectorAll('.project').forEach((project) => {
  project.addEventListener('click', (event) => {
    if (project.classList.contains('project-internal')) return;
    event.preventDefault();
    event.stopPropagation();
    runAfterFullScreenFireworks(() => { window.location.href = project.href; });
  });
});

const internalProject = document.querySelector('.project-internal');
const internalProjectModal = document.querySelector('#internal-project-modal');
if (internalProject && internalProjectModal) {
  const closeInternalProjectModal = () => { internalProjectModal.hidden = true; };
  internalProject.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    internalProjectModal.hidden = false;
  });
  internalProjectModal.querySelectorAll('[data-close-modal]').forEach((element) => {
    element.addEventListener('click', closeInternalProjectModal);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeInternalProjectModal();
  });
}

const portrait = document.querySelector('.portrait');
if (portrait) {
  portrait.addEventListener('click', (event) => {
    event.stopPropagation();
    launchFullScreenFireworks();
  });
  portrait.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      launchFullScreenFireworks();
    }
  });
}

const contactLink = document.querySelector('.text-link[href="#contact"]');
if (contactLink) {
  contactLink.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    runAfterFullScreenFireworks(() => document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }));
  });
}

document.addEventListener('click', (event) => launchFireworks([[event.clientX, event.clientY]]));

const finePointer = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
if (finePointer.matches) {
  const glow = document.querySelector('.cursor-glow');
  const heroRing = document.querySelector('.hero');
  const magnetic = document.querySelectorAll('.round-link, .availability');
  const cards = document.querySelectorAll('.project');

  window.addEventListener('pointermove', (event) => {
    glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`;
    glow.classList.add('is-active');
    const x = (event.clientX / window.innerWidth - 0.5) * 14;
    const y = (event.clientY / window.innerHeight - 0.5) * 14;
    heroRing.style.setProperty('--mouse-x', `${x}px`);
    heroRing.style.setProperty('--mouse-y', `${y}px`);
    heroRing.style.setProperty('perspective', '900px');
  });

  document.addEventListener('pointerleave', () => glow.classList.remove('is-active'));
  document.querySelectorAll('a, .portrait').forEach((item) => {
    item.addEventListener('pointerenter', () => glow.classList.add('is-hovering'));
    item.addEventListener('pointerleave', () => glow.classList.remove('is-hovering'));
  });

  magnetic.forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const box = item.getBoundingClientRect();
      const x = (event.clientX - (box.left + box.width / 2)) * 0.16;
      const y = (event.clientY - (box.top + box.height / 2)) * 0.16;
      item.style.transform = `translate(${x}px, ${y}px)`;
    });
    item.addEventListener('pointerleave', () => { item.style.transform = ''; });
  });

  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 3.2}deg) rotateY(${x * 3.2}deg) translateY(-8px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}
