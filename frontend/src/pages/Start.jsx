
import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://thumbs.dreamstime.com/b/mumbai-india-june-best-bus-running-across-street-bmc-municipal-building-city-british-architecture-historical-120177288.jpg)] h-screen pt-8 flex justify-between flex-col w-full'>
        <img className='w-16 ml-8' src="https://github.com/Jeevan-04/PRAVAS/blob/main/mylogo.png?raw=true" alt="" />
        <div className='bg-white pb-8 py-4 px-4'>
          <h2 className='text-[30px] font-semibold'>चला जाऊया प्रवासात !!!</h2>
          <Link to='/login' className='flex items-center justify-center w-full bg-yellow-600 text-white py-3 rounded-lg mt-5'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Start