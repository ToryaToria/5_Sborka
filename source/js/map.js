document.querySelector('.main-footer__map').classList.remove('no-js');

ymaps.ready(function () {

  // массив размеров маркера
    const sizePlacemark = [
        [57, 53],
        [113, 106]
    ];

      // массив масштабов
    const myMapZoom = [11, 12, 15];

    var myMap = new ymaps.Map('map', {
            // center: [59.938051, 30.323037],
            center: [59.968528, 30.317632],

    // изменения масштаба в зависимости от экрана
            zoom: window.innerWidth <= 768 ? myMapZoom[0] : myMapZoom[1]
        });

        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'ул. Большая Конюшенная, д. 19/8',
            balloonContent: '<b>ул. Большая Конюшенная, д. 19/8,</b><br/>' + ' Санкт-Петербург'
        }, {

            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',

            // Своё изображение иконки метки.
            iconImageHref: '../img/map-pin.png',

    // Размеры метки в зависимости от размера экрана
            iconImageSize: window.innerWidth <= 500 ? sizePlacemark[0] : sizePlacemark[1],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            // iconImageOffset: [155, 38]
        });

    myMap.geoObjects
        .add(myPlacemark);

        let check = true;
        myMap.events.add('boundschange', function () {
            if (window.innerWidth <= 768 && check) {
                myPlacemark.options.set('iconImageSize', sizePlacemark[0]);
                myMap.setZoom(myMapZoom[0], {duration: 300});
                return check = false;
            } else if (window.innerWidth > 768 && !check) {
                myPlacemark.options.set('iconImageSize', sizePlacemark[1]);
                myMap.setZoom(myMapZoom[1], { duration: 300 });
                return check = true;
            } else if (window.innerWidth > 1440) {
                myMap.setZoom(myMapZoom[2], { duration: 300 });
            }
        });
});
