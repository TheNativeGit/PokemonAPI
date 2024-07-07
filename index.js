async function loadData() {
    let pokemonName = document.getElementById('pokemon-input').value;
    try {
        const response = await fetch(`/load-data?pokemon=${pokemonName}`);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function showData() {
        const dataContainer = document.createElement('div');
        dataContainer.id = 'dataContainer';

    try {
        const response = await fetch('/get-data');
        const data = await response.json();
        console.log(data);

        const dataContainer = document.createElement('div');
        dataContainer.id = 'dataContainer';

        data.forEach(pokemon => {
            const pokemonElement = document.createElement('div');
            pokemonElement.textContent = `ID: ${pokemon.id} | Name: ${pokemon.name} | Weight: ${pokemon.weight} | Height: ${pokemon.height} | Base Experience: ${pokemon.base_experience} | Types: ${pokemon.type} | Abilities: ${pokemon.abilities} | Forms: ${pokemon.forms} | Held items: ${pokemon.held_items}`;
            dataContainer.appendChild(pokemonElement);
        });

        document.body.appendChild(dataContainer);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteData() {
    try {
        const response = await fetch('/delete-data');
        if (response.ok) {
            alert('Pokémon-Daten erfolgreich gelöscht!');
        } else {
            alert('Fehler beim Löschen der Daten.');
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        alert('Fehler beim Löschen der Daten.');
    }
}

document.getElementById('loadDataButton').addEventListener('click', loadData);
document.getElementById('showDataButton').addEventListener('click', showData);
document.getElementById('deleteDataButton').addEventListener('click', deleteData);