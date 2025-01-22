import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Header from '../components/layout/Header';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import WhyChooseUs from '../components/landing/WhyChooseUs';
import About from '../components/landing/About';
import Contact from '../components/landing/Contact';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
    useEffect(() => {
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    return (
        <div className="bg-white">
            <Header />
            <main>
                <Hero />
                <Features />
                <WhyChooseUs />
                <About />
                <Contact />
            </main>
            <Footer />
        </div>
    );
} 