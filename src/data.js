import reactLogo from './assets/react.svg'
import TfLogo from './assets/TensorFlow.svg'
import DockerLogo from './assets/Docker.svg'
import pyCharmLogo from './assets/PyCharm.svg'
import gitLogo from './assets/Git.svg'
import githubLogo from './assets/GitHub.svg'
import vsCodeLogo from './assets/Visual Studio Code (VS Code).svg'
import laImage from './assets/LA.jpeg'
import CAI from './assets/CougarAI.jpeg'
import LinIn from './assets/linkedin.svg'

export const frameworks = [
  { name: 'TensorFlow', src: TfLogo },
  { name: 'Git', src: gitLogo },
  { name: 'Docker', src: DockerLogo },
  { name: 'React', src: reactLogo },
]

// Ex: Fusion 360, KiCAD, etc.
export const techLogos = [
  { name: 'PyCharm', src: pyCharmLogo },
  { name: 'VS Code', src: vsCodeLogo },
]

export const projects = [
  { name: 'Linear Algbra Library', src: 'https://github.com/ISucc34/LinAlgLibrary', img: laImage,
    desc: 'A small library for experimenting with matrix and vector operations.' },
  { name: 'Cougar AI Workshops', src: 'https://github.com/ISucc34/CougarAI_Workshops', img: CAI,
    desc: 'Educational workshops for begginners to get hands on experience' },
  { name: 'Portfolio', src: 'https://github.com/ISucc34/My_Website', img: '',
    desc: 'The website you see before you' },
]

export const socials = [
  { name: 'GitHub', img: githubLogo, src: 'https://github.com/ISucc34' },
  { name: 'LinkedIn', img: LinIn, src: 'https://www.linkedin.com/in/isaac-gonzalez28/' },
]

// ---- Resume content (edit here to update the pages) ----
export const email = 'ikgonza2@cougarnet.uh.edu'

export const aboutText = [
  "I'm a Computer Science student at the University of Houston (B.S., graduating May 2027) interested in AI, robotics, and human-computer interaction.",
  "I'm the President of CougarAI, UH's AI student organization, an undergraduate researcher in the AWARE Lab, and an instructor at iCode, where I teach robotics, Python, and web development.",
]

export const education = [
  { title: 'Bachelor of Science, Computer Science', org: 'University of Houston', place: 'Houston, TX', dates: 'Aug. 2024 – May 2027' },
  { title: 'Associate of Arts, Multidisciplinary Studies', org: 'Houston Community College', place: 'Houston, TX', dates: 'June 2024' },
]

export const research = {
  title: 'Undergraduate Researcher', org: 'AWARE Lab, University of Houston', place: 'Houston, TX', dates: '2026 – Present',
  bullets: [
    'Conducting qualitative data analysis on interview transcripts to investigate how AI can support awareness, communication, and collaboration among noise-sensitive individuals and their allies',
    'Reviewing HCI and AI literature to synthesize findings relevant to accessibility-focused human-AI interaction research',
  ],
}

export const experience = [
  research,
  { title: 'Instructor', org: 'iCode', place: 'Houston, TX', dates: 'Mar. 2026 – Present',
    bullets: [
      'Instruct VEX robotics and 3D printing to 5–10 students through hands-on, project-based learning',
      'Teach Python programming and web development, adapting lessons to different age groups and skill levels',
      'Manage classroom logistics including hardware setup, troubleshooting, and curriculum delivery',
    ] },
]

export const leadership = [
  { title: 'President & Workshop Committee', org: 'CougarAI', dates: 'Jan. 2025 – Present',
    bullets: [
      "Direct strategy and operations for UH's AI student organization of 20+ officers, organizing speaker events, technical workshops, and applied ML project teams",
      'Designed and facilitated hands-on workshops on computer vision, reinforcement learning, NumPy, and Pandas, enabling members to build ML pipelines from scratch',
    ] },
  { title: 'Drones Team Lead', org: 'Drones Team', dates: 'Jan. 2023 – May 2023',
    bullets: [
      'Led a 5+ person team through full software/hardware integration, coordinating build schedule, component testing, and flight validation',
      'Debugged hardware-software interface issues under time constraints to meet competition deadlines',
    ] },
  { title: 'Engineering Team Lead', org: 'BEST Robotics', dates: 'Aug. 2024 – Dec. 2024',
    bullets: [
      'Managed a 10+ person engineering team, delegating tasks across mechanical, electrical, and software subgroups',
      'Facilitated cross-functional communication to ensure deliverables met competition specifications',
    ] },
]

export const awards = [
  { name: 'DataJam | 3rd Place', date: 'Nov. 2025' },
  { name: 'CodeRED Hackathon | 3rd Place', date: 'Oct. 2025' },
  { name: 'BEST Robotics Regionals | 1st Place', date: 'Mar. 2022' },
]

export const skills = {
  languages: ['Python', 'C++', 'JavaScript', 'HTML/CSS'],
  aiml: ['PyTorch', 'TensorFlow', 'scikit-learn', 'OpenCV', 'Gymnasium (RL)', 'MediaPipe', 'Ultralytics (YOLOv8)', 'Pandas', 'NumPy'],
  robotics: ['VEX Robotics', 'Embedded C++', 'Isaac Sim', 'Fusion360', 'TinkerCAD', 'Arduino', 'Raspberry Pi'],
  tools: ['React', 'Node.js', 'Docker', 'Git', 'Anaconda', 'Google Colab', 'VS Code', 'PyCharm', 'Linux'],
}
