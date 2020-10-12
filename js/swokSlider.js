export default class {
  constructor({
    sliderClass = '.swok-slider',
    transitionDuration = '250ms',
    backgroundColor = 'rgba(0, 0, 0, 0.5)',
    delay = '4000',
  }) {
    this.slider = document.querySelector(sliderClass);
    this.transitionDuration = transitionDuration;
    this.slider.style.overflow = 'hidden';
    this.slider.style.backgroundColor = backgroundColor;
    this.slider.style.position = 'relative';
    this.sliderCount = this.slider.childElementCount;
    this.curentSlide = 0;
    this.pointsEl = [];
    this.delay = Number.parseInt(delay);
    this.prevButton = this.createSliderElement('button', 'button', 'prev');
    this.nextButton = this.createSliderElement('button', 'button', 'next');

    this.points = this.createSliderElement('div', 'points');
    for (let i = 0; i < this.sliderCount; i += 1) {
      this.pointsEl.push(this.createSliderElement('div', 'point'));
    }
    this.points.append(...this.pointsEl);

    console.log(this.points);
    this.appendElements(
      this.wrapSlider(),
      this.prevButton,
      this.nextButton,
      this.points,
    );
    this.avtoFlipping = setInterval(
      this.nextSlideHandler.bind(this),
      this.delay,
    );

    this.resizeHandler();

    window.addEventListener('resize', this.resizeHandler.bind(this));
    this.slider.addEventListener('click', this.clickHandler.bind(this));
  }
  wrapSlider() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('swok-slider__wrapper');
    for (let i = 0; i < this.sliderCount; i += 1) {
      wrapper.append(this.slider.children[i].cloneNode(true));
      wrapper.children[i].classList.add('swok-slider__item');
      wrapper.children[i].style.width = `calc(100% / ${this.sliderCount})`;
    }
    for (let i = 0; i < this.sliderCount; i += 1) {
      this.slider.removeChild(this.slider.children[0]);
    }
    return wrapper;
  }
  appendElements(...args) {
    this.slider.append(...args);
  }
  createSliderElement(element, className, modifier) {
    const elmt = document.createElement(element);
    elmt.classList.add('swok-slider__' + className);
    if (modifier) {
      elmt.classList.add('swok-slider__' + className + '-' + modifier);
    }
    return elmt;
  }
  setSlidersWidth() {
    for (let i = 0; i < this.slider.children.length; i += 1) {
      if (this.slider.children[i].classList.contains('swok-slider__wrapper')) {
        this.sliderWidth = this.slider.children[i].style.width =
          this.slider.clientWidth * this.sliderCount + 'px';
        break;
      }
    }
  }
  calculateSlideCoordinates() {
    this.sliderCoordinateArray = [];
    for (let i = 0; i < this.sliderCount; i += 1) {
      this.sliderCoordinateArray.push(
        0 - (Number.parseInt(this.sliderWidth) / this.sliderCount) * i,
      );
    }
  }
  changeSlide(enableAnimation) {
    this.slider.children[0].style.transform = `translate3D(${
      this.sliderCoordinateArray[this.curentSlide]
    }px, 0, 0)`;
    this.slider.children[0].style.transition = enableAnimation
      ? `transform ${this.transitionDuration}`
      : 'none';
  }
  prevSlideHandler() {
    this.points.children[this.curentSlide].style.backgroundColor = '#000'; //need to remake
    this.curentSlide =
      this.curentSlide - 1 > 0 ? this.curentSlide - 1 : this.sliderCount - 1;
    this.changeSlide(true);
    this.points.children[this.curentSlide].style.backgroundColor = '#fff'; //need to remake
  }
  nextSlideHandler() {
    this.points.children[this.curentSlide].style.backgroundColor = '#000'; //need to remake
    this.curentSlide +=
      this.curentSlide + 1 === this.sliderCount ? -this.sliderCount + 1 : 1;
    this.changeSlide(true);
    this.points.children[this.curentSlide].style.backgroundColor = '#fff'; //need to remake
  }
  resizeHandler() {
    this.setSlidersWidth();
    this.calculateSlideCoordinates();
    this.changeSlide();
  }
  clickHandler(e) {
    if (e.target === this.nextButton) {
      this.suspenseAutoFill(this.nextSlideHandler.bind(this));
    } else if (e.target === this.prevButton) {
      this.suspenseAutoFill(this.prevSlideHandler.bind(this));
    } else if (e.target.classList.contains('swok-slider__point')) {
      //need to remake
      this.points.children[this.curentSlide].style.backgroundColor = '#000';
      this.curentSlide = this.pointsEl.indexOf(e.target);
      this.suspenseAutoFill(this.changeSlide.bind(this, true));
      this.points.children[this.curentSlide].style.backgroundColor = '#fff';
    }
  }
  suspenseAutoFill(cb) {
    clearInterval(this.avtoFlipping);
    cb();
    this.avtoFlipping = setInterval(
      this.nextSlideHandler.bind(this),
      this.delay,
    );
  }
}
