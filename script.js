const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 300;
canvas.height = 200;

// Array of possible gift messages
const giftMessages = [
    "Congratulations! You won a $10 Gift Card!",
    "You won a Free Coffee!",
    "You won a 20% Discount!",
    "You won a Free Movie Ticket!",
    "You won a Surprise Gift!",
    "Better Luch Next Time",
];

// Select a random gift message
const randomGiftMessage = giftMessages[Math.floor(Math.random() * giftMessages.length)];

// Draw the hidden gift message on the canvas
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = '16px Arial';
ctx.fillStyle = '#fff';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(randomGiftMessage, canvas.width / 2, canvas.height / 2);

// Add the scratch-off layer
ctx.globalCompositeOperation = 'source-over';
ctx.fillStyle = '#888';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isScratching = false;

canvas.addEventListener('mousedown', function() {
    isScratching = true;
});

canvas.addEventListener('mouseup', function() {
    isScratching = false;
    checkIfScratchedEnough();
});

canvas.addEventListener('mousemove', function(e) {
    if (!isScratching) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
});

function checkIfScratchedEnough() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let scratchedPixels = 0;
    const totalPixels = imageData.width * imageData.height;

    for (let i = 0; i < totalPixels * 4; i += 4) {
        if (imageData.data[i + 3] === 0) {
            scratchedPixels++;
        }
    }

    // Reveal the gift message if more than 50% is scratched
    if (scratchedPixels / totalPixels > 0.5) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over'; // Reset the composite operation
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.fillText(randomGiftMessage, canvas.width / 2, canvas.height / 2);
    }
}
