import React from 'react'

import HeroSection from './components/HeroSection'
import FeaturesBanner from './components/FeaturesBanner'
import CollectionsSection from './components/CollectionsSection'
import FeaturedProducts from './components/FeaturedProducts'
import BannerSection from './components/BannerSection'
import ScrollShowcase from './components/ScrollShowcase'
import Navbar from '../../components/components/Navbar'
import Footer from '../../components/components/Footer'
import MarqueeSection from './components/MarqueeSection'
import ReelsSection from './components/ReelsSection'


function Landing() {
  return (
    <div>
      <Navbar/>  
      <HeroSection/>
      <FeaturesBanner/>
      <CollectionsSection/>
      <FeaturedProducts/>
      <MarqueeSection/>
      
      {/* <BannerSection/> */}
      <ScrollShowcase/>
        <ReelsSection/>
    

      <Footer/>
    </div>
  )
}

export default Landing
