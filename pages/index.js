import React from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'

const Home = () => {

  const getWeatherForCoords = async ({latitude, longitude}) => {
    console.log(`Finding weather for location at coordinates: lat: ${latitude} lng: ${longitude}`)
    const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${process.env.OPENWEATHER_API}`)
    const json = await res.json()
    console.log(json)
    return json
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

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={locateMe}>
        Find my location
      </button>

      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%;
          padding-top: 80px;
          line-height: 1.15;
          font-size: 48px;
        }
        .title,
        .description {
          text-align: center;
        }
        .row {
          max-width: 880px;
          margin: 80px auto 40px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
        .card {
          padding: 18px 18px 24px;
          width: 220px;
          text-align: left;
          text-decoration: none;
          color: #434343;
          border: 1px solid #9b9b9b;
        }
        .card:hover {
          border-color: #067df7;
        }
        .card h3 {
          margin: 0;
          color: #067df7;
          font-size: 18px;
        }
        .card p {
          margin: 0;
          padding: 12px 0 0;
          font-size: 13px;
          color: #333;
        }
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
