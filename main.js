import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera =  new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = objectToRender === "camera" ? 5 : 0;
camera.position.z = 5;

//########for tracking mouse cursor to let obj face it
// let mouseX = window.innerWidth / 2;
// let mouseY = window.innerHeight / 2;



let object;

let controls;

// let objectToRender = "camera";
let objectToRender = "desk";


const loader = new GLTFLoader();
loader.load(
    `models/${objectToRender}/scene.gltf`,
    function ( gltf) {
        //load file to the scene
        object = gltf.scene;
        scene.add(object);
    },
    function (xhr) {
        //while it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    },
    function (error) {
        //if there is an error, log it
        console.error(error);
    }
)


const renderer = new THREE.WebGLRenderer( {alpha: true} ); //alpha true allows for transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("container3D").appendChild(renderer.domElement);




const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(50, 50, 500); //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

// const ambientLight = new THREE.AmbientLight(0x333333, objectToRender == "camera" ? 5 : 1);
const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);



//########Add controls to the camera########
// if (objectToRender == "camera") {
//     controls = new OrbitControls(camera, renderer.domElement)
// }
controls = new OrbitControls(camera, renderer.domElement)


//Render the scene
function animate() {
    requestAnimationFrame(animate)
    // letObjTrackMouse("trackedObjName")
    renderer.render(scene, camera);
}

window.addEventListener("resize", function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

// document.onmousemove = (e) => {
//     mouseX = e.clientX;
//     mouseY = e.clientY;
// }
//####Let object face mouse cursor, need to activate mouseX/Y for this to work
function letObjTrackMouse(objName) {
    if (object && objectToRender == objName) {
            object.rotation.y = -3 + mouseX / window.innerWidth * 3;
            object.rotation.x = -1.2 + mouseY * 2.5 / window.innerWidth;
    }
}


animate();


//=======end scene setup===========


const raycaster = new THREE.Raycaster();

document.addEventListener("pointerdown", onPointerDown);

function onPointerDown(event) {
    const coords = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 -1,
        -((event.clientY / renderer.domElement.clientHeight) * 2 -1)
    );

    raycaster.setFromCamera(coords, camera)

    const intersections = raycaster.intersectObjects(scene.children, true);
    if (intersections.length > 0) {
        const selectedObject = intersections[0].object;
        console.log(selectedObject);
        const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        selectedObject.material.color = color;

    }
}