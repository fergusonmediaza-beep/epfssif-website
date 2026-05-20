/* global $, emailjs, Swal, document, window, console, IntersectionObserver, requestAnimationFrame, setTimeout */

/* ── Shared helper: build an IntersectionObserver with a callback ── */
function createScrollObserver(callback, options) {
  return new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        callback(entry.target);
      }
    });
  }, options);
}

/* ── Scroll reveal ───────────────────────────────────────────────── */
function initScrollReveal() {
  var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;
  var observer = createScrollObserver(function(target) {
    target.classList.add('revealed');
    observer.unobserve(target);
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(function(el) { observer.observe(el); });
}

/* ── Navbar scroll state ─────────────────────────────────────────── */
function initNavbarScroll() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;
  function onScroll() {
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Count-up animation ──────────────────────────────────────────── */
function animateCount(el, start, end, duration) {
  var startTime = null;
  function step(timestamp) {
    if (!startTime) { startTime = timestamp; }
    var progress = Math.min((timestamp - startTime) / duration, 1);
    el.textContent = Math.floor(progress * (end - start) + start) + '%';
    if (progress < 1) { requestAnimationFrame(step); }
  }
  requestAnimationFrame(step);
}

/* ── Asset protection bar ────────────────────────────────────────── */
function triggerAssetAnimation() {
  document.querySelectorAll('.asset-progress-bar').forEach(function(bar) {
    bar.classList.add('in-view');
  });
  document.querySelectorAll('.asset-count').forEach(function(el) {
    animateCount(el, 0, parseInt(el.dataset.target, 10), 1600);
  });
}

function initAssetProtectionAnimation() {
  var section = document.getElementById('asset-protection');
  if (!section) return;
  var observer = createScrollObserver(function() {
    triggerAssetAnimation();
    observer.unobserve(section);
  }, { threshold: 0.3 });
  observer.observe(section);
}

/* ── Page loader ─────────────────────────────────────────────────── */
function initPageLoader() {
  var overlay = document.getElementById('page_loader_overlay');
  if (!overlay) return;
  window.addEventListener('load', function() {
    overlay.classList.add('loader-hidden');
  });
}

/* ── Hero entrance animation ─────────────────────────────────────── */
function applyHeroEntered(els) {
  els.forEach(function(el) {
    if (!el.classList.contains('hero-entered')) {
      el.classList.add('hero-entered');
    }
  });
}

function initHeroEntrance() {
  var els = document.querySelectorAll('.hero-animate-1, .hero-animate-2, .hero-animate-3, .hero-animate-4');
  if (!els.length) return;
  window.addEventListener('load', function() {
    setTimeout(function() {
      els.forEach(function(el) { el.classList.add('hero-entered'); });
    }, 220);
  });
  setTimeout(function() { applyHeroEntered(els); }, 5000);
}

/* ── Promo video player ──────────────────────────────────────────── */
function initVideoPlayer() {
  var videoContainer = document.querySelector('.video-tv');
  if (!videoContainer) return;
  var promoVideo = document.getElementById('promoVideo');
  var playOverlay = document.getElementById('playOverlay');
  videoContainer.addEventListener('click', function() {
    promoVideo.classList.remove('opacity-50');
    promoVideo.classList.add('opacity-100');
    promoVideo.controls = true;
    promoVideo.muted = false;
    promoVideo.play();
    playOverlay.classList.add('d-none');
  }, { once: true });
}

/* ── Init all ────────────────────────────────────────────────────── */
initScrollReveal();
initNavbarScroll();
initAssetProtectionAnimation();
initVideoPlayer();
initPageLoader();
initHeroEntrance();

/* ── jQuery: contact form + mobile nav (single ready block) ─────── */
$(function() {

  if ($("#contact-form").length) {
    emailjs.init("9FEuiw6awosAhcPRI");

    $("#contact-form").on("submit", function(event) {
      event.preventDefault();
      var $btn     = $("#submitBtn");
      var $spinner = $("#submitSpinner");
      var $text    = $("#submitText");

      $btn.prop("disabled", true);
      $spinner.removeClass("d-none");
      $text.text("Sending...");

      var templateParams = {
        Name:    $("#name").val(),
        Email:   $("#email").val(),
        Subject: $("#subject").val(),
        Message: $("#message").val(),
        date:    new Date().toLocaleString()
      };

      emailjs.send("service_i5h4bqn", "template_f0837zz", templateParams)
        .then(function(response) {
          console.log('SUCCESS!', response.status, response.text);
          Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: 'Thank you for reaching out. We will get back to you soon.',
            confirmButtonColor: '#212529'
          });
          $("#contact-form")[0].reset();
        }, function(error) {
          console.log('FAILED...', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong. Please try sending your message again.',
            confirmButtonColor: '#212529'
          });
        })
        .finally(function() {
          $btn.prop("disabled", false);
          $spinner.addClass("d-none");
          $text.text("Send Message");
        });
    });
  }

  $('#mainNavbar .nav-link').on('click', function() {
    var $mobileMenu = $('#mainNavbar');
    if ($mobileMenu.hasClass('show')) {
      $mobileMenu.collapse('hide');
    }
  });

});
