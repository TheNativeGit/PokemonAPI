import express from 'express';
import sqlite3 from 'sqlite3';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/load-data', async (req, res) => {
    let input = req.query.pokemon;
    let pokemonName= input.toLowerCase();
    let link = "https://pokeapi.co/api/v2/pokemon/" + pokemonName;
    console.log("Link: " + link);

    try {
        const response = await fetch(link);
        const data = await response.json();
        
        // open db
        const db = new sqlite3.Database('SQLiteDB.db');
        
        // parse data
        const pokemonData = {
            id: data.id,
            name: data.name,
            weight: data.weight,
            height: data.height,
            base_experience: data.base_experience,
            type: data.types.map(typeArray => typeArray.type.name).join(", "),
            abilities: data.abilities.map(abilitiesArray => abilitiesArray.ability.name).join(", "),
            forms: data.forms.map(formsArray => formsArray.name).join(", "),
            held_items: data.held_items.map(held_itemsArray => held_itemsArray.item.name).join(", ")
        };
        
        // create table
        const createTableQuery = `CREATE TABLE IF NOT EXISTS pokemonoverview (
            id INTEGER PRIMARY KEY,
            name TEXT,
            weight INTEGER,
            height INTEGER,
            base_experience INTEGER,
            type TEXT,
            abilities TEXT,
            forms TEXT,
            held_items TEXT
        )`;
        
        db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Error creating table:', err);
                return res.status(500).send('Error creating table');
            }
        
            // insert into db
            const insertQuery = `INSERT INTO pokemonoverview (id, name, weight, height, base_experience, type, abilities, forms, held_items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.run(insertQuery, [pokemonData.id, pokemonData.name, pokemonData.weight, pokemonData.height, pokemonData.base_experience, pokemonData.type, pokemonData.abilities, pokemonData.forms, pokemonData.held_items], (err) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return res.status(500).send('Error inserting data');
                }
                console.log('Pokémon-Daten erfolgreich gespeichert!');
                db.close();
                res.send('Pokémon-Daten erfolgreich gespeichert!');
            });
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/get-data', (req, res) => {
    const db = new sqlite3.Database('SQLiteDB.db', (err) => {
        if (err) {
            console.error('Error opening database', err);
            return res.status(500).send('Error opening database');
        }
    });

    const selectQuery = `SELECT * FROM pokemonoverview`;

    db.all(selectQuery, [], (err, rows) => {
        if (err) {
            console.error('Error fetching data', err);
            return res.status(500).send('Error fetching data');
        }
        res.json(rows);
        db.close((err) => {
            if (err) {
                console.error('Error closing database', err);
                return res.status(500).send('Error closing database');
            }
        });
    });
});

app.get('/delete-data', (req, res) => {
    const db = new sqlite3.Database('SQLiteDB.db');
    
    const deleteQuery = `DELETE FROM pokemonoverview`;
    
    db.run(deleteQuery, (err) => {
        if (err) {
            console.error('Error deleting data:', err);
            return res.status(500).send('Error deleting data');
        }
        console.log('Pokémon-Daten erfolgreich gelöscht!');
        db.close();
        res.send('Pokémon-Daten erfolgreich gelöscht!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
