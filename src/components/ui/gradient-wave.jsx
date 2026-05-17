import { useEffect, useRef } from "react";

export function GradientWave({ colors = ["#0A0A0A", "#C9A84C", "#1a1208", "#8B6914", "#0A0A0A"], isPlaying = true, className = "", opacity = 0.4, style = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const canvas = document.createElement("canvas");
    Object.assign(canvas.style, { position:"absolute", top:"0", left:"0", width:"100%", height:"100%", display:"block" });
    containerRef.current.appendChild(canvas);

    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) return;

    let time = 0, last = 0, animId, active = true;

    const parse = (hex) => {
      const n = parseInt(hex.replace("#","0x"),16);
      return [((n>>16)&255)/255, ((n>>8)&255)/255, (n&255)/255];
    };
    const c = colors.map(parse);
    const cv = (i) => c[i] ? c[i].join(",") : "0.0,0.0,0.0";

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, `precision highp float; attribute vec2 p; varying vec2 v; void main(){ v=p*0.5+0.5; gl_Position=vec4(p,0,1); }`);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, `
      precision highp float;
      uniform float t;
      varying vec2 v;
      vec3 c0=vec3(${cv(0)});
      vec3 c1=vec3(${cv(1)});
      vec3 c2=vec3(${cv(2)});
      vec3 c3=vec3(${cv(3)});
      vec3 c4=vec3(${cv(4)});
      float n(vec2 p){ return sin(p.x*3.+t*.3)*cos(p.y*2.+t*.2)*.5+.5; }
      float n2(vec2 p){ return sin(p.x*5.+t*.15+1.5)*cos(p.y*4.+t*.25)*.5+.5; }
      void main(){
        float a=n(v*2.);
        float b=n2(v*1.5);
        float c=n(v*3.+.7);
        vec3 col=mix(c0,c1,a);
        col=mix(col,c2,b*.6);
        col=mix(col,c3,c*.4);
        col=mix(col,c4,smoothstep(.4,.6,a*b));
        gl_FragColor=vec4(col,0.9);
      }
    `);
    gl.compileShader(fs);

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tLoc = gl.getUniformLocation(prog, "t");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function draw(ts) {
      if (!active) return;
      time += Math.min(ts - last, 50) * 0.001;
      last = ts;
      gl.uniform1f(tLoc, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(draw);
    }
    if (isPlaying) animId = requestAnimationFrame(draw);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      active = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (containerRef.current?.contains(canvas)) containerRef.current.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className={`absolute inset-0 w-full h-full overflow-hidden ${className}`} style={{ opacity, zIndex: 0, ...style }} />;
}
