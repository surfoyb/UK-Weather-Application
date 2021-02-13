const iconType = document.getElementById('icon-type')
const container = document.querySelector('.container')
const headerLocation = document.getElementById('location')
const dayText = document.querySelector('.day')
const search = document.getElementById('search')
const locationChoices = document.getElementById('location-choices')
const locationChoicesDiv = document.getElementById('location-choices-div')
const form = document.getElementById('form')
const locBtn = document.getElementById('locBtn')

let myLat
let myLon
let iconSwitch
let searchLocation = ''
let locationArray = []

if ('geolocation' in navigator) {
  console.log('geolocation available')
  navigator.geolocation.getCurrentPosition(async (position) => {
    myLat = position.coords.latitude
    myLon = position.coords.longitude
  })
} else {
  console.log('geolocation not available')
}
////////////////////////////////////////////////////////////////////////
// returns an array with my location name and id
const findMyLocation = async () => {
  let locLat
  let locLon
  let locationId
  let shortestDistance = 1000

  const locationArray = await fetchLocations()

  locationArray.forEach((loc) => {
    locLat = loc.latitude
    locLon = loc.longitude

    distance = haversineDistance([myLat, myLon], [locLat, locLon])

    if (distance < shortestDistance) {
      shortestDistance = distance
      locationId = loc.id
    }
  })

  return locationId
}
////////////////////////////////////////////////////////////
//returns locations array
const fetchLocations = async () => {
  const api_url = '/locations'
  const response = await fetch(api_url)
  const json = await response.json()
  const locationList = [...json.Locations.Location]
  locationArray = locationList
  return locationList
  //console.log(locationArray)
}
////////////////////////////////////////////////////////////
// returns forecast
const fetchForecast = async () => {
  let myLocationId
  if (searchLocation === '') {
    myLocationId = await findMyLocation()
  } else {
    myLocationId = searchLocation
  }
  const api_url = `/forecast/${myLocationId}`
  const response = await fetch(api_url)
  const json = await response.json()
  const forecast = json.SiteRep.DV.Location
  return forecast
}
////////////////////////////////////////////////////////////
//calculates the distance between two sets of coordinates
const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
  const toRadian = (angle) => (Math.PI / 180) * angle
  const distance = (a, b) => (Math.PI / 180) * (a - b)
  const RADIUS_OF_EARTH_IN_KM = 6371

  const dLat = distance(lat2, lat1)
  const dLon = distance(lon2, lon1)

  lat1 = toRadian(lat1)
  lat2 = toRadian(lat2)

  // Haversine Formula
  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.asin(Math.sqrt(a))

  let finalDistance = RADIUS_OF_EARTH_IN_KM * c
  return finalDistance
}
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
const fill = async () => {
  const data = await fetchForecast()
  const fiveDayArray = data.Period
  console.log(fiveDayArray)
  const myLocation = data.name

  headerLocation.innerHTML = myLocation.toLowerCase()

  function iconSwitchFunc(num) {
    iconSwitch = num
    switch (iconSwitch) {
      case 0:
        return 'far fa-moon'

      case 1:
        return 'fas fa-sun yellow'

      case 2:
        return 'fas fa-cloud-moon light-grey'

      case 3:
        return 'fas fa-cloud-sun light-grey'

      case 5:
        return 'fas fa-smog light-grey'

      case 6:
        return 'fas fa-smog grey'

      case 7:
        return 'fas fa-cloud grey'

      case 8:
        return 'fas fa-cloud grey'

      case 9:
        return 'fas fa-cloud-moon-rain grey'

      case 10:
        return 'fas fa-cloud-sun-rain grey'

      case 11:
        return 'fas fa-cloud-showers-heavy dark-grey'

      case 12:
        return 'fas fa-cloud-showers-heavy dark-grey'

      case 13:
        return 'fas fa-cloud-moon-rain dark-grey'

      case 14:
        return 'fas fa-cloud-sun-rain dark-grey'

      case 15:
        return 'fas fa-cloud-rain'

      case 16:
        return 'fas fa-cloud-moon-rain grey'

      case 17:
        return 'fas fa-sun-rain grey'

      case 18:
        return 'fas fa-cloud-showers-heavy grey'

      case 19:
        return 'fas fa-cloud-moon-rain grey'

      case 20:
        return 'fas fa-cloud-sun-rain grey'

      case 21:
        return 'fas fa-cloud-rain grey'

      case 22:
        return 'far fa-snowflake light-grey'

      case 23:
        return 'far fa-snowflake light-grey'

      case 24:
        return 'far fa-snowflake light-grey'

      case 25:
        return 'fas fa-snowflake dark-grey'

      case 26:
        return 'fas fa-snowflake dark-grey'

      case 27:
        return 'fas fa-snowflake dark-grey'

      case 28:
        return 'fas fa-bolt'

      case 29:
        return 'fas fa-bolt'

      case 30:
        return 'fas fa-poo-storm'
    }
  }

  function windSwitchFunc(code) {
    windDeg = code
    switch (windDeg) {
      case 'N': {
        return 180
      }
      case 'NNE': {
        return 202.5
      }
      case 'NE': {
        return 225
      }
      case 'ENE': {
        return 247.5
      }
      case 'E': {
        return 270
      }
      case 'ESE': {
        return 292.5
      }
      case 'SE': {
        return 315
      }
      case 'SSE': {
        return 337.5
      }
      case 'S': {
        return 0
      }
      case 'SSW': {
        return 22.5
      }
      case 'SW': {
        return 45
      }
      case 'WSW': {
        return 67.5
      }
      case 'W': {
        return 90
      }
      case 'WNW': {
        return 112.5
      }
      case 'NW': {
        return 135
      }
      case 'NNW': {
        return 157.2
      }
    }
  }

  function indexOne() {
    if (firstForecastDay() === day()) {
      return 0
    } else {
      return 1
    }
  }

  function indexTwo() {
    let index1 = indexOne()
    let rep = fiveDayArray[index1].Rep.length
    for (let i = rep - 1; i > 0; i--) {
      if (hour() < 3) {
        return 0
      } else if (fiveDayArray[index1].Rep[i].$ / 60 <= hour()) {
        return i
      } else if (i === 0) {
        return rep - 1
      }
    }
  }

  function hour() {
    let dt = new Date()
    let h = dt.getHours()
    return h
  }

  const setScreen = fiveDayArray[indexOne()].Rep[indexTwo()]
  /////////sets temperature
  const temperatureText = document.querySelector('.temperature-text')
  temperatureText.textContent = fiveDayArray[indexOne()].Rep[indexTwo()].T
  //////////sets chance of rain
  const rainText2 = document.querySelector('.rain-text2')
  const rain2 = fiveDayArray[indexOne()].Rep[indexTwo()].Pp
  rainText2.textContent = `${rain2}% Chance of Rain`
  //////////sets wind direction
  const arrow = document.querySelector('.circle')
  const windDirection2 = document.querySelector('.direction-two')
  windDirection2.textContent = setScreen.D
  arrow.style.transform = `rotate(${windSwitchFunc(setScreen.D)}deg)`
  //arrow.style.setProperty("--rotaion", windSwitchFunc(setScreen.D));
  console.log(windSwitchFunc(setScreen.D))

  /////////sets wind speed
  const windSpeed2 = document.querySelector('.speed-two')
  const speed2 = setScreen.S
  const gust2 = setScreen.G
  windSpeed2.innerHTML = `${speed2} / ${gust2}`
  /////////sets humidity
  const humidity2 = document.querySelector('.humidity-two')
  humidity2.innerHTML = `${setScreen.H}%`
  /////////sets visibility
  const vis2a = document.querySelector('.visibility-two')
  const vis2b = document.querySelector('.visibility-two-p')
  const vis2 = setScreen.V
  switch (vis2) {
    case 'VP': {
      vis2a.textContent = 'Very Poor'
      vis2b.textContent = 'Less than 1 km'
      break
    }
    case 'PO': {
      vis2a.textContent = 'Poor'
      vis2b.textContent = 'Between 1-4 km'
      break
    }
    case 'MO': {
      vis2a.textContent = 'Moderate'
      vis2b.textContent = 'Between 4-10 km'
      break
    }
    case 'GO': {
      vis2a.textContent = 'Good'
      vis2b.textContent = 'Between 10-20 km'
      break
    }
    case 'VG': {
      vis2a.textContent = 'Very Good'
      vis2b.textContent = 'Between 20-40 km'
      break
    }
    case 'EX': {
      vis2a.textContent = 'Excellent'
      vis2b.textContent = 'More than 40 km'
      break
    }
  }
  ////////sets date
  const date2 = document.querySelector('.date-two')
  date2.textContent = todaysDate()
  function todaysDate() {
    let dt = new Date()
    let date = dt.getDate()
    let month = dt.getMonth() + 1
    let year = dt.getFullYear()
    if (month < 10) {
      month = `0${month}`
    }
    if (date < 10) {
      date = `0${date}`
    }
    return `${date}:${month}:${year}`
  }
  ////////sets icon
  const iconType2 = document.getElementById('icon-two')
  const currentIcon = setScreen.W
  iconType2.className = iconSwitchFunc(+currentIcon)

  ////////gets todays day
  function day() {
    let dt = new Date()
    let d = dt.getDay()
    return d
  }
  //////////////////////
  const days = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  }
  //////sets todays day
  dayText.textContent = days[day()]
  ///////////////////////
  //////gets first forecast day
  function firstForecastDay() {
    let repDate = new Date(fiveDayArray[0].value.slice(0, -1))
    let dNo = repDate.getDay()
    return +dNo
  }
  /////////////////////////////////
  let dayIndex = 0
  let dayNo = firstForecastDay()
  let displayDay = 0
  ///////////////////////////////////////////////
  ///////The loops for 5 day forecast start here
  for (let ii = 0; ii < 5; ii++) {
    let dayArrayLength = data.Period[ii].Rep.length

    displayDay = dayNo + dayIndex
    if (displayDay < 6) {
      dayIndex++
    } else {
      dayIndex -= 6
    }

    let dateHeader = document.createElement('h2')
    dateHeader.className = 'date-header'
    dateHeader.innerText = `${days[displayDay]}`

    container.appendChild(dateHeader)

    for (let i = 0; i < dayArrayLength; i++) {
      // Create weather grid
      let weatherGrid = document.createElement('div')
      weatherGrid.className = 'weather-grid'
      // Create first box
      let box = document.createElement('div')
      box.className = 'box'
      weatherGrid.appendChild(box)
      // Create icon
      let iconType = document.createElement('i')
      let weatherType = fiveDayArray[ii].Rep[i].W
      iconType.className = iconSwitchFunc(+weatherType)
      //iconSwitch = +weatherType;
      box.appendChild(iconType)
      //Create second box
      let boxTwo = document.createElement('div')
      boxTwo.className = 'box'
      weatherGrid.appendChild(boxTwo)
      let temperature = fiveDayArray[ii].Rep[i].T
      let tempText = document.createElement('p')
      tempText.className = 'temp-text'
      tempText.textContent = temperature
      let tempUnit = document.createElement('p')
      tempUnit.className = 'temp-unit'
      tempUnit.textContent = 'C'
      boxTwo.appendChild(tempText)
      boxTwo.appendChild(tempUnit)
      // Create Third box
      let boxThree = document.createElement('div')
      boxThree.className = 'box'
      weatherGrid.appendChild(boxThree)
      let windDirection = fiveDayArray[ii].Rep[i].D
      boxThree.appendChild(document.createTextNode(windDirection))
      // Create fourth box
      let boxFour = document.createElement('div')
      boxFour.className = 'box'
      weatherGrid.appendChild(boxFour)
      let windSpeed = fiveDayArray[ii].Rep[i].S
      let windSpeedText = document.createElement('p')
      windSpeedText.className = 'wind-speed-text'
      windSpeedText.textContent = windSpeed
      let windSpeedUnit = document.createElement('p')
      windSpeedUnit.className = 'wind-speed-unit'
      windSpeedUnit.textContent = 'mph'
      boxFour.appendChild(windSpeedText)
      boxFour.appendChild(windSpeedUnit)
      // Create fifth box
      let boxFive = document.createElement('div')
      boxFive.className = 'box'
      weatherGrid.appendChild(boxFive)
      let gustSpeed = fiveDayArray[ii].Rep[i].G
      let gustSpeedText = document.createElement('p')
      gustSpeedText.className = 'gust-speed-text'
      gustSpeedText.textContent = gustSpeed
      let gustSpeedUnit = document.createElement('p')
      gustSpeedUnit.className = 'gust-speed-unit'
      gustSpeedUnit.textContent = 'mph'
      boxFive.appendChild(gustSpeedText)
      boxFive.appendChild(gustSpeedUnit)
      // Create sixth box
      let boxSix = document.createElement('div')
      boxSix.className = 'box rain'
      weatherGrid.appendChild(boxSix)
      let rainIcon = document.createElement('i')
      rainIcon.className = 'fas fa-umbrella'
      boxSix.appendChild(rainIcon)
      let rain = fiveDayArray[ii].Rep[i].Pp
      rainText = document.createElement('p')
      rainText.innerText = rain + '%'
      rainText.className = 'rain-text'
      boxSix.appendChild(rainText)
      //Create time p
      let timeP = document.createElement('p')
      timeP.className = 'time-p'
      let timeStamp = fiveDayArray[ii].Rep[i].$
      timeP.innerHTML = timeFormat(timeStamp)
      weatherGrid.appendChild(timeP)
      // append to
      container.appendChild(weatherGrid)
    }
  }
}

function timeFormat(num) {
  let hour = num / 60
  if (hour < 10) {
    return `0${hour}:00`
  } else {
    return `${hour}:00`
  }
}

////////////////filter locations
function filterLocations(e) {
  //let text = e.target.value.toLowerCase();
  let count = 0
  locationChoices.innerHTML = ''
  if (e.target.value.toLowerCase() !== '') {
    locationChoicesDiv.style.display = 'flex'
  } else {
    locationChoicesDiv.style.display = 'none'
  }

  locationArray.forEach((loc) => {
    if (loc.name.toLowerCase().indexOf(e.target.value.toLowerCase()) != -1) {
      count++

      if (count <= 10) {
        locationChoices.innerHTML += `<option value="${loc.id}">${loc.name}</option>`
      }
    }
  })
  if (count === 0) {
    locationChoicesDiv.style.display = 'none'
  }
}

function addLocation(e) {
  search.value = e.target.textContent
  searchLocation = e.target.value
  fill()
  search.value = ''
  locationChoicesDiv.style.display = 'none'
  container.innerHTML = `<h1>5 Day Forecast</h1>`
}

function getSearchLocation(e) {
  e.preventDefault()
  locationArray.forEach((loc) => {
    if (loc.name.toLowerCase() === search.value.toLowerCase()) {
      searchLocation = loc.id
    }
  })
  fill()
  search.value = ''
  locationChoicesDiv.style.display = 'none'
  container.innerHTML = `<h1>5 Day Forecast</h1>`
}

function getLocationForecast() {
  searchLocation = ''
  fill()
  container.innerHTML = `<h1>5 Day Forecast</h1>`
}
console.log(new Date().getMonth())
window.addEventListener('load', fill)
search.addEventListener('keyup', filterLocations)
locationChoicesDiv.addEventListener('click', addLocation)
form.addEventListener('submit', getSearchLocation)
locBtn.addEventListener('click', getLocationForecast)
