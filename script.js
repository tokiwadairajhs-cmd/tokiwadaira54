(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  var mobile = window.matchMedia('(max-width: 960px)');

  if (!header || !toggle || !nav) return;
  header.classList.add('enhanced');

  function closeNav(restoreFocus) {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    toggle.title = 'メニューを開く';
    if (restoreFocus) toggle.focus();
  }

  function syncViewport() {
    toggle.hidden = !mobile.matches;
    closeNav(false);
  }

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    toggle.title = open ? 'メニューを閉じる' : 'メニューを開く';
  });

  nav.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    closeNav(false);
    // Keep keyboard focus at the destination after hiding its navigation link.
    if (mobile.matches) {
      var destination = document.querySelector(link.getAttribute('href'));
      if (destination) {
        destination.setAttribute('tabindex', '-1');
        destination.focus({ preventScroll: true });
        destination.addEventListener('blur', function () {
          destination.removeAttribute('tabindex');
        }, { once: true });
      }
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('open')) closeNav(true);
  });
  document.addEventListener('click', function (event) {
    if (!header.contains(event.target)) closeNav(false);
  });
  header.addEventListener('focusout', function () {
    window.setTimeout(function () {
      if (!header.contains(document.activeElement)) closeNav(false);
    }, 0);
  });

  mobile.addEventListener('change', syncViewport);
  syncViewport();
})();

