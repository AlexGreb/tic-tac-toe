import { render } from '../../utils/dom/render.js';

export default class Loader {
  #element = null;
  constructor(status, width = 80, height = 80) {
    this.status = status;
    this.width = width;
    this.height = height;
  }

  get element() {
    if (this.#element != null) {
      return this.#element;
    }

    this.#element = render(this.template, `loader`);
    return this.element;
  }

  get template() {
    return `<svg xmlns="http://www.w3.org/2000/svg" 
                width="${this.width}"
                height="${this.height}"
                viewBox="0 0 100 100">
                <path fill="#fff" 
                      d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                <animateTransform 
                    attributeName="transform" 
                    attributeType="XML" 
                    type="rotate"
                    dur="1s" 
                    from="0 50 50"
                    to="360 50 50" 
                    repeatCount="indefinite" />
                    <animate attributeName="fill" 
                             values="#ff0000;#ff7300;#fffb00; #48ff00; #00ffd5; #002bff; #7a00ff; #ff00c8; #b16161" 
                             dur="3s" 
                             repeatCount="indefinite" />
                </path>
                ${this.status != null ? this.statusText : ``}
            </svg>`;
  }

  changeStatus(text) {
    const loaderTextElement = this.#element.querySelector(`.loader__text`);
    if (loaderTextElement) {
      loaderTextElement.nodeValue = text;
    } else {
      const span = document.createElement(`div`);
      span.classList.add(`loader__text`);
      span.nodeValue = text;
      this.#element.appendChild(span);
    }
  }

  get statusText() {
    return `<div class="loader__text">${this.status}</div>`;
  }
}
