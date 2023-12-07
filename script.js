// Variables
let cocossd; // object detector
let objects = [];

let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx;

const startBtn = document.getElementById("startCam");
const stopBtn = document.getElementById("#stopCam");

let WIDTH = 640;
let HEIGHT = 480;

let liveStatus = false;

async function startCam() { // 4
    await h_setupCamera();
    h_setupCanvas(WIDTH, HEIGHT);
    h_setupCamera(WIDTH, HEIGHT);
    ctx = canvas.getContext('2d');
    cocossd = await ml5.objectDetector('cocossd', startDetecting);
}

async function startDetecting() { // 4
    video.setAttribute("style", "display: none;");

    liveStatus = true;
    while (liveStatus) {
        await detect();
    }
}

async function detect() { // 3
    await cocossd.detect(video, (err, results) => {
        if (err) {
            console.log(err);
        }

        objects = results;
        h_draw();
    });
}

function stopCam() { // 4
    liveStatus = false;

    let tracks = video.srcObject.getTracks();
    tracks.forEach((track) => {
        track.stop();
    });

    video.removeAttribute('srcObject');
}

/* Helper Functions */

async function h_setupCamera() {
    // get video from webcam
    const stream = await navigator.mediaDevices.getUserMedia({ 'video': true });
    video.srcObject = stream;
    video.play();
}

function h_setupCanvas(w, h) {
    canvas.width = w;
    canvas.height = h;
}

function h_draw() {
    if (!objects) {
        objects = []
    }
    // clear screen
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // draw video
    ctx.drawImage(video, 0, 0);
    
    // draw detections
    for (let i = 0; i < objects.length; i += 1) {
        // words
        ctx.font = "24px Arial";
        ctx.fillStyle = "green";
        ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y - 5);
        
        // boxes
        ctx.beginPath();
        ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.closePath();
    }
}