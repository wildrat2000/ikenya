import React from 'react';
import SEO from '@/components/SEO';
import AppLayout from '@/components/AppLayout';
import Portfolio from '@/components/Portfolio';

const PortfolioPage: React.FC = () => (
  <>
    <SEO title="Portfolio" description="See our work — county portals, corporate websites, network upgrades, NGO apps, school labs, and jobs platforms built by Itukarua Kenya." path="/portfolio" />
    <AppLayout>
      <Portfolio />
    </AppLayout>
  </>
);

export default PortfolioPage;