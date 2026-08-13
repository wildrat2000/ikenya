import React from 'react';
import SEO from '@/components/SEO';
import AppLayout from '@/components/AppLayout';
import Hero from '@/components/Hero';
import WebsitePortfolioSlider from '@/components/WebsitePortfolioSlider';
import TechStack from '@/components/TechStack';

const HomePage: React.FC = () => (
  <>
    <SEO />
    <AppLayout>
      <Hero />
      <WebsitePortfolioSlider />
      <TechStack />
    </AppLayout>
  </>
);

export default HomePage;