"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
uniform mat4 uProjection;
uniform float uRotationX;
uniform float uRotationY;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPosition;

void main() {
  float cx = cos(uRotationX);
  float sx = sin(uRotationX);
  float cy = cos(uRotationY);
  float sy = sin(uRotationY);

  vec3 p = vec3(
    aPosition.x * cy + aPosition.z * sy,
    aPosition.y,
    -aPosition.x * sy + aPosition.z * cy
  );
  p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  p.z -= 4.15;

  vec3 n = vec3(
    aNormal.x * cy + aNormal.z * sy,
    aNormal.y,
    -aNormal.x * sy + aNormal.z * cy
  );
  n = vec3(n.x, n.y * cx - n.z * sx, n.y * sx + n.z * cx);

  gl_Position = uProjection * vec4(p, 1.0);
  vNormal = normalize(n);
  vColor = aColor;
  vPosition = p;
}
`;

const fragmentShader = `
precision mediump float;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPosition;

void main() {
  vec3 n = normalize(vNormal);
  vec3 lightA = normalize(vec3(-0.55, 0.75, 1.0));
  vec3 lightB = normalize(vec3(0.8, -0.25, 0.5));
  vec3 viewDirection = normalize(-vPosition);
  vec3 halfVector = normalize(lightA + viewDirection);

  float diffuse = max(dot(n, lightA), 0.0);
  float fill = max(dot(n, lightB), 0.0);
  float specular = pow(max(dot(n, halfVector), 0.0), 46.0);
  float rim = pow(1.0 - max(dot(n, viewDirection), 0.0), 2.2);

  vec3 color = vColor * (0.24 + diffuse * 0.76 + fill * 0.16);
  color += vec3(1.0, 0.91, 0.68) * specular * 0.72;
  color += vec3(0.74, 0.86, 1.0) * rim * 0.22;
  gl_FragColor = vec4(color, 1.0);
}
`;

function addTriangle(positions, normals, colors, a, b, c, color) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const normal = [
    ab[1] * ac[2] - ab[2] * ac[1],
    ab[2] * ac[0] - ab[0] * ac[2],
    ab[0] * ac[1] - ab[1] * ac[0]
  ];
  const length = Math.hypot(...normal) || 1;
  const unit = normal.map((part) => part / length);

  for (const point of [a, b, c]) {
    positions.push(...point);
    normals.push(...unit);
    colors.push(...color);
  }
}

function buildJewel() {
  const positions = [];
  const normals = [];
  const colors = [];

  // Gold ring: a real triangulated torus, not a CSS illustration.
  const around = 92;
  const tube = 14;
  const majorRadius = 0.91;
  const minorRadius = 0.075;
  const gold = [0.72, 0.49, 0.19];

  const torusPoint = (u, v) => [
    (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u),
    (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u) - 0.18,
    minorRadius * Math.sin(v)
  ];

  for (let i = 0; i < around; i += 1) {
    const u0 = (i / around) * Math.PI * 2;
    const u1 = ((i + 1) / around) * Math.PI * 2;
    for (let j = 0; j < tube; j += 1) {
      const v0 = (j / tube) * Math.PI * 2;
      const v1 = ((j + 1) / tube) * Math.PI * 2;
      const a = torusPoint(u0, v0);
      const b = torusPoint(u1, v0);
      const c = torusPoint(u1, v1);
      const d = torusPoint(u0, v1);
      const tint = 0.86 + 0.14 * Math.sin(u0 * 2.0 + v0);
      const material = gold.map((channel) => channel * tint);
      addTriangle(positions, normals, colors, a, b, c, material);
      addTriangle(positions, normals, colors, a, c, d, material);
    }
  }

  // Eight-sided brilliant-cut gemstone with a table, crown, girdle and pavilion.
  const sides = 8;
  const ring = (radius, y, phase = Math.PI / 8) => Array.from({ length: sides }, (_, index) => {
    const angle = (index / sides) * Math.PI * 2 + phase;
    return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
  });
  const table = ring(0.19, 0.89);
  const crown = ring(0.43, 0.57);
  const lower = ring(0.29, 0.31);
  const culet = [0, 0.08, 0];

  for (let i = 0; i < sides; i += 1) {
    const next = (i + 1) % sides;
    const facet = i % 2 === 0
      ? [0.9, 0.91, 0.94]
      : [0.57, 0.72, 0.82];
    addTriangle(positions, normals, colors, table[i], crown[i], crown[next], facet);
    addTriangle(positions, normals, colors, table[i], crown[next], table[next], [0.72, 0.82, 0.88]);
    addTriangle(positions, normals, colors, crown[i], lower[i], lower[next], [0.36, 0.53, 0.68]);
    addTriangle(positions, normals, colors, crown[i], lower[next], crown[next], [0.79, 0.86, 0.91]);
    addTriangle(positions, normals, colors, lower[i], culet, lower[next], [0.48, 0.65, 0.78]);
  }

  // Four polished prongs around the stone.
  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const center = [Math.cos(angle) * 0.34, 0.62, Math.sin(angle) * 0.34];
    const top = [center[0] * 1.08, 0.81, center[2] * 1.08];
    const left = [center[0] - 0.025, 0.62, center[2] - 0.025];
    const right = [center[0] + 0.025, 0.62, center[2] + 0.025];
    addTriangle(positions, normals, colors, left, right, top, [0.91, 0.77, 0.48]);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors)
  };
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function projectionMatrix(aspect) {
  const near = 0.1;
  const far = 100;
  const f = 1 / Math.tan(Math.PI / 7);
  const range = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * range, -1,
    0, 0, near * far * range * 2, 0
  ]);
}

export default function WebGLJewelScene({ className = "" }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power"
    });

    if (!gl) {
      host.dataset.fallback = "true";
      return undefined;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) {
      host.dataset.fallback = "true";
      return undefined;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      host.dataset.fallback = "true";
      return undefined;
    }

    const geometry = buildJewel();
    const locations = {
      position: gl.getAttribLocation(program, "aPosition"),
      normal: gl.getAttribLocation(program, "aNormal"),
      color: gl.getAttribLocation(program, "aColor"),
      projection: gl.getUniformLocation(program, "uProjection"),
      rotationX: gl.getUniformLocation(program, "uRotationX"),
      rotationY: gl.getUniformLocation(program, "uRotationY")
    };

    const buffers = [
      [locations.position, geometry.positions],
      [locations.normal, geometry.normals],
      [locations.color, geometry.colors]
    ].map(([location, values]) => {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
      return buffer;
    });

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let frame = 0;
    let rotationX = 0.92;
    let rotationY = -0.25;
    let targetX = rotationX;
    let targetY = rotationY;
    let disposed = false;

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniformMatrix4fv(locations.projection, false, projectionMatrix(width / height));
      draw();
    };

    const draw = () => {
      if (disposed) return;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(locations.rotationX, rotationX);
      gl.uniform1f(locations.rotationY, rotationY);
      gl.drawArrays(gl.TRIANGLES, 0, geometry.positions.length / 3);
      host.dataset.fallback = "false";
      host.dataset.ready = "true";
    };

    const animate = () => {
      if (disposed) return;
      rotationX += (targetX - rotationX) * 0.055;
      rotationY += (targetY - rotationY) * 0.055;
      if (!reduceMotion.matches) rotationY += 0.0014;
      draw();
      frame = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event) => {
      if (event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
      const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
      targetY = -0.25 + (x - 0.5) * 0.58;
      targetX = 0.92 + (0.5 - y) * 0.24;
    };

    const onPointerLeave = () => {
      targetX = 0.92;
      targetY = -0.25;
    };

    const onContextLost = (event) => {
      event.preventDefault();
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      host.dataset.fallback = "true";
    };

    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(resize)
      : null;

    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    if (observer) observer.observe(host);
    else window.addEventListener("resize", resize, { passive: true });

    resize();
    if (!reduceMotion.matches) frame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div ref={hostRef} className={`jp-webgl-jewel ${className}`.trim()} aria-hidden="true" data-fallback="true">
      <canvas ref={canvasRef} className="jp-webgl-canvas" />
      <span className="jp-webgl-fallback-ring" />
      <span className="jp-webgl-fallback-stone" />
    </div>
  );
}
