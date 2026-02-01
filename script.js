const initSmoothScroll = () => {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', href);
      }
    });
  });
};

const initMobileCta = () => {
  const mobileCta = document.getElementById('mobileCta');
  const hero = document.getElementById('hero');
  if (!mobileCta || !hero) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          mobileCta.classList.remove('is-visible');
          mobileCta.setAttribute('aria-hidden', 'true');
        } else {
          mobileCta.classList.add('is-visible');
          mobileCta.setAttribute('aria-hidden', 'false');
        }
      });
    },
    { rootMargin: '-20% 0px 0px 0px' }
  );

  observer.observe(hero);
};

const initImageFallbacks = () => {
  const images = document.querySelectorAll('img[data-fallback]');
  images.forEach((img) => {
    const wrapper = img.closest('.media-frame');
    if (!wrapper) return;
    img.addEventListener('error', () => {
      wrapper.classList.add('is-missing');
    });
  });
};

const initModals = () => {
  const openButtons = document.querySelectorAll('[data-modal-open]');
  const closeButtons = document.querySelectorAll('[data-modal-close]');
  const modals = document.querySelectorAll('.modal');
  let lastActive = null;

  const openModal = (modal) => {
    lastActive = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    const focusTarget = modal.querySelector('input, button, [href], [tabindex]:not([tabindex="-1"])');
    if (focusTarget) focusTarget.focus();
    modal.dispatchEvent(new CustomEvent('modal:open'));
  };

  const closeModal = (modal) => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-success');
    document.body.classList.remove('no-scroll');
    if (lastActive) lastActive.focus();
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = button.getAttribute('data-modal-open');
      const modal = document.getElementById(targetId);
      if (modal) openModal(modal);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) closeModal(modal);
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modals.forEach((modal) => {
        if (modal.classList.contains('is-open')) closeModal(modal);
      });
    }
  });
};

const initWaitlistForm = () => {
  const modal = document.getElementById('waitlist-modal');
  const form = document.getElementById('waitlistForm');
  const message = document.getElementById('waitlistMessage');
  const success = document.getElementById('waitlistSuccess');
  const emailInput = document.getElementById('email');

  if (!modal || !form || !message || !success || !emailInput) return;

  const showSuccess = () => {
    modal.classList.add('is-success');
    message.textContent = '';
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const syncState = () => {
    const saved = localStorage.getItem('waitlistEmail');
    if (saved) {
      showSuccess();
      success.querySelector('p').textContent = "You're on the list.";
    } else {
      modal.classList.remove('is-success');
      message.textContent = '';
      form.reset();
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();

    if (!emailRegex.test(email)) {
      message.textContent = 'Please enter a valid email.';
      return;
    }

    localStorage.setItem('waitlistEmail', email);
    showSuccess();
    success.querySelector('p').textContent = "You're on the list.";
  });

  modal.addEventListener('modal:open', syncState);
};

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initMobileCta();
  initImageFallbacks();
  initModals();
  initWaitlistForm();
});
