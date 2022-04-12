uniform float time;
uniform float distanceFromCenter;
varying vec2 vUv;
varying vec3 vPosition;
varying vec2 pixels;
float PI = 3.141592;

void main() {
  vUv = (uv - vec2(0.5)) * (0.8 - 0.2* distanceFromCenter * (2. - distanceFromCenter)) + vec2(0.5);
  // vUv = uv;
  vec3 pos = position;

  // Image Float Controll
  pos.y += sin(time * 0.5) * 0.02;

  // Bending the slide
  pos.y += sin(PI * uv.x) * 0.01;
  pos.z += sin(PI * uv.x) * 0.025;

  // Create Parallax Effect
  vUv.y += sin(time * 0.3) * 0.02;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
  
}

