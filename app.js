const linkContainer = Array.from(document.querySelector('header > nav').children);
const buttonsContainer = Array.from(document.querySelector('.planetDescription .buttonsContainer').children);
const headerElement = document.querySelector('header');
const startupPlanet = 'mercury';
const imageContainer = document.querySelector('.imageContainer');
const burgerIcon = document.querySelector('.burger');

// ვარქმევთ currentPlanetData-ს, რომ PlanetsData.js-ის planetsData-ს არ დაემთხვეს
let currentPlanetData = {};

initializeEvents();
setStartupData();
window.dispatchEvent(new Event('resize'));

function initializeEvents() {
    window.addEventListener('resize', () => {
        const scale = innerWidth > 1920 ? Math.max(1, Math.min(innerWidth / 1920, innerHeight / 1080)) : 1;
        document.documentElement.style.setProperty('--app-scale', `${scale}`);
    });

    linkContainer.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();

            linkContainer.forEach(item => item.classList.remove('active'));
            el.classList.add('active');

            const planetKey = el.getAttribute('value');

            if (planetKey === 'saturn') {
                imageContainer.classList.add('isSaturn');
            } else {
                imageContainer.classList.remove('isSaturn');
            }

            getPlanetData(planetKey);

            buttonsContainer.forEach(btn => btn.classList.remove('active'));
            buttonsContainer[0].classList.add('active');

            document.querySelector('header > nav').classList.remove('visible');
            burgerIcon.classList.remove('clicked');
            imageContainer.classList.remove('transition');
        });
    });

    buttonsContainer.forEach(el => {
        el.addEventListener('click', () => {
            buttonsContainer.forEach(btn => btn.classList.remove('active'));
            el.classList.add('active');

            // ვიღებთ მიმდინარე პლანეტის შესაბამისი ტაბის ტექსტს (overview / internal / surface)
            document.querySelector('#description').innerText = currentPlanetData.description[el.id];

            const classToDelete = Array.from(imageContainer.classList).filter(
                className => className !== 'imageContainer' && className !== 'isSaturn' && className !== 'transition'
            );
            if (classToDelete.length > 0) {
                imageContainer.classList.remove(...classToDelete);
            }
            imageContainer.classList.add(el.id);
            imageContainer.classList.add('transition');
        });
    });

    burgerIcon.addEventListener('click', () => {
        const nav = document.querySelector('header > nav');
        nav.classList.toggle('visible');
        burgerIcon.classList.toggle('clicked');
    });
}

function setStartupData() {
    linkContainer.find(el => el.getAttribute('value') === startupPlanet).classList.add('active');
    getPlanetData(startupPlanet);
}

function getPlanetData(value) {
    // პირდაპირ PlanetsData.js-ში არსებული planetsData ობიექტიდან ვიღებთ მონაცემს
    const res = planetsData[value];
    if (res) {
        setHTMLData(res);
    }
}

function setHTMLData(data) {
    currentPlanetData = data;

    Object.keys(data).forEach(el => {
        const targetElement = document.querySelector(`#${el}`);
        if (!targetElement) return;

        if (el === 'description') {
            targetElement.innerText = data[el]['overview'];
        } else {
            targetElement.innerText = data[el];
        }
    });

    document.querySelector('#imageSrc').src = `./assets/planets/${data.title}/${data.title}.png`;
    document.querySelector('#imageSrcHalf').src = `./assets/planets/${data.title}/${data.title}Half.png`;
    document.querySelector('#imageSrcSurface').src = `./assets/planets/${data.title}/${data.title}Surface.png`;

    const btnContainer = document.querySelector('.planetDescription .buttonsContainer');
    const classToDelete = Array.from(btnContainer.classList).filter(className => className !== 'buttonsContainer');
    if (classToDelete.length > 0) {
        btnContainer.classList.remove(...classToDelete);
    }
    btnContainer.classList.add(data.title);

    const classToDelete1 = Array.from(imageContainer.classList).filter(
        className => className !== 'imageContainer' && className !== 'isSaturn'
    );
    if (classToDelete1.length > 0) {
        imageContainer.classList.remove(...classToDelete1);
    }
    imageContainer.classList.add('overview');
}