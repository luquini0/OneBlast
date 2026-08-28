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
  { name: "OneBlast", description: "Making things happen, one blast at a time.", model: "models/bomba.glb", scale: 0.8 },
  { name: "Recon Drone", description: "Ojos en el cielo antes de que todo explote.", model: "models/drone.glb", scale: 0.8 },
  { name: "Canister Táctico", description: "Carcasa de gunmetal cepillado, lista para la acción.", model: "models/product2.glb", scale: 0.8 },
  { name: "Caja Blindada", description: "Almacenamiento reforzado para el resto del kit.", model: "models/product1.glb", scale: 1.1 },
  { name: "Ojiva OneBlast", description: "Perfil aerodinámico, punta de impacto marcada.", procedural: "warhead", scale: 0.8 },
  { name: "Mina de Impacto", description: "Núcleo con púas radiales, activación al contacto.", procedural: "spikemine", scale: 0.8 },
  { name: "Detonador Remoto", description: "Botón rojo, antena lista, control total.", procedural: "detonator", scale: 0.8 }
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
        <h1>${p.name}</h1>
        <p>${p.description}</p>
      </div>
      <div class="product-viewer">
        <div class="loader">Loading...</div>
        <canvas class="webgl-canvas"></canvas>
      </div>
    </div>
  `;
  carousel.appendChild(section);
});

const slides = document.querySelectorAll(".product-section");
const prevArrow = document.querySelector(".arrow.prev");
const nextArrow = document.querySelector(".arrow.next");
let current=0, isDragging=false, startX=0, deltaX=0;

function updateSlides(){
  slides.forEach(slide=>{
    slide.classList.remove("active","prev","next");
    slide.style.transform="";
  });
  slides[current].classList.add("active");
  slides[(current-1+slides.length)%slides.length].classList.add("prev");
  slides[(current+1)%slides.length].classList.add("next");
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

  return group;
}

/* =========================
   THREE.JS WEBGL POR SLIDE CON HDR REAL
========================= */
const viewers = document.querySelectorAll(".product-viewer");
const allRenderers = [], allScenes = [], allCameras = [], allControls = [], allModels = [];

const hdrLoader = new THREE.RGBELoader().setDataType(THREE.UnsignedByteType);
hdrLoader.load("textures/studio.hdr", texture=>{
  viewers.forEach((viewer,i)=>{
    const canvas = viewer.querySelector(".webgl-canvas");
    const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;

    const scene = new THREE.Scene();
    scene.environment = envMap;

    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth/canvas.clientHeight, 0.1, 100);
    camera.position.set(0,0,5);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(3,3,3);
    scene.add(dir);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom=false;
    controls.enablePan=false;
    controls.enableDamping=true;

    if(products[i].procedural){
      const model = buildProceduralProduct(products[i].procedural);
      model.scale.set(products[i].scale, products[i].scale, products[i].scale);
      model.traverse(c=>{ if(c.isMesh){ c.material.metalness=1; c.material.roughness=0.2; }});
      scene.add(model);
      model.visible = (i===0);
      allModels[i]=model;
      viewer.querySelector(".loader").style.display="none";
    } else {
      const loader = new THREE.GLTFLoader();
      loader.load(products[i].model, gltf=>{
        const model = gltf.scene;
        model.scale.set(products[i].scale, products[i].scale, products[i].scale);
        model.traverse(c=>{ if(c.isMesh){ c.material.metalness=1; c.material.roughness=0.2; }});
        scene.add(model);
        model.visible = (i===0);
        allModels[i]=model;
        viewer.querySelector(".loader").style.display="none";
      });
    }

    allRenderers[i]=renderer;
    allScenes[i]=scene;
    allCameras[i]=camera;
    allControls[i]=controls;
  });
});

function animate(){
  requestAnimationFrame(animate);
  slides.forEach((slide,i)=>{
    if(allModels[i]) allModels[i].visible = (i===current);
    if(allControls[i]) allControls[i].update();
    if(allRenderers[i]) allRenderers[i].render(allScenes[i], allCameras[i]);
  });
}
animate();

window.addEventListener("resize", ()=>{
  viewers.forEach((viewer,i)=>{
    const canvas = viewer.querySelector(".webgl-canvas");
    if(!canvas) return;
    allCameras[i].aspect = canvas.clientWidth/canvas.clientHeight;
    allCameras[i].updateProjectionMatrix();
    allRenderers[i].setSize(canvas.clientWidth, canvas.clientHeight);
  });
});

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
