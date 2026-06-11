import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uPixelRatio;

  attribute float aRandom;

  varying float vElevation;
  varying float vRandom;

  // Simplex 3D noise — Ashima Arts (MIT)
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;

    float t = uTime * 0.25;
    float elevation = snoise(vec3(pos.x * 0.28, pos.z * 0.28, t)) * 1.1;
    elevation += snoise(vec3(pos.x * 0.9, pos.z * 0.9, t * 1.6)) * 0.25;

    // mouse ripple
    float dist = distance(pos.xz, uMouse * 9.0);
    elevation += smoothstep(3.5, 0.0, dist) * 0.9;

    // scroll energy
    elevation *= 1.0 + uScroll * 0.6;

    pos.y += elevation;
    vElevation = elevation;
    vRandom = aRandom;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float size = (1.6 + aRandom * 2.2) * uPixelRatio;
    gl_PointSize = size * (14.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vElevation;
  varying float vRandom;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.05, d);

    float mixFactor = clamp(vElevation * 0.5 + 0.5, 0.0, 1.0);
    vec3 color = mix(uColorA, uColorB, mixFactor);
    color += vRandom * 0.12;

    gl_FragColor = vec4(color, alpha * (0.35 + mixFactor * 0.65));
  }
`;

export class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.scrollVelocity = 0;
    this.clock = new THREE.Clock();
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x06060a, 8, 22);

    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 2.6, 9);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x06060a, 1);
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.createParticles();
    this.bindEvents();

    this.renderer.setAnimationLoop(() => this.tick());
  }

  createParticles() {
    const isMobile = window.innerWidth < 768;
    const cols = isMobile ? 90 : 160;
    const rows = isMobile ? 60 : 100;
    const width = 24;
    const depth = 16;
    const count = cols * rows;

    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        positions[i * 3] = (x / (cols - 1) - 0.5) * width;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (z / (rows - 1) - 0.5) * depth;
        randoms[i] = Math.random();
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    this.uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: this.mouse },
      uPixelRatio: { value: this.pixelRatio },
      uColorA: { value: new THREE.Color(0x2a2550) },
      uColorB: { value: new THREE.Color(0x6ee7ff) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geometry, material);
    this.points.position.y = -1.2;
    this.scene.add(this.points);
  }

  bindEvents() {
    window.addEventListener('pointermove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.renderer.setPixelRatio(this.pixelRatio);
      this.uniforms.uPixelRatio.value = this.pixelRatio;
    });
  }

  setScrollVelocity(v) {
    this.scrollVelocity = v;
  }

  tick() {
    const elapsed = this.clock.getElapsedTime();

    if (!this.reduceMotion) {
      this.uniforms.uTime.value = elapsed;
    }

    // smooth mouse follow
    this.mouse.lerp(this.targetMouse, 0.05);

    // ease scroll energy back to rest
    this.uniforms.uScroll.value +=
      (Math.min(Math.abs(this.scrollVelocity) * 0.02, 1.5) - this.uniforms.uScroll.value) * 0.06;

    // subtle camera parallax
    this.camera.position.x += (this.mouse.x * 1.2 - this.camera.position.x) * 0.03;
    this.camera.position.y += (2.6 + this.mouse.y * 0.6 - this.camera.position.y) * 0.03;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}
