export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube'

export const socialProfiles = [
  {
    platform: 'facebook' as const,
    href: 'https://www.facebook.com/dalle.b.cleto/',
    label: 'Facebook',
  },
  {
    platform: 'instagram' as const,
    href: 'https://www.instagram.com/dlleclto/',
    label: 'Instagram',
  },
  {
    platform: 'tiktok' as const,
    href: 'https://www.tiktok.com/@dallebaramedaclet6',
    label: 'TikTok',
  },
  {
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/@cletodalleb.235',
    label: 'YouTube',
  },
] as const

export type SocialProfile = (typeof socialProfiles)[number]

export const site = {
  name: 'Dalle B. Cleto',
  photo: '/profile.jpg',
  title: 'Developer',
  tagline: 'IT Specialist',
  summary:
    'IT Specialist with strong experience in designing system architectures and developing full-stack enterprise solutions that automate business processes. Skilled in C#, Node.js, React.js, TypeScript, PHP, Kotlin, Tailwind CSS, and databases including MongoDB, MySQL, and SQL. Experienced in system troubleshooting, network support, SAP management, and authentication systems — delivering reliable, user-focused solutions that improve productivity.',
  work:
    'What you focus on at work—your role, stack, or how you like to build. Edit this in src/content.ts.',
  email: 'dallecleto9@gmail.com',
  cv: '/Dalle-B-Cleto-CV.pdf',
  links: [
    { label: 'GitHub', href: 'https://github.com/yourusername' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yourusername' },
  ] as const,
}

export const skills = [
  {
    category: 'Frontend',
    items: [
      { name: 'HTML · CSS · JavaScript', level: 95 },
      { name: 'React.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Tailwind CSS', level: 85 },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', level: 88 },
      { name: 'REST API', level: 90 },
      { name: 'WebSocket', level: 80 },
      { name: 'PHP', level: 80 },
      { name: 'C#', level: 78 },
    ],
  },
  {
    category: 'Mobile',
    items: [
      { name: 'Kotlin', level: 78 },
      { name: 'Android Studio', level: 75 },
    ],
  },
  {
    category: 'Database',
    items: [
      { name: 'SQL / MySQL', level: 88 },
      { name: 'MongoDB', level: 72 },
    ],
  },
] as const

export const stats = [
  { value: 2, suffix: '+', label: 'Years Experience' },
  { value: 20, suffix: '+', label: 'Projects Delivered' },
  { value: 10, suffix: '+', label: 'Technologies Used' },
  { value: 3,  suffix: '+', label: 'Enterprise Systems' },
] as const

export const workExperience = [
  {
    role: 'IT Specialist',
    company: 'Premium Feeds Corporation',
    period: 'July 2024 – Present',
    bullets: [
      'Design system architecture, create Data Flow Diagrams (DFD), and build prototypes based on business requirements.',
      'Collaborate with management to understand manual workflow challenges and develop full-stack systems that automate processes and improve productivity.',
      'Build and implement secure backend and frontend features, including authentication, authorization, and user management systems.',
      'Build and maintain full-stack system applications using C#, Node.js, React.js (JavaScript/TypeScript), PHP, and Kotlin, with frontend technologies HTML and Tailwind CSS, and databases MongoDB, SQL, and MySQL.',
      'Perform software and system troubleshooting across multiple platforms.',
      'Maintain and manage company systems, including SAP and file servers.',
      'Handle network troubleshooting and ensure stable system connectivity.',
      'Encode and manage data within the SAP system.',
    ],
  },
  {
    role: 'Video Editor',
    company: 'Bulacan State University',
    period: 'March 2023 – June 2023',
    bullets: [
      'Gathered and organized inventory, maintenance, LUDIP project, and accomplishment data for multiple offices.',
      'Directed video and photography efforts to create compelling content for AVP and laboratories.',
      'Managed visual documentation of laboratory equipment, roads, PWD ramps, emergency exits, fire safety equipment, alarms, covered walkways, and waste management.',
      'Created motion graphics and animations using Filmora and Adobe Premiere for impactful audio-visual presentations.',
      'Produced high-quality documents, presentations, and program invitations using PowerPoint, Excel, Adobe Photoshop, Microsoft Word, Microsoft Publisher, and Canva.',
      'Provided support in event management and handled telephone inquiries from various departments.',
    ],
  },
  {
    role: 'Front End Developer (Intern)',
    company: 'Accenture',
    period: 'February 2022 – May 2022',
    bullets: [
      'Collaborated with a team to develop and enhance the Web-Based Faculty Accomplishments Report (WFAR) Management System, streamlining faculty reporting.',
      'Built web components and user interfaces using React.js, JavaScript, CSS, and HTML.',
      'Designed landing pages, functional tables, and user-friendly report layouts.',
      'Engineered user registration and login forms for seamless onboarding and security.',
      'Created a functional prototype using Figma to actively contribute to project success.',
    ],
  },
  {
    role: 'Production Assistant',
    company: 'GMA Network Inc',
    period: 'October 2019 – November 2019',
    bullets: [
      'Played a hands-on role in optimizing on-set operations — organizing materials for upcoming scenes and contributing to set construction, cleanup, and design.',
      'Spearheaded the design of floral arrangements and curtains, enhancing the set\'s ambiance and aesthetics to align with the production\'s vision.',
    ],
  },
] as const

export const education = [
  {
    degree: 'Bachelor of Science in Information Technology, Web and Mobile Development',
    school: 'Bulacan State University',
    years: '2018 – 2022',
  },
  {
    degree: 'Information and Communication Technology (ICT), Senior High School',
    school: 'ACLC College of Malolos',
    years: '2016 – 2018',
  },
  {
    degree: 'High School',
    school: 'Dampol 1st National High School',
    years: '2012 – 2016',
  },
] as const

export const projects = [
  {
    name: 'Premium Feeds Corporation — Corporate Website',
    type: 'Professional Project',
    tech: 'HTML · CSS · JavaScript · PHP · PHPMailer · MySQL',
    href: 'https://premiumfeeds.com.ph/',
    description: 'A full corporate website built for Premium Feeds Corporation, featuring a public-facing site with a hero section, Products & Services catalog, Events and Announcements, About Us, Careers, and Contact pages. The system includes a custom admin panel where non-technical staff can manage all website content — adding, editing, and reordering Products, Events, and Announcements through a drag-and-drop interface — without writing any code. PHPMailer handles contact form submissions.',
    cover: '/projects/pfc-website/cover.jpg',
    gallery: [
      {
        src: '/projects/pfc-website/cover.jpg',
        caption: 'Hero section — "Our Quality, Your Profitability" banner with navigation for Products & Services, Events and Announcements, About, Careers, and Contact.',
      },
      {
        src: '/projects/pfc-website/slide-1.jpg',
        caption: 'Products & Services page — showcases Hog Feeds, Broiler Feeds, and Layer Feeds with product cards and images, dynamically managed from the admin panel.',
      },
      {
        src: '/projects/pfc-website/slide-2.jpg',
        caption: 'Events and Announcements page — displays corporate events and CSR activities with images and descriptions, all editable through the admin panel.',
      },
      {
        src: '/projects/pfc-website/slide-3.jpg',
        caption: 'About Us page — company history, mission, and social media links with an image carousel, fully manageable from the admin side.',
      },
      {
        src: '/corp4.jpg',
        caption:
          'Premium Feeds Admin — Events & Announcements: manage CSR and company events in a table with cover images, ordering, status, and actions (including a Photos gallery per event).',
      },
      {
        src: '/corp5.jpg',
        caption:
          'Premium Feeds Admin — Products: drag-and-drop ordering, product images, categories (Hogs / Broiler), and per-product Variants, Edit, and Delete controls.',
      },
      {
        src: '/corp6.jpg',
        caption:
          'Premium Feeds Admin — Careers / Job Postings: manage listings with job title, location, display order, active status, and Edit / Delete actions.',
      },
    ],
  },
  {
    name: 'Inventory Management System — Premium Choice Meatshop',
    type: 'Professional Project',
    tech: 'TypeScript · Tailwind CSS · Node.js · SQL · REST API · WebSocket',
    description: 'A large-scale, multi-branch inventory management system built for Premium Choice Inc. (Meatshop), covering Cold Storage and 5 store branches. The Super Admin centralizes and monitors inventory data across all branches in real time. Key features include: delivery management and tracking, product traceability (e.g. a whole pork carcass can be traced as it is converted into individual cuts like adobo cut, pork chop, etc. — tracking exactly which batch each product came from), SKU management, stock requests and approvals, low stock and expiry alerts, variance reports, analytics, and a built-in real-time chat system that allows users to communicate and attach files — making it a complete operational platform for the entire supply chain.',
    cover: '/projects/inventory-system/cover.jpg',
    gallery: [
      {
        src: '/projects/inventory-system/cover.jpg',
        caption: 'Login page — role-based authentication for Super Admin, Admin, and branch-level users, branded for Premium Choice Meatshop.',
      },
      {
        src: '/projects/inventory-system/slide-1.jpg',
        caption: 'Cold Storage Dashboard (Super Admin) — manage products across all branches with SKU Management, Stock Requests, Processing, Delivery, Late Receiving, Variance Report, and Analytics tabs. Supports Excel upload and CSV export.',
      },
      {
        src: '/projects/inventory-system/slide-2.jpg',
        caption: 'Branch Store Dashboard — each branch sees their own inventory stats: Total Products, Low Stock Items, Expiring Soon, and High Priority Alerts, with a live Inventory Value Trend chart and quick action buttons.',
      },
      {
        src: '/projects/inventory-system/slide-3.jpg',
        caption: 'Built-in Chat — real-time messaging between users across branches with file and image attachment support, enabling seamless communication within the platform.',
      },
    ],
  },
  {
    name: 'Vehicle, Photolocation & Asset Management System',
    type: 'Professional Project',
    tech: 'Node.js · React.js · TypeScript · SQL · REST API · WebSocket',
    description: 'A full-stack enterprise web system built for Premium Feeds Corporation that centralizes Vehicle Management, Receipt and Reimbursement tracking, Photolocation attendance monitoring, Device and Asset Management, ANQA Department workflows, and User Management for both web and mobile app users — all under a single admin dashboard with role-based access control and activity logging.',
    cover: '/projects/pfc-system/cover.jpg',
    gallery: [
      {
        src: '/projects/pfc-system/cover.jpg',
        caption: 'Login page — "Vehicle, Photolocation & Asset Management System" for Premium Feeds Corporation, with a link to the SAP Request System.',
      },
      {
        src: '/projects/pfc-system/slide-1.jpg',
        caption: 'Admin Dashboard — centralized management of Vehicle, Receipt, Photolocation, Device, Asset, User Management, ANQA Department, Activity Logs, and Password controls.',
      },
    ],
  },
  {
    name: 'Photolocation — Attendance & Document App',
    type: 'Professional Project',
    tech: 'Kotlin · XML · Android Studio · Node.js · REST API · SQL · OpenCage API',
    description: 'A Kotlin-based Android mobile app built with Android Studio for Premium Feeds Corporation field employees. It connects to a Node.js REST API backend and supports photo-based attendance with GPS location tagging, document scanning, and reimbursement receipt submission — all with offline support. The app displays a built-in time and date that is synchronized with the server to ensure accurate and tamper-proof attendance records. It dynamically adapts its theme and data based on the user\'s assigned company, and uses the OpenCage Data API to convert GPS coordinates into human-readable addresses.',
    cover: '/projects/photolocation/slide-1.jpg',
    gallery: [
      {
        src: '/projects/photolocation/slide-1.jpg',
        caption: 'Login screen — secured with username/password authentication, branded for Premium Feeds Corporation.',
      },
      {
        src: '/projects/photolocation/slide-2.jpg',
        caption: 'Home screen — quick access to Take Photo for Attendance, Scan Document, and Reimbursement with offline-supported recent attendance records.',
      },
      {
        src: '/projects/photolocation/slide-3.jpg',
        caption: 'Reimbursement module — employees submit and track official receipts categorized by type: Official, Fleet Card, Non-Valid, and DEC.',
      },
      {
        src: '/projects/photolocation/slide-4.jpg',
        caption: 'Document Scanner — real-time camera-based document scanning with Manual and Auto capture modes.',
      },
      {
        src: '/projects/photolocation/slide-5.jpg',
        caption: 'Attendance List — searchable, date-filtered log of all photo-based attendance entries with GPS-resolved location names.',
      },
      {
        src: '/projects/photolocation/slide-6.jpg',
        caption: 'Photos by Area — attendance photos automatically grouped by location using OpenCage API to convert GPS coordinates into human-readable addresses.',
      },
      {
        src: '/projects/photolocation/slide-7.jpg',
        caption: 'Dynamic theme (PCI) — the UI adapts to an orange accent when the user is assigned to the PCI company profile.',
      },
      {
        src: '/projects/photolocation/slide-8.jpg',
        caption: 'Dynamic theme (Load Master) — the app applies a dark red brand color for Load Master company assignments.',
      },
      {
        src: '/projects/photolocation/slide-9.jpg',
        caption: 'Multi-company support — home screen adapts branding and data based on the user\'s assigned company (Load Master Shell theme shown).',
      },
    ],
  },
  {
    name: 'Church Management Website',
    type: 'Freelance Project',
    tech: 'PHP · JavaScript · HTML · CSS · jQuery',
    description: 'A web application developed for a local church to streamline their day-to-day operations. The system includes transaction and financial management, event scheduling, real-time announcements, a chatbot for common parish inquiries, and a direct messaging module for communication between parishioners and staff — with secure authentication for church personnel.',
    cover: '/projects/church/cover.png',
    gallery: [
      {
        src: '/projects/church/cover.png',
        caption: 'Church schedule page — displays mass schedules and donation information for parishioners.',
      },
      {
        src: '/projects/church/slide-1.png',
        caption: 'Home page with integrated chatbot — greets visitors and answers common parish inquiries such as location, office hours, and mass schedules.',
      },
      {
        src: '/projects/church/slide-2.png',
        caption: 'Messenger module — allows direct real-time communication between parishioners and church staff.',
      },
    ],
  },
  {
    name: 'Fallen Slime',
    type: 'Personal Academic Project',
    tech: 'Unity · C# · WebGL',
    href: 'https://4117175.itch.io/fallenslime',
    description: 'A 2D side-scrolling platformer game built with Unity and C#, published on itch.io as a WebGL browser game. The player controls an angel-themed character navigating floating platforms in a sky environment. The game was developed as a personal academic project to explore game mechanics, physics, and Unity\'s WebGL export pipeline.',
    cover: '/projects/fallen-slime/cover.jpg',
    gallery: [
      {
        src: '/projects/fallen-slime/cover.jpg',
        caption: 'Title screen — "Fallen Slime" main menu with Play, Option, and Quit buttons set against a sky-themed background.',
      },
      {
        src: '/projects/fallen-slime/slide-1.jpg',
        caption: 'Gameplay — the player character navigates floating platforms in a side-scrolling environment, published on itch.io via Unity WebGL.',
      },
    ],
  },
  {
    name: 'Little Learners: A Game for Toddlers',
    type: 'Freelance Project',
    tech: 'Unity · C# · Android',
    href: 'https://4117175.itch.io/quiz-game-for-toddlers',
    description: 'An educational Android game developed for toddlers to build early social and decision-making skills through simple yes/no quiz scenarios. The game features three progressive difficulty levels — Easy, Medium, and Hard — where questions automatically advance to the next difficulty as the player completes each stage. Animated characters react to correct and wrong answers, and a timer tracks how long the player takes to complete all questions. A records screen displays past performance history. Built with Unity and C#, and published on itch.io.',
    cover: '/projects/toddler-game/cover.jpg',
    gallery: [
      {
        src: '/projects/toddler-game/cover.jpg',
        caption: 'Title screen — "Little Learners: A Game for Toddlers" with Play, Records, Tutorial, and Guide options.',
      },
      {
        src: '/projects/toddler-game/slide-3.jpg',
        caption: 'Quiz gameplay — a question is displayed with YES / NO answer choices and a countdown timer for each round.',
      },
      {
        src: '/projects/toddler-game/slide-1.jpg',
        caption: 'Correct answer feedback — animated characters celebrate with confetti when the player answers correctly.',
      },
      {
        src: '/projects/toddler-game/slide-2.jpg',
        caption: 'Wrong answer feedback — the character shows a sad expression to gently indicate an incorrect answer.',
      },
    ],
  },
  {
    name: 'Fire Alert System Mobile App',
    type: 'Freelance Project',
    tech: 'Kotlin · Android · Firebase',
    description: 'A Kotlin Android mobile app designed to assist firefighters and emergency responders by enabling users and bystanders to report fire incidents in real time. Reports are submitted with a description and photo evidence, then verified through built-in algorithms before alerting nearby emergency services. The app displays a live feed of active, pending, and resolved incidents.',
    cover: '/projects/fire-alert/cover.svg',
    gallery: [
      {
        src: '/projects/fire-alert/slide-1.svg',
        caption: 'Home screen — quick access to report emergencies, track submissions, and view active alerts.',
      },
      {
        src: '/projects/fire-alert/slide-2.svg',
        caption: 'Report form — users describe the incident, attach photo evidence, and select severity level.',
      },
      {
        src: '/projects/fire-alert/slide-3.svg',
        caption: 'Active alerts feed — real-time list of verified, pending, and resolved fire incidents.',
      },
    ],
  },
] as const
