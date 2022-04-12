const getCharactersTemplate = (characters) => {
    const renderCharacters = (charactersList) =>{
        return charactersList.map((it) => {
            return (
                `<input type="radio"
                            id="${it.value}"
                            name="character"
                            class="choose-character__input"
                            value="${it.value}"
                            ${it.selected ? 'checked' : ''}>
                <label class="choose-character__${it.name}"
                    for="${it.value}">
                    ${it.icon}
                </label>`
            )
        }).join(``);
    }

    return (
        `<section class="settings-screen__choose-character choose-character">
            <h2 class="choose-character__title">
                Выберите символ:
            </h2>
            <div class="choose-character__characters">
                ${renderCharacters(characters)}
            </div>
        </section>`
    )
}

export default getCharactersTemplate;
