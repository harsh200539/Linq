/**
 * Global Fallback Data for LINQ Corporate Website.
 * Used when the Backend API is unreachable to ensure a content-rich UI.
 */

export const DEFAULT_JOBS = [
  {
    id: 'fallback',
    slug: 'position',
    title: 'Position',
    location: 'Vadodara',
    job_type: '',
    jobType: '',
    status: 'Active',
    description: 'For job-related inquiries, please contact our HR managers.',
    emails: ['Day Shift Team: hr.ds@linq-corporate.com', 'Night Shift Team: hr.ns@linq-corporate.com'],
    status_color: '#05243c',
    avatars: [
      "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
      "https://api.dicebear.com/7.x/notionists/svg?seed=Sasha",
      "https://api.dicebear.com/7.x/notionists/svg?seed=Erik"
    ]
  }
];

export const DEFAULT_MEMBERS = [
  {
    id: 'dm13',
    name: 'Sam Razura',
    role: 'Team Manager',
    detailed_description: 'Sam is a visionary leader with over 10 years of experience in managing high-performance teams. He specializes in strategic planning and operational excellence, ensuring that every project is delivered with the highest standards of quality.',
    image: '/media/career_growth/career-growth-1_cX8JcZj.png',
    category: 'Leadership',
    member_bg_class: 'member-bg-primary',
    experiences: [
      { id: 'de1', year: '2015', title: 'Operations Lead', exp_type: 'hollow' },
      { id: 'de2', year: '2017', title: 'Project Manager', exp_type: 'hollow' },
      { id: 'de3', year: '2020', title: 'Senior Operations Director', exp_type: 'hollow' },
      { id: 'de4', year: '2023', title: 'Team Manager', exp_type: 'filled' }
    ]
  },
  {
    id: 'dm14',
    name: 'Alex Smith',
    role: 'Lead Developer',
    detailed_description: 'Alex is a technical powerhouse with a deep passion for clean code and scalable architecture. Leading our development efforts, he has successfully delivered numerous complex systems, always prioritizing performance and user experience.',
    image: '/media/career_growth/career-growth-1_AmemRLh.png',
    category: 'Technical',
    member_bg_class: 'member-bg-primary',
    experiences: [
      { id: 'de5', year: '2016', title: 'Junior Web Developer', exp_type: 'hollow' },
      { id: 'de6', year: '2018', title: 'Software Engineer', exp_type: 'hollow' },
      { id: 'de7', year: '2021', title: 'Senior Developer', exp_type: 'hollow' },
      { id: 'de8', year: '2024', title: 'Lead Developer', exp_type: 'filled' }
    ]
  },
  {
    id: 'dm15',
    name: 'Jane Doe',
    role: 'UI Designer',
    detailed_description: 'Jane brings a unique blend of creativity and analytical thinking to her designs. Her focus on user-centric design ensures that our interfaces are not only visually stunning but also highly functional.',
    image: '/media/career_growth/career-growth-1_JtXdMl3.png',
    category: 'Creative',
    member_bg_class: 'member-bg-primary',
    experiences: [
      { id: 'de9', year: '2017', title: 'Graphic Designer', exp_type: 'hollow' },
      { id: 'de10', year: '2018', title: 'Junior UI Designer', exp_type: 'hollow' },
      { id: 'de11', year: '2020', title: 'UI/UX Designer', exp_type: 'hollow' },
      { id: 'de12', year: '2024', title: 'Lead UI Designer', exp_type: 'filled' }
    ]
  }
];

export const DEFAULT_TESTIMONIALS = [
  { id: '6', name: 'Sarah Jenkins', role: 'Marketing Director', quote: 'LINQ transformed our approach to market analysis. The insights provided were actionable and directly contributed to our Q3 growth.', category: 'MIDDLE', image: '/media/testimonials/testimonial_0.jpg' },
  { id: '7', name: 'David Chen', role: 'CEO, TechFlow', quote: 'The strategic advisory services are second to none. They understand the intricacies of scaling a startup in a competitive landscape.', category: 'MIDDLE', image: '/media/testimonials/testimonial_1.jpg' },
  { id: '8', name: 'Emily Rodriguez', role: 'Operations Manager', quote: 'Their data management solutions completely streamlined our reporting workflow. We save countless hours every week.', category: 'MIDDLE', image: '/media/testimonials/testimonial_2.jpg' },
  { id: '13', name: 'Thomas Wright', role: 'CTO', quote: 'A seamless experience from start to finish. The technical expertise they brought to our project was exactly what we needed.', category: 'RIGHT', image: '/media/testimonials/testimonial_7.jpg' },
  { id: '14', name: 'Sophia Garcia', role: 'Lead Designer', quote: 'Their attention to detail and commitment to quality is evident in everything they do.', category: 'RIGHT', image: '/media/testimonials/testimonial_8.jpg' }
];

export const DEFAULT_TIMELINE = [
  {
    id: '1',
    year: '2024',
    title: 'Strategic Excellence',
    headline: 'Setting the Pace for <highlight>Strategic Excellence</highlight>.',
    description: 'Our journey began with a vision to revolutionize the digital landscape.',
    thumbnail: '/media/timeline/IMG_6441.webp'
  },
  {
    id: '2',
    year: '2025',
    title: 'Expansion & Growth',
    headline: 'Expanding Influence. <highlight>Amplifying Impact.</highlight>',
    description: 'We expanded our services and team, taking on larger projects.',
    thumbnail: '/media/timeline/IMG_6554.webp'
  },
  {
    id: '3',
    year: '2026',
    title: 'Innovation',
    headline: 'From Insight to <highlight>Industry Momentum</highlight>',
    description: 'Embracing cutting-edge technologies, we pioneered new approaches.',
    thumbnail: '/media/timeline/IMG_6469_1.webp'
  }
];

export const DEFAULT_VISION = {
  title: 'Our Vision',
  subtitle: 'Connecting global industries through ideas that drive opportunity.',
  description: 'Our vision is to connect global industries through ideas that drive opportunity and deliver measurable business value.',
  description_extended: 'Through strong partnerships and a truly global perspective, we work closely with clients to understand their unique challenges.',
  image: '/media/about_us/Vision.webp'
};

export const DEFAULT_VISION_IMAGES = [];


export const DEFAULT_GALLERY = [
  { id: '1', image: '/media/gallery/Peter.webp', image_type: 'a', alt_text: '' },
  { id: '2', image: '/media/gallery/christmas.webp', image_type: 'b', alt_text: '' },
  { id: '3', image: '/media/gallery/WhatsApp_Image_2025-07-25_at_7.57.55_PM_2.webp', image_type: 'c', alt_text: '' },
  { id: '4', image: '/media/gallery/WhatsApp_Image_2025-07-25_at_7.58.18_PM_1.webp', image_type: 'c', alt_text: '' },
  { id: '11', image: '/media/gallery/Xmas.webp', image_type: 'a', alt_text: '' },
  { id: '14', image: '/media/gallery/Navratri25.webp', image_type: 'b', alt_text: '' }
];
