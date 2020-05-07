const path = require('path')
const express = require('express')
const hbs = require('hbs')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const forecast = require('./utils/forecast.js')
const geocode = require('./utils/geocode.js')
const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public') // directory exposed by the web sever 
const viewsPath = path.join(__dirname, '../src/templates/views')
const partialsPath = path.join(__dirname, '../src/templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs') 
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static director to serve 
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Gunkar Singh'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Gunkar Singh'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Gunkar Singh'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ // return stops the function from fully executing 
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude,  longitude, location} = {}) => {
        if (error) {
            return res.send( { error})
        } 

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send ( {error})
            }

            res.send( {
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send({ // return stops the function from fully executing 
            error: 'You must provide a search term'
        })
    }

    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Gunkar Singh'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found',
        name: 'Gunkar Singh'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})