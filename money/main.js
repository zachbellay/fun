import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { gsap } from "gsap";
import $ from "jquery";

THREE.Cache.enabled = true;

let font, scene, camera, renderer;

let index = 0;


function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // callback to resize threejs window on resize
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const controls = new OrbitControls(camera, renderer.domElement)

  const one_dollar_texture = new THREE.TextureLoader().load('imgs/one_dollar.jpg');
  const one_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_dollar_texture, side: THREE.DoubleSide }));

  one_dollar.rotation.x = -Math.PI / 2;
  one_dollar.position.y += 0.01;

  scene.add(one_dollar);


  // create a never ending floor in three.js
  const floorGeometry = new THREE.PlaneGeometry(10000, 10000, 1, 1);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // add lighting to threejs scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 5);
  scene.add(ambientLight);



  var geometry = new TextGeometry('hi!', {
    font: font,
    size: 80,
    height: 1,
    // curveSegments: 12,
    // bevelEnabled: true,
    // bevelThickness: 10,
    // bevelSize: 8,
    // bevelSegments: 5
  });

  var material = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, -1);
  mesh.rotation.x = -Math.PI / 2;


  mesh.scale.multiplyScalar(0.01)
  mesh.castShadow = true;
  scene.add(mesh);


  camera.position.y = 3;
  camera.lookAt(one_dollar.position);


}



const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};


var manager = new THREE.LoadingManager();
manager.onLoad = () => {
  init();
  animate();
}

const loader = new FontLoader(manager);
loader.load('https://cdn.rawgit.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json', (resp) => {
  font = resp;
});

// console.log($);

$(document).keyup(function (event) {
  if (event.keyCode === 39) {
    index++;
  } else if (event.keyCode === 37) {
    index--;
  }
  if (index < 0) {
    index = 0;
  }
});