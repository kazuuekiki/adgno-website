/* ======================================================================
   ADGNO — Dynamic Site Template
   GSAP + ScrollTrigger + Lenis
   ====================================================================== */

(() => {
  "use strict";

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==================== Loader ==================== */
  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loaderBar");
  let loaderProgress = 0;
  const loaderInterval = setInterval(() => {
    loaderProgress += Math.random() * 18;
    if (loaderProgress >= 100) {
      loaderProgress = 100;
      clearInterval(loaderInterval);
      window.addEventListener("load", finishLoader, { once: true });
      // 保険：3秒経ったら強制終了
      setTimeout(finishLoader, 1500);
    }
    if (loaderBar) loaderBar.style.width = loaderProgress + "%";
  }, 120);

  let loaderDone = false;
  function finishLoader() {
    if (loaderDone) return;
    loaderDone = true;
    if (loaderBar) loaderBar.style.width = "100%";
    setTimeout(() => {
      loader && loader.classList.add("is-done");
      initAnimations();
    }, 300);
  }

  /* ==================== Lenis Smooth Scroll ==================== */
  let lenis = null;
  if (typeof Lenis !== "undefined" && !prefersReduced) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // anchor links
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id && id.length > 1) {
          const target = document.querySelector(id);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -60 });
          }
        }
      });
    });
  }

  /* ==================== Custom Cursor (PC only) ==================== */
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");
  const canHover = window.matchMedia("(hover: hover)").matches && window.innerWidth > 768;
  if (cursor && follower && canHover && !prefersReduced) {
    let mouseX = 0, mouseY = 0;
    let fx = 0, fy = 0;
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    });
    function animateFollower() {
      fx += (mouseX - fx) * 0.12;
      fy += (mouseY - fy) * 0.12;
      follower.style.transform = `translate(${fx - 20}px, ${fy - 20}px)`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();
    document.querySelectorAll("a, button, .services__item, .work-card").forEach((el) => {
      el.addEventListener("mouseenter", () => follower.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => follower.classList.remove("is-hover"));
    });
  } else {
    cursor && (cursor.style.display = "none");
    follower && (follower.style.display = "none");
  }

  /* ==================== Header scroll state ==================== */
  const header = document.getElementById("header");
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ==================== Mobile menu ==================== */
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.querySelector(".header__nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("is-open");
      nav.classList.toggle("is-open");
      if (lenis) {
        nav.classList.contains("is-open") ? lenis.stop() : lenis.start();
      }
    });
    nav.querySelectorAll(".header__link").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("is-open");
        nav.classList.remove("is-open");
        lenis && lenis.start();
      });
    });
  }

  /* ==================== Footer year ==================== */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ==================== Split text into chars ==================== */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = "";
    const lines = text.split("\n");
    lines.forEach((line, li) => {
      const lineSpan = document.createElement("span");
      lineSpan.style.display = "inline-block";
      lineSpan.style.overflow = "hidden";
      lineSpan.style.lineHeight = "1.05";
      // Actually, for reveal-chars we wrap each char
      for (const ch of line) {
        if (ch === " ") {
          const sp = document.createElement("span");
          sp.innerHTML = "&nbsp;";
          sp.className = "char";
          el.appendChild(sp);
        } else {
          const sp = document.createElement("span");
          sp.className = "char";
          sp.textContent = ch;
          el.appendChild(sp);
        }
      }
      if (li < lines.length - 1) el.appendChild(document.createElement("br"));
    });
  }

  /* ==================== Animations (triggered after loader) ==================== */
  let animationsInited = false;
  function initAnimations() {
    if (animationsInited) return;
    animationsInited = true;

    if (typeof gsap === "undefined") {
      // GSAP未読込: 静的表示にフォールバック
      document.querySelectorAll("[data-reveal], [data-reveal-line], [data-reveal-chars]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);

      // Lenis + ScrollTrigger 連携
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }
    }

    /* ---- Hero: lines reveal ---- */
    const heroLines = document.querySelectorAll("[data-reveal-line]");
    heroLines.forEach((line) => {
      if (!line.firstElementChild) {
        const span = document.createElement("span");
        span.innerHTML = line.innerHTML;
        line.innerHTML = "";
        line.appendChild(span);
      }
    });
    gsap.to("[data-reveal-line] > *", {
      y: "0%",
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.12,
      delay: 0.2,
    });

    /* ---- Hero subs / eyebrow / scroll hint ---- */
    gsap.to(".hero [data-reveal]", {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.1,
      delay: 0.8,
    });

    /* ---- Section reveal on scroll ---- */
    if (typeof ScrollTrigger !== "undefined") {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        // hero内は既にアニメーション済みなのでスキップ
        if (el.closest(".hero")) return;
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      /* ---- Reveal chars (section titles) ---- */
      document.querySelectorAll("[data-reveal-chars]").forEach((el) => {
        splitChars(el);
        const chars = el.querySelectorAll(".char");
        gsap.to(chars, {
          y: "0%",
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      /* ---- Parallax backgrounds ---- */
      document.querySelectorAll("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax) || 0.3;
        gsap.to(el, {
          y: () => window.innerHeight * amount,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      /* ---- Counter animation ---- */
      document.querySelectorAll("[data-counter]").forEach((el) => {
        const target = parseInt(el.dataset.counter, 10) || 0;
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 2,
              ease: "expo.out",
              onUpdate: () => {
                el.textContent = Math.round(obj.val);
              },
            });
          },
        });
      });

      /* ---- Work cards stagger ---- */
      gsap.utils.toArray(".work-card").forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          delay: (i % 2) * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });

      /* ---- Services stagger ---- */
      gsap.utils.toArray(".services__item").forEach((item, i) => {
        gsap.from(item, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          delay: i * 0.08,
          scrollTrigger: {
            trigger: item,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      });
    }
  }

  // If window already loaded (e.g. cached), trigger immediately
  if (document.readyState === "complete") {
    finishLoader();
  }
})();
