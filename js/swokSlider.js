export default class{
  constructor({
    sliderClass = ".swok-slider",
    transitionDuration = "250ms",
    backgroundColor = "rgba(0, 0, 0, 0.5)",
    delay = "4000",
  }) {
    this.slider = document.querySelector(sliderClass);
    this.transitionDuration = transitionDuration;
    this.slider.style.overflow = "hidden";
    this.slider.style.backgroundColor = backgroundColor;
    this.slider.style.position = "relative";
    this.sliderCount = this.slider.childElementCount;
    this.curentSlide = 0;
    this.delay = Number.parseInt(delay);
    this.prevButton = this.createSliderElement("button", "prev");
    this.nextButton = this.createSliderElement("button", "next");
    this.appendElements(this.wrapSlider(), this.prevButton, this.nextButton);
    this.setSlidersWidth();

    this.avtoFlipping = setInterval(this.nextSlideHandler.bind(this), this.delay);

    window.addEventListener("resize", this.setSlidersWidth.bind(this));

    this.nextButton.addEventListener("click", this.nextSlideHandler.bind(this));
    this.prevButton.addEventListener("click", this.prevSlideHandler.bind(this));
    this.slider.addEventListener('click', (e) => { console.log(e.target) })
  }
  wrapSlider() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("swok-slider__wrapper");
    for (let i = 0; i < this.sliderCount; i += 1) {
      wrapper.append(this.slider.children[i].cloneNode(true));
      wrapper.children[i].classList.add("swok-slider__item");
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
  createSliderElement(element, modifier) {
    const elmt = document.createElement(element);
    elmt.classList.add("swok-slider__" + element);
    if (modifier) {
      elmt.classList.add("swok-slider__" + element + "-" + modifier);
    }
    return elmt;
  }
  setSlidersWidth() {
    for (let i = 0; i < this.slider.children.length; i += 1) {
      if (this.slider.children[i].classList.contains("swok-slider__wrapper")) {
        this.sliderWidth = this.slider.children[i].style.width =
          this.slider.clientWidth * this.sliderCount + "px";
        break;
      }
    }
    this.calculateSlideCoordinates();
    this.changeSlide();
  }
  calculateSlideCoordinates() {
    this.sliderCoordinateArray = [];
    for (let i = 0; i < this.sliderCount; i += 1) {
      this.sliderCoordinateArray.push(
        0 - (Number.parseInt(this.sliderWidth) / this.sliderCount) * i
      );
    }
  }
  changeSlide(enableAnimation) {
    this.slider.children[0].style.transform = `translate3D(${this.sliderCoordinateArray[this.curentSlide]}px, 0, 0)`;
    this.slider.children[0].style.transition = enableAnimation   ? `transform ${this.transitionDuration}`   : "none";
  }
  prevSlideHandler() {
    this.curentSlide =
      this.curentSlide - 1 > 0 ? this.curentSlide - 1 : this.sliderCount - 1;
    this.changeSlide(true);
  }
  nextSlideHandler() {
    this.curentSlide +=
      this.curentSlide + 1 === this.sliderCount ? -this.sliderCount + 1 : 1;
    this.changeSlide(true);
  }
}
