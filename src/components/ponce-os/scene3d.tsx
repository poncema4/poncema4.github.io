// THE VOYAGE — a persistent 3D world behind the whole site (three.js).
// Surface: pirate ship, moon, stars. Scrolling DIVES the camera underwater:
// bubbles, god rays, circling fish, a shipwreck, and a glowing treasure chest
// at the bottom (the contact section — reaching out is the treasure).
// StrictMode-safe: all resources disposed per mount.
import { useEffect, useRef } from "react";
import * as THREE from "three";

function waveH(x: number, z: number, t: number): number {
  return (
    Math.sin(x * 0.16 + t * 0.9) * 0.55 +
    Math.sin(z * 0.13 - t * 0.65) * 0.4 +
    Math.sin((x + z) * 0.08 + t * 0.45) * 0.65
  );
}
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (k: number) => k * k * (3 - 2 * k);

function buildShip(): THREE.Group {
  const ship = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x1a3d30, roughness: 0.75, flatShading: true });
  const woodDark = new THREE.MeshStandardMaterial({ color: 0x123028, roughness: 0.8, flatShading: true });
  const sailM = new THREE.MeshStandardMaterial({ color: 0x2a5c48, emissive: 0x0a2018, roughness: 0.85, side: THREE.DoubleSide, flatShading: true });

  // hull with a proper tapered bow (no more arrowhead cone)
  const hull = new THREE.Mesh(new THREE.BoxGeometry(7, 1.6, 2.4), wood);
  hull.position.y = 0.4;
  ship.add(hull);
  // bow: same height/centerline as the hull so bottoms + decks are flush
  // (was h=1.3 @ y=0.55 -> bottom hovered 0.3 above the hull's: the visible step)
  const bow = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.6, 1.5), wood);
  bow.position.set(4.0, 0.4, 0);
  bow.rotation.y = Math.PI / 4; // diamond taper toward the prow (tip at x ~ 5.24)
  ship.add(bow);
  // bowsprit: base buried in the bow deck (x 4.45, y 1.1), tip up-forward.
  // length 2.2, rotZ -1.2 -> runs (4.42,1.15) to (6.47,1.95): anchored, not floating
  const sprit = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 2.2), woodDark);
  sprit.rotation.z = -1.2;
  sprit.position.set(5.45, 1.55, 0);
  ship.add(sprit);
  // stern cabin + railing cap
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.3, 2.1), woodDark);
  cabin.position.set(-2.9, 1.55, 0);
  ship.add(cabin);
  const cap = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.18, 2.3), wood);
  cap.position.set(-2.9, 2.3, 0);
  ship.add(cap);

  const mastG = new THREE.CylinderGeometry(0.09, 0.13, 6.4);
  for (const [mx, sw, sh] of [[1.6, 3.4, 2.6], [-1.2, 2.8, 2.2]] as const) {
    const mast = new THREE.Mesh(mastG, woodDark);
    mast.position.set(mx, 3.4, 0);
    ship.add(mast);
    const sailGeo = new THREE.PlaneGeometry(sw, sh, 6, 1);
    const pos = sailGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin((pos.getX(i) / sw + 0.5) * Math.PI) * 0.55);
    sailGeo.computeVertexNormals();
    const sail = new THREE.Mesh(sailGeo, sailM);
    sail.rotation.y = Math.PI / 2;
    sail.position.set(mx, 3.9, 0);
    ship.add(sail);
  }
  // crow's nest on the main mast
  const nest = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.28, 0.35, 6), woodDark);
  nest.position.set(1.6, 5.9, 0);
  ship.add(nest);
  // pennant sits ON the main mast tip now (was floating off-angle beside it)
  const flag = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 3), new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x0c3d2c, flatShading: true }));
  flag.rotation.z = -Math.PI / 2;
  flag.position.set(2.05, 6.62, 0); // trailing aft off the mast top
  ship.add(flag);
  // warm stern lantern — a spot of life on the night sea
  const lampPost = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5), woodDark);
  lampPost.position.set(-3.5, 2.55, 0);
  ship.add(lampPost);
  const lampGlass = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffc97a }));
  lampGlass.position.set(-3.5, 2.85, 0);
  ship.add(lampGlass);
  const lamp = new THREE.PointLight(0xffb86b, 1.6, 16);
  lamp.position.set(-3.5, 2.95, 0);
  ship.add(lamp);
  return ship;
}

const SEABED_Y = -62;

export function Scene3D({ onUnsupported }: { onUnsupported: () => void }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch { onUnsupported(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const SKY = new THREE.Color(0x030a08);
    const DEEP = new THREE.Color(0x021018);
    scene.background = SKY.clone();
    scene.fog = new THREE.Fog(SKY.clone(), 40, 130);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);

    // ---- ocean surface (visible from both sides) ----
    const OCEAN = new THREE.PlaneGeometry(180, 180, 56, 56);
    OCEAN.rotateX(-Math.PI / 2);
    const ocean = new THREE.Mesh(OCEAN, new THREE.MeshStandardMaterial({
      color: 0x06251e, metalness: 0.55, roughness: 0.5, flatShading: true, side: THREE.DoubleSide,
    }));
    scene.add(ocean);
    const basePos = (OCEAN.attributes.position as THREE.BufferAttribute).array.slice() as Float32Array;

    // ---- lights ----
    scene.add(new THREE.AmbientLight(0x245042, 0.75));
    const moonLight = new THREE.DirectionalLight(0xa8ffd8, 1.8);
    moonLight.position.set(-35, 40, -55);
    scene.add(moonLight);

    // ---- moon + halo ----
    const moon = new THREE.Mesh(new THREE.SphereGeometry(4.2, 24, 24), new THREE.MeshBasicMaterial({ color: 0xeafff5, fog: false }));
    moon.position.set(-48, 34, -95);
    scene.add(moon);
    const haloC = document.createElement("canvas");
    haloC.width = haloC.height = 128;
    const hctx = haloC.getContext("2d")!;
    const grad = hctx.createRadialGradient(64, 64, 6, 64, 64, 64);
    grad.addColorStop(0, "rgba(200,255,230,0.5)");
    grad.addColorStop(1, "rgba(200,255,230,0)");
    hctx.fillStyle = grad;
    hctx.fillRect(0, 0, 128, 128);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(haloC), transparent: true, fog: false, depthWrite: false }));
    halo.scale.set(30, 30, 1);
    halo.position.copy(moon.position);
    scene.add(halo);

    // ---- stars ----
    const starGeo = new THREE.BufferGeometry();
    const starPts: number[] = [];
    for (let i = 0; i < 1400; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI * 0.48, r = 160 + Math.random() * 60;
      starPts.push(r * Math.cos(th) * Math.cos(ph), r * Math.sin(ph) + 2, r * Math.sin(th) * Math.cos(ph));
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPts, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xb8ffe4, size: 0.55, sizeAttenuation: true, fog: false }));
    scene.add(stars);

    // ---- ship ----
    const ship = buildShip();
    scene.add(ship);

    /* ================= UNDERWATER WORLD ================= */

    // seabed: displaced sandy plane
    const bedGeo = new THREE.PlaneGeometry(220, 220, 40, 40);
    bedGeo.rotateX(-Math.PI / 2);
    const bp = bedGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < bp.count; i++) {
      const x = bp.getX(i), z = bp.getZ(i);
      bp.setY(i, Math.sin(x * 0.11) * Math.cos(z * 0.13) * 1.6 + Math.sin(x * 0.31 + z * 0.17) * 0.7);
    }
    bedGeo.computeVertexNormals();
    const seabed = new THREE.Mesh(bedGeo, new THREE.MeshStandardMaterial({ color: 0x0b1d1a, roughness: 1, flatShading: true }));
    seabed.position.y = SEABED_Y;
    scene.add(seabed);

    // shipwreck: tilted broken hull + snapped mast, half-buried
    const wreck = new THREE.Group();
    const wreckMat = new THREE.MeshStandardMaterial({ color: 0x071511, roughness: 1, flatShading: true });
    const whull = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 2.6), wreckMat);
    whull.rotation.z = 0.5;
    whull.rotation.y = 0.7;
    wreck.add(whull);
    const wmast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 7), wreckMat);
    wmast.rotation.z = 1.9;
    wmast.position.set(2.5, 1.4, 0.5);
    wreck.add(wmast);
    wreck.position.set(-20, SEABED_Y + 1.2, -22);
    scene.add(wreck);

    // treasure chest: body + open lid + glowing gold + pulsing light
    const chest = new THREE.Group();
    const chestMat = new THREE.MeshStandardMaterial({ color: 0x1c1208, roughness: 0.9, flatShading: true });
    const cbody = new THREE.Mesh(new THREE.BoxGeometry(3, 1.6, 2), chestMat);
    chest.add(cbody);
    const clid = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 2), chestMat);
    clid.position.set(0, 1.15, -0.75);
    clid.rotation.x = -0.9;
    chest.add(clid);
    const gold = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.7, 1.5),
      new THREE.MeshStandardMaterial({ color: 0xffd76a, emissive: 0xb8860b, emissiveIntensity: 0.9, flatShading: true })
    );
    gold.position.y = 0.75;
    chest.add(gold);
    const goldLight = new THREE.PointLight(0xffc94d, 2.2, 26);
    goldLight.position.set(0, 2.2, 0);
    chest.add(goldLight);
    chest.position.set(2, SEABED_Y + 1.6, -10);
    chest.rotation.y = -0.5;
    scene.add(chest);

    // bubbles: rising points, wrap at surface
    const BUB = 260;
    const bubGeo = new THREE.BufferGeometry();
    const bubArr = new Float32Array(BUB * 3);
    const bubSpd = new Float32Array(BUB);
    for (let i = 0; i < BUB; i++) {
      bubArr[i * 3] = (Math.random() - 0.5) * 120;
      bubArr[i * 3 + 1] = -Math.random() * 60;
      bubArr[i * 3 + 2] = (Math.random() - 0.5) * 120;
      bubSpd[i] = 1.5 + Math.random() * 3;
    }
    bubGeo.setAttribute("position", new THREE.BufferAttribute(bubArr, 3));
    // constant pixel size: with sizeAttenuation, near-camera bubbles blow up into
    // huge transparent quads at the seafloor and torch the fill rate
    const bubbles = new THREE.Points(bubGeo, new THREE.PointsMaterial({ color: 0x7fe8c8, size: 2.2, transparent: true, opacity: 0.5, sizeAttenuation: false }));
    scene.add(bubbles);

    // fish: cone darts circling at various depths
    const fishes: Array<{ m: THREE.Mesh; r: number; y: number; sp: number; ph: number }> = [];
    const fishMat = new THREE.MeshStandardMaterial({ color: 0x1e6b56, emissive: 0x0a2e24, flatShading: true });
    for (let i = 0; i < 12; i++) {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.4, 4), fishMat);
      f.rotation.z = -Math.PI / 2;
      scene.add(f);
      fishes.push({ m: f, r: 8 + Math.random() * 30, y: -12 - Math.random() * 42, sp: 0.2 + Math.random() * 0.5, ph: Math.random() * Math.PI * 2 });
    }

    // god rays: additive translucent planes slanting from the surface
    const rayMat = new THREE.MeshBasicMaterial({ color: 0x2affc8, transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
    for (const [rx, rz, rot] of [[-14, -18, 0.3], [10, -26, -0.2], [26, -8, 0.15]] as const) {
      const ray = new THREE.Mesh(new THREE.PlaneGeometry(7, 70), rayMat);
      ray.position.set(rx, -30, rz);
      ray.rotation.set(0.15, rot, 0.35);
      scene.add(ray);
    }
    // rays are surface light — fade them out near the seafloor (also avoids the
    // camera sitting inside a full-screen additive quad at the bottom)

    /* ================= CAMERA + INTERACTION ================= */
    let theta = 0, thetaTarget = 0, dragging = false, lastX = 0;
    let parX = 0, parY = 0, parXT = 0, parYT = 0; // smoothed parallax (target vs eased)
    // drag ANYWHERE on open water: the content sits above the canvas, so listen on
    // window and ignore drags that start on interactive UI
    const INTERACTIVE = "a,button,input,textarea,.pos-term,.pos-file,.pos-paper,.pos-uplink,.pos-cert,nav,header";
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) return;
      dragging = true;
      lastX = e.clientX;
      document.body.style.cursor = "grabbing";
      document.body.classList.add("pos-dragging"); // kills text selection during drag
      window.getSelection()?.removeAllRanges();
    };
    const onUp = () => {
      dragging = false;
      document.body.style.cursor = "";
      document.body.classList.remove("pos-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (dragging) { thetaTarget += (e.clientX - lastX) * 0.006; lastX = e.clientX; }
      parXT = e.clientX / window.innerWidth - 0.5;
      parYT = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight, false);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let running = true;
    const onVis = () => { running = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    const clock = new THREE.Clock();
    let elapsed = 0;
    let diveS = 0; // eased dive position — decouples camera from raw scroll jumps
    // adaptive quality: if frames run slow for ~1.5s, drop pixel ratio once
    let slowFrames = 0, degraded = false;
    const posAttr = OCEAN.attributes.position as THREE.BufferAttribute;
    const fogColor = scene.fog.color;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!running) { clock.getDelta(); return; }
      const dt = clock.getDelta();
      elapsed += dt;
      const t = elapsed;

      if (!degraded) {
        if (dt > 0.024) slowFrames++; else slowFrames = Math.max(0, slowFrames - 2);
        if (slowFrames > 90) { degraded = true; renderer.setPixelRatio(1); }
      }

      // scroll = dive TARGET; camera eases toward it (seamless even on jumpy scrolls)
      const d = document.documentElement;
      const s = d.scrollHeight > d.clientHeight ? d.scrollTop / (d.scrollHeight - d.clientHeight) : 0;
      diveS += (s - diveS) * Math.min(1, dt * 7);
      const dive = smooth(Math.min(1, diveS * 1.06));
      // smoothed parallax
      parX += (parXT - parX) * Math.min(1, dt * 8);
      parY += (parYT - parY) * Math.min(1, dt * 8);
      const camY = lerp(9.5, SEABED_Y + 7, dive);
      const under = camY < 0.6;

      // ocean surface animation — no CPU normal recompute: flatShading derives
      // face normals on the GPU (dFdx/dFdy), so displacing Y is all we pay for
      if (camY > -40) {
        for (let i = 0; i < posAttr.count; i++) {
          const x = basePos[i * 3], z = basePos[i * 3 + 2];
          posAttr.setY(i, waveH(x, z, t));
        }
        posAttr.needsUpdate = true;
      }

      // ship rides the surface
      const sx = Math.sin(t * 0.05) * 10, sz = Math.cos(t * 0.032) * 6 - 2;
      ship.position.set(sx, waveH(sx, sz, t) + 0.35, sz);
      const dd = 0.9;
      ship.rotation.z = (waveH(sx + dd, sz, t) - waveH(sx - dd, sz, t)) * 0.25;
      ship.rotation.x = (waveH(sx, sz + dd, t) - waveH(sx, sz - dd, t)) * 0.25;
      ship.rotation.y = Math.cos(t * 0.05) * 0.35;

      // bubbles rise
      const ba = bubGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < BUB; i++) {
        let y = ba.getY(i) + bubSpd[i] * 0.016;
        if (y > -0.5) y = -60;
        ba.setY(i, y);
        ba.setX(i, ba.getX(i) + Math.sin(t * 2 + i) * 0.008);
      }
      ba.needsUpdate = true;

      // fish circle
      for (const f of fishes) {
        const a = t * f.sp + f.ph;
        f.m.position.set(Math.cos(a) * f.r, f.y + Math.sin(t * 0.8 + f.ph) * 0.8, Math.sin(a) * f.r - 10);
        f.m.rotation.y = -a; // face tangent
      }

      // treasure pulse
      goldLight.intensity = 2.0 + Math.sin(t * 2.2) * 0.7;

      // god rays fade with depth
      rayMat.opacity = 0.045 * Math.max(0, 1 - Math.max(0, -camY - 25) / 25);

      // atmosphere: sky <-> deep water
      const k = under ? Math.min(1, (0.6 - camY) / 30) : 0;
      (scene.background as THREE.Color).copy(SKY).lerp(DEEP, k);
      fogColor.copy(SKY).lerp(DEEP, k);
      scene.fog!.near = lerp(40, 6, k);
      scene.fog!.far = lerp(130, 70, k);

      // camera: orbit above, forward glide below, always easing
      theta += (thetaTarget - theta) * 0.06;
      const az = theta + t * 0.02;
      const r = lerp(30, 20, dive);
      camera.position.set(Math.sin(az) * r + parX * 4, camY + parY * -2 + Math.sin(t * 0.1) * 0.5, Math.cos(az) * r);
      const lookY = lerp(2.2, SEABED_Y + 2.5, dive);
      const lx = lerp(ship.position.x * 0.4, chest.position.x, dive);
      const lz = lerp(ship.position.z * 0.4, chest.position.z, dive);
      camera.lookAt(lx, lookY, lz);

      stars.rotation.y = t * 0.004;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVis);
      document.body.style.cursor = "";
      document.body.classList.remove("pos-dragging");
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [onUnsupported]);

  return <div ref={mount} className="pos-scene3d" aria-hidden="true" />;
}
