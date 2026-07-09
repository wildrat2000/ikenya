import React from 'react';
import { Helmet } from 'react-helmet-async';
import { COMPANY } from '@/data/site';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
}

const SITE_URL = 'https://itukarua.co.ke';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.name,
  url: SITE_URL,
  logo: 'https://d64gsuwffb70l.cloudfront.net/699028e48dbd0899cf16554e_1782303809941_c4804fd2.png',
  description: COMPANY.positioning,
  foundingDate: '2020',
  email: COMPANY.email,
  telephone: COMPANY.phone,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: COMPANY.phone,
    contactType: 'sales',
    email: COMPANY.email,
  },
  location: {
    '@type': 'Place',
    name: 'Nairobi, Kenya',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: COMPANY.name,
  url: SITE_URL,
  description: COMPANY.tagline,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const SEO: React.FC<SEOProps> = ({
  title,
  description = COMPANY.positioning,
  path = '',
  image = '/og.png',
  type = 'website',
}) => {
  const fullTitle = title ? `${title} | ${COMPANY.name}` : `${COMPANY.name} | ${COMPANY.tagline}`;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${SITE_URL}${image}`} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={COMPANY.name} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${image}`} />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <script type="application/ld+json">
        {JSON.stringify([organizationJsonLd, websiteJsonLd])}
      </script>
    </Helmet>
  );
};

export default SEO;