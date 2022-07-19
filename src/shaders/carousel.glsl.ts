import { glsl, hexToRgb } from "./utils";

const vert = glsl`attribute vec2 pos;
varying vec2 uv;
void main(void) {
  gl_Position = vec4(pos.x * 2.0 - 1.0 , 1.0 - pos.y * 2.0, 0, 1);
  uv = vec2(pos.x, pos.y);
}`

const frag = glsl`
  #define PI 3.14159265359
precision lowp float;
varying vec2 uv;
uniform sampler2D tex;
uniform float uTime;

float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}

void main(void) {
  vec2 coord0 = uv;
  vec4 t;
  for (float i=.0;i<2.0;i++) {
    coord0.x = (coord0.x + uv.x)*2.0;
    t = t + texture2D(tex, coord0);
  }
  gl_FragColor =  t; 
}`;

export default { vert, frag, name: 'No Filter' };