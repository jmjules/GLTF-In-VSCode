import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const renderer = new THREE.WebGLRenderer( {alpha: true, antialias: true} ); //alpha true allows for transparent background
renderer.outputColorSpace = THREE.SRGBColorSpace //this is the default
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("container3D").appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera =  new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 3, 3);
camera.lookAt(0, 0, 0)

//######## Add controls to the camera########
const controls = new OrbitControls(camera, renderer.domElement)

//############ Add lights #############
// const topLight = new THREE.DirectionalLight(0xffffff, 1);
// topLight.position.set(50, 50, 100);
// topLight.castShadow = true;
// scene.add(topLight);

const spotLight = new THREE.SpotLight(0xffffff, 20, 100, 0.2, 0.5);
spotLight.position.set(0, 6, 0);
scene.add(spotLight);

const ambientLight = new THREE.AmbientLight(0x333333, 2);
scene.add(ambientLight);

//########for tracking mouse cursor to let obj face it
// let mouseX = window.innerWidth / 2;
// let mouseY = window.innerHeight / 2;


//scene to render
let object;

// let objectToRender = "camera";
let objectToRender = "desk";

//######### load first GLTF file ###########
const loader = new GLTFLoader();
loader.load(
    `models/${objectToRender}/scene.gltf`,
    function ( gltf) {
        //load file to the scene
        object = gltf.scene;

        object.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })

        scene.add(object);
    },
    function (xhr) {
        //while it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    },
    function (error) {
        console.error(error);
    }
)


//######### Render the scene ###############
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
// function letObjTrackMouse(objName) {
//     if (object && objectToRender == objName) {
//             object.rotation.y = -3 + mouseX / window.innerWidth * 3;
//             object.rotation.x = -1.2 + mouseY * 2.5 / window.innerWidth;
//     }
// }


animate();


//=======end scene setup===========

const raycaster = new THREE.Raycaster();

document.addEventListener("pointerdown", onPointerDown);

function onPointerDown(event) {
    const colorOnClickValue = document.querySelector("#colorOnClick").checked;
    const canvas = document.querySelector("#container3D canvas")

    if (!colorOnClickValue | event.target !== canvas) {
        return;
    }
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

const loadButton = document.querySelector("#loadButton");
const selectElem = document.querySelector("#sceneSelect")
loadButton.addEventListener("click", onButtonClick)

function onButtonClick(event) {

    const selectedScene = selectElem.value;
    if (selectedScene == objectToRender) {
        return;
    }


    scene.remove(object)

    objectToRender = selectedScene;
    loader.load(
        `models/${objectToRender}/scene.gltf`,
        function ( gltf) {
            //load file to the scene
            object = gltf.scene;
            scene.add(object);
        })
}