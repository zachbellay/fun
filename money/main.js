import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from "gsap";
import $ from "jquery";
import Stats from 'three/examples/jsm/libs/stats.module'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'



THREE.Cache.enabled = true;

let font, scene, camera, renderer;
var objects = [null];


let index = 0;
const stats = Stats()
document.body.appendChild(stats.dom)

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

  // create a never ending floor in three.js
  const floorGeometry = new THREE.PlaneGeometry(10000, 10000, 1, 1);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // add lighting to threejs scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
  scene.add(ambientLight);

  const controls = new OrbitControls(camera, renderer.domElement)


  // OBJECTS  

  const one_dollar_texture = new THREE.TextureLoader().load('imgs/one_dollar.jpg');
  const one_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_dollar_texture, side: THREE.DoubleSide }));

  one_dollar.rotation.x = -Math.PI / 2;
  one_dollar.position.y += 0.01;

  scene.add(one_dollar);

  objects.push({
    "title": "$1",
    "camera_position": {
      "x": 0,
      "y": 2,
      "z": 0
    },
    "object": one_dollar
  });

  const ten_dollar_texture = new THREE.TextureLoader().load('imgs/ten_dollars.jpg');
  const ten_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: ten_dollar_texture, side: THREE.DoubleSide }));

  ten_dollar.rotation.x = -Math.PI / 2;
  ten_dollar.position.y += 0.01;
  ten_dollar.position.x = 5;

  scene.add(ten_dollar);
  objects.push({
    "title": "$10",
    "camera_position": {
      "x": 5,
      "y": 2,
      "z": 0
    },
    "object": ten_dollar
  });

  const one_hundred_dollar_texture = new THREE.TextureLoader().load('imgs/one_hundred_dollars.jpg');
  const one_hundred_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));

  one_hundred_dollar.rotation.x = -Math.PI / 2;
  one_hundred_dollar.position.y += 0.01;
  one_hundred_dollar.position.x = 10

  scene.add(one_hundred_dollar);
  objects.push({
    "title": "$100",
    "camera_position": {
      "x": 10,
      "y": 2,
      "z": 0
    },
    "object": one_hundred_dollar
  });


  const loader = new GLTFLoader();
  loader.load('gltf/10k.glb', (gltf) => {
    var ten_thousand = gltf.scene;
    ten_thousand.position.y = 0.15;
    ten_thousand.position.x = 20;

    scene.add(ten_thousand);
    objects.push({
      "title": "$10,000",
      "camera_position": {
        "x": 20,
        "y": 2,
        "z": 1.5
      },
      "object": ten_thousand
    });

  });







  // set initial camera position and rotation
  camera.position.y = 2;
  camera.lookAt(one_dollar.position);




}



const animate = () => {
  requestAnimationFrame(animate);
  stats.update()
  renderer.render(scene, camera);
};



init();
animate();


$(document).on('keyup', function (event) {
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

  if (index > 0) {
    $(".title-page").css("display", "none");
    $(".item-title").text(objects[index].title);

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

    const startOrientation = camera.quaternion.clone();
    const targetOrientation = objects[index].object.quaternion.clone().normalize();

    console.log('xyz: ', x, y, z);
    console.log(startOrientation, targetOrientation);

    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(x, y, z), 0);

    console.log(quaternion.angleTo(targetOrientation) * (180 / Math.PI));


    // camera.lookAt(ten_thousand);
    // 
    //  look at this https://jsfiddle.net/fungus1487/SMLwa/  
    //  to figure out how to smoothly use camera.lookat
    // 
    // 
    // 


    gsap.to({}, {
      duration: 0.5,
      onUpdate: function () {
        camera.quaternion.copy(startOrientation).slerp(targetOrientation, this.progress());
      },
      ease: 'expo.inOut'
    });

    // console.log("camera: " + x + " " + y + " " + z);
    // console.log("object: " + objects[index].object.position.x + " " + objects[index].object.position.y + " " + objects[index].object.position.z);


    // gsap.to(camera.rotation, {
    //   duration: 0.5,
    //   x: objects[index].camera_rotation.x,
    //   y: objects[index].camera_rotation.y,
    //   z: objects[index].camera_rotation.z,
    //   ease: "power1.inOut"
    // });

    // gsap.to(camera.rotation, {
    //   duration: 0.5,
    //   x: objects[index].camera_rotation.x,
    //   y: objects[index].camera_rotation.y,
    //   z: objects[index].camera_rotation.z,
    //   ease: "power1.inOut"
    // });


  } else if (index == 0) {
    $(".title-page").css("display", "");
  }




});

// on right click log the coordinates of the camera position
// $(document).on('click', () => {
//   console.log(camera.position);
//   console.log(camera.quaternion);
//   console.log(camera.rotation);
// });

// var objects = [
//   null,
//   {
//     "title": "$1",
//     "camera_position": {
//       "x": 0,
//       "y": 2,
//       "z": 0
//     }
//   },
//   {
//     "title": "$10",
//     "camera_position": {
//       "x": 5,
//       "y": 2,
//       "z": 0
//     }
//   },
//   {
//     "title": "$100",
//     "camera_position": {
//       "x": 10,
//       "y": 2,
//       "z": 0
//     },
//   },
//   {
//     "title": "$1000",
//     "camera_position": {
//       "x": 15,
//       "y": 2,
//       "z": 0
//     }
//   },
//   {
//     "title": "$10,000",
//     "camera_position": {
//       "x": 20,
//       "y": 2,
//       "z": 1.5
//     }
//   },
//   {
//     "title": "$100,000",
//     "camera_position": {
//       "x": 20,
//       "y": 2,
//       "z": 0
//     }
//   },

// ];











$(".item-title").text(objects[index].title);