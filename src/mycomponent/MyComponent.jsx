import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone, MapPin, ExternalLink, Code, Briefcase, GraduationCap, Rocket } from 'lucide-react';
import './mycomponent.css';

const MyComponent = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = [
    'React.js', 'Next.js', 'TypeScript', 'Redux', 'JavaScript',
    'Tailwind CSS', 'Bootstrap', 'HTML/CSS', 'PWA', 'REST API', 'Git'
  ];

  const experiences = [
    {
      company: 'Paramaya Technology Services Pvt Ltd',
      role: 'Software Engineer 1',
      period: 'September 2024 – Present',
      location: 'Nagpur, Maharashtra',
      achievements: [
        'Developed a React TypeScript website from scratch, designing the entire component architecture',
        'Led the UI/UX implementation, ensuring a responsive and visually appealing user experience',
        'Collaborated closely with the development team to integrate front-end components with backend APIs'
      ]
    },
    {
      company: 'TechnoBase IT Solutions Pvt Ltd',
      role: 'Software Engineer 1',
      period: 'June 2023 – September 2024',
      location: 'Nagpur, Maharashtra',
      achievements: [
        'Created multiple common components utilized across the project',
        'Deployed a technology stack with Chatbot, Socket and AWS, reducing operational downtime by 35%',
        'Redesigned and optimized multiple websites, improving performance by 30%'
      ]
    },
    {
      company: 'TrickySys IT Solutions',
      role: 'Software Engineer 1',
      period: 'May 2022 – June 2023',
      location: 'Nagpur, Maharashtra',
      achievements: [
        'Initiated a Hotel Booking website using the MERN stack',
        'Translated business requirements into technical specifications',
        'Enhanced user experience and functionality with React.js and Tailwind CSS'
      ]
    }
  ];

  const projects = [
    {
      name: 'Paramaya Website',
      tech: ['React.js', 'Redux', 'TypeScript', 'React Bootstrap'],
      description: 'Developed company website with scalable UI architecture and custom reusable components that dynamically render pages based on JSON data.'
    },
    {
      name: 'EzeeDesk',
      tech: ['Next.js', 'Redux', 'React Bootstrap'],
      description: 'Implemented Chatbots, Multi-Language Translation, and real-time notifications using Socket.'
    },
    {
      name: 'Grant Thornton CMS',
      tech: ['Next.js', 'Redux'],
      description: 'Partnered with legal experts to integrate industry-specific compliance standards into an advanced Compliance Management System.'
    },
    {
      name: 'DSP HRMS Portal',
      tech: ['Next.js', 'Redux', 'AWS'],
      description: 'Deployed comprehensive HRMS portal for DSP Mutual Fund, decreasing employee onboarding time by 60%.'
    },
    {
      name: 'MyResorts.in',
      tech: ['React.js', 'Redux'],
      description: 'Constructed Resort booking feature with admin-managed vendor section and complex pricing calculations.',
      link: 'https://myresorts.in'
    },
    {
      name: 'Mahachai.in',
      tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
      description: 'Crafted modern, high-performance website optimized for speed, increasing company sales by 25%.',
      link: 'https://mahachai.in'
    }
  ];

  return (
    <div className="portfolio">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">SF</div>
          <div className="nav-links">
            {['home', 'about', 'experience', 'projects', 'contact'].map(section => (
              <a
                key={section}
                href={`#${section}`}
                className={activeSection === section ? 'active' : ''}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-greeting">Hi, I'm</div>
            <h1 className="hero-name">Sanket Fulzele</h1>
            <div className="hero-title">
              <span className="typing-text">Front-End Developer</span>
            </div>
            <p className="hero-description">
              3+ years of experience crafting exceptional web applications with React, Next.js, and modern technologies
            </p>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">
                <Rocket size={20} />
                View Projects
              </a>
              <a href="#contact" className="btn btn-secondary">
                <Mail size={20} />
                Get in Touch
              </a>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About Me</h2>
            <div className="title-underline"></div>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p>
                Front-End Developer with 3+ years of experience in designing, developing, and optimizing responsive web applications. 
                Proficient in React.js, Next.js, PWA, Redux, and modern front-end technologies.
              </p>
              <p>
                Skilled in performance optimization, scalability, responsive design, and SEO optimization, with strong expertise 
                in integrating REST APIs and deploying applications using CI/CD pipelines. Proven ability to write clean, 
                maintainable code and collaborate with cross-functional teams.
              </p>
              <div className="contact-info">
                <div className="info-item">
                  <MapPin size={20} />
                  <span>Nagpur, Maharashtra</span>
                </div>
                <div className="info-item">
                  <Mail size={20} />
                  <span>sanketfulzelek6@gmail.com</span>
                </div>
                <div className="info-item">
                  <Phone size={20} />
                  <span>8381001406</span>
                </div>
              </div>
            </div>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div key={index} className="skill-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Code size={20} />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="experience">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Experience</h2>
            <div className="title-underline"></div>
          </div>
          <div className="timeline">
            {experiences.map((exp, index) => (
              <div key={index} className="timeline-item" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-company">{exp.company}</h3>
                      <div className="timeline-role">{exp.role}</div>
                    </div>
                    <div className="timeline-period">{exp.period}</div>
                  </div>
                  <div className="timeline-location">
                    <MapPin size={16} />
                    {exp.location}
                  </div>
                  <ul className="timeline-achievements">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <div className="title-underline"></div>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="project-header">
                  <h3 className="project-name">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Let's Connect</h2>
            <div className="title-underline"></div>
          </div>
          <div className="contact-content">
            <p className="contact-text">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
            </p>
            <div className="social-links">
              <a href="https://github.com/SanketFulzele" target="_blank" rel="noopener noreferrer" className="social-link">
                <Github size={24} />
                <span>GitHub</span>
              </a>
              <a href="https://linkedin.com/in/sanketfulzele" target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin size={24} />
                <span>LinkedIn</span>
              </a>
              <a href="mailto:sanketfulzelek6@gmail.com" className="social-link">
                <Mail size={24} />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 Sanket Fulzele. Built with React & ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default MyComponent;