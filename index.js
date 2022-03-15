const carousel = (() => {
    let navCirlceCounter = 1;

    const getAllImgs = () => document.getElementsByTagName('img');

    const getFirstTwoImgs = (imgArray) => {
        const [first, second] = imgArray;

        return [first, second];
    };

    const shiftImg = (img) => {
        img.classList.toggle('slide');
    };

    const moveImgs = function moveFirstImageToEnd(imgs) {
        const [firstImg, secondImg, thirdImg] = imgs;
        const container = firstImg.parentElement;
        secondImg.classList.toggle('transition');
        container.removeChild(firstImg);
        firstImg.classList.toggle('slide');
        secondImg.classList.toggle('slide');
        container.appendChild(firstImg);

        setTimeout(() => {
            secondImg.classList.toggle('transition');
        }, 500);
    };

    const getNavCircles = () => document.querySelectorAll('.fa-circle');

    const moveNavCirles = (navCirlces) => {
        const index = navCirlceCounter % navCirlces.length;
        navCirlces[index - 1].classList.toggle('active');
        navCirlces[index].classList.toggle('active');
        navCirlceCounter += 1;
    };

    const autoSlideshow = () => {
        const allImgs = getAllImgs();
        const firstTwoImgs = getFirstTwoImgs(allImgs);
        firstTwoImgs.forEach((img) => shiftImg(img));
        moveNavCirles(getNavCircles());
        setTimeout(() => {
            const allImgs = getAllImgs();
            moveImgs(allImgs);
        }, 500);
    };

    const autoNavCirlces = () => {};

    return { autoSlideshow };
})();

setInterval(() => carousel.autoSlideshow(), 5000);
