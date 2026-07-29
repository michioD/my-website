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
    title: 'Remote LED Matrix ESP-32 Controller',
    description: 'Implementation of a remote-controlled LED matrix using ESP-32 microcontroller.',
    tags: ['C++', 'Embedded Systems', 'IoT'],
    link: '#',
    image: '/images/ledmatrix.png'
  },
  {
    id: '2',
    title: 'Stochastic Optimization Tool',
    description: 'A Python-based library for solving stochastic programming problems with applications in finance.',
    tags: ['Python', 'Optimization', 'Stochastic'],
    link: '#',
    image: 'https://picsum.photos/seed/stochastic/800/600'
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
