// =============================================================================
//  YOUR CONTENT LIVES HERE
//  This is the only file you need to edit to make the site yours.
//  Every project below is a placeholder. Replace the text, point `image` and
//  `gallery` at your own files in /public/images (or any https URL), and add or
//  remove projects freely: the helix, the list, the project pages, the sitemap
//  and the Open Graph images all follow this array.
// =============================================================================

/**
 * @typedef {Object} Project
 * @property {string}   slug        URL part: /projects/<slug>. Lowercase, no spaces.
 * @property {string}   title       Shown on hover, in the list and on the project page.
 * @property {string}   year
 * @property {string}   role        What you did.
 * @property {string}   client
 * @property {string[]} tags
 * @property {string}   summary     One sentence. Also used as the page description for search and link previews.
 * @property {string[]} description Paragraphs for the project page.
 * @property {string}   image       Cover. Used on the helix and as the project page hero. 16:9 works best.
 * @property {string[]} gallery     Extra images shown on the project page.
 * @property {string}   [link]      Optional live URL.
 */

export const portfolio = {
  site: {
    name: 'Helix Portfolio',
    author: 'Your Name',
    role: 'Designer & creative developer',
    lang: 'en',
    // Used for link previews when no NUXT_PUBLIC_SITE_URL is set and you are not on Vercel.
    url: 'https://helix-portfolio.vercel.app',
    description:
      'Selected work on a scroll-driven WebGL helix. A placeholder portfolio built with Nuxt and Three.js — replace this text with your own.',
    email: 'hello@example.com',
    location: 'Somewhere on Earth',
    socials: [
      { label: 'GitHub', url: 'https://github.com/' },
      { label: 'Instagram', url: 'https://instagram.com/' },
      { label: 'LinkedIn', url: 'https://linkedin.com/' },
    ],
    about: [
      'This is placeholder text for your introduction. Say who you are, what you make and who you make it for, in two or three short sentences.',
      'A second paragraph can cover how you work: the tools you like, the teams you have been part of, the kind of projects you want more of.',
    ],
    services: ['Art direction', 'Interface design', 'Creative development', 'WebGL & motion'],
    clients: ['Studio North', 'Placeholder Inc.', 'Example Records', 'Sample Gallery', 'Demo Labs'],
  },

  // Optional: your own sound files (mp3, ogg or wav in /public/sounds).
  // Leave a value as null to use the small tones the site synthesises itself.
  sounds: {
    hover: null, // '/sounds/hover.mp3'
    click: null,
    open: null,
    close: null,
    switch: null,
    ambient: null,
  },

  /** @type {Project[]} */
  projects: [
    {
      slug: 'project-01',
      title: 'Project 01',
      year: '2026',
      role: 'Art direction, WebGL',
      client: 'Placeholder Client',
      tags: ['Website', 'WebGL'],
      summary: 'A placeholder project. Replace this sentence with what the project was and why it mattered.',
      description: [
        'This paragraph is placeholder copy. Describe the brief, the problem you were solving and who it was for.',
        'Use a second paragraph for the approach: the idea, the process, the technical choices and the result.',
      ],
      image: '/images/project-01/cover.svg',
      gallery: ['/images/project-01/detail-1.svg', '/images/project-01/detail-2.svg'],
    },
    {
      slug: 'project-02',
      title: 'Project 02',
      year: '2026',
      role: 'Interface design',
      client: 'Placeholder Client',
      tags: ['App', 'UI'],
      summary: 'A placeholder project. Replace this sentence with what the project was and why it mattered.',
      description: [
        'This paragraph is placeholder copy. Describe the brief, the problem you were solving and who it was for.',
        'Use a second paragraph for the approach: the idea, the process, the technical choices and the result.',
      ],
      image: '/images/project-02/cover.svg',
      gallery: ['/images/project-02/detail-1.svg', '/images/project-02/detail-2.svg'],
    },
    {
      slug: 'project-03',
      title: 'Project 03',
      year: '2025',
      role: 'Creative development',
      client: 'Placeholder Client',
      tags: ['Installation', 'Motion'],
      summary: 'A placeholder project. Replace this sentence with what the project was and why it mattered.',
      description: [
        'This paragraph is placeholder copy. Describe the brief, the problem you were solving and who it was for.',
        'Use a second paragraph for the approach: the idea, the process, the technical choices and the result.',
      ],
      image: '/images/project-03/cover.svg',
      gallery: ['/images/project-03/detail-1.svg', '/images/project-03/detail-2.svg'],
    },
    {
      slug: 'project-04',
      title: 'Project 04',
      year: '2025',
      role: 'Branding, Website',
      client: 'Placeholder Client',
      tags: ['Identity', 'Website'],
      summary: 'A placeholder project. Replace this sentence with what the project was and why it mattered.',
      description: [
        'This paragraph is placeholder copy. Describe the brief, the problem you were solving and who it was for.',
        'Use a second paragraph for the approach: the idea, the process, the technical choices and the result.',
      ],
      image: '/images/project-04/cover.svg',
      gallery: ['/images/project-04/detail-1.svg', '/images/project-04/detail-2.svg'],
    },
    {
      slug: 'project-05',
      title: 'Project 05',
      year: '2025',
      role: '3D, Motion',
      client: 'Placeholder Client',
      tags: ['Film', '3D'],
      summary: 'A placeholder project. Replace this sentence with what the project was and why it mattered.',
      description: [
        'This paragraph is placeholder copy. Describe the brief, the problem you were solving and who it was for.',
        'Use a second paragraph for the approach: the idea, the process, the technical choices and the result.',
      ],
      image: '/images/project-05/cover.svg',
      gallery: ['/images/project-05/detail-1.svg', '/images/project-05/detail-2.svg'],
    },
    {
      slug: 'project-06',
      title: 'Project 06',
      year: '2024',
      role: 'Design, Development',
      client: 'Placeholder Client',
      tags: ['E-commerce', 'Website'],
      summary: 'A placeholder project. Replace this sentence with what the project was and why it mattered.',
      description: [
        'This paragraph is placeholder copy. Describe the brief, the problem you were solving and who it was for.',
        'Use a second paragraph for the approach: the idea, the process, the technical choices and the result.',
      ],
      image: '/images/project-06/cover.svg',
      gallery: ['/images/project-06/detail-1.svg', '/images/project-06/detail-2.svg'],
    },
    {
      slug: 'project-07',
      title: 'Project 07',
      year: '2024',
      role: 'Art direction',
      client: 'Placeholder Client',
      tags: ['Campaign', 'Print'],
      summary: 'A placeholder project. Replace this sentence with what the project was and why it mattered.',
      description: [
        'This paragraph is placeholder copy. Describe the brief, the problem you were solving and who it was for.',
        'Use a second paragraph for the approach: the idea, the process, the technical choices and the result.',
      ],
      image: '/images/project-07/cover.svg',
      gallery: ['/images/project-07/detail-1.svg', '/images/project-07/detail-2.svg'],
    },
    {
      slug: 'project-08',
      title: 'Project 08',
      year: '2023',
      role: 'Creative development',
      client: 'Placeholder Client',
      tags: ['Experiment', 'WebGL'],
      summary: 'A placeholder project. Replace this sentence with what the project was and why it mattered.',
      description: [
        'This paragraph is placeholder copy. Describe the brief, the problem you were solving and who it was for.',
        'Use a second paragraph for the approach: the idea, the process, the technical choices and the result.',
      ],
      image: '/images/project-08/cover.svg',
      gallery: ['/images/project-08/detail-1.svg', '/images/project-08/detail-2.svg'],
    },
    {
      slug: 'project-09',
      title: 'Project 09',
      year: '2023',
      role: 'Design',
      client: 'Placeholder Client',
      tags: ['Editorial', 'Website'],
      summary: 'A placeholder project. Replace this sentence with what the project was and why it mattered.',
      description: [
        'This paragraph is placeholder copy. Describe the brief, the problem you were solving and who it was for.',
        'Use a second paragraph for the approach: the idea, the process, the technical choices and the result.',
      ],
      image: '/images/project-09/cover.svg',
      gallery: ['/images/project-09/detail-1.svg', '/images/project-09/detail-2.svg'],
    },
  ],
}

/** @param {string} slug */
export function getProject(slug) {
  return portfolio.projects.find((p) => p.slug === slug) || null
}

/** The project after `slug`, wrapping round to the first. */
export function getNextProject(slug) {
  const i = portfolio.projects.findIndex((p) => p.slug === slug)
  if (i === -1) return null
  return portfolio.projects[(i + 1) % portfolio.projects.length]
}
