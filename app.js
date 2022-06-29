require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const app = express()
const port = process.env.PORT

const url = 'https://api.themoviedb.org/3/search/movie?'
const sUrl = 'https://api.themoviedb.org/3/trending/movie/week?'
const eUrl = 'https://api.themoviedb.org/3/movie/'

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(`${__dirname}/public/`))

app.get('/', (req, res) => {
  fetch(`${sUrl}api_key=${process.env.API_KEY}`)
    .then(res => res.json())
    .then(data => {
      res.render('home', { data: data.results })
    })
}
)

app.get('/searchmovies', (req, res) => {
  res.redirect('/')
})

app.post('/searchmovies', (req, res) => {
  if (req.body.searchInput === '') {
    res.redirect('/')
  } else {
    fetch(`${url}api_key=${process.env.API_KEY}&language=en-US&query=${req.body.searchInput}`)
      .then(res => res.json())
      .then(data => {
        const filteredData = data.results.filter(e => e.poster_path !== null && e.overview !== undefined)
        res.render('search', { data: filteredData })
      })
  }
}
)

app.get('/moviedetails/:id', (req, res) => {
  fetch(`${eUrl}${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
    .then(res => res.json())
    .then(data => {
      res.render('details', { data })
    })
}
)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
