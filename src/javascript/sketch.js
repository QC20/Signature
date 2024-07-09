const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

// Flag to detect if the mouse has moved
let mouseMoved = false;

// Pointer object to store the current mouse position
const pointer = {
    x: .5 * window.innerWidth,
    y: .5 * window.innerHeight,
};

// Parameters for the trail effect
const params = {
    pointsNumber: 52,
    widthFactor: .25,
    mouseThreshold: .6,
    spring: .4,
    friction: .5,
};

// Initialize the trail array with points at the pointer's initial position
const trail = new Array(params.pointsNumber);
for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
    };
}

// Event listeners to update the mouse position
window.addEventListener("click", e => {
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("mousemove", e => {
    mouseMoved = true;
    updateMousePosition(e.pageX, e.pageY);
});
window.addEventListener("touchmove", e => {
    mouseMoved = true;
    updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
});

// Function to update the pointer's position
function updateMousePosition(eX, eY) {
    pointer.x = eX;
    pointer.y = eY;
}

// Setup the canvas size and start the update loop
setupCanvas();
update(0);
window.addEventListener("resize", setupCanvas);

// Function to update the canvas on each frame
function update(t) {
    // Create an intro motion if the mouse has not moved
    if (!mouseMoved) {
        pointer.x = (.5 + .3 * Math.cos(.002 * t) * Math.sin(.005 * t)) * window.innerWidth;
        pointer.y = (.5 + .2 * Math.cos(.005 * t) + .1 * Math.cos(.01 * t)) * window.innerHeight;
    }

    // Clear the canvas for the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update the position of each point in the trail
    trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? .4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
    });

    // Draw the trail
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let i = 1; i < trail.length - 1; i++) {
        const xc = .5 * (trail[i].x + trail[i + 1].x);
        const yc = .5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
    }

    ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
    ctx.stroke();

    // Request the next animation frame
    window.requestAnimationFrame(update);
}

// Function to set up the canvas size
function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
