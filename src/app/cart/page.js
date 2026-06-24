"use client";
import React from 'react'
import Navbar from '../../components/components/Navbar'

import CartPage from './components/CartPage'
// import Footer from '@/components/components/Footer'

function page() {
  return (
    <div>
      <Navbar/>
      <CartPage/>
      {/* <Footer/> */}
    </div>
  )
}

export default page
