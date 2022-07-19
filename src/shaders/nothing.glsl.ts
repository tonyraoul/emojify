import { glsl } from "./utils";

const vert = glsl`attribute vec2 pos;
varying vec2 uv;
void main(void) {
  gl_Position = vec4(pos.x * 2.0 - 1.0, 1.0 - pos.y * 2.0, 0, 1);
  uv = vec2(pos.x, pos.y);
}`

const frag = glsl`
precision highp float;
varying vec2 uv;
uniform sampler2D tex;
uniform float uTime;

void main(void) {
  gl_FragColor = texture2D(tex, uv);
}`

export default { vert, frag, name: 'No Filter' };