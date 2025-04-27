// Vertex shader program
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    }`;

// Fragment shader program
const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`;

// Global variables
let gl;
let canvas;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

// UI
var g_globalAngle = 0; // Camera
var g_jointAngle = 0; // Joint 1
// var head_animation = 0;
var g_jointAngle2 = 0; // Joint 2

var g_Animation = false;

// Animation
var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;



function main() {
    // set up webGL context
    setupWebGL();
    
    connectVariablesToGLSL();

    addActionsForHtmlUI();
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //renderScene();
    
    requestAnimationFrame(tick);
}

function setupWebGL() {
    // get the canvas element
    canvas = document.getElementById('webgl');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // get the webGL context
    gl = getWebGLContext(canvas, {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return null;
    }

    gl.enable(gl.DEPTH_TEST);
}

// connect js variables to glsl
function connectVariablesToGLSL() {
    // initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get u_GlobalRotateMatrix');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// set up event listeners
function addActionsForHtmlUI() {
    document.getElementById("start").onclick = function() {g_Animation = true;}
    document.getElementById("stop").onclick = function() {g_Animation = false;};

    document.getElementById("angleSlide").addEventListener("mousemove", function() { g_globalAngle = this.value; renderScene(); });
    document.getElementById("leftArmSlide").addEventListener("mousemove", function() { g_jointAngle = this.value; renderScene(); });
    document.getElementById("leftHandSlide").addEventListener("mousemove", function() { g_jointAngle2 = this.value; renderScene(); });
}

function tick(){
    g_seconds = performance.now()/1000.0 - g_startTime;
    console.log(g_seconds);

    updateAnimationAngle();

    renderScene();

    requestAnimationFrame(tick);
}

function updateAnimationAngle() {
    if (g_Animation) {
        g_jointAngle = (30*Math.sin(g_seconds));
    }
}

// render all shapes
function renderScene() {
    var startTime = performance.now();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var globalRotateMatrix = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotateMatrix.elements);

    // draw a cube 
    var body = new Cube();
    body.color = [1.0, 0.0, 0.0, 1.0];
    body.matrix.setTranslate(-0.25, -0.5, 0.0);
    body.matrix.scale(0.5, 1.0, 0.5);
    body.render();

    // draw left arm
    var leftArm = new Cube();
    leftArm.color = [1.0, 1.0, 0.0, 1.0];
    leftArm.matrix.setTranslate(0.35, 0.5, 0.0);
    leftArm.matrix.rotate(-135, 0, 0, 1);
    leftArm.matrix.rotate(g_jointAngle, 0, 0, 1);
    var leftArmCoords = new Matrix4(leftArm.matrix);
    leftArm.matrix.scale(0.25, 0.7, 0.5);
    leftArm.render();

    // draw left hand
    var leftHand = new Cube();
    leftHand.color = [.7, .7, 0.0, 1.0];
    leftHand.matrix = leftArmCoords;
    leftHand.matrix.translate(0.15, .65, 0.0);
    leftHand.matrix.rotate(45, 0, 0, 1);
    leftHand.matrix.rotate(g_jointAngle2, 0, 0, 1);
    leftHand.matrix.scale(0.15, 0.15, .5);
    leftHand.render();


    var duration = performance.now() - startTime;
    console.log('Render time: ' + duration.toFixed(2) + ' ms');
    //sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration));
}

// function sendTextToHTML(text, htmlID) {
//     var output = document.getElementById(htmlID);
//     if (!output) {
//         console.log("Failed to retrieve the <output> element");
//         return;
//     }
//     output.innerHTML = text;
// }