function mobileNavAni() {
  "use strict";
  let body = document.querySelector("body");
  let burger = document.querySelector("#burger");
  let burgerBars = burger.querySelectorAll("#burger > div");
  let mobileNav = document.querySelector("nav#mobile-nav");

  let burgerTl = gsap.timeline();
  burgerTl.pause();
  burgerTl.to(burgerBars[0], {transform: "translate(0, 100%)", duration: 0.1}, "b1")
          .to(burgerBars[1], {opacity: 0, duration: 0.1}, "b1")
          .to(burgerBars[2], {transform: "translate(0, -100%)", duration: 0.1}, "b1")
          .to(burgerBars[0], {transform: "translate(0, 100%) rotate(45deg)", duration: 0.1}, "b2")
          .to(burgerBars[2], {transform: "translate(0, -100%) rotate(-45deg)", duration: 0.1}, "b2");

  let openMobileNavTl = gsap.timeline();
  openMobileNavTl.pause();
  openMobileNavTl.set(mobileNav, {display: "block"})
                 .to("#mobile-nav-bg", {opacity: 1, duration: 0.3}, "mnavIn")
                 .to("#mobile-nav a div", {transform: "translate(0, 0)", duration: 0.3, stagger: {amount: 0.3}}, "mnavIn");

  let closeMobileNavTl = gsap.timeline();
  closeMobileNavTl.pause();
  closeMobileNavTl.to("#mobile-nav-bg", {opacity: 0, duration: 0.2}, "mnavOut")
                  .to("#mobile-nav a div", {transform: "translate(0, 100%)", duration: 0.2}, "mnavOut")
                  .set(mobileNav, {display: "none"});

  burger.addEventListener("click", () => {
    mobileNav.classList.toggle("mobile-nav-open");
    body.classList.toggle("mobile-nav-open");
    if (mobileNav.classList.contains("mobile-nav-open")) {
      burgerTl.restart();
      closeMobileNavTl.pause();
      openMobileNavTl.restart();
    } else {
      burgerTl.reverse();
      openMobileNavTl.pause();
      closeMobileNavTl.restart();
    }
  });

  let mobileNavLinks = document.querySelectorAll("#mobile-nav-links > a");
  for (let link of Array.from(mobileNavLinks)) {
    link.addEventListener("click", () => {
      body.classList.remove("mobile-nav-open");
      mobileNav.classList.remove("mobile-nav-open");
      burgerTl.reverse();
      openMobileNavTl.pause();
      closeMobileNavTl.restart();
    });
  }
}

function countSchoolsUp() {
  "use strict";
  let countDivArr = Array.from(document.querySelectorAll(".school-count"));
  for (let countDiv of countDivArr) {
    let target = parseInt(countDiv.textContent);
    let totalTime = 1500;
    let interval = totalTime / target;
    let current = -1;
    let countUp = setInterval(() => {
      countDiv.textContent = ++current;
      if (current === target) {
        clearInterval(countUp);
      }
    }, interval);
  }
}
function homeAni() {
  "use strict";
  /* Intro animations */
  let tl = gsap.timeline();
  tl.from("#cta > h1, #cta > p", {delay: 0.5, duration: 0.5, opacity: 0, transform: "translate(-30px, 0)", stagger: {amount: 0.3}});
  tl.from("#cta .cta-btn, #cta .link", {duration: 0.5, opacity: 0, transform: "translate(0, 30px)"});

  /* Scroll animations */
  let schoolTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#school-grid",
      start: "20% bottom",
    }
  });
  schoolTl.add( countSchoolsUp, "schoolIn" )
          .from(".front", {opacity: 0, ease: "power2.inOut", stagger: {amount: 0.5}}, "schoolIn")
          .from(".back", {opacity: 0, duration: 1.5, transform: "translate(0, 0)", ease: "power4.out"});

  gsap.from(".testimonial-box", {opacity: 0, ease: "power2.out", stagger: {amount: 0.5},
    scrollTrigger: {
      trigger: ".testimonials",
      start: "20% bottom",
    }
  });

  /* Huge text scroll scrub */
  let hugeAcceptances = document.querySelector("#acceptances .huge");
  gsap.to(hugeAcceptances, {transform: "translateX(-35%)", scrollTrigger: {
    trigger: hugeAcceptances,
    start: "top bottom",
    end: "100% top",
    scrub: 1,
  }});

  let hugeTestimonials = document.querySelector("#testimonials .huge");
  gsap.from(hugeTestimonials, {transform: "translateX(-35%)", scrollTrigger: {
    trigger: hugeTestimonials,
    start: "top bottom",
    end: "top top",
    scrub: 1,
  }});

  /* Ready to learn underline animation */
  let line = document.querySelector("#ready-content .title #underline");
  let lineTl = gsap.timeline({scrollTrigger: {
    trigger: "#ready-content .cta-group",
    start: "bottom bottom",
  }});
  lineTl.to(line, {transform: "scaleX(1)", duration: 0.5, ease: "power1.in"});
  lineTl.set(line, {transformOrigin: "right"});
  lineTl.to(line, {transform: "scaleX(0)", duration: 0.5, ease: "power2.out"});

  gsap.from("#ready-content .cta-group", {opacity: 0, transform: "translateY(50px)", duration: 0.5, ease: "power1.out", scrollTrigger: {
    trigger: "#ready-content .cta-group",
    start: "top bottom",
  }});
}
function homeEnrollDropdown() {
  "use strict";
  /* Setup enroll dropdown class toggling */
  let homeEnrollDropdown = document.querySelector("section#home .enroll-dropdown");
  let readyEnrollDropdown = document.querySelector("section#ready .enroll-dropdown");

  homeEnrollDropdown.addEventListener("click", () => {
    homeEnrollDropdown.classList.toggle("enroll-dropdown-open");
  });

  readyEnrollDropdown.addEventListener("click", () => {
    readyEnrollDropdown.classList.toggle("enroll-dropdown-open");
  });

  window.addEventListener("click", event => {
    if (event.target.closest(".enroll-dropdown") === null) {
      homeEnrollDropdown.classList.remove("enroll-dropdown-open");
      readyEnrollDropdown.classList.remove("enroll-dropdown-open");
    }
  });

}

function coursesAni() {
  "use strict";
  let enrichmentCats = document.querySelectorAll("#enrichment-content .categories-container > .category");
  let fundamentalsCats = document.querySelectorAll("#fundamentals-content .categories-container > .category ");
  gsap.from(enrichmentCats, {
    opacity: 0,
    transform: "translate(0, 30px)",
    duration: 0.5,
    stagger: {amount: 0.5},
  });
  gsap.from(fundamentalsCats, {
    opacity: 0,
    transform: "translate(0, 30px)",
    duration: 0.5,
    stagger: {amount: 0.5},
    scrollTrigger: {
      trigger: "#fundamentals-content .title",
      start: "center 70%",
    }
  });
}

function initBarba() {
  "use strict";
  barba.init({
    preventRunning: true,
    views: [
      {
        namespace: "home",
        beforeEnter() {
          homeAni();
          homeEnrollDropdown();
          document.querySelector("video").play();
        },
      },
      {
        namespace: "courses",
        beforeEnter() {
          coursesAni();
        }
      }
    ],
    transitions: [
      {
        name: "default-opacity",
        leave(data) {
          return gsap.to(data.current.container, {
            opacity: 0,
            transform: "translate(0, 50px)",
            duration: 0.4,
            ease: "power1.in",
          });
        },
        enter(data) {
          return gsap.from(data.next.container, {
            opacity: 0,
            transform: "translate(0, -50px)",
            duration: 0.4,
            ease: "power1.out",
          });
        },
      }
    ]
  });

  barba.hooks.enter(() => {
    window.scrollTo(0, 0);
  });
}

function main() {
  "use strict";
  mobileNavAni();
  initBarba();
  document.querySelector("body").style.opacity = 1;
}

main();
