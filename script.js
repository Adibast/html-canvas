const container = document.querySelector('.canvas-container');
const canvas = document.querySelector('#draw');
const context = canvas.getContext('2d');
const color = document.querySelector('#color-picker');
const rainbow = document.querySelector('#rainbow-color-button');
const size = document.querySelector('.slider');
const sizeLabel = document.querySelector('.size-number');
const autoSize = document.querySelector('#automatic-size');
const effects = document.querySelector('#effects-list');
const effectTitle = document.querySelector('.effect-title');
const effectDescription = document.querySelector('#description');
const description = [
    {
        'source-over': 'This is the default setting and draws new shapes on top of the existing canvas content.',
        'destination-over' : 'New shapes are drawn behind the existing canvas content.',
        'lighter' : 'Where both shapes overlap the color is determined by adding color values.',
        'xor' : 'Shapes are made transparent where both overlap and drawn normal everywhere else.',
        'multiply' : 'The pixels of the top layer are multiplied with the corresponding pixel of the bottom layer. A darker picture is the result.',
        'screen' : 'The pixels are inverted, multiplied, and inverted again. A lighter picture is the result (opposite of multiply)',
        'overlay' : 'A combination of multiply and screen. Dark parts on the base layer become darker, and light parts become lighter.',
        'darken' : 'Retains the darkest pixels of both layers.',
        'lighten' : 'Retains the lightest pixels of both layers.',
        'color-dodge' : 'Divides the bottom layer by the inverted top layer.',
        'color-burn' : 'Divides the inverted bottom layer by the top layer, and then inverts the result.',
        'hard-light' : 'A combination of multiply and screen like overlay, but with top and bottom layer swapped.',
        'soft-light' : 'A softer version of hard-light. Pure black or white does not result in pure black or white.',
        'difference' : 'Subtracts the bottom layer from the top layer or the other way round to always get a positive value.',
        'exclusion' : 'Like difference, but with lower contrast.',
        'hue' : 'Preserves the luma and chroma of the bottom layer, while adopting the hue of the top layer.',
        'saturation' : 'Preserves the luma and hue of the bottom layer, while adopting the chroma of the top layer.',
        'color' : 'Preserves the luma of the bottom layer, while adopting the hue and chroma of the top layer.',
        'luminosity' : 'Preserves the hue and chroma of the bottom layer, while adopting the luma of the top layer.',
    }
];

canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;
context.lineJoin = 'round';
context.lineCap = 'round';

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let rect = 0;
let touchX = 0;
let touchY = 0;
let hue = 0;
let direction = true;
let automaticSize = false;
let automaticColor = false;
let effectsOn = false;

function draw(e) {
    let offsetX, offsetY;

    if (e.type === 'mousedown' || e.type === 'mousemove') {
        offsetX = e.clientX - canvas.getBoundingClientRect().left;
        offsetY = e.clientY - canvas.getBoundingClientRect().top;
    } else if (e.type === 'touchstart' || e.type === 'touchmove') {
        offsetX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
        offsetY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    } else {
        return;
    }

    if (!isDrawing) return;
    if (automaticColor) {
        context.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    } else {
        context.strokeStyle = color.value;
    }
    if (!automaticSize) {
        context.lineWidth = size.value;
        size.addEventListener('change', () => sizeLabel.textContent = `${size.value}`)
    }

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(offsetX, offsetY);

    context.stroke();
    context.globalCompositeOperation = effects.value;
    [lastX, lastY] = [offsetX, offsetY];

    hue++;
    if (hue >= 360) {
        hue = 0;
    }
    
    if (context.lineWidth >= 100 || context.lineWidth <= 1) {
        direction = !direction
    }
    if (direction) {
        context.lineWidth++
    } else {
        context.lineWidth--
    }
    sizeLabel.textContent = context.lineWidth;
};

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY]
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);
autoSize.addEventListener('click', () => {
    automaticSize = !automaticSize;
    if (!automaticSize) {
        autoSize.textContent = 'Off';
    } else {
        autoSize.textContent = 'On';
    }
});
rainbow.addEventListener('click', () => {
    automaticColor = !automaticColor;
    if (!automaticColor) {
        rainbow.textContent = 'Off';
    } else {
        rainbow.textContent = 'On';
    }
});
effects.addEventListener('change', () => {
    if (effects.value == '') {
        effectTitle.innerHTML = '';
        effectDescription.innerHTML = 'Select an option from the dropdown list to set the type of compositing operation to apply when drawing new shapes.';
    } else {
        effectTitle.innerHTML = `${effects.value}:`;
        effectDescription.innerHTML = `${description[0][`${effects.value}`]}`;
    }
});

canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    touchX = e.touches[0].clientX - rect.left;
    touchY = e.touches[0].clientY - rect.top;
    [lastX, lastY] = [touchX, touchY];
});
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', () => isDrawing = false);
canvas.addEventListener('touchleave', () => isDrawing = false);
document.querySelector('.credit').addEventListener('click', () => window.open('https://www.google.com', '_blank'))