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

void main(void) {
  vec2 coord = uv;
  coord.x = uv.x * sin(uTime * PI);
  coord.y = uv.y * cos(uTime * PI);
  vec4 t = texture2D(tex, coord);
  gl_FragColor =  t; 
}`;

export default { vert, frag, name: 'No Filter' };