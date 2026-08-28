/* NAV */
const nav = document.querySelector(".nav");
const navInner = document.querySelector(".nav-inner");
navInner.onclick = () => nav.classList.toggle("open");
navInner.addEventListener("keydown", e=>{
  if(e.key==="Enter" || e.key===" "){ e.preventDefault(); nav.classList.toggle("open"); }
});

/* MENU ITEMS -> JUMP TO PRODUCT */
document.querySelectorAll(".nav-item").forEach(item=>{
  item.addEventListener("click",(e)=>{
    e.stopPropagation();
    const index = Number(item.dataset.index);
    if(!Number.isNaN(index)) goToSlide(index);
    nav.classList.remove("open");
  });
});

/* =========================
   MULTI-PRODUCT CAROUSEL + WEBGL
========================= */
const carousel = document.querySelector(".carousel");

const products = [
  // --- entrada: siempre primero ---
  { name: "OneBlast", description: "Making things happen, one blast at a time.", model: "models/bomba.glb", scale: 0.8 },

  // --- de acá en más: complejidad, color y detalle creciendo hacia la derecha ---
  { name: "Caja Blindada", description: "Almacenamiento reforzado para el resto del kit.", model: "models/product1.glb", scale: 1.1 },
  { name: "Bengala de Señal", description: "Punta encendida, mango firme, visible a la distancia.", procedural: "flare", scale: 0.85 },
  { name: "Detonador Remoto", description: "Botón rojo, antena lista, control total.", procedural: "detonator", scale: 0.8 },
  { name: "Cohete de Mano", description: "Perfil delgado, cabeza explosiva liviana.", procedural: "rocket", scale: 0.85 },
  { name: "Barril de Riesgo", description: "Bandas de advertencia, carga a presión.", procedural: "hazardbarrel", scale: 0.85 },
  { name: "Carga Táctica", description: "Bloque compacto, temporizador activo.", procedural: "c4block", scale: 0.85 },
  { name: "Ojiva OneBlast", description: "Perfil aerodinámico, punta de impacto marcada.", procedural: "warhead", scale: 0.8 },
  { name: "Canister Táctico", description: "Carcasa de gunmetal cepillado, lista para la acción.", model: "models/product2.glb", scale: 0.8 },

  { name: "Granada de Fragmentación", description: "Grilla de fractura clásica, anilla y palanca de seguridad.", procedural: "grenade", scale: 0.85, badge: "Mk.I" },
  { name: "Granada de Fragmentación Mk.II", description: "Misma base, carga expuesta y ventilación de sobrepresión.", procedural: "grenade2", scale: 0.85, badge: "Evolución" },

  { name: "Mina de Impacto", description: "Núcleo con púas radiales, activación al contacto.", procedural: "spikemine", scale: 0.8 },

  { name: "Lanzador Portátil", description: "Tubo al hombro, mira simple, listo para disparar.", procedural: "launcher", scale: 0.8, badge: "Mk.I" },
  { name: "Lanzador Portátil Avanzado", description: "Mira óptica activa y toberas de escape traseras.", procedural: "launcher2", scale: 0.8, badge: "Evolución" },

  { name: "Núcleo de Plasma", description: "Energía contenida en órbitas concéntricas.", procedural: "plasmacore", scale: 0.85 },

  { name: "Pistola de Pulso", description: "Compacta, directa, sin partes de más.", procedural: "pulsegun", scale: 0.85, badge: "Mk.I" },
  { name: "Pistola de Pulso Sobrecargada", description: "Núcleo de cañón visible y bobinas de refuerzo activas.", procedural: "pulsegun2", scale: 0.85, badge: "Evolución" },

  { name: "Micro-Dron de Reconocimiento", description: "Cuerpo liviano, cuatro rotores, perfil silencioso.", procedural: "microdrone", scale: 0.85, badge: "Mk.I" },
  { name: "Micro-Dron de Combate", description: "Casco facetado, ojo sensor activo y módulo de armas.", procedural: "microdrone2", scale: 0.85, badge: "Evolución" },

  { name: "Placa Blindada", description: "Protección plana, agarre simple, sin adornos.", procedural: "armorplate", scale: 0.85, badge: "Mk.I" },
  { name: "Placa Blindada Reforzada", description: "Doble capa remachada con núcleo de energía activo.", procedural: "armorplate2", scale: 0.85, badge: "Evolución" },

  { name: "Recon Drone", description: "Ojos en el cielo antes de que todo explote.", model: "models/drone.glb", scale: 0.8 },

  { name: "Núcleo de Contención", description: "Carcasa geodésica, giroscopio triple y plasma activo en el centro.", procedural: "containment", scale: 0.85 },

  // --- top de gama: 5 modelos descargados, licencia CC0 (Quaternius / mastjie vía poly.pizza), sin marca.
  //     keepMaterial:true = no forzar cromado, se muestran con su color e ilustración originales ---
  { name: "Nave de Combate", description: "Perfil aerodinámico, lista para atravesar cualquier bloqueo.", model: "models/spaceship.glb", scale: 0.9, badge: "CC0", keepMaterial: true },
  { name: "Mech de Asalto", description: "Bípedo blindado, potencia de fuego a escala.", model: "models/mech.glb", scale: 0.9, badge: "CC0", keepMaterial: true },
  { name: "Guerrero de Élite", description: "Equipo completo, listo para el frente.", model: "models/warrior.glb", scale: 0.9, badge: "CC0", keepMaterial: true },
  { name: "Astronauta Táctico", description: "Traje reforzado y arma secundaria a mano.", model: "models/astronaut.glb", scale: 0.9, badge: "CC0", keepMaterial: true },
  { name: "Tanque Blindado", description: "Torreta, cañón y orugas — la pieza más pesada del catálogo.", model: "models/tank.glb", scale: 0.75, badge: "CC0", keepMaterial: true }
];

// Crear slides
products.forEach((p,i)=>{
  const section = document.createElement("section");
  section.classList.add("product-section");
  if(i===0) section.classList.add("active");
  section.innerHTML = `
    <div class="product-container">
      <div class="product-info">
        <span class="eyebrow">PRODUCT ${String(i+1).padStart(2,"0")} / ${String(products.length).padStart(2,"0")}</span>
        ${p.badge ? `<span class="evo-badge">${p.badge}</span>` : ""}
        <h1>${p.name}</h1>
        <p>${p.description}</p>
        <a href="https://mpago.la/11P89Mz" target="_blank" class="buy-button">Comprar ahora</a>
      </div>
      <div class="product-viewer">
        <div class="loader">Loading...</div>
      </div>
    </div>
  `;
  carousel.appendChild(section);
});

const slides = document.querySelectorAll(".product-section");
const prevArrow = document.querySelector(".arrow.prev");
const nextArrow = document.querySelector(".arrow.next");
let current=0, isDragging=false, startX=0, deltaX=0;

/* =========================
   THREE.JS WEBGL — UN SOLO CONTEXTO COMPARTIDO
   30 cards x 1 WebGLRenderer cada una excedía el límite de contextos
   WebGL simultáneos del navegador (~8-16), y los más viejos se
   perdían silenciosamente (cards en blanco). Ahora hay un único
   renderer/canvas que se mueve al viewer activo, y los modelos ya
   construidos se cachean para que volver a una card sea instantáneo.
   (Declarado antes de updateSlides() porque esta llama a
   showModelForSlide() apenas se define, más abajo.)
========================= */
const viewers = document.querySelectorAll(".product-viewer");

const viewerCanvas = document.createElement("canvas");
viewerCanvas.className = "webgl-canvas";

const viewerRenderer = new THREE.WebGLRenderer({ canvas:viewerCanvas, alpha:true, antialias:true });
viewerRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
viewerRenderer.outputEncoding = THREE.sRGBEncoding;
viewerRenderer.physicallyCorrectLights = true;
viewerRenderer.toneMapping = THREE.ACESFilmicToneMapping;
viewerRenderer.toneMappingExposure = 1.6;

const viewerScene = new THREE.Scene();

const viewerCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
viewerCamera.position.set(0,0,5);

const viewerAmbient = new THREE.AmbientLight(0xffffff, 0.5);
viewerScene.add(viewerAmbient);

const viewerDir = new THREE.DirectionalLight(0xffffff, 2);
viewerDir.position.set(3,3,3);
viewerScene.add(viewerDir);

const viewerControls = new THREE.OrbitControls(viewerCamera, viewerRenderer.domElement);
viewerControls.enableZoom=false;
viewerControls.enablePan=false;
viewerControls.enableDamping=true;

const modelCache = {};
let activeModel = null;
let viewerReady = false;

function resizeViewerTo(canvas){
  const width = canvas.clientWidth || 1;
  const height = canvas.clientHeight || 1;
  viewerCamera.aspect = width/height;
  viewerCamera.updateProjectionMatrix();
  viewerRenderer.setSize(width, height, false);
}

function getOrBuildModel(i){
  if(modelCache[i]) return modelCache[i];

  if(products[i].procedural){
    const model = buildProceduralProduct(products[i].procedural);
    model.scale.set(products[i].scale, products[i].scale, products[i].scale);
    model.traverse(c=>{ if(c.isMesh){ c.material.metalness=1; c.material.roughness=0.2; }});
    modelCache[i] = model;
    return model;
  }

  // GLB: reserve the slot synchronously, fill it in once loaded
  modelCache[i] = null;
  const loader = new THREE.GLTFLoader();
  loader.load(products[i].model, gltf=>{
    const model = gltf.scene;
    model.scale.set(products[i].scale, products[i].scale, products[i].scale);
    if(!products[i].keepMaterial){
      model.traverse(c=>{ if(c.isMesh){ c.material.metalness=1; c.material.roughness=0.2; }});
    }

    // Downloaded GLBs don't all have their pivot at the visual center
    // (game-ready exports are often pivoted at the base/feet). Re-center
    // on the bounding box so every model frames the same as the procedural ones.
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    modelCache[i] = model;
    if(i === current) showModelForSlide(current); // still the active slide once it finishes loading
  });
  return null;
}

function showModelForSlide(i){
  if(!viewerReady) return;

  const viewer = viewers[i];
  if(!viewer) return;

  if(viewerCanvas.parentElement !== viewer){
    viewer.insertBefore(viewerCanvas, viewer.firstChild);
  }
  resizeViewerTo(viewerCanvas);

  if(activeModel) viewerScene.remove(activeModel);

  const model = getOrBuildModel(i);
  const loaderEl = viewer.querySelector(".loader");

  if(model){
    viewerScene.add(model);
    activeModel = model;
    if(loaderEl) loaderEl.style.display = "none";
  } else {
    activeModel = null;
    if(loaderEl) loaderEl.style.display = "block";
  }

  viewerCamera.position.set(0,0,5);
  viewerControls.target.set(0,0,0);
  viewerControls.update();
}

const hdrLoader = new THREE.RGBELoader().setDataType(THREE.UnsignedByteType);
hdrLoader.load("textures/studio.hdr", texture=>{
  const pmremGenerator = new THREE.PMREMGenerator(viewerRenderer);
  pmremGenerator.compileEquirectangularShader();
  viewerScene.environment = pmremGenerator.fromEquirectangular(texture).texture;
  pmremGenerator.dispose();

  viewerReady = true;
  showModelForSlide(current);
});

function animate(){
  requestAnimationFrame(animate);
  viewerControls.update();
  viewerRenderer.render(viewerScene, viewerCamera);
}
animate();

window.addEventListener("resize", ()=>{
  if(viewerCanvas.parentElement) resizeViewerTo(viewerCanvas);
});

function updateSlides(){
  slides.forEach(slide=>{
    slide.classList.remove("active","prev","next");
    slide.style.transform="";
  });
  slides[current].classList.add("active");
  slides[(current-1+slides.length)%slides.length].classList.add("prev");
  slides[(current+1)%slides.length].classList.add("next");
  if(typeof showModelForSlide === "function") showModelForSlide(current);
}
updateSlides();
function goNext(){ current=(current+1)%slides.length; updateSlides();}
function goPrev(){ current=(current-1+slides.length)%slides.length; updateSlides(); }
function goToSlide(i){ if(i<0||i>=slides.length) return; current=i; updateSlides(); }

slides.forEach(slide=>{
  slide.addEventListener("click",()=>{
    if(slide.classList.contains("next")) goNext();
    if(slide.classList.contains("prev")) goPrev();
  });
});

prevArrow.addEventListener("click",goPrev);
nextArrow.addEventListener("click",goNext);

/* DRAG CONTROLADO (sin rotación libre) */

const MAX_ANGLE = 6; // menos exagerado
const DRAG_LIMIT = 140; // 🔥 mucho más control

carousel.addEventListener("mousedown",e=>{
  isDragging=true;
  startX=e.clientX;
  deltaX=0;
});

window.addEventListener("mousemove",e=>{
  if(!isDragging) return;

  deltaX=e.clientX-startX;

  // clamp del movimiento
  const clamped = Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, deltaX));
  const angle = (clamped / DRAG_LIMIT) * MAX_ANGLE;

  slides[current].style.transform = `translate(-50%,-50%) rotateY(${angle}deg)`;
});

window.addEventListener("mouseup",()=>{
  if(!isDragging) return;
  isDragging=false;

  const threshold = 90; // 🔥 control real

  if(deltaX > threshold) goPrev();
  else if(deltaX < -threshold) goNext();

  slides[current].style.transform="";
  deltaX=0;
});

/* TOUCH */
carousel.addEventListener("touchstart", e=>{
  isDragging=true;
  startX=e.touches[0].clientX;
  deltaX=0;
});

carousel.addEventListener("touchmove", e=>{
  if(!isDragging) return;

  deltaX=e.touches[0].clientX-startX;

  const clamped = Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, deltaX));
  const angle = (clamped / DRAG_LIMIT) * MAX_ANGLE;

  slides[current].style.transform = `translate(-50%,-50%) rotateY(${angle}deg)`;
});

carousel.addEventListener("touchend", ()=>{
  if(!isDragging) return;
  isDragging=false;

  if(deltaX > DRAG_LIMIT/2) goPrev();
  else if(deltaX < -DRAG_LIMIT/2) goNext();

  slides[current].style.transform="";
  deltaX=0;
});

/* =========================
   MODELOS PROCEDURALES (sin GLB) — piezas propias del catálogo OneBlast
========================= */
function buildProceduralProduct(type){
  const group = new THREE.Group();

  if(type === "warhead"){
    const bodyMat = new THREE.MeshStandardMaterial({ color:0x8a8f96 });
    const tipMat  = new THREE.MeshStandardMaterial({ color:0xd21f1f });
    const finMat  = new THREE.MeshStandardMaterial({ color:0x2b2e33 });

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.9, 32), tipMat);
    nose.position.y = 0.95;
    group.add(nose);

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.5, 32), bodyMat);
    group.add(body);

    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, 0.35, 32), bodyMat);
    tail.position.y = -0.925;
    group.add(tail);

    const finGeo = new THREE.BoxGeometry(0.05, 0.55, 0.5);
    for(let i=0;i<4;i++){
      const fin = new THREE.Mesh(finGeo, finMat);
      const angle = (i/4) * Math.PI*2;
      fin.position.set(Math.cos(angle)*0.42, -1.05, Math.sin(angle)*0.42);
      fin.rotation.y = angle;
      group.add(fin);
    }
  }

  if(type === "spikemine"){
    const coreMat = new THREE.MeshStandardMaterial({ color:0x1c1f24 });
    const spikeMat = new THREE.MeshStandardMaterial({ color:0xb3b8c0 });

    const coreGeo = new THREE.IcosahedronGeometry(0.62, 0);
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const posAttr = coreGeo.attributes.position;
    const seen = new Set();
    const spikeGeo = new THREE.ConeGeometry(0.09, 0.5, 12);

    for(let i=0;i<posAttr.count;i++){
      const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      const key = v.toArray().map(n=>n.toFixed(2)).join(",");
      if(seen.has(key)) continue;
      seen.add(key);

      const spike = new THREE.Mesh(spikeGeo, spikeMat);
      const dir = v.clone().normalize();
      spike.position.copy(dir.clone().multiplyScalar(0.62 + 0.25));
      spike.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
      group.add(spike);
    }
  }

  if(type === "detonator"){
    const bodyMat = new THREE.MeshStandardMaterial({ color:0x2e2f33 });
    const buttonMat = new THREE.MeshStandardMaterial({ color:0xe0201f });
    const antennaMat = new THREE.MeshStandardMaterial({ color:0x9aa0a6 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.35), bodyMat);
    group.add(body);

    const button = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16, 0, Math.PI*2, 0, Math.PI/2), buttonMat);
    button.position.set(0.15, 0.3, 0);
    group.add(button);

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 24), bodyMat);
    cap.position.set(0.15, 0.3, 0);
    group.add(cap);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 10), antennaMat);
    antenna.position.set(-0.4, 0.55, 0);
    antenna.rotation.z = -0.35;
    group.add(antenna);

    for(let i=0;i<3;i++){
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 12), antennaMat);
      btn.position.set(-0.25 + i*0.18, 0.31, 0);
      group.add(btn);
    }
  }

  if(type === "flare"){
    const gripMat = new THREE.MeshStandardMaterial({ color:0x2b2e33 });
    const bodyMat = new THREE.MeshStandardMaterial({ color:0x9aa0a6 });
    const tipMat  = new THREE.MeshStandardMaterial({ color:0xff7a1a, emissive:0xff5500, emissiveIntensity:0.6 });

    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.5, 16), gripMat);
    grip.position.y = -0.7;
    group.add(grip);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 1.3, 16), bodyMat);
    shaft.position.y = 0.05;
    group.add(shaft);

    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.4, 16), tipMat);
    tip.position.y = 0.9;
    group.add(tip);

    const spark = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 0), tipMat);
    spark.position.y = 1.15;
    group.add(spark);
  }

  if(type === "hazardbarrel"){
    const drumMat = new THREE.MeshStandardMaterial({ color:0xd8b019 });
    const bandMat = new THREE.MeshStandardMaterial({ color:0x1a1a1a });
    const capMat  = new THREE.MeshStandardMaterial({ color:0x3a3a3a });

    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.1, 32), drumMat);
    group.add(drum);

    [-0.32, 0, 0.32].forEach((y)=>{
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.63, 0.05, 12, 32), bandMat);
      band.rotation.x = Math.PI/2;
      band.position.y = y;
      group.add(band);
    });

    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 24), capMat);
    cap.position.y = 0.6;
    group.add(cap);
  }

  if(type === "c4block"){
    const blockMat = new THREE.MeshStandardMaterial({ color:0xb8ad8f });
    const wireMat  = new THREE.MeshStandardMaterial({ color:0x2b2e33 });
    const timerMat = new THREE.MeshStandardMaterial({ color:0xff2222, emissive:0xff0000, emissiveIntensity:0.7 });

    const block = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 0.7), blockMat);
    group.add(block);

    const timer = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.2), timerMat);
    timer.position.set(0.35, 0.225, 0);
    group.add(timer);

    const timerCase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.28), wireMat);
    timerCase.position.set(0.35, 0.19, 0);
    group.add(timerCase);

    for(let i=0;i<2;i++){
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8), wireMat);
      wire.position.set(-0.3 + i*0.2, 0.35, 0.15);
      wire.rotation.z = i===0 ? 0.5 : -0.4;
      group.add(wire);
    }
  }

  if(type === "rocket"){
    const stickMat = new THREE.MeshStandardMaterial({ color:0x8a8f96 });
    const bulbMat  = new THREE.MeshStandardMaterial({ color:0xd21f1f });
    const finMat   = new THREE.MeshStandardMaterial({ color:0x2b2e33 });

    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.7, 12), stickMat);
    group.add(stick);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), bulbMat);
    bulb.position.y = 0.95;
    group.add(bulb);

    const finGeo = new THREE.BoxGeometry(0.03, 0.3, 0.28);
    for(let i=0;i<3;i++){
      const fin = new THREE.Mesh(finGeo, finMat);
      const angle = (i/3) * Math.PI*2;
      fin.position.set(Math.cos(angle)*0.06, -0.75, Math.sin(angle)*0.06);
      fin.rotation.y = angle;
      group.add(fin);
    }
  }

  if(type === "plasmacore"){
    const coreMat = new THREE.MeshStandardMaterial({ color:0x1c2b33, emissive:0x1fd6ff, emissiveIntensity:0.9 });
    const ringMat = new THREE.MeshStandardMaterial({ color:0x8fe9ff, emissive:0x2fd0ff, emissiveIntensity:0.4 });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 1), coreMat);
    group.add(core);

    const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.02, 12, 64), ringMat);
    ringA.rotation.x = Math.PI/2.3;
    group.add(ringA);

    const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.02, 12, 64), ringMat);
    ringB.rotation.x = Math.PI/6;
    ringB.rotation.y = Math.PI/3;
    group.add(ringB);
  }

  if(type === "grenade"){
    const bodyMat = new THREE.MeshStandardMaterial({ color:0x3d4a35 });
    const ridgeMat = new THREE.MeshStandardMaterial({ color:0x232b1c });
    const pinMat = new THREE.MeshStandardMaterial({ color:0xc9a227 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 20), bodyMat);
    group.add(body);

    [-0.25, 0, 0.25].forEach((y)=>{
      const r = Math.sqrt(Math.max(0.25 - y*y, 0.02));
      const band = new THREE.Mesh(new THREE.TorusGeometry(r, 0.018, 8, 32), ridgeMat);
      band.rotation.x = Math.PI/2;
      band.position.y = y;
      group.add(band);
    });

    [0, Math.PI/2].forEach((rotY)=>{
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.018, 8, 32), ridgeMat);
      band.rotation.y = rotY;
      group.add(band);
    });

    const pinRing = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.016, 8, 24), pinMat);
    pinRing.position.set(0, 0.56, 0);
    pinRing.rotation.x = Math.PI/2;
    group.add(pinRing);

    const lever = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.04), pinMat);
    lever.position.set(0.24, 0.4, 0);
    group.add(lever);
  }

  if(type === "grenade2"){
    const bodyMat = new THREE.MeshStandardMaterial({ color:0x4a5a3f, emissive:0x1a2410, emissiveIntensity:0.15 });
    const ridgeMat = new THREE.MeshStandardMaterial({ color:0xc9a227 });
    const pinMat = new THREE.MeshStandardMaterial({ color:0xd8b019 });
    const coreMat = new THREE.MeshStandardMaterial({ color:0xff5522, emissive:0xff3300, emissiveIntensity:0.9 });
    const ventMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 20), bodyMat);
    group.add(body);

    [-0.25, 0, 0.25].forEach((y)=>{
      const r = Math.sqrt(Math.max(0.25 - y*y, 0.02));
      const band = new THREE.Mesh(new THREE.TorusGeometry(r, 0.02, 8, 32), ridgeMat);
      band.rotation.x = Math.PI/2;
      band.position.y = y;
      group.add(band);
    });

    [0, Math.PI/2].forEach((rotY)=>{
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.02, 8, 32), ridgeMat);
      band.rotation.y = rotY;
      group.add(band);
    });

    const pinRing = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.018, 8, 24), pinMat);
    pinRing.position.set(0, 0.56, 0);
    pinRing.rotation.x = Math.PI/2;
    group.add(pinRing);

    const lever = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.04), pinMat);
    lever.position.set(0.24, 0.4, 0);
    group.add(lever);

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 0), coreMat);
    group.add(core);

    for(let i=0;i<3;i++){
      const angle = (i/3) * Math.PI*2;
      const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 10), ventMat);
      vent.position.set(Math.cos(angle)*0.48, -0.1, Math.sin(angle)*0.48);
      vent.rotation.z = Math.PI/2;
      vent.rotation.y = angle;
      group.add(vent);
    }
  }

  if(type === "launcher"){
    const tubeMat = new THREE.MeshStandardMaterial({ color:0x4a4f42 });
    const restMat = new THREE.MeshStandardMaterial({ color:0x2b2e26 });
    const sightMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });

    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.8, 20), tubeMat);
    tube.rotation.z = Math.PI/2;
    group.add(tube);

    const rest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.12), restMat);
    rest.position.set(-0.2, -0.24, 0);
    group.add(rest);

    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.08), sightMat);
    sight.position.set(0.4, 0.24, 0);
    group.add(sight);
  }

  if(type === "launcher2"){
    const tubeMatA = new THREE.MeshStandardMaterial({ color:0x55603f });
    const tubeMatB = new THREE.MeshStandardMaterial({ color:0x2b2e26 });
    const restMat = new THREE.MeshStandardMaterial({ color:0x2b2e26 });
    const scopeMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });
    const lensMat = new THREE.MeshStandardMaterial({ color:0x1fd6ff, emissive:0x1fd6ff, emissiveIntensity:0.8 });
    const finMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });

    for(let i=0;i<3;i++){
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.6, 20), i%2===0 ? tubeMatA : tubeMatB);
      seg.rotation.z = Math.PI/2;
      seg.position.x = -0.6 + i*0.6;
      group.add(seg);
    }

    const rest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.12), restMat);
    rest.position.set(-0.2, -0.26, 0);
    group.add(rest);

    const scope = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.08), scopeMat);
    scope.position.set(0.15, 0.26, 0);
    group.add(scope);

    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), lensMat);
    lens.position.set(0.42, 0.26, 0);
    group.add(lens);

    [-1, 1].forEach((side)=>{
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.22), finMat);
      fin.position.set(-0.95, 0, side*0.15);
      fin.rotation.z = side * 0.3;
      group.add(fin);
    });
  }

  if(type === "pulsegun"){
    const gripMat = new THREE.MeshStandardMaterial({ color:0x2b2e33 });
    const bodyMat = new THREE.MeshStandardMaterial({ color:0x5a5f66 });
    const barrelMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.14), gripMat);
    grip.position.set(-0.1, -0.3, 0);
    grip.rotation.z = 0.25;
    group.add(grip);

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.18), bodyMat);
    body.position.set(0.05, 0, 0);
    group.add(body);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 16), barrelMat);
    barrel.rotation.z = Math.PI/2;
    barrel.position.set(0.55, 0.02, 0);
    group.add(barrel);
  }

  if(type === "pulsegun2"){
    const gripMat = new THREE.MeshStandardMaterial({ color:0x2b2e33 });
    const bodyMat = new THREE.MeshStandardMaterial({ color:0x6a6f78, emissive:0x111111, emissiveIntensity:0.2 });
    const barrelMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });
    const coreMat = new THREE.MeshStandardMaterial({ color:0xff7a1a, emissive:0xff5500, emissiveIntensity:0.9 });
    const coilMat = new THREE.MeshStandardMaterial({ color:0xd8b019 });
    const finMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.42, 0.14), gripMat);
    grip.position.set(-0.1, -0.3, 0);
    grip.rotation.z = 0.25;
    group.add(grip);

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.18), bodyMat);
    body.position.set(0.05, 0, 0);
    group.add(body);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 16), barrelMat);
    barrel.rotation.z = Math.PI/2;
    barrel.position.set(0.58, 0.02, 0);
    group.add(barrel);

    const coreBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.56, 12), coreMat);
    coreBeam.rotation.z = Math.PI/2;
    coreBeam.position.set(0.58, 0.02, 0);
    group.add(coreBeam);

    [0.4, 0.58, 0.76].forEach((x)=>{
      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 8, 20), coilMat);
      coil.rotation.y = Math.PI/2;
      coil.position.set(x, 0.02, 0);
      group.add(coil);
    });

    for(let i=0;i<3;i++){
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.16), finMat);
      fin.position.set(-0.05 + i*0.1, 0.13, 0);
      group.add(fin);
    }
  }

  if(type === "microdrone"){
    const bodyMat = new THREE.MeshStandardMaterial({ color:0x8a8f96 });
    const armMat = new THREE.MeshStandardMaterial({ color:0x2b2e33 });
    const discMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 16), bodyMat);
    group.add(body);

    for(let i=0;i<4;i++){
      const angle = (i/4) * Math.PI*2 + Math.PI/4;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.55, 8), armMat);
      arm.position.set(Math.cos(angle)*0.3, 0, Math.sin(angle)*0.3);
      arm.rotation.z = Math.PI/2;
      arm.rotation.y = -angle;
      group.add(arm);

      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.015, 16), discMat);
      disc.position.set(Math.cos(angle)*0.55, 0, Math.sin(angle)*0.55);
      group.add(disc);
    }
  }

  if(type === "microdrone2"){
    const bodyMat = new THREE.MeshStandardMaterial({ color:0x6a6f78 });
    const armMat = new THREE.MeshStandardMaterial({ color:0x2b2e33 });
    const discMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });
    const eyeMat = new THREE.MeshStandardMaterial({ color:0xff2222, emissive:0xff0000, emissiveIntensity:0.9 });
    const podMat = new THREE.MeshStandardMaterial({ color:0x3a3a3a });
    const thrusterMat = new THREE.MeshStandardMaterial({ color:0x1fd6ff, emissive:0x1fd6ff, emissiveIntensity:0.7 });

    const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), bodyMat);
    group.add(body);

    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), eyeMat);
    eye.position.set(0, 0, 0.3);
    group.add(eye);

    for(let i=0;i<4;i++){
      const angle = (i/4) * Math.PI*2 + Math.PI/4;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.6, 8), armMat);
      arm.position.set(Math.cos(angle)*0.32, 0, Math.sin(angle)*0.32);
      arm.rotation.z = Math.PI/2;
      arm.rotation.y = -angle;
      group.add(arm);

      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.015, 16), discMat);
      disc.position.set(Math.cos(angle)*0.6, 0, Math.sin(angle)*0.6);
      group.add(disc);

      const thruster = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 8, 20), thrusterMat);
      thruster.position.set(Math.cos(angle)*0.6, -0.03, Math.sin(angle)*0.6);
      group.add(thruster);
    }

    const pod = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.3), podMat);
    pod.position.set(0, -0.24, 0);
    group.add(pod);
  }

  if(type === "armorplate"){
    const plateMat = new THREE.MeshStandardMaterial({ color:0x4a4f56 });
    const handleMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });

    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.06), plateMat);
    group.add(plate);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 10), handleMat);
    handle.rotation.z = Math.PI/2;
    handle.position.set(0, 0, 0.1);
    group.add(handle);
  }

  if(type === "armorplate2"){
    const plateMat = new THREE.MeshStandardMaterial({ color:0x5a5f66 });
    const backPlateMat = new THREE.MeshStandardMaterial({ color:0x2b2e33 });
    const rivetMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });
    const coreMat = new THREE.MeshStandardMaterial({ color:0x1fd6ff, emissive:0x1fd6ff, emissiveIntensity:0.9 });
    const handleMat = new THREE.MeshStandardMaterial({ color:0x1c1c1c });

    const backPlate = new THREE.Mesh(new THREE.BoxGeometry(0.98, 1.28, 0.05), backPlateMat);
    backPlate.position.z = -0.05;
    group.add(backPlate);

    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.06), plateMat);
    group.add(plate);

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.14, 0), coreMat);
    core.position.z = 0.06;
    group.add(core);

    const rivetGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.04, 8);
    const marginX = 0.4, marginY = 0.55;
    [[-marginX,-marginY],[marginX,-marginY],[-marginX,marginY],[marginX,marginY],[0,-marginY],[0,marginY]].forEach(([x,y])=>{
      const rivet = new THREE.Mesh(rivetGeo, rivetMat);
      rivet.rotation.x = Math.PI/2;
      rivet.position.set(x, y, 0.04);
      group.add(rivet);
    });

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3, 10), handleMat);
    handle.rotation.z = Math.PI/2;
    handle.position.set(0, 0, 0.12);
    group.add(handle);
  }

  if(type === "containment"){
    const shellMat = new THREE.MeshBasicMaterial({ color:0xf3ede0, wireframe:true, transparent:true, opacity:0.35 });
    const ringMat = new THREE.MeshStandardMaterial({ color:0x8a8f96 });
    const coreMat = new THREE.MeshStandardMaterial({ color:0xffb347, emissive:0xff9900, emissiveIntensity:1.0 });
    const moteMat = new THREE.MeshStandardMaterial({ color:0xffd27a, emissive:0xffb347, emissiveIntensity:0.8 });

    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 1), shellMat);
    group.add(shell);

    const ringDefs2 = [
      { r:0.55, rotX:0, rotY:0 },
      { r:0.55, rotX:Math.PI/2.2, rotY:0.4 },
      { r:0.55, rotX:Math.PI/1.6, rotY:-0.6 }
    ];
    ringDefs2.forEach((def)=>{
      const ring = new THREE.Mesh(new THREE.TorusGeometry(def.r, 0.02, 10, 64), ringMat);
      ring.rotation.x = def.rotX;
      ring.rotation.y = def.rotY;
      group.add(ring);
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 0), coreMat);
    group.add(core);

    for(let i=0;i<6;i++){
      const angle = (i/6) * Math.PI*2;
      const mote = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), moteMat);
      mote.position.set(Math.cos(angle)*0.9, Math.sin(angle*1.7)*0.25, Math.sin(angle)*0.9);
      group.add(mote);
    }
  }

  return group;
}

/* LOGO 3D MINI + HDR */

const logoCanvas = document.querySelector(".logo-canvas");

const logoRenderer = new THREE.WebGLRenderer({
  canvas: logoCanvas,
  alpha: true,
  antialias: true
});

logoRenderer.setSize(60,60);
logoRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
logoRenderer.outputEncoding = THREE.sRGBEncoding;
logoRenderer.toneMapping = THREE.ACESFilmicToneMapping;
logoRenderer.toneMappingExposure = 1.5;

const logoScene = new THREE.Scene();

const logoCamera = new THREE.PerspectiveCamera(45,1,0.1,100);
logoCamera.position.set(0,0,4);

const logoControls = new THREE.OrbitControls(logoCamera, logoCanvas);
logoControls.enableZoom=false;
logoControls.enablePan=false;
logoControls.enableDamping=true;

/* HDR */
const logoHDR = new THREE.RGBELoader().setDataType(THREE.UnsignedByteType);

logoHDR.load("textures/studio.hdr", (texture)=>{
  const pmrem = new THREE.PMREMGenerator(logoRenderer);
  const envMap = pmrem.fromEquirectangular(texture).texture;
  logoScene.environment = envMap;
});

/* luces suaves */
const light = new THREE.AmbientLight(0xffffff,0.4);
logoScene.add(light);

/* modelo */
const loader = new THREE.GLTFLoader();
let logoModel;

loader.load("models/bomba.glb",(gltf)=>{
  logoModel = gltf.scene;
  logoModel.scale.set(0.6,0.6,0.6);
  logoScene.add(logoModel);
});

/* animación */
function animateLogo(){
  requestAnimationFrame(animateLogo);

  if(logoModel){
    logoModel.rotation.y += 0.01;
  }

  logoControls.update();
  logoRenderer.render(logoScene,logoCamera);
}
animateLogo();
