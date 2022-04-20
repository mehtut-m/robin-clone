import Sketch from './module.js';
import gsap from 'gsap';
import { data } from './data.json';

let sketch = new Sketch({
  dom: document.getElementById('container'),
});
let rollPosition = { y: 0 };
let attractMode = false;
let attractTo = 0;
let previousData = -1;
let speed = 0;
let rounded = 0;
let position = 0;
let initial = true;

const elements = [...document.querySelectorAll('.n')];

window.addEventListener('wheel', (e) => {
  speed += e.deltaY * 0.0003;
});

let objs = Array(6).fill({ dist: 0 });
let navs = [...document.querySelectorAll('.nav-item')];

// Initial animate

function initialAnimate() {
  if (!initial) {
    // return;
  }
  let tl = gsap.timeline({ defaults: { ease: 'Power4.easeOut' } });
  tl.to('.wrapper', { height: '100vh', duration: 2, ease: 'Power2.easeOut' })
    .to(rollPosition, { y: 5, duration: 2, delay: 0.25 }, '-=2')
    .from(rots, { x: -0.5, y: 0, z: 0, duration: 0.5 })
    .to('.wrapper', {
      width: '100vw',
      opacity: 1,
      stagger: 0.2,
      duration: 1,
      delay: -0.5,
    })
    .to('.wrapper > *', { opacity: 1, duration: 0.5 }, '=-0.9')
    .to('.loader', { left: 0 });

  position = rollPosition.y;
  initial = false;
}

function updateContent(rounded) {
  if (previousData === rounded) {
    return;
  }
  // Update Content
  const title = document.querySelector('.project-title');
  const desc = document.querySelector('.project-desc');
  const loader = document.querySelector('.loader');
  const nav = document.querySelector('nav > a');

  const body = document.querySelector('.wrapper');

  body.style.backgroundColor = data[rounded].bgColor;
  loader.style.backgroundColor = data[rounded].mainTypo;
  nav.style.color = data[rounded].secTypo;

  title.textContent = data[rounded].title;
  title.style.color = data[rounded].mainTypo;

  desc.textContent = data[rounded].description;
  desc.style.color = data[rounded].secTypo;

  // Animate the Change
  let direction = previousData < rounded ? '1.5rem' : '-1.5rem';

  gsap.fromTo(
    '.hero-info',
    { opacity: 0, y: direction },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'Power1.out',
    }
  );

  previousData = rounded;
}

function raf() {
  rounded = gsap.utils.clamp(0, objs.length - 1, Math.round(position));
  //
  position += speed;

  // Added Inertia
  speed *= 0.8;

  objs.forEach((obj, index) => {
    obj.dist = Math.min(Math.abs(position - index), 1);
    obj.dist = 1 - obj.dist ** 2;

    elements[index].style.transform = `scale(${1 + 0.4 * obj.dist})`;

    const scale = 1 + 0.1 * obj.dist;

    // Set position
    sketch.meshes[index].position.y = -(index * 1.2 - position * 1.2);

    sketch.meshes[index].scale.set(scale, scale, scale);
    sketch.meshes[index].material.uniforms.distanceFromCenter.value = obj.dist;
  });

  navs.forEach((el, index) => {
    el.style.backgroundColor = 'white';
    if (Math.abs(rounded) === index) {
      el.style.backgroundColor = '#ff9900';
      el.style.opacity = '1';
    }
  });

  let diff = rounded - position;

  if (attractMode) {
    position += -(position - attractTo) * 0.05;
  } else {
    position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;
    updateContent(rounded);
    // wrap.style.transform = `translate(0, ${-position * 100 + 50}px)`;
  }

  window.requestAnimationFrame(raf);
}

function main() {
  initialAnimate();
  raf();
}

let navItems = [...document.querySelectorAll('.nav-item-ctn')];
let nav = document.querySelector('.nav');
let robinLogo = document.querySelector('.robin-logo');

let rots = sketch.groups.map((e) => e.rotation);
let mesh = sketch.meshes.map((e) => e.position);

// Navigation Bar
nav.addEventListener('mouseenter', () => {
  attractMode = true;
  document
    .querySelectorAll('.project-name-tag')
    .forEach((item) => (item.style.visibility = 'visible'));

  document.querySelector('.wrapper').style.visibility = 'hidden';
  [...document.querySelectorAll('.nav-item')].forEach(
    (el) => (el.style.opacity = 1)
  );

  let changeViewTL = gsap.timeline({ defaults: { ease: 'SlowMo.easeOut' } });
  changeViewTL
    .to('.nav-item', {
      width: '100%',
      duration: 0.35,
      opacity: 1,
      ease: 'Power2.easeOut',
    })
    .to('.nav-item', { width: '8px', stagger: 0.1 });
  gsap.to(rots, { x: -0.5, y: 0, z: 0, duration: 0.3 });
  gsap.to(mesh, { x: 0, duration: 0.3 });
});

nav.addEventListener('mouseleave', () => {
  attractMode = false;
  document.querySelector('.wrapper').style.visibility = 'visible';

  document
    .querySelectorAll('.project-name-tag')
    .forEach((item) => (item.style.visibility = 'hidden'));
  gsap.to(rots, { x: -0.25, y: -0.3, z: -0.1, duration: 0.3 });
  gsap.to(mesh, { x: 0.6, duration: 0.3 });
});

navItems.forEach((el) => {
  el.addEventListener('mouseover', (e) => {
    attractTo = Number(el.querySelector('li').getAttribute('data-nav'));
    // attractTo = Number(e.target.querySelector('li').getAttribute('data-nav'));
  });
});

robinLogo.addEventListener('mouseenter', () => {
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'Power4.easeOut' },
  });
  let first = document.querySelector('.first-r');
  let last = document.querySelector('.last-r');

  let width =
    window
      .getComputedStyle(robinLogo)
      .width.substring(0, window.getComputedStyle(robinLogo).width.length - 2) -
    window
      .getComputedStyle(first)
      .width.substring(0, window.getComputedStyle(first).width.length - 2);

  tl.to(first, { y: -20, duration: 0.5 })
    .to(last, { y: 20, delay: -0.5 })
    .to(first, { x: width, duration: 0.5 })
    .to(last, { x: -width, delay: -0.5 })
    .to(first, { y: 0, duration: 0.5 })
    .to(last, { y: 0, delay: -0.5 });

  tl.play();
  // tl.reverse();
});

main();
