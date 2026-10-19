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
