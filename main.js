import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
//scene
const scene = new THREE.Scene();
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: "#ffffff" });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
//fullscreen
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
//light
const light = new THREE.PointLight(0xffffff, 200, 100);
light.position.set(0, 10, 10);
scene.add(light);
//camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

//render
const canvas = document.querySelector(".webgl");
const render = new THREE.WebGLRenderer({ canvas });
render.setSize(sizes.width, sizes.height);
render.setPixelRatio(2);
render.render(scene, camera);
//control
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 10;
//responsive (won't work without loop())
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height; // maintain aspect ratio
  camera.updateProjectionMatrix(); // maintain aspect ratio
  render.setSize(sizes.width, sizes.height);
});
const loop = () => {
  controls.update();
  render.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();
//animation
let mouseDown = false;
let rgb = [];
const timeline = gsap.timeline({ defaults: { duration: 1 } });
timeline.fromTo(sphere.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
//change color
window.addEventListener("mousedown", () => (mouseDown = false));
window.addEventListener("mouseup", () => (mouseDown = true));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);

    gsap.to(sphere.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
