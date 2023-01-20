function setDrivingMode() {
    let control = Module.getControl();
    let startPos = GLOBAL.POIPosition[0];
    let endPos = GLOBAL.POIPosition[1];
    startPos.Altitude += 10;

    let camera = GLOBAL.camera;
    camera.setMoveMode(true);
    camera.moveLonLatAlt(
        startPos.Longitude,
        startPos.Latitude,
        startPos.Altitude,
        true
    );
    camera.look(startPos, endPos);
    // set drone direction code is in common.js

    if (GLOBAL.isGhostSymbolLoaded == false) {
        loadModel(startPos);
        GLOBAL.isGhostSymbolLoaded = true;
    } else {
        setTraceTarget(startPos);
    }

    drawArrow(endPos);

    control.setKeyControlEnable(false);
    control.setMouseZoomMode(false);
    removeSelectModeEvent();
    addDrivingModeEvent();

    let layer = Module.getTileLayerList().nameAtLayer("facility_build");
    let pick = layer.getPickInfoAtView(
        new Module.JSVector3D(126.916589, 37.531051, 20.0),
        new Module.JSVector3D(126.917843, 37.531267, 20.0)
    );
    layer.SetDefineMeshColorByObjectKey(
        pick.objectKey,
        2,
        new Module.JSColor(0, 255, 0),
        false
    );

    GLOBAL.currentMode = Mode.DRIVING;

    document.getElementById("model-loader").style.visibility = "visible";
}

function clearGhostSymbol() {
    GLOBAL.layerList
        .nameAtLayer("GHOST_SYMBOL_LAYER")
        .removeAtKey("DRONE_DRIVING");
}

function loadModel(startPos) {
    Module.getGhostSymbolMap().insert({
        id: "DRONE",
        url: "./data/drone/drone_simulator.3ds",
        callback: function (e) {
            setTraceTarget(startPos);
        },
    });
}

function setTraceTarget(startPos) {
    let model = Module.createGhostSymbol("DRONE_DRIVING");
    model.setBasePoint(0.0, 0.0, 0.0);
    model.setScale(new Module.JSSize3D(0.2, 0.2, 0.2));
    model.setGhostSymbol("DRONE");
    model.setPosition(startPos);
    GLOBAL.layerList.nameAtLayer("GHOST_SYMBOL_LAYER").addObject(model, 0);

    GLOBAL.droneToTargetDirection = getTargetDirection();

    let traceTarget = Module.createTraceTarget(model.getId());
    traceTarget.set({
        object: model,
        tilt: 10.0,
        direction: GLOBAL.droneToTargetDirection,
        distance: 200.0,
    });

    GLOBAL.TRACE_TARGET = traceTarget;

    let camera = Module.getViewCamera();
    camera.setTraceTarget(GLOBAL.TRACE_TARGET);
    camera.setTraceActive(true);

    drawVerticalLine(getDronePosition(), "VERTICAL_LINE");
}

function drawArrow(target) {
    target.Altitude += 30;

    let arrow = Module.CreateArrow("ARROW");
    arrow.Create(
        target,
        0.0,
        90.0,
        10,
        1,
        0.2,
        2.0,
        new Module.JSColor(255, 255, 0, 0)
    );

    GLOBAL.layerList.nameAtLayer("POI_LAYER").addObject(arrow, 0);
}

function drawVerticalLine(startPos, id) {
    let layer = GLOBAL.layerList.nameAtLayer("VERTICAL_LINE_LAYER");
    if (layer == null) {
        layer = GLOBAL.layerList.createLayer(
            "VERTICAL_LINE_LAYER",
            Module.ELT_3DLINE
        );
    } else {
        layer.removeAtKey(id);
    }

    let line = Module.createLineString(id);

    let vertices = new Module.JSVec3Array();
    vertices.push(startPos);
    startPos.Altitude = 0.0;
    vertices.push(startPos);

    let part = new Module.Collection();
    part.add(2);

    line.setPartCoordinates(vertices, part);
    line.setUnionMode(false);

    // 폴리곤 색상 설정
    let lineStyle = new Module.JSPolyLineStyle();
    lineStyle.setColor(new Module.JSColor(100, 0, 0, 255));
    lineStyle.setWidth(2.0);
    line.setStyle(lineStyle);

    layer.addObject(line, 0);
}

function printDroneStatus() {
    let pos = GLOBAL.camera.getLocation();
    setItemValue("driving_longitude", pos.Longitude);
    setItemValue("driving_latitude", pos.Latitude);
    setItemValue("driving_altitude", pos.Altitude);
    setItemValue("driving_drone_direct", GLOBAL.droneDirection);
}

function printDroneCamera() {
    let camera = GLOBAL.camera;
    setItemValue("driving_tilt", camera.getTilt());
    setItemValue("driving_direct", camera.getDirect());
    setItemValue("driving_fov", camera.getFov());
}
