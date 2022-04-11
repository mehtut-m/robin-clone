import Sketch from './module';

let sketch = new Sketch({
  dom: document.getElementById('container'),
});

let speed = 0;
let rounded = 0;
let position = 0;
let block = document.getElementById('block');
let wrap = document.getElementById('wrap');
const elements = [...document.querySelectorAll('.n')];

window.addEventListener('wheel', (e) => {
  speed += e.deltaY * 0.0003;
});

let objs = Array(5).fill({ dist: 0 });

function raf() {
  position += speed;
  // Added Inertia
  speed *= 0.8;

  objs.forEach((obj, index) => {
    obj.dist = Math.min(Math.abs(position - index), 1);
    obj.dist = 1 - obj.dist ** 2;
    elements[index].style.transform = `scale(${1 + 0.4 * obj.dist})`;
  });

  rounded = Math.round(position);

  let diff = rounded - position;

  position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;

  // block.style.transform = `translate(0, ${position * 100 + 50}px)`;
  wrap.style.transform = `translate(0, ${-position * 100 + 50}px)`;

  window.requestAnimationFrame(raf);
}

raf();
