import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import './StudyPlan.css';

const StudyPlan = () => {
  const { isAuthenticated, user } = useAuth0();
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulated study plans data - in a real app, this would come from an API
    const mockStudyPlans = [
      {
        id: 1,
        courseName: "Introduction to Programming",
        weeklySchedule: [
          {
            day: "Monday",
            tasks: ["Lecture 1: Basic Concepts", "Practice Exercises", "Reading Assignment"]
          },
          {
            day: "Wednesday",
            tasks: ["Lecture 2: Variables & Data Types", "Coding Practice", "Quiz Preparation"]
          },
          {
            day: "Friday",
            tasks: ["Lecture 3: Control Structures", "Project Work", "Peer Review"]
          }
        ],
        progress: 65,
        nextMilestone: "Complete Module 3"
      },
      {
        id: 2,
        courseName: "Data Structures & Algorithms",
        weeklySchedule: [
          {
            day: "Tuesday",
            tasks: ["Lecture 1: Arrays & Lists", "Implementation Practice", "Problem Solving"]
          },
          {
            day: "Thursday",
            tasks: ["Lecture 2: Stacks & Queues", "Algorithm Analysis", "Assignment Work"]
          }
        ],
        progress: 40,
        nextMilestone: "Submit Assignment 2"
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setStudyPlans(mockStudyPlans);
      setLoading(false);
    }, 1000);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="study-plan-container">
        <h1>Please log in to view your study plan</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="study-plan-container">
        <div className="loading">Loading your study plan...</div>
      </div>
    );
  }

  return (
    <div className="study-plan-container">
      <h1>Your Personalized Study Plan</h1>
      <div className="study-plans-grid">
        {studyPlans.map((plan) => (
          <div key={plan.id} className="study-plan-card">
            <h2>{plan.courseName}</h2>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${plan.progress}%` }}
              ></div>
            </div>
            <p className="progress-text">Progress: {plan.progress}%</p>
            <p className="next-milestone">Next: {plan.nextMilestone}</p>
            
            <div className="weekly-schedule">
              <h3>Weekly Schedule</h3>
              {plan.weeklySchedule.map((schedule, index) => (
                <div key={index} className="schedule-day">
                  <h4>{schedule.day}</h4>
                  <ul>
                    {schedule.tasks.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button
              className="continue-course-btn"
              onClick={() => navigate(`/courses/${plan.id}`)}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(79,70,229,0.08)'
              }}
            >
              Continue Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyPlan; 