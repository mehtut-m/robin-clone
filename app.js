import Sketch from './module.js';
import gsap from 'gsap';

let sketch = new Sketch({
  dom: document.getElementById('container'),
});

let attractMode = false;
let attractTo = 0;
let speed = 0;
let rounded = 0;
let position = 0;
let block = document.getElementById('block');
let wrap = document.getElementById('wrap');
const elements = [...document.querySelectorAll('.n')];

window.addEventListener('wheel', (e) => {
  speed += e.deltaY * 0.0003;
});

let objs = Array(6).fill({ dist: 0 });
let navs = [...document.querySelectorAll('li')];

function raf() {
  rounded = gsap.utils.clamp(0, objs.length - 1, Math.round(position));

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
    el.style.backgroundColor = 'rgb(13,13,13)';
    el.style.opacity = '0.4';
    if (Math.abs(rounded) === index) {
      el.style.backgroundColor = 'red';
      el.style.opacity = '1';
    }
  });

  let diff = rounded - position;

  if (attractMode) {
    position += -(position - attractTo) * 0.05;
  } else {
    position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;
    // block.style.transform = `translate(0, ${position * 100 + 50}px)`;
    wrap.style.transform = `translate(0, ${-position * 100 + 50}px)`;
  }

  window.requestAnimationFrame(raf);
}

raf();

let navItems = [...document.querySelectorAll('.nav-item-ctn')];
let nav = document.querySelector('.nav');

let rots = sketch.groups.map((e) => e.rotation);
let mesh = sketch.meshes.map((e) => e.position);

nav.addEventListener('mouseenter', () => {
  attractMode = true;
  document
    .querySelectorAll('.project-name-tag')
    .forEach((item) => (item.style.visibility = 'visible'));

  document.querySelector('body').style.backgroundColor = '#000';
  gsap.to(rots, { x: -0.5, y: 0, z: 0, duration: 0.3 });
  gsap.to(mesh, { x: 0, duration: 0.3 });
});

nav.addEventListener('mouseleave', () => {
  attractMode = false;
  document
    .querySelectorAll('.project-name-tag')
    .forEach((item) => (item.style.visibility = 'hidden'));

  document.querySelector('body').style.backgroundColor = '#fff';
  gsap.to(rots, { x: -0.25, y: -0.3, z: -0.1, duration: 0.3 });
  gsap.to(mesh, { x: 0.6, duration: 0.3 });
});

navItems.forEach((el) => {
  el.addEventListener('mouseover', (e) => {
    attractTo = Number(e.target.querySelector('li').getAttribute('data-nav'));
  });
});
