/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/utils/dom/render.js":
/*!********************************!*\
  !*** ./js/utils/dom/render.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const render = (containerElement, element) => {
  containerElement.innerHTML = ``;
  containerElement.appendChild(element);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (render);

/***/ }),

/***/ "./js/views/settings.js":
/*!******************************!*\
  !*** ./js/views/settings.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getSettingsScreenElement": () => (/* binding */ getSettingsScreenElement),
/* harmony export */   "getSettingsScreenTemplate": () => (/* binding */ getSettingsScreenTemplate),
/* harmony export */   "bindSettingsScreen": () => (/* binding */ bindSettingsScreen)
/* harmony export */ });
const getSettingsScreenElement = () => {
  const _element = document.createElement(`div`);

  const template = getSettingsScreenTemplate();
  _element.innerHTML = template;
  return _element;
};

const getSettingsScreenTemplate = () => {
  return `<article class="settings-screen">
    <h1 class="settings-screen__title">
        Настройки
    </h1>
    <section class="settings-screen__choose-character choose-character">
        <h2 class="choose-character__title">
            Выберите символ:
        </h2>
        <div class="choose-character__characters">
            <input type="radio"
                id="x"
                name="character"
                class="choose-character__input"
                checked>
            <label class="choose-character__x"
                for="x">
                <svg x="0px" y="0px" 
                    height="25"
                    width="25"
                    fill="currentColor"
                    viewBox="0 0 492 492">
                    <path d="M300.188,246L484.14,62.04c5.06-5.064,7.852-11.82,7.86-19.024c0-7.208-2.792-13.972-7.86-19.028L468.02,7.872
                        c-5.068-5.076-11.824-7.856-19.036-7.856c-7.2,0-13.956,2.78-19.024,7.856L246.008,191.82L62.048,7.872
                        c-5.06-5.076-11.82-7.856-19.028-7.856c-7.2,0-13.96,2.78-19.02,7.856L7.872,23.988c-10.496,10.496-10.496,27.568,0,38.052
                        L191.828,246L7.872,429.952c-5.064,5.072-7.852,11.828-7.852,19.032c0,7.204,2.788,13.96,7.852,19.028l16.124,16.116
                        c5.06,5.072,11.824,7.856,19.02,7.856c7.208,0,13.968-2.784,19.028-7.856l183.96-183.952l183.952,183.952
                        c5.068,5.072,11.824,7.856,19.024,7.856h0.008c7.204,0,13.96-2.784,19.028-7.856l16.12-16.116
                        c5.06-5.064,7.852-11.824,7.852-19.028c0-7.204-2.792-13.96-7.852-19.028L300.188,246z"/>
                </svg>
            </label>
            <input type="radio"
                id="zero"
                name="character"
                class="choose-character__input">
            <label class="choose-character__zero"
                for="zero">
                <svg x="0px" y="0px"
                    height="25"
                    width="25"
                    fill="currentColor"
                    viewBox="0 0 380.734 380.734">
                    <path d="M190.367,0C85.23,0,0,85.23,0,190.367s85.23,190.367,190.367,190.367s190.367-85.23,190.367-190.367
                        S295.504,0,190.367,0z M299.002,298.36c-28.996,28.996-67.57,44.959-108.634,44.959S110.723,327.35,81.733,298.36
                        c-28.865-28.876-44.769-67.227-44.769-107.993c0-40.771,15.904-79.128,44.769-107.993c28.99-28.996,67.57-44.959,108.634-44.959
                        c41.054,0,79.639,15.969,108.629,44.959c28.871,28.865,44.763,67.221,44.763,107.993
                        C343.765,231.133,327.867,269.489,299.002,298.36z"/>
                </svg>
            </label>
        </div>
    </section>
    <section class="settings-screen__size-field settings-field">
        <h2 class="settings-field__title">
            Выберите размер поля:
        </h2>
        <div class="settings-field__size">
            <label class="settings-field__size-input">
                <span class="input">
                    <input
                        value="3"
                        min="3" 
                        max="15"
                        type="number">
                </span>
            </label>
            <span class="settings-field__cross">X</span>
            <label class="settings-field__size-input">
                <span class="input">
                    <input 
                        value="3"
                        min="3"
                        max="15"
                        type="number">
                </span>
                
            </label>
        </div>
    </section>
    <section class="settings-screen__start start-block">
        <h2 class="start-block__title" hidden>Начать игру</h2>
        <button 
            class="start-block__btn btn btn--action"
            type="button">
            Играть
        </button>
    <section>
</article>`;
};

const bindSettingsScreen = _element => {};



/***/ }),

/***/ "./js/views/welcome.js":
/*!*****************************!*\
  !*** ./js/views/welcome.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getWelcomeScreenElement": () => (/* binding */ getWelcomeScreenElement),
/* harmony export */   "getWelcomeScreenTemplate": () => (/* binding */ getWelcomeScreenTemplate),
/* harmony export */   "bindWelcomeScreen": () => (/* binding */ bindWelcomeScreen)
/* harmony export */ });
/* harmony import */ var _utils_dom_render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/dom/render */ "./js/utils/dom/render.js");
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./settings */ "./js/views/settings.js");



const getWelcomeScreenElement = () => {
  const _element = document.createElement(`div`);

  const template = getWelcomeScreenTemplate();
  _element.innerHTML = template;
  return _element;
};

const getWelcomeScreenTemplate = () => {
  return `<article class="welcome-screen">
        <h1 class="welcome-screen__title">
            Крестики <span>X</span> Н<span>о</span>лики
        </h1>
    
        <button class="welcome-screen__btn btn btn--action"
            type="button">
            Начать игру
        </button>
    </article>`;
};

const bindWelcomeScreen = _element => {
  _element.querySelector(`.welcome-screen__btn`).addEventListener(`click`, e => {
    e.preventDefault();
    const settingsScreenElement = (0,_settings__WEBPACK_IMPORTED_MODULE_1__.getSettingsScreenElement)();
    (0,_utils_dom_render__WEBPACK_IMPORTED_MODULE_0__.default)(document.body, settingsScreenElement);
  });
};



/***/ }),

/***/ "./sass/button.scss":
/*!**************************!*\
  !*** ./sass/button.scss ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./sass/style.scss":
/*!*************************!*\
  !*** ./sass/style.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_utils_dom_render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../js/utils/dom/render */ "./js/utils/dom/render.js");
/* harmony import */ var _js_views_welcome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../js/views/welcome */ "./js/views/welcome.js");
/* harmony import */ var _sass_style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sass/style.scss */ "./sass/style.scss");
/* harmony import */ var _sass_button_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../sass/button.scss */ "./sass/button.scss");




window.addEventListener(`load`, () => {
  const welcomeScreenElement = (0,_js_views_welcome__WEBPACK_IMPORTED_MODULE_1__.getWelcomeScreenElement)();
  (0,_js_views_welcome__WEBPACK_IMPORTED_MODULE_1__.bindWelcomeScreen)(welcomeScreenElement);
  (0,_js_utils_dom_render__WEBPACK_IMPORTED_MODULE_0__.default)(document.body, welcomeScreenElement);
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map