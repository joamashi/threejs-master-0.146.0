let start = null;
const blurs = Array.from(document.querySelectorAll('.blur')); // [.blur]
const gaussianBlurs = Array.from(document.querySelectorAll('.gaussianBlur'));
const duration = 600;
const easeCubicOut = (t) => 1 - (1 - t) * (1 - t) * (1 - t);

blurs.forEach((blur, i) => blur.startTime = i * 400);

function step(timestamp) {
    let reschedule = false;
    
    if (!start) start = timestamp;

    blurs.forEach((blur, i) => {
        const progress = timestamp - start - blur.startTime;
        let qouta;

        if (progress < 0) {
            quota = 0;
        } else if (progress > duration) {
            quota = 1;
        } else {
            quota = easeCubicOut(progress / duration);
        }

        if (blur.classList.contains('left') || blur.classList.contains('right')) {
            const left = blur.classList.contains('left');
            blur.style.transform = `translateX(${left ? '-' : ''}${(1 - quota) * 60}vmax`;
            gaussianBlurs[i].setAttribute("stdDeviation", `${(1.0001 - quota) * 180},0`);
        } else {
            const top = blur.classList.contains('top');
            blur.style.transform = `translateY(${top ? '-' : ''}${(1 - quota) * 60}vmax`;
            gaussianBlurs[i].setAttribute('stdDeviation', `0, ${(1.0001 - quota) * 180}`)
        }

        if (progress < duration) reschedule = true;
    })

    if (reschedule) {
        window.requestAnimationFrame(step);
    } else {
        document.body.classList.add('out');
    }
}

window.requestAnimationFrame(step);
document.body.addEventListener('click', () => {
    document.body.classList.remove('out');
    start = null;
    window.requestAnimationFrame(step);
})