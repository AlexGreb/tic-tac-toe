import {render} from '../utils/dom/render.js';

class AbstractView {
    constructor() {
        if(new.target === AbstractView) {
            throw new Error(`Can't instantiate AbstractView, only concrete one`);
        }
    }

    get template() {
        throw new Error(`Template is required`);
    }

    get element() {
        if(this._element) {
            return this._element
        }

        this._element = this.render();
        this.bind(this._element);
        this.postRender();
        return this._element;
    }

    render() {
        return render(this.template, this.className);
    }

    bind() {
         
    }

    postRender() {

    }
}

export default AbstractView;