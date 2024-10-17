// src/components/About.jsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import './About.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faBirthdayCake, faUniversity } from '@fortawesome/free-solid-svg-icons';

// Import images from the assets folder
import Justin from '../assets/justin.jpeg';
import MinhHoangDuong from '../assets/MinhHoangDuong.jpg';
import Melvin from '../assets/Melvin.jpg';

function About() {
    //Replace with proper team description
  const teamDescription = "Our team of dedicated professionals combines a passion for technology and innovation to tackle complex challenges. With expertise in software development, machine learning, and project management, we bring diverse skill sets to the table, enabling us to deliver cutting-edge solutions. Our collaborative spirit and commitment to excellence drive us to create impactful projects and make a meaningful difference in the world of technology.";

  const teamMembers = [
    {
    //Replace with proper information please :)

      name: 'Justin Nguyen',
      dob: 'January 15, 2005',
      description: 'A dedicated software developer and technical provider.',
      university: 'Swinburne University Of Technology',
      role: 'Software Developer',
      image: Justin,
      github: 'https://github.com/ruchanswin' 
    },
    {
      name: 'Minh Hoang Duong',
      dob: 'Dec 11, 2005',
      description: 'Experienced in machine learning and technical leadership.',
      university: 'Swinburne University Of Technology',
      role: 'Technical Leader',
      image: MinhHoangDuong,
      github: 'https://github.com/EichanInIt'
    },
    {
      name: 'Melvin',
      dob: 'August 9, 1999',
      description: 'Project manager with a focus on machine learning and leadership.',
      university: 'Swinburne University Of Technology',
      role: 'Team Leader',
      image: Melvin,
      github: 'https://github.com/melvin0108' 
    }
  ];

  return (
    <div className="about-container">
      <div className="team-description">
        <h2>Meet Our Team</h2>
        <p>{teamDescription}</p>
      </div>
      
      <div className="team-members">
        {teamMembers.map((member, index) => (
          <a href={member.github} target="_blank" rel="noopener noreferrer" key={index} className="team-card-link">
            <Card className="team-card">
              <Card.Img variant="top" src={member.image} alt={member.name} className="team-image" />
              <Card.Body>
                <Card.Title>{member.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <FontAwesomeIcon icon={faBriefcase} /> <strong>{member.role}</strong>
                </Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">
                  <FontAwesomeIcon icon={faBirthdayCake} /> <strong>DOB:</strong> {member.dob}
                </Card.Subtitle>
                <Card.Text>{member.description}</Card.Text>
                <Card.Text className="university-badge">
                  <FontAwesomeIcon icon={faUniversity} /> {member.university}
                </Card.Text>
              </Card.Body>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}

export default About;
