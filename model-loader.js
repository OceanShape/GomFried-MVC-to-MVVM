import { GLTFLoader } from "GLTFLoader";
import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

function reset(camera) {
    camera.position.set(0, 0, -20);
    camera.lookAt(0, 0, 0);
}

function updateCamera(camera) {
    if (GLOBAL.currentMode == Mode.DRIVING) {
        let droneCamera = GLOBAL.camera;

        let turn = GLOBAL.camera.getDirect();
        if (
            160 < GLOBAL.droneToTargetDirection &&
            GLOBAL.droneToTargetDirection < 260
        ) {
            turn += GLOBAL.droneToTargetDirection - 90;
        } else {
            turn -= GLOBAL.droneToTargetDirection;
        }
        let direct = getRadians(turn);
        let tilt = getRadians(droneCamera.getTilt());
        let tiltAbs = getRadians(Math.abs(droneCamera.getTilt()));
        camera.position.x =
            -GLOBAL.radius * Math.cos(tiltAbs) * Math.sin(-direct);
        camera.position.z =
            -GLOBAL.radius * Math.cos(tiltAbs) * Math.cos(-direct);
        camera.position.y = GLOBAL.radius * Math.sin(tilt);
        camera.lookAt(0, 0, 0);
    }
}

(function initModelLoader() {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
        canvas: (function () {
            let canvas = document.getElementById("model-loader");
            canvas.width = 800;
            canvas.height = 800;
            return canvas;
        })(),
        antialias: true,
        alpha: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;

    let camera = new THREE.PerspectiveCamera(30, 1);

    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.listenToKeyEvents(document.body);

    camera.position.set(0, 0, -GLOBAL.radius);
    camera.lookAt(0, 0, 0);

    let light = new THREE.DirectionalLight(0xffffff, 10); //조명
    scene.add(light);

    let loader = new GLTFLoader();
    loader.load("./data/drone/drone_indicator.glb", function (gltf) {
        scene.add(gltf.scene);
        renderer.render(scene, camera);
    });

    function animate() {
        requestAnimationFrame(animate);
        updateCamera(camera);
        //controls.update();
        renderer.render(scene, camera);
    }
    animate();
})();
