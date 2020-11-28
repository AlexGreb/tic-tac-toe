const render = (containerElement, element) => {
  containerElement.innerHTML = ``;
  containerElement.appendChild(element);
};
export default render;
