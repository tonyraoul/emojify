import { glsl, hexToRgb } from "./utils";

const vert = glsl`attribute vec2 pos;
varying vec2 uv;
void main(void) {
  gl_Position = vec4(pos.x * 2.0 - 1.0, 1.0 - pos.y * 2.0, 0, 1);
  uv = vec2(pos.x, pos.y);
}`

const frag = glsl`
  #define PI 3.14159265359
  #define SPEED 10.0
precision lowp float;
varying vec2 uv;
uniform sampler2D tex;
uniform float uTime;
uniform vec3 lut[10];

float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}

void main(void) {
  vec4 t = texture2D(tex, uv);
  int frame = int(modI(uTime * 50.0, 10.0));
  vec3 recolor;
  for (int k = 0; k < 10; ++k)
    if (frame == k)
        recolor = lut[k]; 
  gl_FragColor = vec4(recolor, 1) * t; 
}`;

const init = (gl: WebGLRenderingContext, prog: WebGLProgram) => {

  ['#ff6968',
    '#fe6cb7',
    '#ff68f7',
    '#ff8cff',
    '#d78cff',
    '#8bb5fe',
    '#87ffff',
    '#88ff89',
    '#fed689',
    '#ff8d8b'].forEach((colhex, index) => {
      const col = hexToRgb(colhex);
      gl.uniform3f(gl.getUniformLocation(prog, `lut[${index}]`), col.r / 255, col.g / 255, col.b / 255);
    });

};

export default { vert, frag, name: 'No Filter', init };