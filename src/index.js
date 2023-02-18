const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.get("/totalRecovered", async (req, res) => {
    try {
        let cases = await connection.find()
        let recover = 0
        cases.map((data) => {
            recover += data.recovered
        })
        res.status(200).json({
            data: {
                _id: "total",
                recovered: recover
            }
        })
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

app.get("/totalActive", async (req, res) => {
    try {
        let cases = await connection.find()
        let actives = 0
        cases.map((data) => {
            let act = data.infected - data.recovered
            actives += act
        })
        res.status(200).json({
            data: {
                _id: "total",
                active: actives
            }
        })
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

app.get("/totalDeath", async (req, res) => {
    try {
        let cases = await connection.find()
        let deaths = 0
        cases.map((data) => {
            deaths += data.death
        })
        res.status(200).json({
            data: {
                _id: "total",
                death: deaths
            }
        })
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

app.get("/hotspotStates", async (req, res) => {
    try {
        let cases = await connection.find()
        let states = []
        cases.map((data) => {
            let rates = (data.infected - data.recovered) / data.infected
            rates = rates.toFixed(5)
            if (rates > 0.1) {
                states.push({ state: data.state, rate: rates })
            }
        })
        res.status(200).json({
            data: {
                states
            }
        })
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

app.get("/healthyStates", async (req, res) => {
    try {
        let cases = await connection.find()
        let states = []
        cases.map((data) => {
            let rate = data.death / data.infected
            rate = rate.toFixed(5)
            if (rate > 0.005) {
                states.push({ state: data.state, mortality: rate })
            }
        })
        res.status(200).json({
            data: {
                states
            }
        })
    } catch (e) {
        res.status(404).send({
            message: e.message
        })
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;