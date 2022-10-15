class slider {
    constructor(settings) {
        this.settings = Object.assign(this.defaultSettings, settings)
    }

    state = {
        currentSlide: 0,
    }

    defaultSettings = {
        selector: '.slider',
        loop: false,
        arrows: false,
        dots: false,
        autoplay: false
    };

    templates = {
        renderDots(dots) {
            return `
            <div class="slider_dots">
               ${dots.map((_, index) => {
                return `
                   <span class="slider_dots__slider_dot" data-dots="${index}">${index + 1}</span>    
                `
            }).join('')}
            </div>
            `
        },
        renderArrows() {
            return `
            <div class="slider_arrows">
                <span class="slider_arrows__slider_left_arrows"><</span>
                <span class="slider_arrows__slider_right_arrows">></span>
            </div>
            `
        },
        renderTrack(slides) {
            return ` 
        <div class="slider_list">
              <div class="slider_track">
                 ${slides}
              </div>
        </div>`
        },
        renderSlides(sliderChildren) {
            return sliderChildren.map((slide) => {
                return `
               <div class="slider_slide">
                       ${slide.outerHTML}
               </div>
               `
            }).join('')
        }
    }

    setState(state) {
        this.state = Object.assign(this.state, state);
    }

    render() {
        const slider = document.querySelector(this.settings.selector)
        const sliderChildren = Array.from(slider.children)
        const slides = this.templates.renderSlides(sliderChildren)

        slider.innerHTML = this.templates.renderTrack(slides)

        if (this.settings.dots) slider.insertAdjacentHTML('beforeend', this.templates.renderDots(sliderChildren))

        if (this.settings.arrows) slider.insertAdjacentHTML('beforeend', this.templates.renderArrows())

        this.setState({
            slidesCount: sliderChildren.length,
            elements: {
                slider: slider,
                track: slider.querySelector('.slider_track'),
                next: slider.querySelector('.slider_arrows__slider_right_arrows'),
                prev: slider.querySelector('.slider_arrows__slider_left_arrows'),
                dots: slider.querySelector('.slider_dots'),
            }
        })
    }

    arrowsEvents() {
        const next = this.state.elements.next;
        const prev = this.state.elements.prev;

        next.addEventListener('click', this.nextSlide.bind(this))
        prev.addEventListener('click', this.prevSlide.bind(this))
    }

    nextSlide() {
        if (Math.abs(this.state.currentSlide) === this.state.slidesCount - 1) {
            this.state.currentSlide = 0
        } else {
            this.state.currentSlide += 1
        }
        this.state.elements.track.style.transform = `translateX(${-(this.state.currentSlide) * 100}%)`
    }

    prevSlide() {
        if (Math.abs(this.state.currentSlide) === 0) {
            this.state.currentSlide = this.state.slidesCount - 1
        } else {
            this.state.currentSlide--
        }
        this.state.elements.track.style.transform = `translateX(${(-this.state.currentSlide) * 100}%)`
    }

    dotsEvents() {
        const dots = this.state.elements.dots
        dots.addEventListener('click', (event) => {
            let target = event.target
            if (target.closest('.slider_dots__slider_dot')) {
                this.state.currentSlide = Number(target.dataset.dots)
                this.state.elements.track.style.transform = `translateX(${(-this.state.currentSlide) * 100}%)`
            }
        })
    }

    // autoplay(timeout) {
    //     setInterval(this.nextSlide.bind(this), timeout)
    // }

    init() {

        this.render()
        if (this.settings.arrows) this.arrowsEvents()
        if (this.settings.dots) this.dotsEvents()
        if (this.settings.autoplay) this.autoplay(this.settings.autoplay)

    }
}


let mySlider = new slider({
    selector: '.slider_test',
    arrows: true,
    dots: true,
    // autoplay: 2000

})
mySlider.init()