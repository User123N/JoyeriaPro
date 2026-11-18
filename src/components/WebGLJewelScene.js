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
  p.z -= 4.2;

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
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform float uTime;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPosition;

void main() {
  vec3 n = normalize(vNormal);
  vec3 lightKey = normalize(vec3(-0.56, 0.82, 1.1));
  vec3 lightFill = normalize(vec3(0.82, -0.28, 0.65));
  vec3 lightRim = normalize(vec3(0.2, 0.42, -1.0));
  vec3 viewDirection = normalize(-vPosition);
  vec3 halfVector = normalize(lightKey + viewDirection);

  float diffuse = max(dot(n, lightKey), 0.0);
  float fill = max(dot(n, lightFill), 0.0);
  float rimLight = pow(max(dot(n, lightRim), 0.0), 2.0);
  float specular = pow(max(dot(n, halfVector), 0.0), 90.0);
  float rim = pow(1.0 - max(dot(n, viewDirection), 0.0), 2.4);
  float glint = 0.94 + 0.06 * sin(uTime * 1.1 + vPosition.y * 5.0 + vPosition.x * 3.0);

  vec3 color = vColor * (0.34 + diffuse * 0.82 + fill * 0.3);
  color += vec3(1.0, 0.92, 0.74) * specular * 1.55 * glint;
  color += vec3(0.82, 0.9, 1.0) * rim * 0.42;
  color += vec3(0.94, 0.68, 0.34) * rimLight * 0.12;
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

function rotatePoint(point, rotation) {
  let [x, y, z] = point;
  const [rx, ry, rz] = rotation;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const cz = Math.cos(rz), sz = Math.sin(rz);
  [y, z] = [y * cx - z * sx, y * sx + z * cx];
  [x, z] = [x * cy + z * sy, -x * sy + z * cy];
  [x, y] = [x * cz - y * sz, x * sz + y * cz];
  return [x, y, z];
}

function addTorus(positions, normals, colors, {
  center = [0, 0, 0],
  major = 0.8,
  minor = 0.05,
  rotation = [0, 0, 0],
  color = [0.78, 0.55, 0.24],
  around = 72,
  tube = 12
} = {}) {
  const point = (u, v) => {
    const radial = major + minor * Math.cos(v);
    const local = [radial * Math.cos(u), radial * Math.sin(u), minor * Math.sin(v)];
    const rotated = rotatePoint(local, rotation);
    return rotated.map((part, index) => part + center[index]);
  };

  for (let i = 0; i < around; i += 1) {
    const u0 = (i / around) * Math.PI * 2;
    const u1 = ((i + 1) / around) * Math.PI * 2;
    for (let j = 0; j < tube; j += 1) {
      const v0 = (j / tube) * Math.PI * 2;
      const v1 = ((j + 1) / tube) * Math.PI * 2;
      const a = point(u0, v0), b = point(u1, v0);
      const c = point(u1, v1), d = point(u0, v1);
      const tint = 0.88 + 0.12 * Math.sin(u0 * 2.0 + v0);
      const material = color.map((channel) => channel * tint);
      addTriangle(positions, normals, colors, a, b, c, material);
      addTriangle(positions, normals, colors, a, c, d, material);
    }
  }
}

function addDiamond(positions, normals, colors, center, size = 1, palette = "ice") {
  const sides = 8;
  const tones = palette === "champagne"
    ? [[0.9, 0.75, 0.47], [0.64, 0.48, 0.25], [0.98, 0.88, 0.65], [0.48, 0.34, 0.16]]
    : [[0.91, 0.95, 0.98], [0.57, 0.72, 0.82], [0.78, 0.87, 0.93], [0.38, 0.55, 0.68]];
  const ring = (radius, y, phase = Math.PI / 8) => Array.from({ length: sides }, (_, index) => {
    const angle = (index / sides) * Math.PI * 2 + phase;
    return [
      center[0] + Math.cos(angle) * radius * size,
      center[1] + y * size,
      center[2] + Math.sin(angle) * radius * size
    ];
  });
  const table = ring(0.18, 0.39);
  const crown = ring(0.43, 0.18);
  const girdle = ring(0.35, 0.05);
  const pavilion = ring(0.26, -0.13);
  const culet = [center[0], center[1] - 0.37 * size, center[2]];

  for (let i = 0; i < sides; i += 1) {
    const next = (i + 1) % sides;
    const facet = i % 2 === 0 ? tones[0] : tones[1];
    addTriangle(positions, normals, colors, table[i], crown[i], crown[next], facet);
    addTriangle(positions, normals, colors, table[i], crown[next], table[next], tones[2]);
    addTriangle(positions, normals, colors, crown[i], girdle[i], girdle[next], tones[1]);
    addTriangle(positions, normals, colors, crown[i], girdle[next], crown[next], facet);
    addTriangle(positions, normals, colors, girdle[i], pavilion[i], pavilion[next], tones[2]);
    addTriangle(positions, normals, colors, girdle[i], pavilion[next], girdle[next], tones[0]);
    addTriangle(positions, normals, colors, pavilion[i], culet, pavilion[next], tones[3]);
  }
}

function addPearl(positions, normals, colors, center, radius = 0.07, color = [0.88, 0.78, 0.58]) {
  const latitude = 9;
  const longitude = 14;
  const point = (lat, lon) => {
    const phi = (lat / latitude) * Math.PI;
    const theta = (lon / longitude) * Math.PI * 2;
    const shimmer = 1 + 0.035 * Math.sin(theta * 3);
    return [
      center[0] + Math.sin(phi) * Math.cos(theta) * radius * shimmer,
      center[1] + Math.cos(phi) * radius * shimmer,
      center[2] + Math.sin(phi) * Math.sin(theta) * radius * shimmer
    ];
  };

  for (let lat = 0; lat < latitude; lat += 1) {
    for (let lon = 0; lon < longitude; lon += 1) {
      const a = point(lat, lon), b = point(lat + 1, lon);
      const c = point(lat + 1, lon + 1), d = point(lat, lon + 1);
      const tint = 0.92 + 0.08 * Math.sin((lon / longitude) * Math.PI * 2 + lat);
      const material = color.map((channel) => Math.min(1, channel * tint));
      addTriangle(positions, normals, colors, a, b, c, material);
      addTriangle(positions, normals, colors, a, c, d, material);
    }
  }
}

function buildJewel() {
  const positions = [];
  const normals = [];
  const colors = [];

  // Main signet ring and its brilliant-cut centerpiece.
  addTorus(positions, normals, colors, {
    center: [0, -0.32, 0],
    major: 0.78,
    minor: 0.07,
    rotation: [0.04, 0.04, -0.03],
    color: [0.78, 0.54, 0.22],
    around: 88,
    tube: 14
  });
  addDiamond(positions, normals, colors, [0, 0.37, 0.03], 1.05);
  addDiamond(positions, normals, colors, [0, -0.43, 0.76], 0.2, "champagne");

  // Four prongs, each a small tapered metallic facet.
  for (let i = 0; i < 4; i += 1) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const x = Math.cos(angle) * 0.34;
    const z = Math.sin(angle) * 0.34;
    const top = [x * 1.1, 0.69, z * 1.1];
    const left = [x - 0.025, 0.47, z - 0.025];
    const right = [x + 0.025, 0.47, z + 0.025];
    addTriangle(positions, normals, colors, left, right, top, [0.94, 0.78, 0.49]);
    addTriangle(positions, normals, colors, right, [x + 0.01, 0.43, z - 0.02], top, [0.62, 0.43, 0.18]);
  }

  // Twin miniature bands, like earrings orbiting the central ring.
  addTorus(positions, normals, colors, {
    center: [-1.04, 0.02, -0.26], major: 0.27, minor: 0.035,
    rotation: [0.66, 0.22, -0.58], color: [0.83, 0.67, 0.4], around: 52, tube: 9
  });
  addTorus(positions, normals, colors, {
    center: [1.04, 0.08, -0.3], major: 0.22, minor: 0.032,
    rotation: [0.76, -0.28, 0.66], color: [0.68, 0.48, 0.24], around: 52, tube: 9
  });

  // Two orbital filigree loops around the entire arrangement.
  addTorus(positions, normals, colors, {
    center: [0, 0.05, -0.46], major: 1.37, minor: 0.014,
    rotation: [1.14, 0.08, -0.26], color: [0.73, 0.59, 0.36], around: 96, tube: 7
  });
  addTorus(positions, normals, colors, {
    center: [0, 0.05, -0.52], major: 1.25, minor: 0.012,
    rotation: [1.49, -0.36, 0.32], color: [0.46, 0.57, 0.65], around: 92, tube: 7
  });

  // Floating diamond accents around the centerpiece.
  addDiamond(positions, normals, colors, [-1.22, 0.72, -0.34], 0.37);
  addDiamond(positions, normals, colors, [1.18, 0.7, -0.4], 0.31, "champagne");
  addDiamond(positions, normals, colors, [-1.2, -0.68, -0.34], 0.25, "champagne");
  addDiamond(positions, normals, colors, [1.18, -0.67, -0.38], 0.23);
  addDiamond(positions, normals, colors, [0.04, 1.36, -0.56], 0.2);
  addDiamond(positions, normals, colors, [-0.05, -1.25, -0.48], 0.17, "champagne");

  // Pearl constellation: small 3D spheres that catch the rim light.
  [
    [-1.45, 0.28, -0.28], [1.42, 0.32, -0.34],
    [-0.78, 1.15, -0.5], [0.79, 1.17, -0.46],
    [-0.75, -1.1, -0.47], [0.74, -1.08, -0.44],
    [-1.44, -0.32, -0.36], [1.42, -0.35, -0.34],
    [-0.32, 1.44, -0.7], [0.38, -1.42, -0.66]
  ].forEach((point, index) => addPearl(
    positions, normals, colors, point,
    index % 3 === 0 ? 0.07 : 0.048,
    index % 2 === 0 ? [0.9, 0.81, 0.63] : [0.76, 0.84, 0.89]
  ));

  // Tiny gold studs complete the high-jewellery composition.
  [
    [-1.5, 0.88, -0.4], [1.47, 0.9, -0.42],
    [-1.42, -0.88, -0.44], [1.45, -0.9, -0.43],
    [0.0, 1.55, -0.7], [0.0, -1.52, -0.72]
  ].forEach((point, index) => addPearl(positions, normals, colors, point, 0.034, [0.88, 0.61, 0.25]));

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors)
  };
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
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
  const f = 1 / Math.tan(Math.PI / 7.4);
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
      powerPreference: "low-power",
      preserveDrawingBuffer: false
    });

    if (!gl) {
      host.dataset.fallback = "true";
      return undefined;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      host.dataset.fallback = "true";
      return undefined;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      host.dataset.fallback = "true";
      return undefined;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
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
      rotationY: gl.getUniformLocation(program, "uRotationY"),
      time: gl.getUniformLocation(program, "uTime")
    };

    const attributes = [
      [locations.position, geometry.positions],
      [locations.normal, geometry.normals],
      [locations.color, geometry.colors]
    ];
    const buffers = [];
    for (const [location, values] of attributes) {
      if (location < 0) continue;
      const buffer = gl.createBuffer();
      if (!buffer) continue;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
      buffers.push(buffer);
    }

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let frame = 0;
    let rotationX = 0.88;
    let rotationY = -0.22;
    let targetX = rotationX;
    let targetY = rotationY;
    let disposed = false;
    let inView = true;
    let lastTime = 0;

    const draw = (time = 0) => {
      if (disposed || gl.isContextLost()) return;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(locations.rotationX, rotationX);
      gl.uniform1f(locations.rotationY, rotationY);
      gl.uniform1f(locations.time, time);
      gl.drawArrays(gl.TRIANGLES, 0, geometry.positions.length / 3);
      host.dataset.fallback = "false";
      host.dataset.ready = "true";
    };

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniformMatrix4fv(locations.projection, false, projectionMatrix(width / height));
      draw(lastTime);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const animate = (timestamp) => {
      if (disposed || !inView || reduceMotion.matches) {
        stop();
        return;
      }
      rotationX += (targetX - rotationX) * 0.045;
      rotationY += (targetY - rotationY) * 0.045;
      lastTime = timestamp * 0.001;
      draw(lastTime);
      frame = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (!frame && inView && !reduceMotion.matches && !document.hidden) {
        frame = window.requestAnimationFrame(animate);
      } else if (!frame) {
        draw(lastTime);
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    const onMotionChange = () => {
      if (reduceMotion.matches) {
        stop();
        draw(lastTime);
      } else start();
    };
    const onPointerMove = (event) => {
      if (event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
      const y = (event.clientY - rect.top) / Math.max(rect.height, 1);
      targetY = -0.22 + (x - 0.5) * 0.5;
      targetX = 0.88 + (0.5 - y) * 0.2;
    };
    const onPointerLeave = () => {
      targetX = 0.88;
      targetY = -0.22;
    };
    const onContextLost = (event) => {
      event.preventDefault();
      stop();
      host.dataset.fallback = "true";
      host.dataset.ready = "false";
    };

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    const visibilityObserver = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      }, { rootMargin: "120px" })
      : null;

    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", () => window.location.reload(), false);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener?.("change", onMotionChange);
    if (observer) observer.observe(host);
    else window.addEventListener("resize", resize, { passive: true });
    if (visibilityObserver) visibilityObserver.observe(host);

    resize();
    start();

    return () => {
      disposed = true;
      stop();
      observer?.disconnect();
      visibilityObserver?.disconnect();
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener?.("change", onMotionChange);
      buffers.forEach((buffer) => gl.deleteBuffer(buffer));
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`jp-webgl-jewel ${className}`.trim()}
      aria-hidden="true"
      data-fallback="true"
      data-objects="24+"
    >
      <canvas ref={canvasRef} className="jp-webgl-canvas" />
      <span className="jp-webgl-fallback-orbit" />
      <span className="jp-webgl-fallback-ring" />
      <span className="jp-webgl-fallback-stone" />
      <span className="jp-webgl-fallback-diamond jp-webgl-fallback-diamond--one" />
      <span className="jp-webgl-fallback-diamond jp-webgl-fallback-diamond--two" />
      <span className="jp-webgl-fallback-pearl jp-webgl-fallback-pearl--one" />
      <span className="jp-webgl-fallback-pearl jp-webgl-fallback-pearl--two" />
    </div>
  );
}
