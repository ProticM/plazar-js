plz.define('ui-bootstrap-carousel', function () {
    'use strict';

    var _getNavButton = function (id, type) {
        return '<a class="carousel-control-' + type + '" href="#carousel_' + id + '" role="button" data-slide="' + type +
            '"><span class="carousel-control-' + type + '-icon" aria-hidden="true"></span><span class="sr-only">' + type + '</span></a>';
    };

    var _parseTemplate = function () {

        this.html.setAttribute('id', 'carousel_' + this.id);
        this.html.setAttribute('data-interval', this.interval);
        this.html.setAttribute('data-keyboard', this.keyboard);
        this.html.setAttribute('data-pause', (this.pauseOnHover ? false : 'hover'));

        var indicators, me = this, prevBtn, nextBtn, item, inner, css, mainCss;

        if (this.indicators) {
            plz.dom.append(this.html, '<ol class="carousel-indicators"></ol');
            indicators = plz.dom.findElement(this.html, 'ol.carousel-indicators');
        };

        plz.dom.append(this.html, '<div class="carousel-inner"></div>');
        inner = plz.dom.findElement(this.html, 'div.carousel-inner');

        plz.forEach(this.slides, function (slide, index) {

            if (me.indicators) {
                plz.dom.append(indicators, '<li data-target="#carousel_' + me.id + '" data-slide-to="' + index + '"></li>');
            };

            mainCss = 'carousel-item' + ((index == 0 ? ' active' : '') + ' slide_' + index);
            css = plz.isEmpty(slide.css) ? mainCss : (mainCss + ' ' + slide.css.join(' ')).trim();
            item = plz.dom.parseTemplate('<div class="' + css + '">' + slide.text + '</div>');

            if (!plz.isEmpty(slide.caption)) {
                plz.dom.append(item, '<div class="carousel-caption d-none d-md-block">' + slide.caption + '</div>');
            };

            plz.dom.append(inner, item);
        });

        prevBtn = _getNavButton(this.id, 'prev');
        nextBtn = _getNavButton(this.id, 'next');

        plz.dom.append(this.html, prevBtn);
        plz.dom.append(this.html, nextBtn);

    };

    var _slide = function (me, to) {
        $(me.html).carousel(to);
    };

    return {
        ownerType: 'ui-component',
        template: '<div class="carousel slide" data-ride="carousel"></div>',
        indicators: true,
        interval: 5000,
        keyboard: true,
        pauseOnHover: false,
        handlers: [{
            on: 'slide.bs.carousel',
            fn: 'onSlide'
        }, {
            on: 'slid.bs.carousel',
            fn: 'onSlid'
        }],
        slides: [],
        parseTemplate: _parseTemplate,
        destroy: function () {
            $(this.html).carousel('dispose');
            this.base(arguments);
        },
        onSlide: function (e) {
            this.publish('slide-bs-carousel', e);
        },
        onSlid: function (e) {
            this.publish('slid-bs-carousel', e);
        },
        slideNext: function () {
            _slide(this, 'next');
        },
        slidePrev: function () {
            _slide(this, 'prev');
        },
        slideTo: function (number) {
            _slide(this, number);
        },
        cycle: function (pause) {
            _slide(this, (pause ? 'pause' : 'cycle'));
        }
    };
});
