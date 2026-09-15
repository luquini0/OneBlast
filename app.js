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
      </div>
      <div class="product-viewer">
        <div class="viewer-hint">Drag to rotate</div>
        <div class="loader">Loading...</div>
      </div>
      <div class="product-actions">
        <button class="animate-button" type="button"><span class="play-ico">&#9654;</span> Animate</button>
        <a href="https://mpago.la/11P89Mz" target="_blank" class="buy-button">Comprar ahora</a>
      </div>
    </div>
  `;
  carousel.appendChild(section);
  section.querySelector(".animate-button").addEventListener("click", (e)=>{
    e.stopPropagation();
    openLightbox(i);
  });
});

const slides = document.querySelectorAll(".product-section");
const prevArrow = document.querySelector(".arrow.prev");
const nextArrow = document.querySelector(".arrow.next");
let current=0, isDragging=false, startX=0, deltaX=0;

/* PAGINATION DOTS — outside the card, pinned to the bottom like a footer.
   One per product, click to jump straight to it; updateSlides() keeps
   the active one in sync further down. */
const dotsContainer = document.getElementById("carouselDots");
const dots = products.map((p,i)=>{
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "dot";
  dot.setAttribute("aria-label", p.name);
  dot.addEventListener("click", ()=> goToSlide(i));
  dotsContainer.appendChild(dot);
  return dot;
});

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
viewerControls.rotateSpeed=0.8;
// Explicit, since the default touch mapping only holds while nothing else
// on the page has already claimed the gesture — pin single-finger touch
// to rotate (matches the mouse drag) regardless.
viewerControls.touches.ONE = THREE.TOUCH.ROTATE;

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

    if(products[i].keepMaterial){
      // Downloaded GLBs each come in whatever native scale/pivot the
      // export used (some read as meters, some as centimeters, pivoted
      // at the base/feet rather than the visual center) — one flat
      // scale number can't fit all of them. Measure the model first,
      // then scale so its longest side matches the procedural pieces'
      // typical size, and center it on that same measurement.
      const box0 = new THREE.Box3().setFromObject(model);
      const size0 = box0.getSize(new THREE.Vector3());
      const center0 = box0.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size0.x, size0.y, size0.z) || 1;
      const targetSize = 1.8;
      const factor = (targetSize / maxDim) * products[i].scale;

      model.scale.set(factor, factor, factor);
      model.position.set(-center0.x*factor, -center0.y*factor, -center0.z*factor);
    } else {
      model.scale.set(products[i].scale, products[i].scale, products[i].scale);
      model.traverse(c=>{ if(c.isMesh){ c.material.metalness=1; c.material.roughness=0.2; }});

      // Center on the bounding box too — a couple of the real assets
      // aren't pivoted at their visual center either.
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
    }

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
    // Goes after the "drag to rotate" hint (the .loader is absolutely
    // positioned, so it doesn't matter where it sits in flow).
    viewer.appendChild(viewerCanvas);
  }
  resizeViewerTo(viewerCanvas);
  // A second resize next frame corrects for any layout that hasn't fully
  // settled yet on the first paint (e.g. the hint's height shifting once
  // the web font swaps in) — on mobile a wrong initial canvas size made
  // OrbitControls' touch-drag rotation feel broken/oversensitive.
  requestAnimationFrame(()=> resizeViewerTo(viewerCanvas));

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
  dots.forEach((d,i)=> d.classList.toggle("active", i===current));
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
  // Swiping works over the whole card, EXCEPT the model itself — dragging
  // the canvas is drag-to-rotate (OrbitControls owns it exclusively) and
  // shouldn't also swipe the card underneath it.
  if(e.target.closest(".webgl-canvas")) return;
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
  if(e.target.closest(".webgl-canvas")) return;
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

/* =========================================================
   ANIMATE LIGHTBOX — per-product-family animation profiles
   ---------------------------------------------------------
   Each family gets its own tick(t) closure built once when the lightbox
   opens (grabs bounds / caches child references / adds any VFX), then
   called every frame. VFX (sprites, particle points, lights) are always
   added as CHILDREN of the cloned model — never the scene directly — so
   closing the lightbox and disposing the model tree cleans them up too,
   with no separate bookkeeping needed.
========================================================= */

/* Shared soft glow texture (radial gradient), reused by every spark/
   flame/muzzle-flash/ember effect below instead of loading image assets. */
const GLOW_TEXTURE = (function(){
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const gctx = c.getContext("2d");
  const g = gctx.createRadialGradient(size/2,size/2,0, size/2,size/2,size/2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  gctx.fillStyle = g;
  gctx.fillRect(0,0,size,size);
  return new THREE.CanvasTexture(c);
})();

function makeGlowSprite(color, size){
  const mat = new THREE.SpriteMaterial({
    map:GLOW_TEXTURE, color, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(size,size,1);
  return sprite;
}

function makeGlowParticles(count, spreadFn, color, size){
  const positions = new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const p = spreadFn(i);
    positions[i*3]=p.x; positions[i*3+1]=p.y; positions[i*3+2]=p.z;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions,3));
  const mat = new THREE.PointsMaterial({
    map:GLOW_TEXTURE, color, size, transparent:true, depthWrite:false,
    blending:THREE.AdditiveBlending, sizeAttenuation:true
  });
  return new THREE.Points(geo, mat);
}

function pulse(base, amp, speed, t, phase){
  return base + amp * (0.5 + 0.5*Math.sin(t*speed + (phase||0)));
}

/* Each builder: (model, opts) => tick(t). Called once per lightbox open;
   the returned tick runs every frame. `model` is always the lightbox's
   own clone, safe to mutate freely without touching the card behind it. */
const PROFILE_BUILDERS = {

  /* ---- flagship: the bomb, fuse lit, tension building to a "blast" ---- */
  fuseTension(model){
    const box = new THREE.Box3().setFromObject(model);
    const ember = makeGlowSprite(0xff6a1a, box.getSize(new THREE.Vector3()).length()*0.3);
    ember.position.set(0, box.max.y, 0);
    model.add(ember);
    const light = new THREE.PointLight(0xff5500, 1.2, 5);
    light.position.copy(ember.position);
    model.add(light);

    return function(t){
      model.rotation.y = t*0.35;
      const cyclePos = t % 4;
      const tension = cyclePos > 3 ? (cyclePos-3) : 0;
      model.rotation.z = Math.sin(t*50)*tension*0.06;
      const flicker = pulse(0.75,0.25,9,t) * pulse(1,0.15,23,t,1.7);
      ember.material.opacity = flicker;
      light.intensity = 1.0 + flicker*1.8;
    };
  },

  /* ---- unlabeled crates/canisters (real assets, unknown internals):
     a sci-fi inspection scan sweeping the bounding box ---- */
  scanReveal(model){
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const w = Math.max(size.x, size.z) * 1.2;
    const bar = new THREE.Mesh(
      new THREE.PlaneGeometry(w, Math.max(w*0.04,0.03)),
      new THREE.MeshBasicMaterial({ color:0xff7a3a, transparent:true, opacity:0.55, side:THREE.DoubleSide, blending:THREE.AdditiveBlending })
    );
    bar.rotation.x = Math.PI/2;
    model.add(bar);
    const minY = box.min.y, span = size.y || 1;

    return function(t){
      model.rotation.y = t*0.3;
      bar.position.y = minY + (0.5+0.5*Math.sin(t*1.3))*span;
      bar.material.opacity = 0.3 + 0.3*Math.sin(t*2.6);
    };
  },

  /* ---- flare: lit tip, rising embers ---- */
  sparkIgnite(model){
    const tip = model.children[2];
    const spark = model.children[3];
    const embers = makeGlowParticles(14, ()=>({
      x:(Math.random()-0.5)*0.15, y:Math.random()*0.5, z:(Math.random()-0.5)*0.15
    }), 0xff8a2a, 0.1);
    embers.position.set(0, 1.15, 0);
    model.add(embers);
    const basePos = embers.geometry.attributes.position.array.slice();

    return function(t){
      model.rotation.y = t*0.4;
      const flicker = pulse(0.6,0.4,14,t);
      tip.material.emissiveIntensity = 0.5+flicker*0.6;
      spark.material.emissiveIntensity = 0.6+flicker*0.8;
      const pos = embers.geometry.attributes.position;
      for(let i=0;i<pos.count;i++){
        const rise = (t*0.6+i*0.13) % 1;
        pos.setXYZ(i, basePos[i*3]+Math.sin(t*3+i)*0.02, rise*0.7, basePos[i*3+2]+Math.cos(t*3+i)*0.02);
      }
      pos.needsUpdate = true;
    };
  },

  /* ---- detonator: button press, signal rings pulsing outward ---- */
  buttonPress(model){
    const button = model.children[1];
    const baseY = button.position.y;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.05,0.08,24),
      new THREE.MeshBasicMaterial({ color:0xff3b3b, transparent:true, opacity:0, side:THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI/2;
    ring.position.copy(button.position);
    ring.position.y += 0.02;
    model.add(ring);

    return function(t){
      model.rotation.y = Math.sin(t*0.4)*0.5;
      const cycle = t % 2;
      const pressed = cycle < 0.15 ? cycle/0.15 : (cycle < 0.3 ? 1-(cycle-0.15)/0.15 : 0);
      button.position.y = baseY - pressed*0.05;
      const ringPhase = cycle/2;
      ring.scale.setScalar(1+ringPhase*8);
      ring.material.opacity = cycle < 0.5 ? Math.max(0,0.7*(1-ringPhase*2)) : 0;
    };
  },

  /* ---- hand rocket: launches up on a loop, flame trailing ---- */
  launchLoop(model){
    const flame = makeGlowSprite(0xff8a2a, 0.5);
    flame.position.set(0,-0.85,0);
    model.add(flame);
    const baseY = model.position.y;

    return function(t){
      const cycle = t % 3;
      const launch = cycle < 2.4 ? Math.pow(cycle/2.4, 2) : 1 - (cycle-2.4)/0.6;
      model.position.y = baseY + launch*3.2;
      model.rotation.y = t*0.6;
      const flameOn = cycle < 2.4;
      flame.material.opacity = flameOn ? 0.6+0.4*Math.sin(t*20) : 0;
      flame.scale.setScalar(0.35+0.25*Math.sin(t*20));
    };
  },

  /* ---- hazard barrel: rumbling, strobing warning light ---- */
  hazardRumble(model){
    const light = new THREE.PointLight(0xff2200, 0, 3);
    light.position.set(0,0.8,0.8);
    model.add(light);

    return function(t){
      model.rotation.y = t*0.2;
      model.position.x = Math.sin(t*45)*0.015;
      model.position.z = Math.cos(t*37)*0.015;
      light.intensity = (Math.sin(t*6) > 0.3 ? 1 : 0) * 2.5;
    };
  },

  /* ---- C4 block: blinking countdown timer ---- */
  timerBlink(model){
    const timer = model.children[1];

    return function(t){
      model.rotation.y = Math.sin(t*0.3)*0.4;
      const blink = Math.sin(t*4) > 0 ? 1 : 0.15;
      timer.material.emissiveIntensity = blink*1.1;
      model.position.x = blink>0.5 ? Math.sin(t*80)*0.006 : 0;
    };
  },

  /* ---- warhead: fast spin in flight, speed-line trail ---- */
  spinFlight(model){
    const trail = makeGlowParticles(16, (i)=>({x:0,y:-0.9-i*0.1,z:0}), 0xaad4ff, 0.06);
    model.add(trail);
    const basePos = trail.geometry.attributes.position.array.slice();

    return function(t){
      model.rotation.y = t*6;
      const pos = trail.geometry.attributes.position;
      for(let i=0;i<pos.count;i++){
        pos.setY(i, basePos[i*3+1] - (t*1.5+i*0.1)%1.6);
      }
      pos.needsUpdate = true;
      trail.material.opacity = 0.5;
    };
  },

  /* ---- grenades: lever flips, pin slides out, then resets ---- */
  pinPull(model, opts){
    const pinRing = model.children[6];
    const lever = model.children[7];
    const basePinPos = pinRing.position.clone();
    const baseLeverRot = lever.rotation.z;
    const core = opts.glow ? model.children[8] : null;

    return function(t){
      model.rotation.y = t*0.3;
      const cycle = t % 3;
      const pull = Math.min(cycle/1.2, 1);
      pinRing.position.x = basePinPos.x + pull*0.6;
      pinRing.position.y = basePinPos.y + pull*0.3;
      lever.rotation.z = baseLeverRot + (cycle>1.2 ? Math.min((cycle-1.2)/0.4,1) : 0) * 1.1;
      if(core) core.material.emissiveIntensity = 0.6 + 0.5*Math.sin(t*10);
      model.position.x = cycle>1.6 ? Math.sin(t*40)*0.02 : 0;
    };
  },

  /* ---- impact mine: spikes pulse outward radially ---- */
  spikesPulse(model){
    const core = model.children[0];
    core.material.emissive = new THREE.Color(0xff2222);
    const spikes = model.children.slice(1);
    spikes.forEach(s=>{
      s.userData.dir = s.position.clone().normalize();
      s.userData.baseDist = s.position.length();
    });

    return function(t){
      model.rotation.y = t*0.25;
      const pulseAmt = 0.06*Math.sin(t*2);
      spikes.forEach(s=>{
        s.position.copy(s.userData.dir.clone().multiplyScalar(s.userData.baseDist + pulseAmt));
      });
      core.material.emissiveIntensity = 0.3+0.2*Math.sin(t*2);
    };
  },

  /* ---- launchers: recoil kick + muzzle flash ---- */
  recoilFlash(model, opts){
    const flash = makeGlowSprite(0xffb066, 0.45);
    flash.position.set(0.95,0,0);
    model.add(flash);
    const lens = opts.glow ? model.children[5] : null;
    const baseX = model.position.x;

    return function(t){
      model.rotation.y = Math.sin(t*0.3)*0.3;
      const cycle = t % 1.4;
      const firing = cycle < 0.08;
      flash.material.opacity = firing ? 1 : 0;
      flash.scale.setScalar(firing ? 0.5+Math.random()*0.2 : 0.1);
      model.position.x = baseX - (firing ? 0.08*(1-cycle/0.08) : 0);
      if(lens) lens.material.emissiveIntensity = 0.6+0.4*Math.sin(t*6);
    };
  },

  /* ---- plasma core: rings spinning at different speeds, core breathing ---- */
  energyRings(model){
    const core = model.children[0];
    const ringA = model.children[1];
    const ringB = model.children[2];

    return function(t){
      ringA.rotation.z = t*1.2;
      ringB.rotation.z = -t*0.8;
      core.scale.setScalar(1+0.08*Math.sin(t*2));
      core.material.emissiveIntensity = 0.7+0.4*Math.sin(t*2);
      model.rotation.y = t*0.2;
    };
  },

  /* ---- pulse guns: muzzle charging glow + recoil ---- */
  chargeGlow(model, opts){
    const glow = makeGlowSprite(opts.heavy?0xff5500:0xffb066, opts.heavy?0.5:0.35);
    glow.position.set(opts.heavy?0.85:0.82, 0.02, 0);
    model.add(glow);
    const coreBeam = opts.heavy ? model.children[3] : null;
    const coils = opts.heavy ? [model.children[4], model.children[5], model.children[6]] : [];

    return function(t){
      model.rotation.y = Math.sin(t*0.35)*0.5;
      const charge = pulse(0.5,0.5,3,t);
      glow.material.opacity = charge;
      glow.scale.setScalar((opts.heavy?0.5:0.35) * (0.8+0.4*charge));
      if(coreBeam) coreBeam.material.emissiveIntensity = 0.6+charge*1.2;
      coils.forEach((c,i)=>{ c.rotation.x += 0.05*(i%2===0?1:-1); });
      model.position.x = -(Math.max(0, Math.sin(t*3))**6) * 0.05;
    };
  },

  /* ---- micro-drones: rotors spin, body hovers ---- */
  rotorHover(model, opts){
    const discIdx = opts.eye ? [3,6,9,12] : [2,4,6,8];
    const discs = discIdx.map(i=>model.children[i]);
    const eye = opts.eye ? model.children[1] : null;
    const thrusters = opts.eye ? [4,7,10,13].map(i=>model.children[i]) : [];

    return function(t){
      discs.forEach(d=>{ d.rotation.y += 0.9; });
      model.position.y = Math.sin(t*2.2)*0.08;
      model.rotation.y = Math.sin(t*0.4)*0.3 + t*0.05;
      if(eye) eye.material.emissiveIntensity = 0.6+0.5*Math.sin(t*4);
      thrusters.forEach((th,i)=>{ th.material.emissiveIntensity = 0.5+0.4*Math.sin(t*5+i); });
    };
  },

  /* ---- armor plates: slow presentation spin ---- */
  presentationSpin(model, opts){
    const core = opts.core ? model.children[2] : null;

    return function(t){
      model.rotation.y = t*0.4;
      model.position.y = Math.sin(t*1.5)*0.06;
      if(core) core.material.emissiveIntensity = 0.6+0.5*Math.sin(t*3);
    };
  },

  /* ---- containment core: rings + core + orbiting motes ---- */
  containmentOrbit(model){
    const rings = [model.children[1], model.children[2], model.children[3]];
    const core = model.children[4];
    const motes = model.children.slice(5);
    motes.forEach(m=>{
      m.userData.radius = Math.hypot(m.position.x, m.position.z);
      m.userData.angle = Math.atan2(m.position.z, m.position.x);
      m.userData.baseY = m.position.y;
    });

    return function(t){
      rings[0].rotation.z = t*0.5;
      rings[1].rotation.z = -t*0.35;
      rings[2].rotation.z = t*0.65;
      core.rotation.y = t*0.8;
      core.material.emissiveIntensity = 0.8+0.4*Math.sin(t*3);
      motes.forEach((m,i)=>{
        const a = m.userData.angle + t*0.4;
        m.position.x = Math.cos(a)*m.userData.radius;
        m.position.z = Math.sin(a)*m.userData.radius;
        m.position.y = m.userData.baseY + Math.sin(t*1.5+i)*0.05;
      });
    };
  },

  /* ---- recon drone (real asset): hover bob + dust ---- */
  hoverBob(model){
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const dust = makeGlowParticles(14, ()=>({
      x:(Math.random()-0.5)*size.x*1.6,
      y:box.min.y + Math.random()*0.2,
      z:(Math.random()-0.5)*size.z*1.6
    }), 0xffd27a, 0.08);
    model.add(dust);
    const basePos = dust.geometry.attributes.position.array.slice();

    return function(t){
      model.position.y = Math.sin(t*1.8)*0.12;
      model.rotation.y = Math.sin(t*0.5)*0.25 + t*0.1;
      model.rotation.z = Math.sin(t*2.4)*0.03;
      const pos = dust.geometry.attributes.position;
      for(let i=0;i<pos.count;i++){
        pos.setY(i, basePos[i*3+1] + Math.sin(t*3+i)*0.03);
      }
      pos.needsUpdate = true;
    };
  },

  /* ---- combat ship (real asset): flight bank + engine glow ---- */
  flightBank(model){
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const glow = makeGlowSprite(0x66d9ff, size.length()*0.25);
    glow.position.set(0,0, box.min.z);
    model.add(glow);

    return function(t){
      model.rotation.z = Math.sin(t*0.6)*0.35;
      model.rotation.x = Math.sin(t*0.4)*0.12 + 0.05;
      model.rotation.y = t*0.15;
      model.position.y = Math.sin(t*0.8)*0.15;
      glow.material.opacity = 0.5 + 0.4*Math.sin(t*10);
    };
  },

  /* ---- mech / warrior (real assets): idle sway + glowing aura clone ---- */
  idleAura(model){
    const auraGroup = new THREE.Group();
    // Real GLB assets can nest meshes several levels deep (bone/rig
    // groups), so a mesh's own local position/rotation isn't enough to
    // place its aura copy correctly — compute the transform relative to
    // `model` via world matrices instead, which works at any nesting depth.
    model.updateMatrixWorld(true);
    const modelWorldInverse = new THREE.Matrix4().copy(model.matrixWorld).invert();
    model.traverse(c=>{
      if(c.isMesh){
        const auraMesh = new THREE.Mesh(c.geometry, new THREE.MeshBasicMaterial({
          color:0xff5a2a, wireframe:true, transparent:true, opacity:0.3
        }));
        const relMatrix = new THREE.Matrix4().multiplyMatrices(modelWorldInverse, c.matrixWorld);
        const pos = new THREE.Vector3(), quat = new THREE.Quaternion(), scl = new THREE.Vector3();
        relMatrix.decompose(pos, quat, scl);
        auraMesh.position.copy(pos);
        auraMesh.quaternion.copy(quat);
        auraMesh.scale.copy(scl).multiplyScalar(1.04);
        auraGroup.add(auraMesh);
      }
    });
    model.add(auraGroup);

    return function(t){
      model.rotation.y = Math.sin(t*0.3)*0.15;
      model.position.y = Math.sin(t*1.2)*0.05;
      const pulseAmt = 0.3 + 0.15*Math.sin(t*2.4);
      auraGroup.children.forEach(m=>{ m.material.opacity = pulseAmt; });
    };
  },

  /* ---- astronaut (real asset): slow zero-gravity tumble/drift ---- */
  zeroGFloat(model){
    return function(t){
      model.rotation.x = Math.sin(t*0.3)*0.3;
      model.rotation.y = t*0.25;
      model.rotation.z = Math.cos(t*0.22)*0.2;
      model.position.x = Math.sin(t*0.4)*0.2;
      model.position.y = Math.sin(t*0.6)*0.15;
    };
  },

  /* ---- tank (real asset): idling rumble + dust ---- */
  driveRumble(model){
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const dust = makeGlowParticles(10, ()=>({
      x:(Math.random()-0.5)*size.x,
      y:box.min.y,
      z:(Math.random()-0.5)*size.z
    }), 0x9a8a6a, 0.1);
    model.add(dust);

    return function(t){
      model.rotation.y = Math.sin(t*0.35)*0.1;
      model.position.x = Math.sin(t*40)*0.01;
      model.position.z = Math.sin(t*0.9)*0.05;
      dust.material.opacity = 0.35 + 0.25*Math.sin(t*3);
    };
  }
};

/* procedural-type -> [builder name, opts] */
const PROFILE_BY_KEY = {
  flare: ["sparkIgnite"],
  detonator: ["buttonPress"],
  rocket: ["launchLoop"],
  hazardbarrel: ["hazardRumble"],
  c4block: ["timerBlink"],
  warhead: ["spinFlight"],
  grenade: ["pinPull", {glow:false}],
  grenade2: ["pinPull", {glow:true}],
  spikemine: ["spikesPulse"],
  launcher: ["recoilFlash", {glow:false}],
  launcher2: ["recoilFlash", {glow:true}],
  plasmacore: ["energyRings"],
  pulsegun: ["chargeGlow", {heavy:false}],
  pulsegun2: ["chargeGlow", {heavy:true}],
  microdrone: ["rotorHover", {eye:false}],
  microdrone2: ["rotorHover", {eye:true}],
  armorplate: ["presentationSpin", {core:false}],
  armorplate2: ["presentationSpin", {core:true}],
  containment: ["containmentOrbit"]
};

/* real .glb asset path -> [builder name, opts] */
const GLB_PROFILE_BY_NAME = {
  "models/bomba.glb": ["fuseTension"],
  "models/product1.glb": ["scanReveal"],
  "models/product2.glb": ["scanReveal"],
  "models/drone.glb": ["hoverBob"],
  "models/spaceship.glb": ["flightBank"],
  "models/mech.glb": ["idleAura"],
  "models/warrior.glb": ["idleAura"],
  "models/astronaut.glb": ["zeroGFloat"],
  "models/tank.glb": ["driveRumble"]
};

function buildAnimationTick(product, model){
  const entry = product.procedural
    ? PROFILE_BY_KEY[product.procedural]
    : GLB_PROFILE_BY_NAME[product.model];
  const [name, opts] = entry || ["presentationSpin", {core:false}];
  return PROFILE_BUILDERS[name](model, opts || {});
}

function cloneForLightbox(source){
  const clone = source.clone(true);
  clone.traverse(c=>{
    if(c.material){
      c.material = Array.isArray(c.material) ? c.material.map(m=>m.clone()) : c.material.clone();
    }
  });
  return clone;
}

function disposeObjectTree(obj){
  obj.traverse(c=>{
    if(c.geometry) c.geometry.dispose();
    if(c.material){
      const mats = Array.isArray(c.material) ? c.material : [c.material];
      mats.forEach(m=>{
        // GLOW_TEXTURE is shared across every open of the lightbox — never
        // dispose it here, only per-clone materials/geometries.
        if(m.map && m.map !== GLOW_TEXTURE) m.map.dispose();
        m.dispose();
      });
    }
  });
}

/* ---- lightbox scene/renderer (separate from the card viewer so the
   automatic animation and the card's own OrbitControls never fight) ---- */
const lightbox = document.getElementById("lightbox");
const lightboxCanvas = document.getElementById("lightboxCanvas");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxCaption = document.getElementById("lightboxCaption");

const lbRenderer = new THREE.WebGLRenderer({ canvas:lightboxCanvas, alpha:true, antialias:true });
lbRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
lbRenderer.outputEncoding = THREE.sRGBEncoding;
lbRenderer.physicallyCorrectLights = true;
lbRenderer.toneMapping = THREE.ACESFilmicToneMapping;
lbRenderer.toneMappingExposure = 1.6;

const lbScene = new THREE.Scene();
const lbCamera = new THREE.PerspectiveCamera(45,1,0.1,100);
lbCamera.position.set(0,0,5);

lbScene.add(new THREE.AmbientLight(0xffffff,0.5));
const lbDir = new THREE.DirectionalLight(0xffffff,2);
lbDir.position.set(3,3,3);
lbScene.add(lbDir);

const lbControls = new THREE.OrbitControls(lbCamera, lbRenderer.domElement);
lbControls.enableZoom = true;
lbControls.enablePan = false;
lbControls.enableDamping = true;

let lbModel = null;
let lbTick = null;
let lbClock = null;
let lbRAFId = null;
let lbPollId = null;
let lbCurrentIndex = -1;

function resizeLightbox(){
  const w = lightboxCanvas.clientWidth || 1;
  const h = lightboxCanvas.clientHeight || 1;
  lbCamera.aspect = w/h;
  lbCamera.updateProjectionMatrix();
  lbRenderer.setSize(w,h,false);
}

function populateLightboxModel(index){
  const product = products[index];
  const source = modelCache[index];
  if(!source){
    // modelCache[index] is `undefined` until a load has ever been kicked
    // off for this index, then `null` while that load is in flight — only
    // start one ourselves if nothing (card or lightbox) already has.
    if(modelCache[index] === undefined) getOrBuildModel(index);
    lbPollId = setTimeout(()=>{ if(lbCurrentIndex===index) populateLightboxModel(index); }, 150);
    return;
  }
  if(lbModel){ lbScene.remove(lbModel); disposeObjectTree(lbModel); }
  lbModel = cloneForLightbox(source);
  lbScene.add(lbModel);
  lbTick = buildAnimationTick(product, lbModel);
  lbClock = new THREE.Clock();
}

function openLightbox(index){
  lbCurrentIndex = index;
  lightboxCaption.textContent = products[index].name;
  lbScene.environment = viewerScene.environment;

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden","false");
  resizeLightbox();

  if(lbPollId){ clearTimeout(lbPollId); lbPollId=null; }
  populateLightboxModel(index);

  if(lbRAFId){ cancelAnimationFrame(lbRAFId); }
  (function loop(){
    lbRAFId = requestAnimationFrame(loop);
    const t = lbClock ? lbClock.getElapsedTime() : 0;
    if(lbTick) lbTick(t);
    lbControls.update();
    lbRenderer.render(lbScene, lbCamera);
  })();
}

function closeLightbox(){
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden","true");

  if(lbRAFId){ cancelAnimationFrame(lbRAFId); lbRAFId=null; }
  if(lbPollId){ clearTimeout(lbPollId); lbPollId=null; }
  lbCurrentIndex = -1;
  lbTick = null;

  if(lbModel){ lbScene.remove(lbModel); disposeObjectTree(lbModel); lbModel=null; }
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e=>{ if(e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape" && lightbox.classList.contains("open")) closeLightbox(); });
window.addEventListener("resize", ()=>{ if(lightbox.classList.contains("open")) resizeLightbox(); });
