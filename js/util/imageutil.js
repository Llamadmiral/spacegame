function loadImages() {
    for (let i = 0; i < IMAGES.length; i++) {
        let currentImage = IMAGES[i];
        loadImage(currentImage);
    }
}

function loadImage(res) {
    let loadedImage = new Image();
    loadedImage.onload = function () {
        if (res.createRotaiton) {
            for (let i = 0; i < 4; i++) {
                let name = res.name + '_' + imageDirection[i];
                let rotatedImage = rotateImage(loadedImage, i * 90);
                let mirroredImage = mirrorImage(rotatedImage);
                LOADED_IMAGES[name] = new ImageDescriptor(name, rotatedImage, !!res.anim, res.numberOfFrames ? res.numberOfFrames : 1, res.animationLength ? res.animationLength : FPS)
                LOADED_IMAGES[name + '_mirrored'] = new ImageDescriptor(name + '_mirrored', mirroredImage, !!res.anim, res.numberOfFrames ? res.numberOfFrames : 1, res.animationLength ? res.animationLength : FPS)
            }
        } else {
            LOADED_IMAGES[res.name] = new ImageDescriptor(res.name, loadedImage, !!res.anim, res.numberOfFrames ? res.numberOfFrames : 1, res.animationLength ? res.animationLength : FPS);
        }
        if (res.selectable) {
            let img = generateSelectedImage(loadedImage);
            LOADED_IMAGES[res.name + '_selected'] = new ImageDescriptor(res.name + '_selected', img, !!res.anim, res.numberOfFrames ? res.numberOfFrames : 1, res.animationLength ? res.animationLength : FPS);
        }
        loadedImage.onload = null;
        loadedImages++;
        if (loadedImages === IMAGES.length) {
            console.log("All images loaded");
            imagesLoaded();
        }
    };
    loadedImage.src = res.src;
}

function mirrorImage(img) {
    let c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    let ctx = c.getContext("2d");
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, img.width * -1, img.height);
    let newImg = new Image(img.width, img.height);
    newImg.src = ctx.canvas.toDataURL("image/png");
    return newImg;
}

function rotateImage(img, angle) {
    let c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    let ctx = c.getContext("2d");
    ctx.translate(img.width / 2, img.height / 2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    let newImg = new Image(img.width, img.height);
    newImg.src = ctx.canvas.toDataURL("image/png");
    return newImg;
}

function hexToRgb(hex) {
    let long = parseInt(hex, 16);
    return {
        R: (long >>> 16) & 0xff,
        G: (long >>> 8) & 0xff,
        B: long & 0xff
    };
}

function generateSelectedImage(img) {
    let newColor = hexToRgb('ff0000');
    let c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    let ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
    let originalPixels = ctx.getImageData(0, 0, img.width, img.height);
    let currentPixels = ctx.getImageData(0, 0, img.width, img.height);
    for (let i = 0, l = originalPixels.data.length; i < l; i += 4) {
        if (currentPixels.data[i + 3] > 0) {
            currentPixels.data[i] = originalPixels.data[i] / 255 * newColor.R;
            currentPixels.data[i + 1] = originalPixels.data[i + 1] / 255 * newColor.G;
            currentPixels.data[i + 2] = originalPixels.data[i + 2] / 255 * newColor.B;
        }
    }

    ctx.putImageData(currentPixels, 0, 0);
    let newImg = new Image(img.width, img.height);
    newImg.src = ctx.canvas.toDataURL("image/png");
    return newImg;
}
