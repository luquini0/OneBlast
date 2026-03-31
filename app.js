/* NAV */
const nav = document.querySelector(".nav");
const navInner = document.querySelector(".nav-inner");
navInner.onclick = () => nav.classList.toggle("open");

/* SUBMENU MOBILE */
document.querySelectorAll(".nav-item").forEach(item=>{
  item.addEventListener("click",(e)=>{
    if(window.innerWidth < 900){
      e.stopPropagation();
      item.classList.toggle("open");
    }
  });
});

/* =========================
   MULTI-PRODUCT CAROUSEL + WEBGL
========================= */
const carousel = document.querySelector(".carousel");

const products = [
  { name: "OneBlast", description: "Making things happen, one blast at a time.", model: "models/bomba.glb", scale: 0.8 },
  { name: "Producto 2", description: "Otra vista fullscreen", model: "models/product2.glb", scale: 0.8 },
  { name: "Producto 3", description: "Otra card flotante", model: "models/product3.glb", scale: 0.8 },
  { name: "Producto 4", description: "Slide adicional 4", model: "models/product.glb", scale: 0.8 },
  { name: "Producto 5", description: "Slide adicional 5", model: "models/product.glb", scale: 0.8 },
  { name: "Producto 5", description: "Slide adicional 5", model: "models/drone.glb", scale: 0.8 },
  { name: "Producto 5", description: "Slide adicional 5", model: "models/mouth.glb", scale: 0.8 },
  { name: "Producto 6", description: "Slide adicional 6", model: "models/product1.glb", scale: 0.8 }
];

// Crear slides
products.forEach((p,i)=>{
  const section = document.createElement("section");
  section.classList.add("product-section");
  if(i===0) section.classList.add("active");
  section.innerHTML = `
    <div class="product-container">
      <div class="product-info">
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
logoCamera.position.set(0,0,3);

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
