document.addEventListener('DOMContentLoaded', () => {
  const clockDigits = {
    hoursTens: document.querySelector('#hours .tens'),
    hoursOnes: document.querySelector('#hours .ones'),
    minutesTens: document.querySelector('#minutes .tens'),
    minutesOnes: document.querySelector('#minutes .ones'),
    secondsTens: document.querySelector('#seconds .tens'),
    secondsOnes: document.querySelector('#seconds .ones'),
  };

  let use24HourMode = true;

  function setDigit(digitCard, newValue) {
    if (!digitCard) return;
    
    // Get the current value from the front element
    const topElement = digitCard.querySelector('.top');
    const bottomElement = digitCard.querySelector('.bottom');
    const frontElement = digitCard.querySelector('.front');
    const backElement = digitCard.querySelector('.back');
    
    const currentValue = topElement.innerText;
    
    if (currentValue !== newValue) {
      if (currentValue !== '') {
        // Start flipping procedure
        frontElement.innerText = currentValue;
        backElement.innerText = newValue;

        // Ensure elements are upright
        frontElement.style.transform = 'rotateX(0deg)';
        backElement.style.transform = 'rotateX(90deg)';
        frontElement.style.transition = 'none';
        backElement.style.transition = 'none';

        // Trigger reflow
        void digitCard.offsetWidth;

        // Animation timing
        frontElement.style.transition = 'transform 0.3s ease-in';
        backElement.style.transition = 'transform 0.3s ease-out 0.3s';
        
        frontElement.style.transform = 'rotateX(-90deg)';
        backElement.style.transform = 'rotateX(0deg)';
        
        // Update static elements halfway through
        setTimeout(() => {
          topElement.innerText = newValue;
        }, 300);

        setTimeout(() => {
          bottomElement.innerText = newValue;
          // reset states
          frontElement.style.transition = 'none';
          backElement.style.transition = 'none';
          frontElement.innerText = newValue;
          backElement.innerText = newValue;
          frontElement.style.transform = 'rotateX(0deg)';
          backElement.style.transform = 'rotateX(90deg)';
        }, 650);

      } else {
        // Initial set
        topElement.innerText = newValue;
        bottomElement.innerText = newValue;
        frontElement.innerText = newValue;
        backElement.innerText = newValue;
      }
    }
  }

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    
    if (!use24HourMode) {
      hours = hours % 12 || 12;
    }

    const h = String(hours).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    setDigit(clockDigits.hoursTens, h[0]);
    setDigit(clockDigits.hoursOnes, h[1]);
    
    setDigit(clockDigits.minutesTens, m[0]);
    setDigit(clockDigits.minutesOnes, m[1]);
    
    setDigit(clockDigits.secondsTens, s[0]);
    setDigit(clockDigits.secondsOnes, s[1]);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "light") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }

  function toggleFormat() {
    use24HourMode = !use24HourMode;
    // Force immediate update of all digits
    document.querySelectorAll('.top, .bottom, .front, .back').forEach(el => el.innerText = '');
    updateClock();
  }

  function toggleFullscreen() {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      if (requestFullScreen) requestFullScreen.call(docEl);
    } else {
      if (cancelFullScreen) cancelFullScreen.call(doc);
    }
    
    const settingsPanel = document.getElementById('settingsPanel');
    if (settingsPanel && settingsPanel.classList.contains('visible')) {
      settingsPanel.classList.remove('visible');
    }
  }

  document.getElementById('toggleTheme').addEventListener('click', toggleTheme);
  document.getElementById('toggleFormat').addEventListener('click', toggleFormat);
  document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

  document.getElementById('fontSelect').addEventListener('change', (e) => {
    document.body.style.fontFamily = e.target.value;
  });

  const quoteEnable = document.getElementById('quoteEnable');
  const quoteText = document.getElementById('quoteText');
  const quoteSize = document.getElementById('quoteSize');
  const quoteColor = document.getElementById('quoteColor');
  const quoteDisplay = document.getElementById('quoteDisplay');

  const quoteSizeVal = document.getElementById('quoteSizeVal');
  const clockSizeVal = document.getElementById('clockSizeVal');

  quoteEnable.addEventListener('change', (e) => {
    if (e.target.checked) {
      quoteDisplay.classList.remove('hidden');
    } else {
      quoteDisplay.classList.add('hidden');
    }
  });

  quoteText.addEventListener('input', (e) => {
    quoteDisplay.innerText = e.target.value;
  });

  quoteSize.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--quote-size', `${e.target.value}px`);
    if (quoteSizeVal) quoteSizeVal.innerText = e.target.value;
  });

  quoteColor.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--quote-color', e.target.value);
  });

  const sizeRange = document.getElementById('sizeRange');
  let userManuallyScaled = false;
  
  sizeRange.addEventListener('input', (e) => {
    userManuallyScaled = true;
    document.documentElement.style.setProperty('--clock-scale', e.target.value);
    if (clockSizeVal) clockSizeVal.innerText = e.target.value;
  });

  function setInitialFullWidth() {
    if (userManuallyScaled) return;
    
    let isMobile = window.innerWidth <= 768;
    let clockBaseWidth = isMobile ? 260 : 850; 
    
    let targetScale = (window.innerWidth) / clockBaseWidth;
    targetScale = targetScale * 0.9; 

    if (isMobile) {
        let safeHeight = window.innerHeight * 0.75; // Leave space for quote
        let scaleByHeight = safeHeight / 460;
        targetScale = Math.min(targetScale, scaleByHeight);
    }
    
    targetScale = Math.max(0.5, Math.min(targetScale, 5));
    let finalScale = targetScale.toFixed(1);
    
    sizeRange.value = finalScale;
    document.documentElement.style.setProperty('--clock-scale', finalScale);
    if (clockSizeVal) clockSizeVal.innerText = finalScale;
  }

  setInitialFullWidth();
  window.addEventListener('resize', setInitialFullWidth);

  // Particle System Logic
  const effectSelect = document.getElementById('effectSelect');
  const particleContainer = document.getElementById('particle-container');
  let particles = [];
  let targets = [];
  let currentEffect = 'none';
  let animationFrameId = null;

  function updateTargets() {
    const cards = document.querySelectorAll('.flip-card');
    targets = Array.from(cards).map(card => {
      const rect = card.getBoundingClientRect();
      return { top: rect.top, left: rect.left, right: rect.right };
    });
  }

  function resetParticle(p, isInitial) {
    p.x = Math.random() * window.innerWidth;
    p.y = isInitial ? (Math.random() * window.innerHeight * 0.5) : -30;
    p.vy = Math.random() * 1.5 + 1; // fall speed
    p.baseVx = Math.random() * 1 - 0.5; // base wind
    p.rotation = Math.random() * 360;
    p.rotSpeed = Math.random() * 2 - 1;
    p.swayPhase = Math.random() * Math.PI * 2;
    p.isLanded = false;
    p.landTime = 0;
  }

  function createParticle(x = 0, y = 0, isBurst = false) {
    const el = document.createElement('div');
    el.className = `particle ${currentEffect}`;
    el.innerText = currentEffect === 'snow' ? '❄' : '🌸';
    el.style.willChange = 'transform';
    particleContainer.appendChild(el);
    
    const p = { el, isBurst };
    p.size = Math.random() * 10 + 15;
    el.style.fontSize = `${p.size}px`;

    if (isBurst) {
      p.x = x;
      p.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2; 
      p.vx = Math.cos(angle) * speed;
      p.baseVx = p.vx;
      p.vy = Math.sin(angle) * speed - 2; 
      p.rotation = Math.random() * 360;
      p.rotSpeed = Math.random() * 6 - 3;
      p.swayPhase = Math.random() * Math.PI * 2;
      p.isLanded = false;
      p.landTime = 0;
    } else {
      resetParticle(p, true);
    }
    particles.push(p);
  }

  function loopParticles() {
    const now = Date.now();
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];

        if (p.isLanded) {
            if (now > p.landTime) {
                p.isLanded = false; // resume falling
                p.vy = Math.random() * 1.5 + 1;
            }
        } else {
            p.x += p.baseVx + Math.sin(p.y / 60 + p.swayPhase) * 1;
            p.y += p.vy;
            p.rotation += p.rotSpeed;

            if (p.isBurst) {
               p.vy += 0.05; // gravity pull for explosive burst
            }

            if (p.y > window.innerHeight + 50) {
               if (p.isBurst) {
                   p.el.remove();
                   particles.splice(i, 1);
                   continue;
               } else {
                   resetParticle(p, false);
                   continue;
               }
            }

            // Check landing logic
            if (p.vy > 0 && Math.random() < 0.05) { 
              for (let box of targets) {
                  if (p.y > box.top - p.size && p.y < box.top + 5 && p.x > box.left && p.x < box.right) {
                      p.isLanded = true;
                      p.y = box.top - p.size * 0.6; 
                      p.landTime = now + 1500 + Math.random() * 5000;
                      p.vy = 0;
                      break;
                  }
              }
            }
        }
        // translate3d forces hardware acceleration
        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;
    }
    
    if (currentEffect !== 'none') {
        animationFrameId = requestAnimationFrame(loopParticles);
    }
  }

  effectSelect.addEventListener('change', (e) => {
    currentEffect = e.target.value;
    updateTargets();
    particleContainer.innerHTML = '';
    particles = [];
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    if (currentEffect !== 'none') {
      const pCount = currentEffect === 'snow' ? 40 : 25; 
      for (let i = 0; i < pCount; i++) {
          createParticle(0, 0, false);
      }
      loopParticles();
    }
  });

  window.addEventListener('resize', updateTargets);
  document.getElementById('sizeRange').addEventListener('input', updateTargets);

  const settingsPanel = document.getElementById('settingsPanel');
  const settingsBtn = document.getElementById('settingsBtn');
  
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    settingsPanel.classList.toggle('visible');
  });

  document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
      if (settingsPanel.classList.contains('visible')) {
        settingsPanel.classList.remove('visible');
      }
    }
    // Particle click burst
    if (currentEffect !== 'none' && !e.target.closest('.settings-panel') && e.target.id !== 'settingsBtn') {
        for(let i=0; i<10; i++) {
           createParticle(e.clientX, e.clientY, true);
        }
    }
  });

  // Initial call and start interval
  updateClock();
  setInterval(updateClock, 1000);
  
  // Trigger default effect on load
  if (effectSelect.value !== 'none') {
    effectSelect.dispatchEvent(new Event('change'));
  }
});
