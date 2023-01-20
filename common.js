function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

function changeMode() {
    if (GLOBAL.isAllPOISet == false) {
        return;
    }
    if (GLOBAL.currentMode == Mode.SELECT) {
        setDrivingMode();
        includeHTML();
    } else {
        setSelectMode();
        includeHTML();
        clearIndicator();
    }
}

function keyReleaseCallback(event) {
    GLOBAL.keys[event.key] = false;
    for (key in GLOBAL.keys) {
        GLOBAL.keys[key] ? true : delete GLOBAL.keys[key];
    }
}

function keyPressCallback(event) {
    GLOBAL.keys[event.key] = true;

    let camera = GLOBAL.camera;
    let del = GLOBAL.droneDelta;

    if (GLOBAL.keys["w"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ front: del });
    }
    if (GLOBAL.keys["x"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ back: del });
    }

    if (GLOBAL.keys["d"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ right: del });
    }
    if (GLOBAL.keys["a"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ left: del });
    }

    if (GLOBAL.keys["c"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ up: del });
    }
    if (GLOBAL.keys["z"]) {
        GLOBAL.TRACE_TARGET.moveTarget({ down: del });
    }

    if (GLOBAL.keys["s"]) {
        GLOBAL.droneDelta = 10 / del;
    }

    GLOBAL.droneToTargetDirection = getTargetDirection();

    camera.setLocation(camera.getLocation());

    // start drawing vertical line
    let dronePos = getDronePosition();
    let rotatedPos = new Module.JSVector3D(dronePos.Longitude, dronePos.Latitude, dronePos.Altitude);
    let direct = getRadians(GLOBAL.camera.getDirect());
    rotatedPos.Longitude += 0.0001 * Math.sin(-direct);
    rotatedPos.Latitude += 0.0001 * Math.cos(-direct);
    console.log("dronePos: ", dronePos.Longitude, dronePos.Latitude, dronePos.Altitude)
    console.log("rotatedPos: ", rotatedPos.Longitude, rotatedPos.Latitude, rotatedPos.Altitude)

    drawVerticalLine(dronePos, "VERTICAL_LINE");

    drawVerticalLine(rotatedPos, "TEST");

    // end drawing vertical line

    // let pos = getDronePosition();
    // console.log(Module.getMap().getTerrHeightFast(pos.Longitude, pos.Latitude));

    Module.XDRenderData();
    // printDroneStatus();
    // printDroneCamera();
}

function mouseWheelCallback(event) {
    let deltaFOV = 1;
    let camera = GLOBAL.camera;
    let fov = camera.getFov();

    event.deltaY > 0 ? (fov += deltaFOV) : (fov -= deltaFOV);
    fov = clamp(fov, 10, 90);

    camera.setFov(fov);
    printDroneCamera();
}

function mouseMoveCallback(event) {
    if (GLOBAL.MOUSE_BUTTON_PRESS && event.buttons == 1) {
        GLOBAL.TRACE_TARGET.direction += event.movementX * 0.5;
        GLOBAL.TRACE_TARGET.tilt += event.movementY * 0.5;

        let dronePos = getDronePosition();
        let rotatedPos = new Module.JSVector3D(dronePos.Longitude, dronePos.Latitude, dronePos.Altitude);
        let direct = getRadians(GLOBAL.camera.getDirect());
        rotatedPos.Longitude += 0.0001 * Math.sin(-direct);
        rotatedPos.Latitude += 0.0001 * Math.cos(-direct);
    
        drawVerticalLine(rotatedPos, "TEST");
    }

    printDroneCamera();
}

function mouseUpCallback() {
    GLOBAL.MOUSE_BUTTON_PRESS = false;
}

function mouseDownCallback() {
    GLOBAL.MOUSE_BUTTON_PRESS = true;
}

/* 마우스 & 키보드 이벤트 설정 */
function addSelectModeEvent() {
    Module.canvas.addEventListener("click", mouseClickCallback);
}

function removeSelectModeEvent() {
    Module.canvas.removeEventListener("click", mouseClickCallback);
}

function addDrivingModeEvent() {
    window.addEventListener("keypress", keyPressCallback);
    window.addEventListener("keyup", keyReleaseCallback);
    Module.canvas.addEventListener("mousemove", mouseMoveCallback);
    Module.canvas.addEventListener("mousewheel", mouseWheelCallback);
    Module.canvas.addEventListener("mouseup", mouseUpCallback);
    Module.canvas.addEventListener("mousedown", mouseDownCallback);
}

function removeDrivingModeEvent() {
    window.removeEventListener("keypress", keyPressCallback);
    Module.canvas.removeEventListener("mousemove", mouseMoveCallback);
    Module.canvas.removeEventListener("mousewheel", mouseWheelCallback);
}

function setItemValue(_div, _value) {
    let value =
        typeof _value == "number" ? "" + parseFloat(_value).toFixed(6) : _value;
    document.getElementById(_div).value = value;
}
