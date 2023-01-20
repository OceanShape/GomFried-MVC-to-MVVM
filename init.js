//import * as model from "./model-loader.js";

function init() {
    Module.Start(window.innerWidth, window.innerHeight);

    GLOBAL.camera = Module.getViewCamera();
    camera = GLOBAL.camera;

    Module.XDEMapCreateLayer(
        "facility_build",
        "https://xdworld.vworld.kr",
        0,
        true,
        true,
        false,
        9,
        0,
        15
    );

    GLOBAL.layerList = new Module.JSLayerList(true);
    let layerList = GLOBAL.layerList;
    let POILayer = layerList.createLayer("POI_LAYER", Module.ELT_3DPOINT);
    POILayer.setMinDistance(0.0);
    POILayer.setMaxDistance(100000000);
    layerList.createLayer("GHOST_SYMBOL_LAYER", Module.ELT_GHOST_3DSYMBOL);
    GLOBAL.images = [];
    GLOBAL.POIPosition = [];

    setSelectMode();

    camera.setLocation(
        new Module.JSVector3D(
            126.91534283205316,
            37.53060216016567,
            836.298700842075
        )
    );

    includeHTML();
    document.getElementById("model-loader").style.visibility = "hidden";
}

// HTML include
function includeHTML() {
    var includeElements = document.getElementsByClassName("include-html");
    for (var element of includeElements) {
        var xhttp;
        var file =
            GLOBAL.currentMode == Mode.SELECT
                ? GLOBAL.selectModePath
                : GLOBAL.drivingModePath;
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        element.innerHTML = this.responseText;
                    }
                    if (this.status == 404) {
                        element.innerHTML = "Page not found.";
                    }
                }
            };
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}

// 엔진 파일 로드
(function () {
    // 1. XDWorldEM.asm.js 파일 로드
    var file = GLOBAL.engineDirectory + "XDWorldEM.asm.js";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", file, true);
    xhr.onload = function () {
        var script = document.createElement("script");
        script.innerHTML = xhr.responseText;
        document.body.appendChild(script);

        // 2. XDWorldEM.html.mem 파일 로드
        setTimeout(function () {
            (function () {
                var memoryInitializer =
                    GLOBAL.engineDirectory + "XDWorldEM.html.mem";
                var xhr = (Module["memoryInitializerRequest"] =
                    new XMLHttpRequest());
                xhr.open("GET", memoryInitializer, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = function () {
                    // 3. XDWorldEM.js 파일 로드
                    var url = GLOBAL.engineDirectory + "XDWorldEM.js";
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", url, true);
                    xhr.onload = function () {
                        var script = document.createElement("script");
                        script.innerHTML = xhr.responseText;
                        document.body.appendChild(script);
                    };
                    xhr.send(null);
                };
                xhr.send(null);
            })();
        }, 1);
    };
    xhr.send(null);
})();

var Module = {
    TOTAL_MEMORY: 256 * 1024 * 1024,
    postRun: [init],
    canvas: (function () {
        // Canvas 엘리먼트 생성
        var canvas = document.createElement("canvas");

        // Canvas id, Width, height 설정
        canvas.id = "canvas";
        canvas.width = "calc(100%)";
        canvas.height = "100%";

        // Canvas 스타일 설정
        canvas.style.position = "fixed";
        canvas.style.top = "0px";
        canvas.style.left = "0px";

        // contextmenu disabled
        canvas.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        });

        // 생성한 Canvas 엘리먼트를 body에 추가합니다.
        document.body.appendChild(canvas);
        return canvas;
    })(),
};

window.onresize = function () {
    if (typeof Module == "object") {
        Module.Resize(window.innerWidth, window.innerHeight);
        Module.XDRenderData();
    }
};
