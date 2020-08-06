let burger = document.querySelector("#burger");
let burgerBars = burger.querySelectorAll("#burger > div");
let mobileNav = document.querySelector("nav#mobile-nav");

let burgerTl = gsap.timeline();
burgerTl.pause();
burgerTl.to(burgerBars, {background: "white", duration: 0.1}, "b1")
        .to(burgerBars[0], {transform: "translate(0, 0)", duration: 0.1}, "b1")
        .to(burgerBars[1], {opacity: 0, duration: 0.1}, "b1")
        .to(burgerBars[2], {transform: "translate(0, 0)", duration: 0.1}, "b1")
        .to(burgerBars[0], {transform: "rotate(45deg)", duration: 0.1}, "b2")
        .to(burgerBars[2], {transform: "rotate(-45deg)", duration: 0.1}, "b2");

let openMobileNavTl = gsap.timeline();
openMobileNavTl.pause();
openMobileNavTl.set(mobileNav, {display: "block"})
               .to("#mobile-nav-bg", {opacity: 1, duration: 0.3}, "mnavIn")
               .to("#mobile-nav a span", {top: 0, duration: 0.3, stagger: {amount: 0.3}}, "mnavIn");


let closeMobileNavTl = gsap.timeline();
closeMobileNavTl.pause();
closeMobileNavTl.to("#mobile-nav-bg", {opacity: 0, duration: 0.2}, "mnavOut")
                .to("#mobile-nav a span", {top: "100%", duration: 0.2}, "mnavOut")
                .set(mobileNav, {display: "none"});

burger.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
  if (mobileNav.classList.contains("open")) {
    burgerTl.restart();
    closeMobileNavTl.pause();
    openMobileNavTl.restart();
  } else {
    burgerTl.reverse();
    openMobileNavTl.pause();
    closeMobileNavTl.restart();
  }
});
