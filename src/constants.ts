export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
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
    title: 'Numerical Methods for PDE',
    description: 'Implementation of finite element methods for solving partial differential equations in structural mechanics.',
    tags: ['MATLAB', 'Numerical Analysis', 'PDE'],
    link: '#',
    image: 'https://picsum.photos/seed/math-pde/800/600'
  },
  {
    id: '2',
    title: 'Stochastic Optimization Tool',
    description: 'A Python-based library for solving stochastic programming problems with applications in finance.',
    tags: ['Python', 'Optimization', 'Stochastic'],
    link: '#',
    image: 'https://picsum.photos/seed/stochastic/800/600'
  },
  {
    id: '3',
    title: 'KTH Campus Map API',
    description: 'A lightweight API for navigating KTH campus buildings and lecture halls.',
    tags: ['TypeScript', 'Node.js', 'API'],
    link: '#',
    image: 'https://picsum.photos/seed/kth-map/800/600'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Linear Algebra in Machine Learning',
    excerpt: 'Deep dive into how singular value decomposition powers modern recommendation systems.',
    date: 'March 1, 2026',
    readTime: '10 min read',
    category: 'Mathematics',
    content: ''
  },
  {
    id: '2',
    title: 'Life as a Teknisk Matematik Student',
    excerpt: 'Reflections on the first three years at KTH and the transition to master studies.',
    date: 'February 10, 2026',
    readTime: '6 min read',
    category: 'Student Life',
    content: ''
  }
];
