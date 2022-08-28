import Loader from '../views/common/loader.js';
import Modal from 'modal-vanilla';

export const getModalSearchingGame = (textLoader, onCancelCallback) => {
  const container = document.createElement(`div`);
  const loader = new Loader(textLoader).element;
  container.appendChild(loader);

  const modal = new Modal({
    content: container,
    footer: true,
    buttons: [
      {
        text: `Отменить`,
        value: false,
        attr: {
          class: `btn`,
          'data-dismiss': `modal`,
        },
      },
    ],
    header: false,
    backdrop: `static`,
  });

  const dismissCallback = (modal) => {
    if (onCancelCallback) {
      onCancelCallback();
    }

    modal.off(`hide`, dismissCallback);
  };

  modal.on(`hide`, dismissCallback);

  return modal;
};
