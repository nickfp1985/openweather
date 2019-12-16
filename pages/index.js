import React, { useState } from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'

const ICONMAP = {
  '01d': 'sunny'
}


const Home = () => {
  const [loading, setLoading] = useState(false)
  const [zipCode, setZipCode] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)

  const getWeatherFromURL = async (url) => {
    setLoading(true)
    const res = await fetch(`http://api.openweathermap.org/data/2.5/${url}&APPID=${process.env.OPENWEATHER_API}&units=imperial`)
    const json = await res.json()
    const weatherContext = {
      condition: json.weather[0].main,
      conditionDescription: json.weather[0].description,
      temperatures: json.main,
      wind: json.wind,
      location: json.name,
      icon: ICONMAP[json.weather[0].icon]
    }
    setCurrentWeather(weatherContext)
    setLoading(false)
  }

  const getWeatherForCoords = async ({latitude, longitude}) => {
    console.log(`Finding weather for location at coordinates: lat: ${latitude} lng: ${longitude}`)
    await getWeatherFromURL(`weather?lat=${latitude}&lon=${longitude}`)
  }

  const getWeatherForZipCode = async () => {
    if (zipCode.length !== 5) {
      console.log('Error invalid zip')
      return
    }
    await getWeatherFromURL(`weather?zip=${zipCode},us`)
  }

  const locateMe = () => {
    console.log('locate me!')
    const locationOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log(pos)
        getWeatherForCoords(pos.coords)
      },
      (err) => { console.log('error!', err)},
      locationOptions
    )
  }

  let weatherDisplay = null
  if (currentWeather) {
    weatherDisplay = (
      <p>
        Conditions are {currentWeather.condition} in {currentWeather.location}.
        The temperature is {currentWeather.temperatures.temp}&deg; and feels like {currentWeather.temperatures.feels_like}&deg;.
        <img src={`/static/icons/${currentWeather.icon}.svg`} />
      </p>
    )
  }

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={locateMe}>
        Find my location
      </button>

      <input type="text" onChange={(e)=> setZipCode(e.target.value)} />
      <button onClick={getWeatherForZipCode}>Lookup</button>

      {(loading) ? 'Loading...' : ''}

      {weatherDisplay}

      <style jsx>{`

      `}</style>
    </div>
  )
}

Home.getInitialProps = async ({ req }) => {
  const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=London&APPID=${process.env.OPENWEATHER_API}`)
  const resJson = await res.json()
  console.log(resJson)
  return {}
}


export default Home
