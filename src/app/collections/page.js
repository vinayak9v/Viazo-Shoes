import Footer from '../../components/components/Footer'
import Navbar from '../../components/components/Navbar'
import React from 'react'
import CollectionsPage from './components/CollectionsPage'

function page() {
  return (
    <div>
      <Navbar/>
      <CollectionsPage/>
      <Footer/>
    </div>
  )
}

export default page
