const container = document.querySelector('.slider');

document.querySelector('.slider__range').addEventListener('input', (e) => {
container.style.setProperty ('--position', `${e.target.value}%`);
})


console.log('Пивет!');
