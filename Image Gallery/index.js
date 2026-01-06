let galleryImages = document.querySelectorAll("#gallery img");
let fullscreen = document.getElementById("fullscreen");
let bigImg = document.getElementById("bigImg");
let leftArrow = document.getElementById("left");
let rightArrow = document.getElementById("right");
let currentIndex = 0;


galleryImages.forEach((img, index) => {
    img.onclick = function () {
        currentIndex = index;
        bigImg.src = this.src; // show clicked image
        fullscreen.style.display = "flex"; // make fullscreen visible
    };
});

fullscreen.addEventListener("click", function (e) {
    if (e.target === fullscreen) {
        fullscreen.style.display = "none";
    }
});


leftArrow.onclick = function () {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    bigImg.src = galleryImages[currentIndex].src;
};

rightArrow.onclick = function () {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    bigImg.src = galleryImages[currentIndex].src;
};      