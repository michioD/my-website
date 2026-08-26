import mcHostingMd from './blog-markdown/mc_hosting_s10.md?raw';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  githubLink?: string;
  image: string;
  imageClassName?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Remote LED Matrix ESP-32 Controller',
    description: 'Implementation of a remote-controlled LED matrix using ESP-32 microcontroller.',
    tags: ['C++', 'Embedded Systems', 'IoT'],
    link: '/projects/led-matrix',
    githubLink: 'https://github.com/michioD/led-matrix-esp32',
    image: '/images/ledmatrix.png',
    imageClassName: 'object-cover object-[center_80%]'
  },

  {
    id: '2',
    title: 'SL Metro Delay Predictor',
    description: 'An end-to-end MLOps pipeline fetching real-time GTFS streams to predict transit delays across Stockholm.',
    tags: ['Python', 'FastAPI', 'MLOps', 'Data Engineering'],
    link: '/sl-metro',
    githubLink: 'https://github.com/michioD/sl-metro-predict',
    image: '/images/waiting.png',
    imageClassName: 'object-cover object-[center_1%]'
  },

  // {
  //   id: '3',
  //   title: 'Stochastic Optimization Tool',
  //   description: 'A Python-based library for solving stochastic programming problems with applications in finance.',
  //   tags: ['Python', 'Optimization', 'Stochastic'],
  //   link: '#',
  //   githubLink: 'https://github.com/michioD',
  //   image: 'https://picsum.photos/seed/stochastic/800/600'
  // }
];

export function parseBlogPost(id: string, title: string, rawMd: string, date: string, category: string): BlogPost {
  const lines = rawMd.split('\n');
  // Extract excerpt (first non-empty paragraph that isn't a heading or an image)
  const excerpt = lines.find(l => {
    const trimmed = l.trim();
    return trimmed.length > 0 && !trimmed.startsWith('#') && !trimmed.startsWith('![');
  })?.trim() || '';
  
  // Calculate read time based on 238 words per minute
  const wordCount = rawMd.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 238));
  const readTime = `${minutes} min read`;

  return { id, title, excerpt, date, readTime, category, content: rawMd };
}

export const BLOG_POSTS: BlogPost[] = [
  parseBlogPost('2026-08-07','Self-hosting minecraft server on an old S10+', mcHostingMd, 'August 7, 2026', 'Mini Projects')
];
