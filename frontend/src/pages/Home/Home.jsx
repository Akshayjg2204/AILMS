import React from 'react'
import HeroSection from '../../components/Home/HeroSection/HeroSection'
import Navbar from '../../components/Navbar/Navbar'
import FeaturesSection from '../../components/Home/Features/Features'

export default function Home() {
  return (
    <div>
        <HeroSection/>
        <FeaturesSection/>
        <section style={{marginTop: '3rem', padding: '1.5rem 0', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center'}}>
          <h3 style={{margin: 0, color: '#333'}}>Creator</h3>
          <p style={{margin: '0.5rem 0 0 0', color: '#555', fontWeight: 'bold'}}>Akshay Gaikwad</p>
        </section>
    </div>
  )
}
