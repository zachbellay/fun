import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from "gsap";
import $ from "jquery";
import { Uint8ClampedBufferAttribute } from 'three';

var BASE = import.meta.env.BASE_URL;
if (BASE == "/") {
  BASE = "";
}


var screen_width = $(window).width();

THREE.Cache.enabled = true;

let font, scene, camera, renderer, controls, window_width, window_height;
var objects = [''];

let liberty,
  one_thousand,
  two_thousand,
  five_thousand,
  ten_thousand,
  fifteen_thousand,
  twenty_five_thousand,
  forty_five_thousand,
  sixty_five_thousand,
  three_hundred_fifty_thousand,
  one_million,
  three_million_five_hundred_thousand,
  six_million,
  eighty_million,
  human_1,
  four_forty_million,
  one_p_four_billion,
  one_p_eight_billion,
  seventy_billion,
  ninety_five_billion,
  one_thirty_four_billion,
  one_ninety_billion,
  two_hundred_one_billion,
  two_hundred_nine_billion,
  two_hundred_seventy_three_billion,
  seven_hundred_five_billion,
  one_p_three_trillion,
  one_p_seven_four_trillion,
  two_p_one_trillion,
  three_p_four_trillion,
  four_p_five_trillion,
  twenty_one_p_eigthy_five_trillion,
  twenty_eight_p_fifty_trillion,
  thirty_three_trillion,
  thirty_four_trillion,
  forty_three_trillion,
  forty_eight_trillion,
  three_hundred_sixty_trillion,
  one_quadrillion,
  eleven_quadrillion;

let startPos = 0;
let isDragging = false;
let currentTranslate = 0,
  prevTranslate = 0;

let index = 0;
let prev_index = -1;

function modelLoader(url) {

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(BASE + url, data => resolve(data), null, reject);
  });
}

async function init() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000);
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

  const loader = new THREE.TextureLoader();

  function human_format_filename_to_number(filename) {
    let lut = {
      "K": 1000,
      "M": 1000000,
      "B": 1000000000,
      "T": 1000000000000,
      "Q": 1000000000000000,
    }

    let [number, ext] = filename.split(".");
    let magnitude = number[number.length - 1];
    let number_without_magnitude = number.slice(0, number.length - 1);
    let [big, small] = number_without_magnitude.split("_");
    let value = (Number(big) + (Number(small) / 10)) * lut[magnitude];
    return value;
  }

  function number_to_human_format(number) {
    var magnitude = 0;
    while (Math.abs(number) >= 1000) {
      magnitude += 1;
      number /= 1000;
    }
    var output = String(number.toFixed(2)) + ["", "K", "M", "B", "T", "Q"][magnitude];
    output = output.replace(".", "_");
    return output;
  }

  function value_to_dimensions(value) {
    const scaling_d = 0.25;
    const scaling_l = 2.63;
    const scaling_h = 1.13;

    var bundles = value / 10000;

    const length = 156;
    const height = 66;
    const depth = 10;

    var alpha = Math.cbrt(bundles * length * height * depth);

    var l = Math.round(alpha / length) * scaling_l;
    var h = Math.round(alpha / height) * scaling_h;
    var d = Math.round(alpha / depth) * scaling_d;
    
    return [l, h, d];
  }

  function value_to_cube(value) {
    var filename;

    // this nasty hack is because above this value the texture is the same
    // so we should just use the same texture to reduce the number of assets
    // that need to be loaded by the browser
    if (value > 21850000000000) {
      filename = "21_85T";
    } else {
      filename = number_to_human_format(value);
    }

    const materials = [
      new THREE.MeshBasicMaterial({ map: loader.load(BASE + '/' + filename + '_side.jpg') }),
      new THREE.MeshBasicMaterial({ map: loader.load(BASE + '/' + filename + '_side.jpg') }),
      new THREE.MeshBasicMaterial({ map: loader.load(BASE + '/' + filename + '_side.jpg') }),
      new THREE.MeshBasicMaterial({ map: loader.load(BASE + '/' + filename + '_side.jpg') }),
      new THREE.MeshBasicMaterial({ map: loader.load(BASE + '/' + filename + '_front.jpg') }),
      new THREE.MeshBasicMaterial({ map: loader.load(BASE + '/' + filename + '_back.jpg') }),
    ];
    let [boxWidth, boxHeight, boxDepth] = value_to_dimensions(value);
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    
    const cube = new THREE.Mesh(geometry, materials);
    cube.position.y = (boxHeight / 2) - 9; // the human is adjust 9 units, so this is applied to all the rest so the "floor" is the same
    return cube;
  }



  // COFFEE -- $1

  const one_dollar_texture = new THREE.TextureLoader().load(BASE + '/one_dollar.jpg');
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


  // CHIPOTLE STEAK BURRITO -- $10

  const ten_dollar_texture = new THREE.TextureLoader().load(BASE + '/ten_dollars.jpg');
  const ten_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: ten_dollar_texture, side: THREE.DoubleSide }));

  ten_dollar.position.x = 3;

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

  const fifty_dollar_texture = new THREE.TextureLoader().load(BASE + '/fifty_dollars.jpg');

  // ALL BIRDS -- $100

  const one_hundred_dollar_texture = new THREE.TextureLoader().load(BASE + '/one_hundred_dollars.jpg');
  const one_hundred_dollar = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1), new THREE.MeshBasicMaterial({ map: one_hundred_dollar_texture, side: THREE.DoubleSide }));

  one_hundred_dollar.position.x = 6

  scene.add(one_hundred_dollar);
  objects.push({
    "title": "Pair of Allbirds Sneakers",
    "description": "$100",
    "camera_position": {
      "x": 10,
      "y": 0,
      "z": 3
    },
    "object": one_hundred_dollar
  });



  // Macbook Air -- $1000

  var one_thousand_gltf = await modelLoader('1k.glb');
  one_thousand = one_thousand_gltf.scene;

  one_thousand.position.x = 9;
  one_thousand.rotation.x = -Math.PI / 2;

  scene.add(one_thousand);
  objects.push({
    "title": "Macbook Air",
    "description": "$1,000",
    "camera_position": {
      "x": one_thousand.position.x,
      "y": 0,
      "z": 5
    },
    "object": one_thousand
  });

  // $10k Plane Ticket lmao -- $10K

  var ten_thousand_gltf = await modelLoader('10k.glb');
  ten_thousand = ten_thousand_gltf.scene;

  ten_thousand.position.x = 12;
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



  // Median US Household Income -- $65k
  var sixty_five_thousand_gltf = await modelLoader('65k_cube.glb');

  sixty_five_thousand = sixty_five_thousand_gltf.scene;

  sixty_five_thousand.position.x = 16;
  sixty_five_thousand.rotation.x = -Math.PI / 2;

  scene.add(sixty_five_thousand);
  objects.push({
    "title": "Median US Household Income",
    "description": "$65,000",
    "camera_position": {
      "x": sixty_five_thousand.position.x,
      "y": 0,
      "z": 6
    },
    "object": sixty_five_thousand
  });


  // House -- $350K

  var three_hundred_fifty_gltf = await modelLoader('350k_cube.glb');

  three_hundred_fifty_thousand = three_hundred_fifty_gltf.scene;

  three_hundred_fifty_thousand.position.x = 22;
  three_hundred_fifty_thousand.rotation.x = -Math.PI / 2;

  scene.add(three_hundred_fifty_thousand);

  objects.push({
    "title": "Median US Home Price",
    "description": "$350,000",
    "camera_position": {
      "x": three_hundred_fifty_thousand.position.x,
      "y": 0,
      "z": 12
    },
    "object": three_hundred_fifty_thousand
  });

  // Janitor Lifetime Earnings -- $1M

  var one_million_gltf = await modelLoader('1M_cube.glb');

  one_million = one_million_gltf.scene;

  one_million.position.x = 29;
  one_million.rotation.x = -Math.PI / 2;

  scene.add(one_million);

  objects.push({
    "title": "Janitor Lifetime Earnings",
    "description": "$1,000,000",
    "camera_position": {
      "x": one_million.position.x,
      "y": 0,
      "z": 15
    },
    "object": one_million
  });

  var three_million_five_hundred_thousand_gltf = await modelLoader('3p5M_cube.glb');

  three_million_five_hundred_thousand = three_million_five_hundred_thousand_gltf.scene;

  three_million_five_hundred_thousand.position.x = 40;
  three_million_five_hundred_thousand.rotation.x = -Math.PI / 2;

  scene.add(three_million_five_hundred_thousand);

  objects.push({
    "title": "Software Engineer Lifetime Earnings",
    "description": "$3,500,000",
    "camera_position": {
      "x": three_million_five_hundred_thousand.position.x,
      "y": 0,
      "z": 17
    },
    "object": three_million_five_hundred_thousand
  });

  var six_million_gltf = await modelLoader('6M_cube.glb');

  six_million = six_million_gltf.scene;

  six_million.position.x = 53;
  six_million.rotation.x = -Math.PI / 2;

  scene.add(six_million);

  objects.push({
    "title": "Doctor Lifetime Earnings",
    "description": "$6,200,000",
    "camera_position": {
      "x": six_million.position.x,
      "y": 0,
      "z": 20
    },
    "object": six_million
  });


  eighty_million = value_to_cube(80000000);
  eighty_million.position.x = 80;
  scene.add(eighty_million);

  objects.push({
    "title": "Walter White Meth Profits",
    "description": "$80,000,000",
    "camera_position": {
      "x": eighty_million.position.x,
      "y": 0,
      "z": 50
    },
    "object": eighty_million
  });

  var human_1_gltf = await modelLoader('human.glb');

  human_1 = human_1_gltf.scene;

  human_1.position.x = 110;
  human_1.position.y = 9;
  human_1.rotation.x = -Math.PI / 2;
  human_1.rotation.z = Math.PI;

  scene.add(human_1);

  objects.push({
    "title": "Human",
    "description": "5' 10\"",
    "camera_position": {
      "x": human_1.position.x,
      "y": 0,
      "z": 75
    },
    "object": human_1
  });


  four_forty_million = value_to_cube(440000000)
  four_forty_million.position.x = 160;
  scene.add(four_forty_million);

  objects.push({
    "title": "Beyonce Net Worth",
    "description": "$440,000,000",
    "camera_position": {
      "x": four_forty_million.position.x,
      "y": 0,
      "z": 95
    },
    "object": four_forty_million
  });

  one_p_four_billion = value_to_cube(1400000000);
  one_p_four_billion.position.x = 230;
  scene.add(one_p_four_billion);

  objects.push({
    "title": "Jay-Z Net Worth",
    "description": "$1,400,000,000",
    "camera_position": {
      "x": one_p_four_billion.position.x,
      "y": 0,
      "z": 110
    },
    "object": one_p_four_billion
  });

  one_p_eight_billion = value_to_cube(1800000000);
  one_p_eight_billion.position.x = 320;
  scene.add(one_p_eight_billion);

  objects.push({
    "title": "Kanye West Net Worth",
    "description": "$1,800,000,000",
    "camera_position": {
      "x": one_p_eight_billion.position.x,
      "y": 0,
      "z": 120
    },
    "object": one_p_eight_billion
  });



  seventy_billion = value_to_cube(70000000000);
  seventy_billion.position.x = 500;
  scene.add(seventy_billion);

  objects.push({
    "title": "Vladimir Putin Net Worth",
    "description": "$70,000,000,000",
    "camera_position": {
      "x": seventy_billion.position.x,
      "y": 0,
      "z": 400
    },
    "object": seventy_billion
  });



  ninety_five_billion = value_to_cube(95000000000);
  ninety_five_billion.position.x = 800;
  scene.add(ninety_five_billion);

  objects.push({
    "title": "Cost of Climate Related Disasters 2020 in USA",
    "description": "$95,000,000,000",
    "camera_position": {
      "x": ninety_five_billion.position.x,
      "y": 0,
      "z": 550
    },
    "object": ninety_five_billion
  });

  one_thirty_four_billion = value_to_cube(134000000000);
  one_thirty_four_billion.position.x = 1150;
  scene.add(one_thirty_four_billion);

  objects.push({
    "title": "Bill Gates Net Worth",
    "description": "$134,000,000,000",
    "camera_position": {
      "x": one_thirty_four_billion.position.x,
      "y": 0,
      "z": 550
    },
    "object": one_thirty_four_billion
  });


  one_ninety_billion = value_to_cube(190000000000);
  one_ninety_billion.position.x = 1600;
  scene.add(one_ninety_billion);

  objects.push({
    "title": "Elon Musk Net Worth",
    "description": "$190,000,000,000",
    "camera_position": {
      "x": one_ninety_billion.position.x,
      "y": 0,
      "z": 550
    },
    "object": one_ninety_billion
  });

  two_hundred_one_billion = value_to_cube(201000000000);
  two_hundred_one_billion.position.x = 2050;
  scene.add(two_hundred_one_billion);

  objects.push({
    "title": "Jeff Bezos Net Worth",
    "description": "$201,000,000,000",
    "camera_position": {
      "x": two_hundred_one_billion.position.x,
      "y": 0,
      "z": 550
    },
    "object": two_hundred_one_billion
  });

  two_hundred_nine_billion = value_to_cube(209160000000);
  two_hundred_nine_billion.position.x = 2450;
  scene.add(two_hundred_nine_billion);

  objects.push({
    "title": "China Defense Budget 2021",
    "description": "$209,160,000,000",
    "camera_position": {
      "x": two_hundred_nine_billion.position.x,
      "y": 0,
      "z": 550
    },
    "object": two_hundred_nine_billion
  });


  two_hundred_seventy_three_billion = value_to_cube(273650000000);
  two_hundred_seventy_three_billion.position.x = 2900;
  scene.add(two_hundred_seventy_three_billion);

  objects.push({
    "title": "Value of All Gold Bars in Fort Knox",
    "description": "$273,650,000,000",
    "camera_position": {
      "x": two_hundred_seventy_three_billion.position.x,
      "y": 0,
      "z": 550
    },
    "object": two_hundred_seventy_three_billion
  });

  seven_hundred_five_billion = value_to_cube(705000000000);
  seven_hundred_five_billion.position.x = 3500;
  scene.add(seven_hundred_five_billion);

  objects.push({
    "title": "US Defense Budget 2021",
    "description": "$705,000,000,000",
    "camera_position": {
      "x": seven_hundred_five_billion.position.x,
      "y": 0,
      "z": 750
    },
    "object": seven_hundred_five_billion
  });


  one_p_three_trillion = value_to_cube(1300000000000);
  one_p_three_trillion.position.x = 4200;
  scene.add(one_p_three_trillion);

  objects.push({
    "title": "Cost to End Homelessness in US",
    "description": "$1,300,000,000,000",
    "camera_position": {
      "x": one_p_three_trillion.position.x,
      "y": 0,
      "z": 900
    },
    "object": one_p_three_trillion
  });


  one_p_seven_four_trillion = value_to_cube(1740000000000);
  one_p_seven_four_trillion.position.x = 5000;
  scene.add(one_p_seven_four_trillion);

  objects.push({
    "title": "Value of All Land on Manhattan 2014",
    "description": "$1,740,000,000,000",
    "camera_position": {
      "x": one_p_seven_four_trillion.position.x,
      "y": 0,
      "z": 1050
    },
    "object": one_p_seven_four_trillion
  });


  two_p_one_trillion = value_to_cube(2100000000000);
  two_p_one_trillion.position.x = 5900;
  scene.add(two_p_one_trillion);

  objects.push({
    "title": "Net Worth of Bottom 50% of Americans",
    "description": "$2,100,000,000,000",
    "camera_position": {
      "x": two_p_one_trillion.position.x,
      "y": 0,
      "z": 1100
    },
    "object": two_p_one_trillion
  });

  three_p_four_trillion = value_to_cube(3400000000000);
  three_p_four_trillion.position.x = 6900;
  scene.add(three_p_four_trillion);

  objects.push({
    "title": "Cost of US Covid Relief Bills",
    "description": "$3,400,000,000,000",
    "camera_position": {
      "x": three_p_four_trillion.position.x,
      "y": 0,
      "z": 1300
    },
    "object": three_p_four_trillion
  });


  four_p_five_trillion = value_to_cube(4500000000000);
  four_p_five_trillion.position.x = 8000;
  scene.add(four_p_five_trillion);

  objects.push({
    "title": "Net Worth of 400 Wealthiest Americans",
    "description": "$4,500,000,000,000",
    "camera_position": {
      "x": four_p_five_trillion.position.x,
      "y": 0,
      "z": 1400
    },
    "object": four_p_five_trillion
  });
  var liberty_gltf = await modelLoader('liberty.glb');
  liberty = liberty_gltf.scene;
  liberty.position.x = 9000;
  scene.add(liberty);

  objects.push({
    "title": "Statue of Liberty",
    "description": "151 ft. tall",
    "camera_position": {
      "x": liberty.position.x,
      "y": four_p_five_trillion.position.y,
      "z": 1450
    },
    "object": liberty
  });

  // this same texture from here on out will be used for all cubes
  twenty_one_p_eigthy_five_trillion = value_to_cube(21850000000000);
  twenty_one_p_eigthy_five_trillion.position.x = 10500;
  scene.add(twenty_one_p_eigthy_five_trillion);

  objects.push({
    "title": "US GDP 2021",
    "description": "$21,850,000,000,000",
    "camera_position": {
      "x": twenty_one_p_eigthy_five_trillion.position.x,
      "y": 0,
      "z": 2500
    },
    "object": twenty_one_p_eigthy_five_trillion
  });

  twenty_eight_p_fifty_trillion = value_to_cube(28500000000000);
  twenty_eight_p_fifty_trillion.position.x = 12500;
  scene.add(twenty_eight_p_fifty_trillion);

  objects.push({
    "title": "US Debt 2021",
    "description": "$28,500,000,000,000",
    "camera_position": {
      "x": twenty_eight_p_fifty_trillion.position.x,
      "y": 0,
      "z": 2700
    },
    "object": twenty_eight_p_fifty_trillion
  });

  thirty_three_trillion = value_to_cube(33000000000000);
  thirty_three_trillion.position.x = 14500;
  scene.add(thirty_three_trillion);

  objects.push({
    "title": "Net Worth of 50th to 90th Percentile of Americans",
    "description": "$33,000,000,000,000",
    "camera_position": {
      "x": thirty_three_trillion.position.x,
      "y": 0,
      "z": 2800
    },
    "object": thirty_three_trillion
  });

  thirty_four_trillion = value_to_cube(34000000000000);
  thirty_four_trillion.position.x = 17000;
  scene.add(thirty_four_trillion);

  objects.push({
    "title": "Net worth of Top 1 Percent of Americans",
    "description": "$34,000,000,000,000",
    "camera_position": {
      "x": thirty_four_trillion.position.x,
      "y": 0,
      "z": 3000
    },
    "object": thirty_four_trillion
  });

  forty_three_trillion = value_to_cube(43000000000000);
  forty_three_trillion.position.x = 19500;
  scene.add(forty_three_trillion);

  objects.push({
    "title": "Net Worth of 90th to 99th Percentile of Americans",
    "description": "$43,000,000,000,000",
    "camera_position": {
      "x": forty_three_trillion.position.x,
      "y": 0,
      "z": 3200
    },
    "object": forty_three_trillion
  });


  forty_eight_trillion = value_to_cube(48000000000000);
  forty_eight_trillion.position.x = 22000;
  scene.add(forty_eight_trillion);

  objects.push({
    "title": "Cost of Limiting Global Warming to 1.5°C",
    "description": "$48,000,000,000,000",
    "camera_position": {
      "x": forty_eight_trillion.position.x,
      "y": 0,
      "z": 3300
    },
    "object": forty_eight_trillion
  });


  three_hundred_sixty_trillion = value_to_cube(360600000000000);
  three_hundred_sixty_trillion.position.x = 25500;
  scene.add(three_hundred_sixty_trillion);

  objects.push({
    "title": "Wealth of All of Humanity",
    "description": "$360,600,000,000,000",
    "camera_position": {
      "x": three_hundred_sixty_trillion.position.x,
      "y": 0,
      "z": 6500
    },
    "object": three_hundred_sixty_trillion
  });


  one_quadrillion = value_to_cube(1000000000000000);
  one_quadrillion.position.x = 31500;
  scene.add(one_quadrillion);

  objects.push({
    "title": "Low End Cost of Climate Change 2020-2100",
    "description": "$1,028,600,000,000,000",
    "camera_position": {
      "x": one_quadrillion.position.x,
      "y": 0,
      "z": 9000
    },
    "object": one_quadrillion
  });


  eleven_quadrillion = value_to_cube(11000000000000000);

  eleven_quadrillion.position.x = 43500;
  scene.add(eleven_quadrillion);

  objects.push({
    "title": "High End Cost of Climate Change 2020-2100",
    "description": "$11,870,000,000,000,000",
    "camera_position": {
      "x": eleven_quadrillion.position.x,
      "y": 0,
      "z": 20000
    },
    "object": eleven_quadrillion
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

  if (three_hundred_fifty_thousand) {
    three_hundred_fifty_thousand.rotation.z += 0.01;
  }

  if (one_million) {
    one_million.rotation.z += 0.01;
  }

  if (three_million_five_hundred_thousand) {
    three_million_five_hundred_thousand.rotation.z += 0.01;
  }
  if (six_million) {
    six_million.rotation.z += 0.01;
  }

  if (eighty_million) {
    eighty_million.rotation.y += 0.005;
  }

  if (human_1) {
    human_1.rotation.z += 0.01;
  }
  if (four_forty_million) {
    four_forty_million.rotation.y += 0.005;
  }
  if (one_p_four_billion) {
    one_p_four_billion.rotation.y += 0.005;
  }
  if (one_p_eight_billion) {
    one_p_eight_billion.rotation.y += 0.005;
  }
  if (seventy_billion) {
    seventy_billion.rotation.y += 0.005;
  }
  if (ninety_five_billion) {
    ninety_five_billion.rotation.y += 0.005;
  }
  if (one_thirty_four_billion) {
    one_thirty_four_billion.rotation.y += 0.005;
  }

  if (one_ninety_billion) {
    one_ninety_billion.rotation.y += 0.005;
  }

  if (two_hundred_one_billion) {
    two_hundred_one_billion.rotation.y += 0.005;
  }

  if (two_hundred_nine_billion) {
    two_hundred_nine_billion.rotation.y += 0.005;
  }

  if (two_hundred_seventy_three_billion) {
    two_hundred_seventy_three_billion.rotation.y += 0.005;
  }

  if (seven_hundred_five_billion) {
    seven_hundred_five_billion.rotation.y += 0.005;
  }

  if (one_p_three_trillion) {
    one_p_three_trillion.rotation.y += 0.005;
  }

  if (one_p_seven_four_trillion) {
    one_p_seven_four_trillion.rotation.y += 0.005;
  }

  if (two_p_one_trillion) {
    two_p_one_trillion.rotation.y += 0.005;
  }

  if (three_p_four_trillion) {
    three_p_four_trillion.rotation.y += 0.005;
  }

  if (four_p_five_trillion) {
    four_p_five_trillion.rotation.y += 0.005;
  }

  if(liberty){
    liberty.rotation.y += 0.005;
  }

  // texture upper limit, all textures from here and above will use the same texture
  if (twenty_one_p_eigthy_five_trillion) {
    twenty_one_p_eigthy_five_trillion.rotation.y += 0.005;
  }

  if (twenty_eight_p_fifty_trillion) {
    twenty_eight_p_fifty_trillion.rotation.y += 0.005;
  }

  if (thirty_three_trillion) {
    thirty_three_trillion.rotation.y += 0.005;
  }

  if (thirty_four_trillion) {
    thirty_four_trillion.rotation.y += 0.005;
  }

  if (forty_three_trillion) {
    forty_three_trillion.rotation.y += 0.005;
  }

  if (forty_eight_trillion) {
    forty_eight_trillion.rotation.y += 0.005;
  }

  if (three_hundred_sixty_trillion) {
    three_hundred_sixty_trillion.rotation.y += 0.005;
  }

  if (one_quadrillion) {
    one_quadrillion.rotation.y += 0.005;
  }

  if (eleven_quadrillion) {
    eleven_quadrillion.rotation.y += 0.005;
  }

};



init();
animate();


$(document).on('keyup', function (event) {

  if (event.keyCode === 39 && index < objects.length) {
    index++;
  } else if (event.keyCode === 37 && index > 0) {
    index--;
  } else {
    return;
  }


  canvasAnimate();

});

function canvasAnimate() {

  if (index == objects.length) {
    $(".end-page").css("left", "0px");
  } else if (index > 0) {
    $(".title-page").css("left", "-100%");
    $(".end-page").css("left", "100%");
    $(".item-title").text(objects[index].title);
    $(".item-description").text(objects[index].description);

    let object = objects[index].object;
    var y; 
    if(objects[index].camera_position.y != 0) {
      y = objects[index].camera_position.y
    }else{
      y = object.position.y;
    }

    let z = objects[index].camera_position.z;

    // arbitrary pixel cutoff to move the camera back
    // so that the object can be see in its entirety on smaller
    // screens
    if (screen_width < 780) {
      z = z * 1.5;
    }



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

// $('.go-right').on('click', () => {
//   index = 1;
//   canvasAnimate();
// });

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

  if (currentTranslate < -50 && index < objects.length) {
    index += 1;
  }

  if (currentTranslate > 50 && index > 0) {
    index -= 1;
  }

  currentTranslate = 0;

  canvasAnimate();

  isDragging = false;
}

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

(function () {
  const classes = document.body.classList;
  let timer = 0;
  window.addEventListener('resize', function () {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    else
      classes.add('stop-transitions');

    timer = setTimeout(() => {
      classes.remove('stop-transitions');
      timer = null;
    }, 100);
  });
})();