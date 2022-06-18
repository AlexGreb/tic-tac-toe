import Router from './router.js';
import '../scss/style.scss';
import '../scss/button.scss';
import '../scss/loader.scss';
import '../scss/modal.scss';
import '../scss/welcome-view.scss';
import '../scss/settings-view.scss';
import '../scss/game-view.scss';
import '../scss/form.scss';

window.addEventListener(`load`, () => {
    Router.showWelcome();
});
