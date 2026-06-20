import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uMouse;
  uniform float uPixelRatio;
  uniform float uIntro;

  attribute float aRandom;
  attribute float aScale;

  varying float vElevation;
  varying float vRandom;
  varying float vDist;

  // Simplex 3D noise — Ashima Arts (MIT)
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
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
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
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

  void main(){
    vec3 pos = position;
    float t = uTime * 0.22;

    float elevation  = snoise(vec3(pos.x * 0.20, pos.z * 0.20, t)) * 1.15;
    elevation       += snoise(vec3(pos.x * 0.55, pos.z * 0.55, t * 1.5)) * 0.35;

    // mouse ripple
    float d = distance(pos.xz, uMouse * 10.0);
    elevation += smoothstep(4.0, 0.0, d) * 1.0;

    // scroll energy
    elevation *= 1.0 + uScroll * 0.5;

    // intro rise
    elevation *= uIntro;

    pos.y += elevation;
    vElevation = elevation;
    vRandom = aRandom;
    vDist = d;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float size = (1.0 + aScale * 2.4) * uPixelRatio;
    gl_PointSize = size * (16.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorLow;
  uniform vec3 uColorHigh;
  uniform float uTint;

  varying float vElevation;
  varying float vRandom;
  varying float vDist;

  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float dd = length(uv);
    float alpha = smoothstep(0.5, 0.06, dd);

    float h = clamp(vElevation * 0.45 + 0.5, 0.0, 1.0);
    vec3 color = mix(uColorLow, uColorHigh, pow(h, 1.3));

    // warm tint near the mouse
    color += vec3(0.35, 0.12, 0.0) * smoothstep(4.0, 0.0, vDist);
    color += vRandom * 0.06;

    float a = alpha * (0.28 + h * 0.72);
    gl_FragColor = vec4(color, a);
  }
`;

export class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.scrollVelocity = 0;
    this.clock = new THREE.Clock();
    this.running = true;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._init();
  }

  _init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0908, 0.058);

    this.camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    this.camera.position.set(0, 3.0, 10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x0a0908, 1);
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this._createParticles();
    this._bind();

    // intro rise (driven externally or auto)
    this.uniforms.uIntro.value = this.reduceMotion ? 1 : 0;

    this.renderer.setAnimationLoop(() => this._tick());
  }

  _createParticles() {
    const isMobile = window.innerWidth < 768;
    const cols = isMobile ? 96 : 170;
    const rows = isMobile ? 64 : 104;
    const width = 26;
    const depth = 17;
    const count = cols * rows;

    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const scales = new Float32Array(count);

    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        positions[i * 3] = (x / (cols - 1) - 0.5) * width;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (z / (rows - 1) - 0.5) * depth;
        randoms[i] = Math.random();
        scales[i] = Math.random();
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    this.uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: this.mouse },
      uPixelRatio: { value: this.pixelRatio },
      uIntro: { value: 0 },
      uTint: { value: 0 },
      uColorLow: { value: new THREE.Color(0x16294d) },
      uColorHigh: { value: new THREE.Color(0xff7a44) },
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
    this.points.position.y = -1.4;
    this.points.rotation.y = -0.12;
    this.scene.add(this.points);
  }

  _bind() {
    this._onMove = (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', this._onMove, { passive: true });

    this._onResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.renderer.setPixelRatio(this.pixelRatio);
      this.uniforms.uPixelRatio.value = this.pixelRatio;
    };
    window.addEventListener('resize', this._onResize);

    // pause when tab hidden to save CPU/GPU/battery
    document.addEventListener('visibilitychange', () => {
      this.running = !document.hidden;
      if (this.running) this.clock.getDelta();
    });
  }

  setScrollVelocity(v) {
    this.scrollVelocity = v;
  }

  // 0..1 progress through the page — gently shifts depth/tone
  setProgress(p) {
    this._progress = p;
  }

  playIntro() {
    if (this.reduceMotion) {
      this.uniforms.uIntro.value = 1;
      return;
    }
    const start = performance.now();
    const dur = 2200;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      this.uniforms.uIntro.value = ease(t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  _tick() {
    if (!this.running) return;
    const elapsed = this.clock.getElapsedTime();

    if (!this.reduceMotion) this.uniforms.uTime.value = elapsed;

    this.mouse.lerp(this.targetMouse, 0.045);

    const targetScroll = Math.min(Math.abs(this.scrollVelocity) * 0.02, 1.4);
    this.uniforms.uScroll.value += (targetScroll - this.uniforms.uScroll.value) * 0.05;

    // camera parallax + slow drift through the page
    const p = this._progress || 0;
    const targetX = this.mouse.x * 1.4;
    const targetY = 3.0 + this.mouse.y * 0.7 - p * 1.2;
    this.camera.position.x += (targetX - this.camera.position.x) * 0.03;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.03;
    if (!this.reduceMotion) this.points.rotation.y = -0.12 + Math.sin(elapsed * 0.05) * 0.04;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('resize', this._onResize);
    this.points.geometry.dispose();
    this.points.material.dispose();
    this.renderer.dispose();
  }
}
