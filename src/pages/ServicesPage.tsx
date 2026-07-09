import React from 'react';
import SEO from '@/components/SEO';
import AppLayout from '@/components/AppLayout';
import Services from '@/components/Services';

const ServicesPage: React.FC = () => (
  <>
    <SEO title="Services" description="Web design, hosting, network infrastructure, server solutions, software development, and jobs portal — IT services in Nairobi, Kenya." path="/services" />
    <AppLayout>
      <Services />
    </AppLayout>
  </>
);

export default ServicesPage;