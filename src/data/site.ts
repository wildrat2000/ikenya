export const COMPANY = {
  name: 'Itukarua Kenya',
  tagline: 'Your IT Warehouse Solutions Hub',
  positioning:
    'Itukarua Kenya builds secure, modern websites and IT infrastructure that help organizations in Nairobi and across Kenya operate reliably and serve customers better.',
  founded: 2020,
  location: 'Nairobi, Kenya',
  email: 'info@itukarua.co.ke',
  contactEmail: 'itukarua2020@gmail.com',
  phone: '+254 721 219 359',
  logo: 'https://d64gsuwffb70l.cloudfront.net/699028e48dbd0899cf16554e_1782303809941_c4804fd2.png',
  heroBg:
    'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782303976305_15e83d96.jpg',
  bookingUrl:
    'https://famous.ai/api/crm/6a3bcc9db53d660313cad858/calendar/public?calendarId=ada5d031-a84c-47e6-a37c-b868ed705075&view=booking',
};

export interface Service {
  id: string;
  title: string;
  desc: string;
  points: string[];
  icon: string;
  img: string;
}

const SERVICE_IMAGES: Record<string, string> = {
  web: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
  hosting: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
  network: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop',
  server: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  software: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
  jobs: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
};

export const SERVICES: Service[] = [
  {
    id: 'web',
    title: 'Web Design & Development',
    desc: 'Fast, secure, and maintainable websites and web applications built with modern best practices.',
    points: ['React, Node.js & Vite', 'Python & WordPress', 'HTML / CSS & ongoing maintenance'],
    icon: 'code',
    img: SERVICE_IMAGES.web,
  },
  {
    id: 'hosting',
    title: 'Hosting & Domain Consulting',
    desc: 'Practical guidance on domain strategy, hosting selection, setup, migrations, and renewals.',
    points: ['Domain strategy & setup', 'Hosting selection & migration', 'Renewals & support guidance'],
    icon: 'globe',
    img: SERVICE_IMAGES.hosting,
  },
  {
    id: 'network',
    title: 'Network Infrastructure',
    desc: 'Planning, deployment, upgrades, and troubleshooting to keep your office network stable and fast.',
    points: ['Office networking & structured cabling', 'Router & firewall deployment', 'Optimization & troubleshooting'],
    icon: 'network',
    img: SERVICE_IMAGES.network,
  },
  {
    id: 'server',
    title: 'Server Solutions',
    desc: 'HP server sales, support, and administration to keep teams productive with the right hardware.',
    points: ['HP server sales & supply', 'Setup & administration', 'Ongoing support'],
    icon: 'server',
    img: SERVICE_IMAGES.server,
  },
  {
    id: 'software',
    title: 'Software Development',
    desc: 'Off-the-shelf and custom software products with practical, dependable ongoing support.',
    points: ['Custom software products', 'Off-the-shelf solutions', 'Maintenance & support'],
    icon: 'box',
    img: SERVICE_IMAGES.software,
  },
  {
    id: 'jobs',
    title: 'Jobs Portal Solutions',
    desc: 'Localized online jobs portal development and day-to-day operations support.',
    points: ['Portal development', 'Localized job listings', 'Operations support'],
    icon: 'briefcase',
    img: SERVICE_IMAGES.jobs,
  },
];

export interface Sector {
  title: string;
  desc: string;
  img: string;
}

export const SECTORS: Sector[] = [
  {
    title: 'Government Institutions',
    desc: 'Secure, compliant digital services and dependable infrastructure for public-sector teams.',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304007153_acce148e.png',
  },
  {
    title: 'SMEs & Growing Businesses',
    desc: 'Affordable websites and IT setups that scale as your business grows.',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304027149_2d3fd106.jpg',
  },
  {
    title: 'Corporates',
    desc: 'Enterprise-grade networks, servers, and web platforms built for performance.',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304174946_63b8e378.jpg',
  },
  {
    title: 'NGOs & Development Orgs',
    desc: 'Reliable technology that helps mission-driven teams reach more people.',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304132797_a9246363.jpg',
  },
  {
    title: 'Educational Institutions',
    desc: 'Computer labs, networks, and school websites that support learning.',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304087626_480d510d.jpg',
  },
  {
    title: 'Individuals',
    desc: 'Personal sites and reliable IT support for freelancers and professionals.',
    img: '/og.png',
  },
];

export const TECH = [
  'React',
  'Node.js',
  'Vite',
  'Python',
  'WordPress',
  'HTML5',
  'CSS3',
  'JavaScript',
  'Linux',
  'HP Servers',
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Itukarua rebuilt our website and stabilized our office network. Downtime is virtually gone and our site loads fast.',
    name: 'James Mwangi',
    role: 'Operations Manager, Nairobi SME',
  },
  {
    quote:
      'Professional, responsive, and dependable. They handled our hosting migration without a single hiccup.',
    name: 'Grace Wanjiru',
    role: 'Director, Development NGO',
  },
  {
    quote:
      'Their server setup and ongoing support keep our team productive. A genuine technology partner.',
    name: 'Daniel Otieno',
    role: 'IT Lead, Corporate Client',
  },
];

export const STATS = [
  { value: 'Since 2020', label: 'Trusted delivery' },
  { value: '6+', label: 'Sectors served' },
  { value: '10+', label: 'Technologies' },
  { value: '24/7', label: 'Support mindset' },
];

export interface Project {
  id: string;
  title: string;
  sector: string;
  serviceType: string;
  img: string;
  summary: string;
  challenge: string;
  solution: string;
  tech: string[];
  result: string;
}

// Sector and service-type values reused from SECTORS / SERVICES titles where possible.
export const PORTFOLIO: Project[] = [
  {
    id: 'gov-portal',
    title: 'County Services Web Portal',
    sector: 'Government Institutions',
    serviceType: 'Web Design & Development',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304408458_74122177.png',
    summary: 'A secure, citizen-facing portal for accessing county services and information.',
    challenge:
      'A county institution relied on an outdated, slow website that frequently went offline and made it hard for citizens to find services or submit requests.',
    solution:
      'We designed and built a fast, accessible, mobile-first portal with a structured content model, secure forms, and a hardened hosting setup with monitoring and backups.',
    tech: ['React', 'Node.js', 'Linux', 'WordPress'],
    result:
      'Page load times dropped by over 60%, uptime reached 99.9%, and citizen service requests submitted online increased significantly within the first quarter.',
  },
  {
    id: 'sme-site',
    title: 'SME Corporate Website & Hosting',
    sector: 'SMEs & Growing Businesses',
    serviceType: 'Hosting & Domain Consulting',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304403333_7871c1bb.jpg',
    summary: 'Brand-aligned marketing website with managed domain and hosting.',
    challenge:
      'A growing Nairobi SME had no professional web presence and was paying for unreliable shared hosting with frequent downtime and email issues.',
    solution:
      'We delivered a modern marketing site, migrated their domain, advised on the right hosting tier, and set up reliable business email and SSL.',
    tech: ['WordPress', 'HTML5', 'CSS3', 'JavaScript'],
    result:
      'The business gained a credible online presence, eliminated email downtime, and saw a measurable rise in inbound enquiries through the contact forms.',
  },
  {
    id: 'corp-network',
    title: 'Corporate Office Network Upgrade',
    sector: 'Corporates',
    serviceType: 'Network Infrastructure',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304063977_2f6b3dbb.jpg',
    summary: 'Structured cabling, firewall, and Wi-Fi redesign for a multi-floor office.',
    challenge:
      'A corporate client experienced constant network drops, slow internal file transfers, and security concerns across a multi-floor office.',
    solution:
      'We planned and deployed structured cabling, segmented the network with a managed firewall, and rolled out optimized enterprise Wi-Fi with monitoring.',
    tech: ['Routers & Firewalls', 'Structured Cabling', 'Linux'],
    result:
      'Network reliability stabilized, internal transfer speeds improved dramatically, and the segmented design reduced the organization\'s security exposure.',
  },
  {
    id: 'ngo-app',
    title: 'NGO Field Data Web Application',
    sector: 'NGOs & Development Orgs',
    serviceType: 'Software Development',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304437216_571759d9.png',
    summary: 'Custom web app for collecting and reporting field program data.',
    challenge:
      'An NGO collected program data on paper and spreadsheets, making reporting to donors slow, error-prone, and difficult to verify.',
    solution:
      'We built a custom web application with role-based access, structured data entry, and automated reporting dashboards, plus training and ongoing support.',
    tech: ['React', 'Node.js', 'Python', 'Linux'],
    result:
      'Reporting time fell from weeks to days, data accuracy improved, and the team could share live program metrics with donors on demand.',
  },
  {
    id: 'school-lab',
    title: 'School Computer Lab & Website',
    sector: 'Educational Institutions',
    serviceType: 'Network Infrastructure',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304087626_480d510d.jpg',
    summary: 'A complete computer lab network plus a modern school website.',
    challenge:
      'A school needed a reliable computer lab for learning and a professional website to communicate with parents, but had limited infrastructure.',
    solution:
      'We supplied and configured endpoints, set up a stable lab network with content filtering, and delivered an easy-to-update school website.',
    tech: ['WordPress', 'Structured Cabling', 'HP Servers'],
    result:
      'Students gained reliable lab access for digital learning, and staff could update news and admissions information without technical help.',
  },
  {
    id: 'jobs-portal',
    title: 'Localized Jobs Portal',
    sector: 'Corporates',
    serviceType: 'Jobs Portal Solutions',
    img: 'https://d64gsuwffb70l.cloudfront.net/6a3bcc9db53d660313cad858_1782304428735_cf8b678d.jpg',
    summary: 'A localized online jobs portal with listings and applicant management.',
    challenge:
      'A client wanted to launch a localized jobs portal but needed both the platform and dependable day-to-day operational support.',
    solution:
      'We developed a searchable jobs portal with employer listings, applicant tracking, and an admin dashboard, then provided ongoing operations support.',
    tech: ['React', 'Node.js', 'Vite', 'Python'],
    result:
      'The portal launched on schedule, onboarded employers steadily, and continues to run reliably with our maintenance and operations support.',
  },
];
