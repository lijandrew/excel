function insertHeader() {
  let header = document.createElement("header");
  header.innerHTML = `
    <div id="header-content" class="content">
      <nav id="mobile-nav">
        <div id="mobile-nav-bg"></div>
        <div id="mobile-nav-links">
          <a target="_blank" href="https://www.excelacademyny.com/CDreg/OR_Login.html">
            <div>Parent Login</div>
          </a>
          <a href="index.html">
            <div>Home</div>
          </a>
          <a href="enroll.html">
            <div>Enroll</div>
          </a>
          <a href="courses.html">
            <div>Courses</div>
          </a>
          <a href="calendar.html">
            <div>Calendar</div>
          </a>
          <a class="link" target="_blank" href="https://www.excelacademyny.com/Congratulations.html">
            Acceptances
          </a>
          <a href="#contact">
            <div>Contact</div>
          </a>
        </div>
      </nav>
      <a href="index.html" id="logo"><img src="res/logo.svg" alt="Excel Academy logo"></a>
      <nav id="desktop-nav">
        <a class="link" href="index.html">
          <div>Home</div>
        </a>
        <a class="link" href="enroll.html">Enroll</a>
        <a class="link" href="courses.html">Courses</a>
        <a class="link" href="calendar.html">Calendar</a>
        <a class="link" target="_blank" href="https://www.excelacademyny.com/Congratulations.html">Acceptances</a>
        <a class="link" href="#contact">Contact</a>
        <a target="_blank" href="https://www.excelacademyny.com/CDreg/OR_Login.html" id="login" class="cta-btn">
          <div class="fill-wrapper">
            <div class="fill"></div>
          </div>
          <span class="upper">Parent Login</span>
          <span class="lower">Parent Login</span>
        </a>
      </nav>
      <div id="burger">
        <div id="bar1"></div>
        <div id="bar2"></div>
        <div id="bar3"></div>
      </div>
    </div>
  `;
  let body = document.querySelector("body");
  body.insertBefore(header, body.childNodes[0]);
  console.log(body.childNodes[0]);
}

function insertFooter() {
  let footer = document.createElement("footer");
  footer.innerHTML = `
    <section id="footer-links">
      <div id="footer-links-content" class="content">
        <a class="link" href="index.html">Home</a>
        <a class="link" href="enroll.html">Enroll</a>
        <a class="link" href="courses.html">Courses</a>
        <a class="link" href="#testimonials">Testimonials</a>
        <a class="link" target="_blank" href="https://www.excelacademyny.com/Congratulations.html">Acceptances</a>
        <a class="link" href="calendar.html">Calendar</a>
        <a class="link" href="about.html">About</a>
      </div>
    </section>
    <section id="contact">
      <div id="contact-content" class="content">
        <div class="manhasset address">
          <p><span>Excel Academy - Manhasset<span></p>
          <p>1447 Northern Boulevard, 2F,<br>Manhasset, NY 11030</p>
        </div>
        <div class="manhasset number">
          <p><span>Tel</span>&nbsp;&nbsp;516-365-8870</p>
          <p><span>Fax</span>&nbsp;516-365-8873</p>
        </div>
        <div class="syosset address">
          <p><span>Excel Academy - Syosset/Jericho<span></p>
          <p>6801 Jericho Turnpike, Suite 210,<br>Syosset, NY 11791</p>
        </div>
        <div class="syosset number">
          <p><span>Tel</span>&nbsp;&nbsp;516-864-0688</p>
          <p><span>Fax</span>&nbsp;516-365-8873</p>
        </div>
        <div class="email">
          <p><span>learn@excelacademyny.com</span></p>
          <p><span>joy@excelacademyny.com</span></p>
          <p><span>michael@excelacademyny.com</span></p>
        </div>
        <div id="footer-logo-wrapper">
          <a href="index.html"><img src="res/logo.svg" alt="Excel Academy logo"></a>
        </div>
      </div>
    </section>
  `;
  let stretchWrapper = document.querySelector(".stretch-wrapper");
  stretchWrapper.appendChild(footer);
}

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

async function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

async function countUp(elem, target, totalTime) {
  let i = 0;
  let sleepTime = totalTime / target;
  while (i <= target) {
    elem.textContent = i++;
    await sleep(sleepTime);
  }
}

function countSchoolsUp() {
  "use strict";
  let countDivArr = Array.from(document.querySelectorAll(".school-count"));
  let totalTime = 1500;
  for (let countDiv of countDivArr) {
    let target = parseInt(countDiv.textContent);
    countUp(countDiv, target, totalTime);
  }
}

function setupHome() {
  "use strict";
  /* Intro animations */
  let tl = gsap.timeline();
  tl.from("#cta > h1, #cta > p, #cta > .cta-group", {
    delay: 0.3,
    duration: 0.5,
    ease: "power1.out",
    opacity: 0,
    transform: "translate(0, 30px)",
    stagger: {amount: 0.5}
  });

  /* Scroll animations */
  let schoolTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#school-grid",
      start: "20% bottom",
    }
  });
  schoolTl.add(countSchoolsUp, "schoolIn")
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
  let line = document.querySelector("section#ready .content .title #underline");
  let lineTl = gsap.timeline({scrollTrigger: {
    trigger: "section#ready .content .cta-group",
    start: "bottom bottom",
  }});
  lineTl.to(line, {transform: "scaleX(1)", duration: 0.5, ease: "power1.in"});
  lineTl.set(line, {transformOrigin: "right"});
  lineTl.to(line, {transform: "scaleX(0)", duration: 0.5, ease: "power2.out"});

  gsap.from("section#ready .content .cta-group", {opacity: 0, transform: "translateY(50px)", duration: 0.5, ease: "power1.out", scrollTrigger: {
    trigger: "section#ready .content .cta-group",
    start: "top bottom",
  }});
}

function setupCourses() {
  "use strict";
  let enrichmentCats = document.querySelectorAll("section#enrichment .content .categories-container > .category");
  let fundamentalsCats = document.querySelectorAll("section#fundamentals .content .categories-container > .category ");
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
      trigger: "section#fundamentals .content .title",
      start: "center bottom",
    }
  });
}

function main() {
  "use strict";
  window.onload = () => {
    insertHeader();
    insertFooter();
    mobileNavAni();
    if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
      setupHome();
    } else if (window.location.pathname === "/courses.html") {
      setupCourses();
    }
    document.querySelector("body").style.opacity = 1;
  };
}

main();
