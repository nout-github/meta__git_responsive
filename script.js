class ElementQuery {
    constructor(data) {
        if(typeof data.el === 'string') {
            this.el = document.querySelector(data.el)
            this.name = data.el.replace('.', '')
        }else if (data.el instanceof HTMLElement) {
            this.el = data.el
            this.name = this.el.className
        }
    }
    createElement(parent, geo, html) {
        parent.insertAdjacentHTML(geo, html)
    }
}

class Slider extends ElementQuery {
    constructor(data) {
        super(data)
        this.sliderInner = this.el.querySelector(`.${this.name}_inner`)
        this.slides = [...this.sliderInner.children]

        this.queryBtn(data)

        this.dir = data.direction.toUpperCase() === 'X' ? 'X' : 'Y'
        this.timeMuve = data.time != undefined || data.time >= 200 ? data.time : 1000


        this.width = this.size().w
        this.heght = this.size().h


        this.activeSlide = 0
        this.genPosition()

        this.interval = isNaN(data.interval) || data.interval <= this.timeMuve
                        ? this.timeMuve + 500
                        : data.interval

        if(data.autoplay) {
            let interval = setInterval(() => {
                this.move(this.next)
            }, this.interval);

            this.el.onmouseenter = () => clearInterval(interval)
            this.el.onmouseleave = () => 
                interval = setInterval(() => {
                    this.move(this.next)
                },  this.interval)
        }

        window.onresize = () => this.resize()

        this.next.onclick = () => this.move(this.next)
        this.prev.onclick = () => this.move(this.prev)
    }

    queryBtn(data) {
       if(data?.btn?.create) {
        this.createElement(this.el, 'beforeend', `<div class="${data.btn.parent}"></div>`)
        const parentControls = this.el.querySelector('.' + data.btn.parent)
        const parentBtns = ['prev', 'next']
        parentBtns.forEach(dir => {
            const HTML = `<button data-arrow="${dir}">${data.btn[`${dir}InnerBtn`]}</button>`
            this.createElement(parentControls, 'beforeend', HTML)
        })
       } 
       this.btns = [...this.el.querySelectorAll('[data-arrow]')]

       if(this.btns.length) {
        this.btns.forEach(btn => {
            const dataArrow = btn.getAttribute('data-arrow')
            this[dataArrow] = btn
        })
       }


    }

    resize() {
        this.width = this.size().w
        this.heght = this.size().h

        this.genPosition()
    }

    size() {
        return {
            w: this.el.clientWidth,
            h: this.el.clientHeight
        }
    }

    genPosition() { 

        this.moveSzie = this.dir === 'X' ? this.width : this.heght

        this.sliderInner.style.position = 'relative'
        this.sliderInner.style.height = `${this.heght}px`
        this.sliderInner.style.overflow = `hidden`

        this.slides.forEach((slide, index) => {
            slide.style.position = 'absolute'
            slide.style.width = `${this.width}px`
            slide.style.height = `${this.heght}px`

            if(index !== this.activeSlide) slide.style.transform = `translate${this.dir}(${this.moveSzie}px)`
            const leftSlide = this.activeSlide === 0 ? this.slides.length -1 : index -1
            
            if(leftSlide === index) slide.style.transform = `translate${this.dir}(${-this.moveSzie}px)`





        })

    }

    move(btn) {
        this.next.disabled = this.prev.disabled = true

        setTimeout(() => {
            this.next.disabled = this.prev.disabled = false
        },  this.timeMuve)

        const btnLeftOrRight = btn === this.next
                                ? this.moveSzie * -1
                                : this.moveSzie
        
        this.slides.forEach((slide, index) => {
            slide.style.transition = '0ms'

            if(index !== this.activeSlide) {

                slide.style.transform = `translate${this.dir}(${btnLeftOrRight * -1}px)`

            }
        })

        this.slides[this.activeSlide].style.transform = `translate${this.dir}(${btnLeftOrRight}px)`
        this.slides[this.activeSlide].style.transition = `${this.timeMuve}ms`

        if(this.next === btn) {
            this.activeSlide++
                if(this.activeSlide === this.slides.length) this.activeSlide = 0

        }else if(this.prev === btn) {
            this.activeSlide--
                if(this.activeSlide < 0) this.activeSlide = this.slides.length - 1
        }

        this.slides[this.activeSlide].style.transform = `translate${this.dir}(${0}px)`
        this.slides[this.activeSlide].style.transition = `${this.timeMuve}ms`
    }

}

const slider = new Slider({
    el: '.slider',
    direction: 'X',
    time: 1000,
    interval: 2000,
    autoplay: true,
    btn: {
        create: true,
        parent: 'slider__controls',
        prevInnerBtn: 'prev',
        nextInnerBtn: 'next',
        defoultBtn: false
    }
})


const slider2 = new Slider({
    el: '.extra-slide',
    direction: 'X',
    time: 1000,
  
})








































