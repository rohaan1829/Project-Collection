/* ─────────────────────────────────────────────────────────────
   Rohaan Ashraf · script.js
   Lenis smooth scroll · GSAP horizontal pin
   ───────────────────────────────────────────────────────────── */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;

  /* ─────  LENIS smooth scroll ───── */
  let lenis = null;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (window.Lenis && !reduceMotion && !isIOS) {
    lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      syncTouch: false,
    });

    if (window.gsap && window.ScrollTrigger) {
      // Drive Lenis from GSAP's ticker (single rAF loop instead of two)
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }

    // anchor links → lenis scrollTo
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
          const el = document.querySelector(id);
          if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -60 }); }
        }
      });
    });
  }

  /* ─────  CLOCK (Pakistan Standard Time, UTC+5) ───── */
  const clock = document.getElementById('clock');
  if (clock) {
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const d = new Date();
      const pkt = new Date(d.getTime() + (5 * 60 * 60 * 1000) + (d.getTimezoneOffset() * 60 * 1000));
      clock.textContent =
        `${pad(pkt.getHours())}:${pad(pkt.getMinutes())}:${pad(pkt.getSeconds())} PKT`;
    };
    tick(); setInterval(tick, 1000);
  }

  /* ─────  MOBILE NAV SHEET ───── */
  const burger = document.getElementById('navBurger');
  const sheet = document.getElementById('navSheet');

  if (burger && sheet) {
    let sheetOpen = false;

    const openSheet = () => {
      sheetOpen = true;
      sheet.classList.add('is-open');
      sheet.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.documentElement.classList.add('sheet-open');
      document.body.classList.add('sheet-open');
      if (lenis) lenis.stop();
      setTimeout(() => sheet.querySelector('.sheet__close')?.focus(), 80);
    };

    const closeSheet = () => {
      if (!sheetOpen) return;
      sheetOpen = false;
      sheet.classList.remove('is-open');
      sheet.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.documentElement.classList.remove('sheet-open');
      document.body.classList.remove('sheet-open');
      if (lenis) lenis.start();
      burger.focus();
    };

    burger.addEventListener('click', () => {
      sheetOpen ? closeSheet() : openSheet();
    });

    sheet.querySelectorAll('[data-sheet-close], [data-sheet-link]').forEach((el) => {
      el.addEventListener('click', closeSheet);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sheetOpen) closeSheet();
    });

    // close on resize to desktop so state doesn't get stuck
    window.addEventListener('resize', () => {
      if (sheetOpen && window.innerWidth > 820) closeSheet();
    }, { passive: true });
  }

  /* ─────  PROJECT MODAL ───── */
  const projectBriefs = {
    helperhive: {
      kicker: 'Capstone · Full-stack · 2025',
      title: 'HelperHive',
      titleEm: '',
      deck: 'An on-demand services marketplace that connects households with verified domestic-help providers, with real-time booking and chat baked in from day one.',
      dl: {
        'The problem': 'Booking trusted house-help in our region runs on word-of-mouth. The product needed to make discovery, scheduling, and live communication feel as easy as ordering a cab.',
        'What I built': 'The full-stack: role-based authentication, scalable REST APIs, real-time booking flows, an in-app chat service with NLP-powered sentiment analysis, and Firebase-backed dashboards for both clients and providers.',
        'Stack': '<code>Node</code> <code>Express</code> <code>Firebase</code> <code>NLP</code> <code>React</code>',
        'Outcome': 'Delivered as the capstone for a four-person team I led; handled concurrent booking flows without race conditions and shipped a chat layer that flagged unhealthy interactions automatically.'
      },
      meta: '2025 · Capstone Project',
    },
    fbr: {
      kicker: 'Client Engagement · 2024',
      title: 'FBR Compliance CRM',
      titleEm: '',
      deck: 'An invoicing and customer-relationship system built specifically to meet Pakistan\'s FBR tax-compliance regulations, with an analytics layer on top.',
      dl: {
        'The problem': 'SMBs were burning hours every month reconciling sales against shifting FBR tax rules, then re-keying the same data into accounting tools. Errors were expensive and audits worse.',
        'What I built': 'A CRM with automated tax calculation, FBR-aligned invoice generation, a customer ledger, and a revenue-and-reporting dashboard. Heavy attention to query performance on long transaction histories.',
        'Stack': '<code>Node</code> <code>PostgreSQL</code> <code>Reporting</code> <code>Auth</code>',
        'Outcome': 'Took monthly compliance work from days to minutes for the operator, and made audit-ready reports a one-click export.'
      },
      meta: '2024 · Client engagement',
    },
    smartformgen: {
      kicker: 'Automation · GPT · 2024',
      title: 'SmartFormGen',
      titleEm: '',
      deck: 'A browser-based automation that reads any web form, understands what each field wants, and drafts an intelligent fill using a custom GPT prompt pipeline.',
      dl: {
        'The problem': 'Knowledge workers were re-typing the same answers into a dozen different forms each week. Off-the-shelf autofill was too dumb; LLM chat was too manual.',
        'What I built': 'A browser tool that scans DOM forms, infers field semantics, and produces a context-aware draft via GPT. The user reviews, edits, and submits in a single pass.',
        'Stack': '<code>JavaScript</code> <code>Browser APIs</code> <code>GPT</code> <code>Prompt Eng.</code>',
        'Outcome': 'Cut average form-fill time meaningfully and turned a class of repetitive admin work into a review-and-confirm flow.'
      },
      meta: '2024 · Side project, productionised',
    },
    corextech: {
      kicker: 'Full Stack Developer · CorexTech · 2025',
      title: 'CorexTech · Email Platform',
      titleEm: '',
      deck: 'A cross-platform email-marketing automation product where I shipped the server-side modules and the API integrations that the mobile and web clients depend on.',
      dl: {
        'The problem': 'The product needed shared business logic across React Native and web — reused without duplication — plus a tidy REST API to absorb a fast-growing list of third-party integrations.',
        'What I built': 'Reusable modules behind a clean MVC structure, REST integrations for third-party services, and the feature work that gets shipped through Agile cycles. Led client requirement-gathering sessions and translated business needs into deliverables.',
        'Stack': '<code>Node</code> <code>Express</code> <code>React Native</code> <code>REST</code>',
        'Outcome': 'Improved maintainability across the platform, shortened feature cycles, and built direct client trust through requirement workshops that consistently shipped on what was promised.'
      },
      meta: '2025 · Full-time engagement',
    },
  };

  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalKicker = document.getElementById('modalKicker');
  const modalMeta = document.getElementById('modalMeta');

  const renderBrief = (key) => {
    const b = projectBriefs[key];
    if (!b) return;
    modalKicker.textContent = b.kicker;
    modalMeta.textContent = b.meta || '';

    let html = `<h3 class="m-title">${b.title}${b.titleEm ? ` <em>${b.titleEm}</em>` : ''}</h3>`;
    html += `<span class="m-kicker">${b.kicker}</span>`;
    html += `<p class="m-deck">${b.deck}</p>`;
    html += `<dl class="m-dl">`;
    Object.entries(b.dl).forEach(([k, v]) => {
      html += `<dt>${k}</dt><dd>${v}</dd>`;
    });
    html += `</dl>`;
    modalBody.innerHTML = html;
    modalBody.scrollTop = 0;
  };

  let modalOpen = false;
  let lastFocused = null;

  const openModal = (key, trigger) => {
    renderBrief(key);
    modalOpen = true;
    lastFocused = trigger;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    if (lenis) lenis.stop();
    setTimeout(() => modal.querySelector('.modal__close')?.focus(), 60);
  };

  const closeModal = () => {
    if (!modalOpen) return;
    modalOpen = false;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    if (lenis) lenis.start();
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  };

  document.querySelectorAll('[data-modal]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn.dataset.modal, btn);
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A') {
        // CTA inside modal: close, then let the anchor scroll handler run
        closeModal();
      } else {
        e.preventDefault();
        closeModal();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOpen) closeModal();
  });

  /* ─────  REVEAL ON SCROLL ───── */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ─────  HORIZONTAL PINNED CASE STUDY ───── */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    const caseSection = document.querySelector('.case');
    const track = document.querySelector('.case__track');
    const panels = document.querySelectorAll('.panel');

    let caseTween = null;

    const buildCaseScroll = () => {
      if (!caseSection || !track || !panels.length) return;
      if (window.innerWidth <= 820) return;
      const totalPanels = panels.length;
      const distance = (totalPanels - 1) * window.innerWidth;

      caseTween = gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: caseSection,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: '.case__pin',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    };

    const tearDownCaseScroll = () => {
      if (caseTween) {
        caseTween.scrollTrigger?.kill();
        caseTween.kill();
        caseTween = null;
      }
      if (track) gsap.set(track, { clearProps: 'all' });
    };

    buildCaseScroll();

    // rebuild on breakpoint crossing
    let lastIsMobile = window.innerWidth <= 820;
    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth <= 820;
      if (isMobile !== lastIsMobile) {
        tearDownCaseScroll();
        buildCaseScroll();
        lastIsMobile = isMobile;
      }
    }, { passive: true });

    if (caseSection && track && panels.length && window.innerWidth > 820) {
      const totalPanels = panels.length;
      const distance = (totalPanels - 1) * window.innerWidth;

      // counters trigger when ledger panel hits middle
      const ledgerPanel = document.querySelector('.panel--ledger');
      if (ledgerPanel) {
        const counters = ledgerPanel.querySelectorAll('.counter');
        ScrollTrigger.create({
          trigger: caseSection,
          start: 'top top',
          end: () => `+=${distance}`,
          onUpdate: (self) => {
            // ledger is panel 4 of 5 (index 3); fires around 65–85% progress
            if (self.progress > 0.6 && !ledgerPanel.dataset.counted) {
              ledgerPanel.dataset.counted = '1';
              counters.forEach((c) => {
                const target = parseInt(c.dataset.count, 10);
                const obj = { v: 0 };
                gsap.to(obj, {
                  v: target,
                  duration: 1.8,
                  ease: 'power2.out',
                  onUpdate: () => {
                    c.textContent = Math.round(obj.v).toLocaleString('en-US');
                  },
                });
              });
            }
          },
        });
      }

      // parallax on diagram
      const diagram = document.querySelector('.diagram');
      if (diagram) {
        gsap.to(diagram, {
          y: -30,
          rotation: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: '.panel--diagram',
            containerAnimation: ScrollTrigger.getAll().find(st => st.trigger === caseSection),
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        });
      }
    }

    /* ─────  HERO PARALLAX — one timeline, one ScrollTrigger  ───── */
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.4,
      },
    });
    heroTl
      .to('.display',         { yPercent: 8, ease: 'none' }, 0)
      .to('.hero__meta--tl',  { y: 60,       ease: 'none' }, 0)
      .to('.hero__meta--tr',  { y: 60,       ease: 'none' }, 0);

    /* ─────  KICKER LINE-DRAW UNDERLINE PER SECTION  ───── */
    gsap.utils.toArray('.kicker').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });
  }

  /* ─────  PAGE-LOAD READY CLASS ───── */
  document.documentElement.classList.add('is-ready');
})();
