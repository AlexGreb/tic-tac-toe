export const render = (html, className) => {
    const wrapper = document.createElement(`div`);
    if(className){
        wrapper.classList.add(className);
    }
    wrapper.insertAdjacentHTML('afterbegin', html.trim());
    return wrapper.children[0];
}