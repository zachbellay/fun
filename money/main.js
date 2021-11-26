import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from "gsap";
import $ from "jquery";
// import Stats from 'three/examples/jsm/libs/stats.module'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Swipe from 'swipejs';

// const stats = Stats();
// document.body.appendChild(stats.dom)

var screen_width = $(window).width();


THREE.Cache.enabled = true;

let font, scene, camera, renderer, controls, window_width, window_height;
var objects = [''];

let one_thousand,
  two_thousand,
  five_thousand,
  ten_thousand,
  fifteen_thousand,
  twenty_five_thousand,
  forty_five_thousand,
  sixty_five_thousand,
  seventy_five_thousand,
  one_hundred_thousand,
  three_hundred_fifty_thousand;

let startPos = 0;
let isDragging = false;
let currentTranslate = 0,
  prevTranslate = 0;

let index = 20;
let prev_index = -1;

function modelLoader(url) {

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(url, data => resolve(data), null, reject);
  });
}

async function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 15;
  camera.position.x = -5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  window_width = window.innerWidth;
  window_height = window.innerHeight;
  document.body.appendChild(renderer.domElement);

  // callback to resize threejs window on resize
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    window_width = window.innerWidth;
    window_height = window.innerHeight;
    screen_width = $(window).width();
    canvasAnimate();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // add lighting to threejs scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  // OBJECTS  

  // COFFEE -- $1

  const one_dollar_texture = new THREE.TextureLoader().load('/one_dollar.jpg');
  const one_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_dollar_texture, side: THREE.DoubleSide }));

  scene.add(one_dollar);

  objects.push({
    "title": "McDonald's Coffee",
    "description": "$1",
    "camera_position": {
      "x": one_dollar.position.x,
      "y": 0,
      "z": 3
    },
    "object": one_dollar
  });

  // COKE -- $2

  const two_dollar_texture = new THREE.TextureLoader().load('/two_dollars.jpg');
  const two_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: two_dollar_texture, side: THREE.DoubleSide }));

  two_dollar.position.x = 3;

  scene.add(two_dollar);

  objects.push({
    "title": "Bottle of Coca-Cola",
    "description": "$2",
    "camera_position": {
      "x": two_dollar.position.x,
      "y": 0,
      "z": 3
    },
    "object": two_dollar
  });

  // CHIK-FIL-A NUGGETS - $5

  const five_dollar_texture = new THREE.TextureLoader().load('/five_dollars.jpg');
  const five_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: five_dollar_texture, side: THREE.DoubleSide }));

  five_dollar.position.x = 6;

  scene.add(five_dollar);

  objects.push({
    "title": "Chik-fil-A Nuggets",
    "description": "$5",
    "camera_position": {
      "x": five_dollar.position.x,
      "y": 0,
      "z": 3
    },
    "object": five_dollar
  });

  // CHIPOTLE STEAK BURRITO -- $10

  const ten_dollar_texture = new THREE.TextureLoader().load('/ten_dollars.jpg');
  const ten_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: ten_dollar_texture, side: THREE.DoubleSide }));

  ten_dollar.position.x = 9;

  scene.add(ten_dollar);
  objects.push({
    "title": "Chipotle Steak Burrito",
    "description": "$10",
    "camera_position": {
      "x": ten_dollar.position.x,
      "y": 0,
      "z": 3
    },
    "object": ten_dollar
  });

  // OLD NAVY GRAPHIC TEE -- $20

  const twenty_dollar_texture = new THREE.TextureLoader().load('/twenty_dollars.jpg');
  const twenty_dollars = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: twenty_dollar_texture, side: THREE.DoubleSide }));

  twenty_dollars.position.x = 12;

  scene.add(twenty_dollars);
  objects.push({
    "title": "Old Navy Graphic Tee",
    "description": "$20",
    "camera_position": {
      "x": twenty_dollars.position.x,
      "y": 0,
      "z": 3
    },
    "object": twenty_dollars
  });

  // DELUXE MANICURE -- $50

  const fifty_dollar_texture = new THREE.TextureLoader().load('/fifty_dollars.jpg');
  const fifty_dollars = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: fifty_dollar_texture, side: THREE.DoubleSide }));

  fifty_dollars.position.x = 15;

  scene.add(fifty_dollars);
  objects.push({
    "title": "Deluxe Manicure",
    "description": "$50",
    "camera_position": {
      "x": fifty_dollars.position.x,
      "y": 0,
      "z": 3
    },
    "object": fifty_dollars
  });

  // ALL BIRDS -- $100

  const one_hundred_dollar_texture = new THREE.TextureLoader().load('imgs/one_hundred_dollars.jpg');
  const one_hundred_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));

  one_hundred_dollar.position.x = 18

  scene.add(one_hundred_dollar);
  objects.push({
    "title": "Pair of Allbirds",
    "description": "$100",
    "camera_position": {
      "x": 10,
      "y": 0,
      "z": 3
    },
    "object": one_hundred_dollar
  });

  const one_hundred_dollar_250_1 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_250_2 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const fifty_dollars_250 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: fifty_dollar_texture, side: THREE.DoubleSide }));

  one_hundred_dollar_250_1.position.y = -0.25;
  one_hundred_dollar_250_1.position.x = -0.25;

  fifty_dollars_250.position.x = 0.25;
  fifty_dollars_250.position.y = 0.25;

  const two_fifty_group = new THREE.Group();

  two_fifty_group.add(one_hundred_dollar_250_1);
  two_fifty_group.add(one_hundred_dollar_250_2);
  two_fifty_group.add(fifty_dollars_250);

  two_fifty_group.position.x = 21;

  scene.add(two_fifty_group);

  objects.push({
    "title": "Airpods Pros",
    "description": "$250",
    "camera_position": {
      "x": two_fifty_group.position.x,
      "y": 0,
      "z": 4
    },
    "object": two_fifty_group
  });

  // BOSE HEADPHONES -- $380

  const one_hundred_dollar_380_1 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_380_2 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_380_3 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const fifty_dollars_380 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: fifty_dollar_texture, side: THREE.DoubleSide }));
  const ten_dollar_380_1 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: ten_dollar_texture, side: THREE.DoubleSide }));
  const ten_dollar_380_2 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: ten_dollar_texture, side: THREE.DoubleSide }));
  const ten_dollar_380_3 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: ten_dollar_texture, side: THREE.DoubleSide }));

  one_hundred_dollar_380_1.position.y = -0.5;
  one_hundred_dollar_380_1.position.x = -0.5;
  one_hundred_dollar_380_2.position.y = -0.333;
  one_hundred_dollar_380_2.position.x = -0.333;
  one_hundred_dollar_380_3.position.y = -0.166;
  one_hundred_dollar_380_3.position.x = -0.166;

  ten_dollar_380_3.position.y = 0.5;
  ten_dollar_380_3.position.x = 0.5;
  ten_dollar_380_2.position.y = 0.333;
  ten_dollar_380_2.position.x = 0.333;
  ten_dollar_380_1.position.y = 0.166;
  ten_dollar_380_1.position.x = 0.166;

  const three_eighty_group = new THREE.Group();

  three_eighty_group.add(one_hundred_dollar_380_1);
  three_eighty_group.add(one_hundred_dollar_380_2);
  three_eighty_group.add(one_hundred_dollar_380_3);
  three_eighty_group.add(fifty_dollars_380);
  three_eighty_group.add(ten_dollar_380_1);
  three_eighty_group.add(ten_dollar_380_2);
  three_eighty_group.add(ten_dollar_380_3);

  three_eighty_group.position.x = 25;

  scene.add(three_eighty_group);

  objects.push({
    "title": "Bose Headphones",
    "description": "$380",
    "camera_position": {
      "x": three_eighty_group.position.x,
      "y": 0,
      "z": 5
    },
    "object": three_eighty_group
  });


  // COACHELLA TICKET -- $450

  const one_hundred_dollar_450_1 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_450_2 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_450_3 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_450_4 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const fifty_dollars_450 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: fifty_dollar_texture, side: THREE.DoubleSide }));

  one_hundred_dollar_450_1.position.y = -0.5;
  one_hundred_dollar_450_1.position.x = -0.5;
  one_hundred_dollar_450_2.position.y = -0.25;
  one_hundred_dollar_450_2.position.x = -0.25;

  one_hundred_dollar_450_4.position.y = 0.25;
  one_hundred_dollar_450_4.position.x = 0.25;
  fifty_dollars_450.position.y = 0.5;
  fifty_dollars_450.position.x = 0.5;

  const four_fifty = new THREE.Group();

  four_fifty.add(one_hundred_dollar_450_1);
  four_fifty.add(one_hundred_dollar_450_2);
  four_fifty.add(one_hundred_dollar_450_3);
  four_fifty.add(one_hundred_dollar_450_4);
  four_fifty.add(fifty_dollars_450);

  four_fifty.position.x = 29;

  scene.add(four_fifty);

  objects.push({
    "title": "Coachella Pass",
    "description": "$450",
    "camera_position": {
      "x": four_fifty.position.x,
      "y": 0,
      "z": 5
    },
    "object": four_fifty
  });

  // GUCCI BELT -- $500
  const one_hundred_dollar_500_1 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_500_2 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_500_3 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_500_4 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_500_5 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));

  one_hundred_dollar_500_1.position.y = -0.5;
  one_hundred_dollar_500_1.position.x = -0.5;
  one_hundred_dollar_500_2.position.y = -0.25;
  one_hundred_dollar_500_2.position.x = -0.25;
  one_hundred_dollar_500_4.position.y = 0.25;
  one_hundred_dollar_500_4.position.x = 0.25;
  one_hundred_dollar_500_5.position.y = 0.5;
  one_hundred_dollar_500_5.position.x = 0.5;

  const five_hundred = new THREE.Group();
  five_hundred.add(one_hundred_dollar_500_1);
  five_hundred.add(one_hundred_dollar_500_2);
  five_hundred.add(one_hundred_dollar_500_3);
  five_hundred.add(one_hundred_dollar_500_4);
  five_hundred.add(one_hundred_dollar_500_5);

  five_hundred.position.x = 33;

  scene.add(five_hundred);

  objects.push({
    "title": "Gucci Belt",
    "description": "$500",
    "camera_position": {
      "x": five_hundred.position.x,
      "y": 0,
      "z": 5
    },
    "object": five_hundred
  });

  // 70 INCH 4K TV -- $650
  const one_hundred_dollar_650_1 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_650_2 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_650_3 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_650_4 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_650_5 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_650_6 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const fifty_dollars_650 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: fifty_dollar_texture, side: THREE.DoubleSide }));

  one_hundred_dollar_650_1.position.y = -0.5;
  one_hundred_dollar_650_1.position.x = -0.5;
  one_hundred_dollar_650_2.position.y = -0.333;
  one_hundred_dollar_650_2.position.x = -0.333;
  one_hundred_dollar_650_3.position.y = -0.166;
  one_hundred_dollar_650_3.position.x = -0.166;
  one_hundred_dollar_650_5.position.y = 0.166;
  one_hundred_dollar_650_5.position.x = 0.166;
  one_hundred_dollar_650_6.position.y = 0.333;
  one_hundred_dollar_650_6.position.x = 0.333;
  fifty_dollars_650.position.y = 0.5;
  fifty_dollars_650.position.x = 0.5;

  const six_fifty = new THREE.Group();
  six_fifty.add(one_hundred_dollar_650_1);
  six_fifty.add(one_hundred_dollar_650_2);
  six_fifty.add(one_hundred_dollar_650_3);
  six_fifty.add(one_hundred_dollar_650_4);
  six_fifty.add(one_hundred_dollar_650_5);
  six_fifty.add(one_hundred_dollar_650_6);
  six_fifty.add(fifty_dollars_650);

  six_fifty.position.x = 37;

  scene.add(six_fifty);

  objects.push({
    "title": "70\" 4K Flatscreen TV",
    "description": "$650",
    "camera_position": {
      "x": six_fifty.position.x,
      "y": 0,
      "z": 5
    },
    "object": six_fifty
  });

  // iPhone 13 -- $800
  const one_hundred_dollar_800_1 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_800_2 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_800_3 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_800_4 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_800_5 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_800_6 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_800_7 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));
  const one_hundred_dollar_800_8 = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));

  one_hundred_dollar_800_1.position.y = -0.5;
  one_hundred_dollar_800_1.position.x = -0.5;
  one_hundred_dollar_800_2.position.y = -0.3571;
  one_hundred_dollar_800_2.position.x = -0.3571;
  one_hundred_dollar_800_3.position.y = -0.2142;
  one_hundred_dollar_800_3.position.x = -0.2142;
  one_hundred_dollar_800_4.position.y = -0.0714;
  one_hundred_dollar_800_4.position.x = -0.0714;
  one_hundred_dollar_800_5.position.y = 0.0714;
  one_hundred_dollar_800_5.position.x = 0.0714;
  one_hundred_dollar_800_6.position.y = 0.2142;
  one_hundred_dollar_800_6.position.x = 0.2142;
  one_hundred_dollar_800_7.position.y = 0.3751;
  one_hundred_dollar_800_7.position.x = 0.3751;
  one_hundred_dollar_800_8.position.y = 0.5;
  one_hundred_dollar_800_8.position.x = 0.5;

  const eight_hundred = new THREE.Group();
  eight_hundred.add(one_hundred_dollar_800_1);
  eight_hundred.add(one_hundred_dollar_800_2);
  eight_hundred.add(one_hundred_dollar_800_3);
  eight_hundred.add(one_hundred_dollar_800_4);
  eight_hundred.add(one_hundred_dollar_800_5);
  eight_hundred.add(one_hundred_dollar_800_6);
  eight_hundred.add(one_hundred_dollar_800_7);
  eight_hundred.add(one_hundred_dollar_800_8);

  eight_hundred.position.x = 41;

  scene.add(eight_hundred);

  objects.push({
    "title": "iPhone 13",
    "description": "$800",
    "camera_position": {
      "x": eight_hundred.position.x,
      "y": 0,
      "z": 5
    },
    "object": eight_hundred
  });

  // Mont Blanc -- $1000

  var one_thousand_gltf = await modelLoader('/1k.glb');
  one_thousand = one_thousand_gltf.scene;

  one_thousand.position.x = 45;
  one_thousand.rotation.x = -Math.PI / 2;

  scene.add(one_thousand);
  objects.push({
    "title": "Montblanc Pen",
    "description": "$1,000",
    "camera_position": {
      "x": one_thousand.position.x,
      "y": 0,
      "z": 5
    },
    "object": one_thousand
  });

  // Macbook Pro -- $2000

  var two_thousand_gltf = await modelLoader('/2k.glb');
  two_thousand = two_thousand_gltf.scene;

  two_thousand.position.x = 49;
  two_thousand.rotation.x = -Math.PI / 2;

  scene.add(two_thousand);
  objects.push({
    "title": "Macbook Pro",
    "description": "$2,000",
    "camera_position": {
      "x": two_thousand.position.x,
      "y": 0,
      "z": 5
    },
    "object": two_thousand
  });

  // 1 Year CC -- $5K

  var five_thousand_gltf = await modelLoader('/5k.glb');
  five_thousand = five_thousand_gltf.scene;

  five_thousand.position.x = 53;
  five_thousand.rotation.x = -Math.PI / 2;

  scene.add(five_thousand);
  objects.push({
    "title": "1 Year Community College",
    "description": "$5,000",
    "camera_position": {
      "x": five_thousand.position.x,
      "y": 0,
      "z": 5
    },
    "object": five_thousand
  });

  // $10k Plane Ticket lmao -- $10K

  var ten_thousand_gltf = await modelLoader('/10k.glb');
  ten_thousand = ten_thousand_gltf.scene;

  ten_thousand.position.x = 57;
  ten_thousand.rotation.x = -Math.PI / 2;

  scene.add(ten_thousand);
  objects.push({
    "title": "First Class LA ➔ London",
    "description": "$10,000",
    "camera_position": {
      "x": ten_thousand.position.x,
      "y": 0,
      "z": 5
    },
    "object": ten_thousand
  });

  // birkin bag -- $15k

  var fifteen_thousand_gltf = await modelLoader('/15k.glb');

  fifteen_thousand = fifteen_thousand_gltf.scene;

  fifteen_thousand.position.x = 61;
  fifteen_thousand.rotation.x = -Math.PI / 2;

  scene.add(fifteen_thousand);
  objects.push({
    "title": "Birkin Bag",
    "description": "$15,000",
    "camera_position": {
      "x": fifteen_thousand.position.x,
      "y": 0,
      "z": 6
    },
    "object": fifteen_thousand
  });

  // 1 Year In State Tuition -- $25K

  var twenty_five_thousand_gltf = await modelLoader('/25k.glb');

  twenty_five_thousand = twenty_five_thousand_gltf.scene;

  twenty_five_thousand.position.x = 65;
  twenty_five_thousand.rotation.x = -Math.PI / 2;

  scene.add(twenty_five_thousand);
  objects.push({
    "title": "1 Year In-State Tuition",
    "description": "$25,000",
    "camera_position": {
      "x": twenty_five_thousand.position.x,
      "y": 0,
      "z": 6
    },
    "object": twenty_five_thousand
  });

  // Avg. New Car USA -- $45K

  var forty_five_thousand_gltf = await modelLoader('/45k.glb');

  forty_five_thousand = forty_five_thousand_gltf.scene;

  forty_five_thousand.position.x = 69;
  forty_five_thousand.rotation.x = -Math.PI / 2;

  scene.add(forty_five_thousand);
  objects.push({
    "title": "Avg. New Car Price",
    "description": "$45,000",
    "camera_position": {
      "x": forty_five_thousand.position.x,
      "y": 0,
      "z": 6
    },
    "object": forty_five_thousand
  });

  // Median US Household Income -- $65k
  var sixty_five_thousand_gltf = await modelLoader('/65k.glb');

  sixty_five_thousand = sixty_five_thousand_gltf.scene;

  sixty_five_thousand.position.x = 73;
  sixty_five_thousand.rotation.x = -Math.PI / 2;

  scene.add(sixty_five_thousand);
  objects.push({
    "title": "Median US Household Income",
    "description": "$65,000",
    "camera_position": {
      "x": sixty_five_thousand.position.x,
      "y": 0,
      "z": 8.5
    },
    "object": sixty_five_thousand
  });

  // 1 Year Tuition at Harvard
  var seventy_five_thousand_gltf = await modelLoader('/75k.glb');

  seventy_five_thousand = seventy_five_thousand_gltf.scene;

  seventy_five_thousand.position.x = 77;
  seventy_five_thousand.rotation.x = -Math.PI / 2;

  scene.add(seventy_five_thousand);
  objects.push({
    "title": "1 Year Tuition at Harvard",
    "description": "$75,000",
    "camera_position": {
      "x": seventy_five_thousand.position.x,
      "y": 0,
      "z": 8.5
    },
    "object": seventy_five_thousand
  });

  // Tesla Model X -- $100k

  var one_hundred_thousand_gltf = await modelLoader('/100k_cube.glb');
  one_hundred_thousand = one_hundred_thousand_gltf.scene;
  one_hundred_thousand.position.x = 81;
  one_hundred_thousand.rotation.x = -Math.PI / 2;
  one_hundred_thousand.position.z = 0;

  scene.add(one_hundred_thousand);

  objects.push({
    "title": "Tesla Model X",
    "description": "$100,000",
    "camera_position": {
      "x": one_hundred_thousand.position.x,
      "y": 0.25,
      "z": 8.5
    },
    "object": one_hundred_thousand
  });

  // Median Home US -- $350K
  var fifty_thousand_gltf = await modelLoader('/100k_cube.glb');
  var fifty_thousand = fifty_thousand_gltf.scene;
  var one_hundred_thousand_350_1 = one_hundred_thousand.clone();
  var one_hundred_thousand_350_2 = one_hundred_thousand.clone();
  var one_hundred_thousand_350_3 = one_hundred_thousand.clone();

  one_hundred_thousand_350_1.position.x = 0;
  one_hundred_thousand_350_1.position.z = -1;

  one_hundred_thousand_350_2.position.x = 0;

  one_hundred_thousand_350_3.position.x = 0;
  one_hundred_thousand_350_3.position.z = 1;

  fifty_thousand.position.z = -1.5;
  fifty_thousand.rotation.x = -Math.PI / 2;

  three_hundred_fifty_thousand = new THREE.Group();
  three_hundred_fifty_thousand.add(one_hundred_thousand_350_1);
  three_hundred_fifty_thousand.add(one_hundred_thousand_350_2);
  three_hundred_fifty_thousand.add(one_hundred_thousand_350_3);
  three_hundred_fifty_thousand.add(fifty_thousand);

  three_hundred_fifty_thousand.position.x = 85;

  scene.add(three_hundred_fifty_thousand);
  console.log(three_hundred_fifty_thousand)
  console.log(three_hundred_fifty_thousand.position.x);

  objects.push({
    "title": "Median US Home Price",
    "description": "$350,000",
    "camera_position": {
      "x": three_hundred_fifty_thousand.position.x,
      "y": 0,
      "z": 8.5
    },
    "object": three_hundred_fifty_thousand
  });


  // set initial camera position and rotation

  // index = 0;
  // controls = new OrbitControls(camera, renderer.domElement);
}



const animate = () => {
  requestAnimationFrame(animate);
  // stats.update()
  // if (controls) {
  //   controls.update();
  // }

  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);

  if (one_thousand) {
    one_thousand.rotation.z += 0.02;
  }

  if (two_thousand) {
    two_thousand.rotation.z += 0.02;
  }

  if (five_thousand) {
    five_thousand.rotation.z += 0.02;
  }

  if (ten_thousand) {
    ten_thousand.rotation.z += 0.02;
  }

  if (fifteen_thousand) {
    fifteen_thousand.rotation.z += 0.02;
  }

  if (twenty_five_thousand) {
    twenty_five_thousand.rotation.z += 0.02;
  }

  if (forty_five_thousand) {
    forty_five_thousand.rotation.z += 0.02;
  }

  if (sixty_five_thousand) {
    sixty_five_thousand.rotation.z += 0.02;
  }

  if (seventy_five_thousand) {
    seventy_five_thousand.rotation.z += 0.02;
  }

  if (one_hundred_thousand) {
    one_hundred_thousand.rotation.z += 0.01;
  }

  if (three_hundred_fifty_thousand) {
    three_hundred_fifty_thousand.rotation.y += 0.01;
  }


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


  canvasAnimate();

});

function canvasAnimate() {

  if (index > 0) {
    $(".title-page").css("left", "-100%");
    $(".item-title").text(objects[index].title);
    $(".item-description").text(objects[index].description);
    let y = objects[index].camera_position.y;
    let z = objects[index].camera_position.z;

    // arbitrary pixel cutoff to move the camera back
    // so that the object can be see in its entirety on smaller
    // screens
    if (screen_width < 780) {
      z = z * 1.5;
    }

    let object = objects[index].object;

    let x = object.position.x;

    gsap.to(camera.position, {
      duration: index == 1 ? 1 : 0.5,
      // duration: 1,
      x: x,
      y: y,
      z: z,
      ease: "power1.inOut",
    });
  } else if (index == 0) {
    $(".title-page").css("left", "0px");
    gsap.to(camera.position, {
      duration: 1,
      x: -5,
      y: 0,
      z: 15,
      ease: "power1.inOut",
    });
  }
}

$('.go-right').on('click', () => {
  index = 1;
  canvasAnimate();
});

let app_container = $('#app-container');
let canvas = $('canvas');

// disallow selecting text
app_container.on('selectstart', (event) => {
  event.preventDefault();
});

// desktop event listeners
canvas.on('mousedown', touchStart);
canvas.on('mousemove', touchMove);
canvas.on('mouseup', touchEnd);

// mobile event listeners
canvas.on('touchstart', touchStart);
canvas.on('touchmove', touchMove);
canvas.on('touchend', touchEnd);

// desktop event listeners
app_container.on('mousedown', touchStart);
app_container.on('mousemove', touchMove);
app_container.on('mouseup', touchEnd);

// mobile event listeners
app_container.on('touchstart', touchStart);
app_container.on('touchmove', touchMove);
app_container.on('touchend', touchEnd);

$(window).on('load', function () {
  $('.loader').fadeOut();
  $('.page-loader').delay(350).fadeOut('slow');
});

// prevent right click on screen
window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

function touchStart(event) {
  isDragging = true;
  startPos = getPositionX(event);
}

function touchMove(event) {
  if (isDragging) {
    var currentPosition = getPositionX(event);
    currentTranslate = currentPosition - startPos;
  }
}

function touchEnd(event) {

  if (currentTranslate < -100 && index < objects.length - 1) {
    index += 1;
  }

  if (currentTranslate > 100 && index > 0) {
    index -= 1;
  }

  currentTranslate = 0;

  canvasAnimate();

  isDragging = false;
}

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

