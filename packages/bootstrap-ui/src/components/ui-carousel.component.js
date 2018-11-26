const carousel = () => {
    
    let _getNavButton = (id, type) => {
        return '<a class="carousel-control-' + type + '" href="#carousel_' + id + '" role="button" data-slide="' + type +
            '"><span class="carousel-control-' + type + '-icon" aria-hidden="true"></span><span class="sr-only">' + type + '</span></a>';
    };

    let _parseTemplate = () => {

        this.html.setAttribute('id', 'carousel_' + this.id);
        this.html.setAttribute('data-interval', this.interval);
        this.html.setAttribute('data-keyboard', this.keyboard);
        this.html.setAttribute('data-pause', (this.pauseOnHover ? false : 'hover'));

        let indicators, me = this, prevBtn, nextBtn, item, inner, css, mainCss;

        if (this.indicators) {
            pz.dom.append(this.html, '<ol class="carousel-indicators"></ol');
            indicators = pz.dom.findElement(this.html, 'ol.carousel-indicators');
        };

        pz.dom.append(this.html, '<div class="carousel-inner"></div>');
        inner = pz.dom.findElement(this.html, 'div.carousel-inner');

        pz.forEach(this.slides, (slide, index) => {

            if (me.indicators) {
                pz.dom.append(indicators, '<li data-target="#carousel_' + me.id + '" data-slide-to="' + index + '"></li>');
            };

            mainCss = 'carousel-item' + ((index == 0 ? ' active' : '') + ' slide_' + index);
            css = pz.isEmpty(slide.css) ? mainCss : (mainCss + ' ' + slide.css.join(' ')).trim();
            item = pz.dom.parseTemplate('<div class="' + css + '">' + slide.text + '</div>');

            if (!pz.isEmpty(slide.caption)) {
                pz.dom.append(item, '<div class="carousel-caption d-none d-md-block">' + slide.caption + '</div>');
            };

            pz.dom.append(inner, item);
        });

        prevBtn = _getNavButton(this.id, 'prev');
        nextBtn = _getNavButton(this.id, 'next');

        pz.dom.append(this.html, prevBtn);
        pz.dom.append(this.html, nextBtn);

    };

    let _slide = (me, to) => {
        $(me.html).carousel(to);
    };

    return {
        type: 'ui-bootstrap-carousel',
        ownerType: 'ui-bootstrap-component',
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
        destroy: () => {
            $(this.html).carousel('dispose');
            this.base(arguments);
        },
        onSlide: (e) => {
            this.publish('slide-bs-carousel', e);
        },
        onSlid: (e) => {
            this.publish('slid-bs-carousel', e);
        },
        slideNext: () => {
            _slide(this, 'next');
        },
        slidePrev: () => {
            _slide(this, 'prev');
        },
        slideTo: (number) => {
            _slide(this, number);
        },
        cycle: (pause) => {
            _slide(this, (pause ? 'pause' : 'cycle'));
        }
    };
};

export default carousel;