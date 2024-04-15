// Asgn1 CSE160 4/14/2024
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_Size;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = u_Size;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

// Constants 
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;

//Set up action for the HTML UI elements
function addActionsForHtmlUI() {

    //Button Events (shape Type)
    document.getElementById('clearButton').onclick = function () { g_shapesList = []; renderAllShapes(); };

    document.getElementById('pointButton').onclick = function () { g_selectedType = POINT };
    document.getElementById('triButton').onclick = function () { g_selectedType = TRIANGLE };
    document.getElementById('circleButton').onclick = function () { g_selectedType = CIRCLE };

    //slider Events
    document.getElementById('redSlide').addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function () { g_selectedColor[2] = this.value / 100; });

    //Size Slider Events
    document.getElementById('sizeSlide').addEventListener('mouseup', function () { g_selectedSize = this.value; });


    //drawing event
    document.getElementById('draw').onclick = function () { drawing(); };
}
function main() {
    console.log("CSE160 Asgn 1 Junhao Lai")

    //Set up canvas and gl variables
    setupWebGL();
    //Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    //Set up actions for the HTML UI elements
    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    //canvas.onmousemove = click;
    canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev) } };
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];
function click(ev) {
    let [x, y] = convertCoordinatesEventToGL(ev);

    let point;
    if (g_selectedType == POINT) {
        point = new Point();
    } else if (g_selectedType == TRIANGLE) {
        point = new Triangle();
    } else {
        point = new Circle();
    }
    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);

    renderAllShapes();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}

function renderAllShapes() {
    // Clear <canvas>
    var startTime = performance.now();
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_shapesList.length;
    for (var i = 0; i < len; i++) {

        g_shapesList[i].render();
    }
    var duration = performance.now() - startTime;
    sendTexttoHTML("numdot: " + len + " ms: " + Math.floor(duration) + " FPS: " + Math.floor(10000 / duration), "numdot");
}

function sendTexttoHTML(text, htmlID) {
    var htmlElem = document.getElementById(htmlID);
    if (!htmlElem) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElem.innerHTML = text;

}


//   function drawing(){
//     renderAllShapes();
//     const P1 = new Point();
//     P1.type = 'point';
//     P1.position = [-1, -1];
//     P1.color = [0.1, 0.6, 0.5, 1];
//     P1.size = 100.0;
//     g_shapesList[0] = P1;

//     renderAllShapes();
//   }

function drawing() {
    //clear the canvas to draw the sample 
    g_shapesList = [];
    renderAllShapes();
    canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas);
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // default black
    gl.clear(gl.COLOR_BUFFER_BIT);

    var point = new Point();
    point.size = 800;
    point.position = [0, 0, 0.0];
    point.color = [0, 0, 0, 1];
    g_shapesList[0] = point;

    var p2 = new Point();
    p2.size = 65;
    p2.type = 'point';
    p2.position = [0.445, -0.35, 0.0];
    p2.color = [0.6, 0.4, 0.8, 1]
    g_shapesList[1] = p2;

    var p3 = new Point();
    p3.size = 65;
    p3.type = 'point';
    p3.position = [0.445, -0.5, 0.0];
    p3.color = [0.8, 0.8, 0.8, 1];
    g_shapesList[2] = p3;

    var p3 = new Triangle();
    p3.size = 35;
    p3.type = 'point';
    p3.position = [0.445, -0.2, 0.0];
    p3.color = [0.8, 0.8, 0.8, 1];
    g_shapesList[2] = p3;
    // right rainbow starts 
    var p4 = new Point();
    p4.size = 65;
    p4.type = 'point';
    p4.position = [0.9, 0.9, 0.0];
    p4.color = [1, 0, 0, 1];
    g_shapesList[3] = p4;

    var p5 = new Point();
    p5.size = 65;
    p5.type = 'point';
    p5.position = [0.9, 0.6, 0.0];
    p5.color = [1, 0.5, 0, 1];
    g_shapesList[4] = p5;

    var p6 = new Point(); // 3rd
    p6.size = 65;
    p6.type = 'point';
    p6.position = [0.9, 0.3, 0.0];
    p6.color = [1, 1, 0, 1];
    g_shapesList[5] = p6;

    var p7 = new Point();
    p7.size = 65;
    p7.type = 'point';
    p7.position = [0.9, 0.0, 0.0];
    p7.color = [0, 1, 0, 1];
    g_shapesList[6] = p7;

    var p8 = new Point(); //5th color 
    p8.size = 65;
    p8.type = 'point';
    p8.position = [0.9, -0.3, 0.0];
    p8.color = [0, 0.5, 1, 1];
    g_shapesList[7] = p8;


    var p9 = new Point(); //6th color 
    p9.size = 65;
    p9.type = 'point';
    p9.position = [0.9, -0.6, 0.0];
    p9.color = [0.5, 0, 1, 1];
    g_shapesList[8] = p9;


    var p10 = new Point(); //7th color 
    p10.size = 65;
    p10.type = 'point';
    p10.position = [0.9, -0.9, 0.0];
    p10.color = [0.5, 0, 0.5, 1];
    g_shapesList[9] = p10;
    // ---------------------- right side rainbow ends

    //Left  rainbow starts 
    var p11 = new Point();
    p11.size = 65;
    p11.type = 'point';
    p11.position = [-0.9, 0.9, 0.0];
    p11.color = [1, 0, 0, 1];
    g_shapesList[10] = p11;

    var p12 = new Point();
    p12.size = 65;
    p12.type = 'point';
    p12.position = [-0.9, 0.6, 0.0];
    p12.color = [1, 0.5, 0, 1];
    g_shapesList[11] = p12;

    var p13 = new Point(); // 3rd
    p13.size = 65;
    p13.type = 'point';
    p13.position = [-0.9, 0.3, 0.0];
    p13.color = [1, 1, 0, 1];
    g_shapesList[12] = p13;

    var p14 = new Point();
    p14.size = 65;
    p14.type = 'point';
    p14.position = [-0.9, 0.0, 0.0];
    p14.color = [0, 1, 0, 1];
    g_shapesList[13] = p14;

    var p15 = new Point(); //5th color 
    p15.size = 65;
    p15.type = 'point';
    p15.position = [-0.9, -0.3, 0.0];
    p15.color = [0, 0.5, 1, 1];
    g_shapesList[14] = p15;

    var p16 = new Point(); //6th color 
    p16.size = 65;
    p16.type = 'point';
    p16.position = [-0.9, -0.6, 0.0];
    p16.color = [0.5, 0, 1, 1];
    g_shapesList[15] = p16;


    var p17 = new Point(); //7th color 
    p17.size = 65;
    p17.type = 'point';
    p17.position = [-0.9, -0.9, 0.0];
    p17.color = [0.5, 0, 0.5, 1];
    g_shapesList[16] = p17;

    // end of left side rainbow 

    var t1 = new Triangle();
    t1.size = 65;
    t1.position = [0, -0.9, 0.0];
    t1.color = [0, 1, 0, 1];
    g_shapesList[17] = t1;


    var c1 = new Circle();
    c1.size = 30;
    c1.segments = 30;
    c1.position = [0, -0.5, 0.0];
    c1.color = [1, 1, 1, 1];
    g_shapesList[18] = c1;

    // ----------------------
    var P95 = new Circle();
    P95.size = 22;
    P95.segments = 30;
    P95.position = [0, 0, 0.0];
    P95.color = [1, 1, 1, 1];
    g_shapesList[19] = P95;


    var P96 = new Circle();
    P96.size = 15;
    P96.segments = 30;
    P96.position = [0.1, 0.11, 0.0];
    P96.color = [1, 1, 1, 1];
    g_shapesList[20] = P96;

    var P97 = new Circle();
    P97.size = 15;
    P97.segments = 30;
    P97.position = [-0.1, 0.11, 0.0];
    P97.color = [1, 1, 1, 1];
    g_shapesList[21] = P97;
    renderAllShapes();
}
