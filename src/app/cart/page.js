import React, { Suspense } from 'react'
import Navbar from '../../components/components/Navbar'

import CartPage from './components/CartPage'
// import Footer from '@/components/components/Footer'

function page() {
  return (
    <div>
      <Navbar/>
      <Suspense fallback={<div className="p-10 text-center">Loading cart...</div>}>
        <CartPage/>
      </Suspense>
      {/* <Footer/> */}
    </div>
  )
}

export default page
