(function () {
  const body = document.body;
  const nav = document.getElementById('navLinks');
  const scrollLinks = Array.from(document.querySelectorAll('[data-scroll]'));
  const navLinks = Array.from(document.querySelectorAll('#navLinks [data-scroll]'));
  const navToggle = document.getElementById('navToggle');
  const themeToggle = document.getElementById('themeToggle');
  const heroPanel = document.getElementById('heroPanel');
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const savedTheme = localStorage.getItem('ti-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    body.classList.toggle('theme-light', savedTheme === 'light');
  }

  if (themeToggle) {
    themeToggle.textContent = body.classList.contains('theme-light') ? '☀' : '☾';
    themeToggle.addEventListener('click', () => {
      const next = body.classList.contains('theme-light') ? 'dark' : 'light';
      body.classList.toggle('theme-light', next === 'light');
      localStorage.setItem('ti-theme', next);
      themeToggle.textContent = next === 'light' ? '☀' : '☾';
    });
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      if (nav.classList.contains('open')) {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.background = 'var(--bg-card)';
        nav.style.padding = '12px 16px';
        nav.style.position = 'absolute';
        nav.style.right = '20px';
        nav.style.top = '68px';
        nav.style.border = '1px solid var(--border)';
        nav.style.borderRadius = '12px';
        nav.style.gap = '12px';
      } else {
        nav.removeAttribute('style');
      }
    });
  }

  scrollLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      nav?.classList.remove('open');
      nav?.removeAttribute('style');
      if (navLinks.includes(link)) {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function setActiveLink() {
    if (!sections.length) return;

    const marker = window.scrollY + window.innerHeight * 0.35;
    const headerOffset = 80;
    let activeId = '#' + sections[0].id;

    for (let i = 0; i < sections.length; i++) {
      const top = sections[i].offsetTop - headerOffset;
      const bottom = top + sections[i].offsetHeight;

      if (marker >= top && marker < bottom) {
        activeId = '#' + sections[i].id;
        break;
      }
      if (marker >= top) {
        activeId = '#' + sections[i].id;
      }
    }

    const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
    if (nearBottom) {
      activeId = '#' + sections[sections.length - 1].id;
    }

    navLinks.forEach((link) => {
      if (link.getAttribute('href') === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.section, .hero-copy, .hero-panel').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  if (heroPanel) {
    heroPanel.addEventListener('mousemove', (e) => {
      const rect = heroPanel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x - rect.width / 2) / rect.width) * 6;
      const rotateX = ((rect.height / 2 - y) / rect.height) * 6;
      heroPanel.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    heroPanel.addEventListener('mouseleave', () => {
      heroPanel.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
    });
  }

  if (form && formSuccess) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subjectInput = form.subject ? form.subject.value.trim() : '';
      const message = form.message.value.trim();
      if (!name || !email || !message || !subjectInput) return;

      const subject = encodeURIComponent(subjectInput || 'Portfolio Contact');
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      window.location.href = `mailto:undftd324@gmail.com?subject=${subject}&body=${body}`;
      formSuccess.textContent = 'Draft opened in your email client.';
    });
  }

  // Skills: bouncing icons
  const skillsStage = document.querySelector('.skills-stage');
  const skillCircles = skillsStage ? Array.from(skillsStage.querySelectorAll('.skill-circle')) : [];

  if (skillsStage && skillCircles.length) {
    const nodes = [];
    const padding = 6;

    const stageRect = () => ({
      width: skillsStage.clientWidth,
      height: skillsStage.clientHeight,
    });

    const randomBetween = (min, max) => Math.random() * (max - min) + min;

    function placeCircles() {
      nodes.length = 0;
      const { width, height } = stageRect();

      skillCircles.forEach((circle) => {
        const size = circle.getBoundingClientRect().width || 80;
        let x;
        let y;
        let tries = 0;
        let ok = false;

        while (!ok && tries < 150) {
          x = randomBetween(padding, width - size - padding);
          y = randomBetween(padding, height - size - padding);
          ok = nodes.every((n) => {
            const dx = (n.x + n.size / 2) - (x + size / 2);
            const dy = (n.y + n.size / 2) - (y + size / 2);
            const dist = Math.hypot(dx, dy);
            return dist > (n.size + size) / 2 + 8;
          });
          tries++;
        }

        nodes.push({
          el: circle,
          size,
          x,
          y,
          vx: randomBetween(-1.2, 1.2) || 0.6,
          vy: randomBetween(-1.2, 1.2) || 0.6,
        });

        circle.style.left = '0px';
        circle.style.top = '0px';
      });
    }

    function bounceWalls(node, bounds) {
      if (node.x <= padding) {
        node.x = padding;
        node.vx = Math.abs(node.vx);
      } else if (node.x + node.size >= bounds.width - padding) {
        node.x = bounds.width - padding - node.size;
        node.vx = -Math.abs(node.vx);
      }

      if (node.y <= padding) {
        node.y = padding;
        node.vy = Math.abs(node.vy);
      } else if (node.y + node.size >= bounds.height - padding) {
        node.y = bounds.height - padding - node.size;
        node.vy = -Math.abs(node.vy);
      }
    }

    function handleCollisions(nodes) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (b.x + b.size / 2) - (a.x + a.size / 2);
          const dy = (b.y + b.size / 2) - (a.y + a.size / 2);
          const dist = Math.hypot(dx, dy) || 0.0001;
          const minDist = (a.size + b.size) / 2 + 2;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            // push apart
            a.x -= (nx * overlap) / 2;
            a.y -= (ny * overlap) / 2;
            b.x += (nx * overlap) / 2;
            b.y += (ny * overlap) / 2;

            // swap normal velocity components (elastic, equal mass)
            const va = a.vx * nx + a.vy * ny;
            const vb = b.vx * nx + b.vy * ny;
            const diff = va - vb;

            a.vx -= diff * nx;
            a.vy -= diff * ny;
            b.vx += diff * nx;
            b.vy += diff * ny;
          }
        }
      }
    }

    placeCircles();

    let last = 0;
    function tick(ts) {
      if (!last) last = ts;
      const dt = Math.min((ts - last) / 16, 2); // normalize to ~60fps and clamp
      last = ts;

      const bounds = stageRect();
      handleCollisions(nodes);

      nodes.forEach((n) => {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        bounceWalls(n, bounds);
        n.el.style.transform = `translate3d(${n.x}px, ${n.y}px, 0)`;
      });

      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', placeCircles);
    requestAnimationFrame(tick);
  }
})();
