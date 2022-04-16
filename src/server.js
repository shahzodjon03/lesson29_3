const express = require('express')
const app = express()
const PORT = process.env.PORT || 9000
const { Pool } = require('pg')

const pool = new Pool({
    connectionString: 'postgres://jgcjxqbf:Ykqc4rA-gUSrSOETfgQMAhFSALJXIiI_@john.db.elephantsql.com/jgcjxqbf'
})

app.use(express.json())


app.route('/cars')
    .get(async(req, res) => {
    const client = await pool.connect()

    const { rows } = await client.query('SELECT * FROM cars')

    client.release()

    res.json(rows)
    })
    .post(async(req, res) => {
    const client = await pool.connect()
    const { name } = req.body

    const { rows } = await client.query('INSERT INTO cars(car_name) VALUES($1) RETURNING *', [ name ])

    client.release()

    res.json(rows)
    })
    .put(async(req, res) => {
        const { name, id } = req.body
        const client = await pool.connect()

        console.log(name, id);

        const { rows } = await client.query('UPDATE cars SET car_name = $1 WHERE car_id = $2 RETURNING *', [ name, id ])

        client.release()
        
        res.json(rows)
    })
    .delete(async(req, res) => {
        const { id } = req.body
        const client = await pool.connect()

        const { rows } = await client.query('DELETE FROM cars WHERE car_id = $1 RETURNING *', [ id ])

        client.release()
        
        res.json(rows)
    })

app.get('/cars/:name', async(req, res) => {
    const { name } = req.params
    const client = await pool.connect()

    const { rows: [ car ] } = await client.query('SELECT * FROM cars WHERE car_name = $1', [ name ])

    client.release()
    
    res.json(car)
})

app.listen(PORT, console.log(PORT))