import React from 'react';
import SEO from '@/components/SEO';
import AppLayout from '@/components/AppLayout';
import Contact from '@/components/Contact';

const ContactPage: React.FC = () => (
  <>
    <SEO title="Contact" description="Get in touch with Itukarua Kenya. Call, email, or book a consultation for IT services in Nairobi and across Kenya." path="/contact" />
    <AppLayout>
      <Contact />
    </AppLayout>
  </>
);

export default ContactPage;