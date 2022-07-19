import normalShader from './shaders/nothing.glsl';
import rave from './shaders/rave';
import yonk from './shaders/yonk.glsl';
import dance from './shaders/dance.glsl';
import carousel from './shaders/carousel.glsl';
import { Effect } from './shaders/utils';

const container = document.createElement('div');
container.style.display = 'flex';
document.body.appendChild(container);



const imageFilterPreview = (effect: Effect) => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    const gl = canvas.getContext('webgl');
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, .0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var vert = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vert, effect.vert);
    gl.compileShader(vert);
    if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoconsole.error(vert))
    }

    var frag = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(frag, effect.frag);
    gl.compileShader(frag);
    if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(frag))
    }

    var prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    gl.validateProgram(prog);
    if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog));
    }
    gl.useProgram(prog);

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(prog, 'tex'), 0);
    effect.init?.(gl, prog);
    let frame = 0;

    const animate = () => {
        gl.uniform1f(gl.getUniformLocation(prog, 'uTime'), frame);
        gl.flush();
        frame += .01;
        // console.log(frame);
        if (frame >= 1) { frame = 0 };
        requestAnimationFrame(animate);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

    };
    animate();

    var buffer = gl.createBuffer();
    var verts = Float32Array.from([
        0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0,
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts.buffer, gl.STATIC_DRAW);
    var pos = gl.getAttribLocation(prog, "pos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, gl.FALSE, 0 /*tight*/, 0);

    const image = new Image();
    const url = './public/doge.png';

    image.onload = function () {
        canvas.width = image.width / 4;
        canvas.height = image.height / 4;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(.0, .0, .0, .0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        URL.revokeObjectURL(url);
    };
    image.src = url;
    return canvas;
}



const effects = [normalShader, rave, yonk, dance, carousel];
effects.forEach(effect => container.appendChild(imageFilterPreview(effect)));