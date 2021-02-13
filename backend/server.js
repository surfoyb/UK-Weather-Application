import express from 'express'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const app = express()

app.use(express.static('frontend'))
app.use(express.json({ limit: '1mb' }))

app.get('/locations', async (request, response) => {
  const api_url = `http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?&key=${process.env.API_KEY}`
  const fetch_response = await fetch(api_url)
  const json = await fetch_response.json()
  response.json(json)
})

app.get('/forecast/:mylocationid', async (request, response) => {
  const myLocationId = request.params.mylocationid
  const api_url = `http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/${myLocationId}?res=3hourly&key=${process.env.API_KEY}`
  const fetch_response = await fetch(api_url)
  const json = await fetch_response.json()
  response.json(json)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
