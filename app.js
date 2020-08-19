
function setupMobileNavAni() {
  "use strict";
  let body = document.querySelector("body");
  let burger = document.querySelector("#burger");
  let burgerBars = burger.querySelectorAll("#burger > div");
  let mobileNav = document.querySelector("nav#mobile-nav");

  let burgerTl = gsap.timeline();
  burgerTl.pause();
  burgerTl.to(burgerBars, {background: "white", duration: 0.1}, "b1")
          .to(burgerBars[0], {transform: "translate(0, 100%)", duration: 0.1}, "b1")
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

function setupScrollAni() {
  let schoolTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#school-grid",
      start: "20% bottom",
    }
  });
  schoolTl.add( countSchoolsUp, "schoolIn" )
          .to(".front", {opacity: 1, ease: "power2.inOut", stagger: {amount: 0.5}}, "schoolIn")
          .to(".back", {opacity: 1, duration: 1.5, transform: "translate(-5px, -5px)", ease: "power4.out"});

  gsap.to(".testimonial-box", {opacity: 1, ease: "power2.out", stagger: {amount: 0.5},
    scrollTrigger: {
      trigger: ".testimonials",
      start: "20% bottom",
    }
  });
}

function countSchoolsUp() {
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

function setupEnrollDropdown() {
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

function setupCourseDropdown() {
  let categoryArr = Array.from(document.querySelectorAll(".category"));
  for (let category of categoryArr) {
    let categoryTitle = category.querySelector(".category-title");
    let ul = category.querySelector("ul");
    let liHeight = 60;
    let liCount = Array.from(category.querySelectorAll("li")).length;
    console.log(liCount);
    let ulHeight = `${liHeight * liCount}px`;
    categoryTitle.addEventListener("click", () => {
      category.classList.toggle("category-open");
      /*
      if (category.classList.contains("category-open")) {
        gsap.to(ul, {height: ulHeight, duration: 0.3, ease: "power1.out"});
      } else {
        gsap.to(ul, {height: 0, duration: 0.3, ease: "power1.out"});
      }
      */
    });
  }
}

function main() {
  setupMobileNavAni();
  if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
    setupScrollAni();
    setupEnrollDropdown();
  } else if (window.location.pathname === "/courses.html") {
    setupCourseDropdown();
  }
}

main();
