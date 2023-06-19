import { CircularProgress, Slide, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

import './App.css'

function App () {
  const [cityName, setCityName] = useState('Copenhagen')
  const [inputText, setInputText] = useState('')
  const [data, setData] = useState({})
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCityWeather () {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL_API + cityName}`
        )
        if (response.status === 200) {
          error && setError(false)
          const weatherData = await response.json()
          setLoading(false)

          if (weatherData?.cod !== '404') {
            setData(weatherData)
          } else {
            setError(true)
          }
        } else if (response.status === 429) {
          alert('Too many requests please try again later')
        }
      } catch (error) {
        setLoading(false)
        alert('Try again later please')
      }
    }
    getCityWeather()
  }, [cityName])

  const handleSearch = e => {
    if (e.key === 'Enter') {
      setCityName(e.target.value)
      setInputText('')
    }
  }

  return (
    <div className='bg_img'>
      {!loading ? (
        <>
          <TextField
            variant='filled'
            label='Search city'
            className='input'
            error={error}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleSearch}
          />
          {data?.weather?.length > 0 && (
            <div className='weather_box'>
              <h1 className='city'>
                {data.name}, {data.sys.country}
              </h1>
              <div className='group'>
                <img
                  src={`http://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`}
                  alt=''
                />
                <h1>{data.weather[0].main}</h1>
              </div>

              <h1 className='temp'>{data.main.temp.toFixed()} °C</h1>

              <Slide direction='right' timeout={800} in={!loading}>
                <div className='box_container'>
                  <div className='box'>
                    <p>Humidity</p>
                    <h1>{data.main.humidity.toFixed()}%</h1>
                  </div>

                  <div className='box'>
                    <p>Wind</p>
                    <h1>{data.wind.speed.toFixed()} km/h</h1>
                  </div>

                  <div className='box'>
                    <p>Feels Like</p>
                    <h1>{data.main.feels_like.toFixed()} °C</h1>
                  </div>
                </div>
              </Slide>
            </div>
          )}
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  )
}

export default App
