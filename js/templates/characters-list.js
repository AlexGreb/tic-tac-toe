const getCharactersListTemplate = (items, indexFormControl) => {
  return items
    .map((it, index) => {
      return `<input type="radio"
                            id="${it.value}"
                            data-index-form-control="${indexFormControl}"
                            data-index="${index}"
                            name="${it.name}"
                            class="character__input"
                            value="${it.value}"
                            ${it.selected ? 'checked' : ''}>
                <label class="character__${it.class}"
                    for="${it.value}">
                    ${it.icon}
                </label>`;
    })
    .join(``);
};

export default getCharactersListTemplate;
