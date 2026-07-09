import React from 'react';
import SEO from '@/components/SEO';
import AppLayout from '@/components/AppLayout';
import About from '@/components/About';

const AboutPage: React.FC = () => (
  <>
    <SEO title="About" description="Learn about Itukarua Kenya — IT solutions provider based in Nairobi. Secure, modern websites, network infrastructure, and server support." path="/about" />
    <AppLayout>
      <About />
    </AppLayout>
  </>
);

export default AboutPage;