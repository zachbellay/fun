import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from "gsap";
import $ from "jquery";
// import Stats from 'three/examples/jsm/libs/stats.module'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'



THREE.Cache.enabled = true;

let font, scene, camera, renderer;
var objects = [null];

let one_thousand, ten_thousand;

let index = 0;
// const stats = Stats()
// document.body.appendChild(stats.dom)

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

  // add lighting to threejs scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);


  // OBJECTS  

  const one_dollar_texture = new THREE.TextureLoader().load('imgs/one_dollar.jpg');
  const one_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_dollar_texture, side: THREE.DoubleSide }));

  scene.add(one_dollar);

  objects.push({
    "title": "$1",
    "camera_position": {
      "x": 0,
      "y": 0,
      "z": 2
    },
    "object": one_dollar
  });

  const ten_dollar_texture = new THREE.TextureLoader().load('imgs/ten_dollars.jpg');
  const ten_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: ten_dollar_texture, side: THREE.DoubleSide }));

  ten_dollar.position.x = 5;

  scene.add(ten_dollar);
  objects.push({
    "title": "$10",
    "camera_position": {
      "x": 5,
      "y": 0,
      "z": 2
    },
    "object": ten_dollar
  });

  const one_hundred_dollar_texture = new THREE.TextureLoader().load('imgs/one_hundred_dollars.jpg');
  const one_hundred_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));

  one_hundred_dollar.position.x = 10

  scene.add(one_hundred_dollar);
  objects.push({
    "title": "$100",
    "camera_position": {
      "x": 10,
      "y": 0,
      "z": 2
    },
    "object": one_hundred_dollar
  });

  const loader = new GLTFLoader();

  loader.load('gltf/1k.glb', (gltf) => {

    one_thousand = gltf.scene;

    one_thousand.position.x = 15;
    one_thousand.rotation.x = -Math.PI / 2;

    scene.add(one_thousand);
    objects.push({
      "title": "$1,000",
      "camera_position": {
        "x": 15,
        "y": 0,
        "z": 3
      },
      "object": one_thousand
    });

  });


  loader.load('gltf/10k.glb', (gltf) => {
    ten_thousand = gltf.scene;

    ten_thousand.position.x = 20;
    ten_thousand.rotation.x = -Math.PI / 2;

    scene.add(ten_thousand);
    objects.push({
      "title": "$10,000",
      "camera_position": {
        "x": 20,
        "y": 0,
        "z": 3
      },
      "object": ten_thousand
    });

  });









  // set initial camera position and rotation
  camera.position.z = 2;
  // camera.lookAt(one_dollar.position);




}



const animate = () => {
  requestAnimationFrame(animate);
  // stats.update()
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);

  if (one_thousand) {
    one_thousand.rotation.z += 0.02;
  }

  if (ten_thousand) {
    ten_thousand.rotation.z += 0.02;
  }


};



init();
animate();


$(document).on('keyup', function (event) {
  console.log(objects);

  if (event.keyCode === 39 && index < objects.length - 1) {
    index++;
  } else if (event.keyCode === 37 && index > 0) {
    index--;
  } else {
    return;
  }
  if (index < 0) {
    index = 0;
  }
  console.log(index);

  if (index > 0) {
    // $(".title-page").css("display", "none");
    $(".title-page").css("left", "-100%");
    $(".item-title").text(objects[index].title);
    // $("#app").toggle('slide', { direction: 'right' }, 500);

    let x = objects[index].camera_position.x;
    let y = objects[index].camera_position.y;
    let z = objects[index].camera_position.z;

    gsap.to(camera.position, {
      duration: 0.5,
      x: x,
      y: y,
      z: z,
      ease: "power1.inOut",
    });

  } else if (index == 0) {
    // $(".title-page").css("display", "");
    $(".title-page").css("left", "0px");
  }
});

// on right click log the coordinates of the camera position
$(document).on('click', () => {
  console.log(camera.position);
  console.log(camera.quaternion);
  console.log(camera.rotation);
});

$(".item-title").text(objects[index].title);