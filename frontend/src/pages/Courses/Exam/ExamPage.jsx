import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ExamPage.css';

const ExamPage = ({ courses }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  // Find course and generate questions
  useEffect(() => {
    if (courses && courses.length > 0) {
      // Find the course with the matching ID
      const foundCourse = courses.find((c) => c.course_id === id);
      
      if (foundCourse) {
        // Process course data for exam content
        const enhancedCourse = {
          ...foundCourse,
          sections: foundCourse.sections || generateCourseSections(foundCourse)
        };
        
        setCourse(enhancedCourse);
        
        // Generate exam questions based on course
        const generatedQuestions = generateExamQuestions(enhancedCourse);
        setQuestions(generatedQuestions);
        
        // Initialize answers object with all correct answers
        const initialAnswers = {};
        generatedQuestions.forEach((q) => {
          // Set each answer to the correct answer (1 for multiple-choice, 0 for true/false)
          initialAnswers[q.id] = q.correctAnswer;
        });
        setAnswers(initialAnswers);
        
        setLoading(false);
      } else {
        // If course not found, redirect back to courses
        navigate('/courses');
      }
    }
  }, [id, courses, navigate]);

  // Generate course sections if not available in data
  const generateCourseSections = (course) => {
    // This is a simplified version of the function from CourseContent.jsx
    const sectionCount = Math.floor(Math.random() * 3) + 4; // 4-6 sections
    const sections = [];
    
    for (let i = 1; i <= sectionCount; i++) {
      const lectureCount = Math.floor(Math.random() * 3) + 3; // 3-5 lectures per section
      const lectures = [];
      
      for (let j = 1; j <= lectureCount; j++) {
        lectures.push({
          id: `lecture-${i}-${j}`,
          title: `Lecture ${j}: ${getLectureTitle(course, i, j)}`,
          duration: `${Math.floor(Math.random() * 20) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          completed: false,
          videoUrl: getRandomVideoUrl(course)
        });
      }
      
      sections.push({
        id: `section-${i}`,
        title: `Section ${i}: ${getSectionTitle(course, i)}`,
        lectures: lectures
      });
    }
    
    return sections;
  };
  
  // Helper function to generate section titles
  const getSectionTitle = (course, sectionIndex) => {
    if (course.topics && course.topics.length > 0) {
      // Use course topics if available
      const topicIndex = (sectionIndex - 1) % course.topics.length;
      return course.topics[topicIndex];
    }
    
    // Fallback section titles based on department
    const titles = {
      "Computer Science": [
        "Introduction to Programming Concepts",
        "Data Structures and Algorithms",
        "Object-Oriented Programming",
        "Web Development Fundamentals",
        "Database Design and Management",
        "Software Engineering Principles"
      ],
      "Data Science": [
        "Data Analysis Fundamentals",
        "Statistical Methods",
        "Machine Learning Basics",
        "Data Visualization Techniques",
        "Big Data Processing",
        "Predictive Modeling"
      ],
      "Business": [
        "Business Strategy Principles",
        "Market Analysis Techniques",
        "Financial Decision Making",
        "Operations Management",
        "Leadership and Communication",
        "Project Management"
      ],
      "Languages": [
        "Vocabulary Building",
        "Grammar Fundamentals",
        "Conversation Practice",
        "Writing Techniques",
        "Cultural Context",
        "Advanced Expression"
      ],
      "Psychology": [
        "Cognitive Processes",
        "Human Development",
        "Social Psychology",
        "Research Methods",
        "Abnormal Psychology",
        "Applied Psychology"
      ]
    };
    
    const departmentTitles = titles[course.department] || titles["Computer Science"];
    const titleIndex = (sectionIndex - 1) % departmentTitles.length;
    return departmentTitles[titleIndex];
  };
  
  // Helper function to generate lecture titles
  const getLectureTitle = (course, sectionIndex, lectureIndex) => {
    const sectionTitle = getSectionTitle(course, sectionIndex);
    
    // Generate lecture titles based on section title
    const lectureKeywords = [
      "Understanding", "Exploring", "Applying", "Analyzing", 
      "Implementing", "Mastering", "Introduction to", "Advanced",
      "Practical", "Theoretical", "Fundamentals of", "Case Studies in"
    ];
    
    const keyword = lectureKeywords[(sectionIndex + lectureIndex) % lectureKeywords.length];
    return `${keyword} ${sectionTitle}`;
  };
  
  // Helper function to get random video URLs
  const getRandomVideoUrl = (course) => {
    // Default videos by department
    const videosByDepartment = {
      "Computer Science": [
        "https://www.youtube.com/embed/zOjov-2OZ0E",
        "https://www.youtube.com/embed/rfscVS0vtbw",
        "https://www.youtube.com/embed/W6NZfCO5SIk"
      ],
      "Data Science": [
        "https://www.youtube.com/embed/_isUaBW-3eU",
        "https://www.youtube.com/embed/ua-CiDNNj30",
        "https://www.youtube.com/embed/QUT1VHiLmmI"
      ],
      "Business": [
        "https://www.youtube.com/embed/4JICuqP7pkc",
        "https://www.youtube.com/embed/MxDCRHaekko",
        "https://www.youtube.com/embed/9VZsMY15xeU"
      ],
      "Languages": [
        "https://www.youtube.com/embed/rd4YeCYgYoI",
        "https://www.youtube.com/embed/o_XVt5rdpFY",
        "https://www.youtube.com/embed/iBt2aTjCNmI"
      ],
      "Psychology": [
        "https://www.youtube.com/embed/vo4pMVb0R6M",
        "https://www.youtube.com/embed/LuZFThlOiJI",
        "https://www.youtube.com/embed/mL2hyEGeQKo"
      ]
    };
    
    const departmentVideos = videosByDepartment[course.department] || videosByDepartment["Computer Science"];
    return departmentVideos[Math.floor(Math.random() * departmentVideos.length)];
  };

  // Timer countdown
  useEffect(() => {
    if (loading || examSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examSubmitted]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  // Submit exam
  const submitExam = () => {
    if (examSubmitted) return;
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setExamSubmitted(true);
  };

  // Generate questions based on course content
  const generateExamQuestions = (course) => {
    // Topics to generate questions from based on course
    const topics = getTopicsFromCourse(course);
    
    const examQuestions = [];
    
    // Generate 30 questions
    for (let i = 1; i <= 30; i++) {
      const questionType = Math.random() > 0.7 ? 'true-false' : 'multiple-choice';
      
      // Select random topic
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      // Generate question
      const question = generateQuestion(topic, questionType, course.title, i);
      examQuestions.push(question);
    }
    
    return examQuestions;
  };

  // Get topics from course for question generation
  const getTopicsFromCourse = (course) => {
    // If course has topics, use them
    if (course.topics && course.topics.length > 0) {
      return course.topics;
    }
    
    // If course has sections, extract topics from section titles
    if (course.sections && course.sections.length > 0) {
      return course.sections.map(section => {
        // Extract main topic from section title
        const title = section.title;
        const colonIndex = title.indexOf(':');
        return colonIndex > -1 ? title.substring(colonIndex + 1).trim() : title;
      });
    }
    
    // Fallback: use department-based topics
    return getTopicsByDepartment(course.department);
  };

  // Get topics by department for question generation
  const getTopicsByDepartment = (department) => {
    const topicsByDepartment = {
      'Computer Science': [
        'Variables and Data Types', 'Control Structures', 'Functions', 
        'Object-Oriented Programming', 'Data Structures', 'Algorithms',
        'Web Development', 'Databases', 'Software Engineering', 'Operating Systems'
      ],
      'Data Science': [
        'Data Cleaning', 'Data Visualization', 'Statistical Analysis', 
        'Machine Learning', 'Neural Networks', 'Big Data', 'Python Programming',
        'Data Mining', 'Predictive Modeling', 'Natural Language Processing'
      ],
      'Business': [
        'Marketing', 'Finance', 'Management', 'Accounting', 
        'Economics', 'Strategy', 'Entrepreneurship', 'Business Ethics',
        'Human Resources', 'International Business'
      ],
      'Languages': [
        'Grammar', 'Vocabulary', 'Pronunciation', 'Reading Comprehension',
        'Writing', 'Cultural Studies', 'Conversation', 'Language History',
        'Literature', 'Translation'
      ],
      'Psychology': [
        'Cognitive Psychology', 'Social Psychology', 'Developmental Psychology',
        'Abnormal Psychology', 'Clinical Psychology', 'Neuroscience',
        'Personality', 'Learning Theory', 'Memory', 'Emotion'
      ]
    };
    
    // Return topics for the given department or a default set
    return topicsByDepartment[department] || topicsByDepartment['Computer Science'];
  };

  // Generate a single question
  const generateQuestion = (topic, type, courseTitle, index) => {
    let question, options, correctAnswer;
    
    if (type === 'multiple-choice') {
      // Generate multiple choice question
      const mcQuestions = [
        {
          q: `Which of the following best describes ${topic}?`,
          o: [
            `A systematic approach to ${topic} analysis`,
            `The fundamental principles of ${topic}`,
            `A modern framework for understanding ${topic}`,
            `The historical development of ${topic}`
          ],
          c: 1  // Always option B (index 1)
        },
        {
          q: `What is the primary purpose of ${topic}?`,
          o: [
            `To solve complex problems`,
            `To organize information efficiently`,
            `To communicate ideas effectively`,
            `To analyze patterns and relationships`
          ],
          c: 1  // Always option B (index 1)
        },
        {
          q: `In the context of ${courseTitle}, how is ${topic} typically applied?`,
          o: [
            `Through rigorous mathematical analysis`,
            `By implementing practical frameworks`,
            `Using specialized software tools`,
            `Following established methodologies`
          ],
          c: 1  // Always option B (index 1)
        }
      ];
      
      const selectedQ = mcQuestions[Math.floor(Math.random() * mcQuestions.length)];
      question = selectedQ.q;
      options = selectedQ.o;
      correctAnswer = selectedQ.c;  // Will always be 1 (option B)
    } else {
      // Generate true/false question
      const tfQuestions = [
        {
          q: `${topic} is generally considered an essential component of ${courseTitle}.`,
          c: true  // Always True
        },
        {
          q: `Modern approaches to ${topic} typically involve collaborative methods.`,
          c: true  // Always True
        },
        {
          q: `The foundations of ${topic} were primarily developed in the last decade.`,
          c: true  // Always True
        }
      ];
      
      const selectedQ = tfQuestions[Math.floor(Math.random() * tfQuestions.length)];
      question = selectedQ.q;
      options = ['True', 'False'];
      correctAnswer = 0;  // Will always be 0 (True)
    }
    
    return {
      id: `q-${index}`,
      question: question,
      options: options,
      type: type,
      correctAnswer: correctAnswer
    };
  };

  // Handle return to course content
  const handleReturnToCourse = () => {
    navigate(`/courses/${id}/learn`);
  };

  // Generate and download certificate
  const generateCertificate = () => {
    if (!course) return;
    
    // Get user name - using a prompt for now, but could be fetched from user profile in a real app
    const userName = prompt("Please enter your name for the certificate:", "");
    if (!userName || userName.trim() === "") return; // Exit if no name entered
    
    // Create a hidden canvas element to draw the certificate
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    ctx.strokeStyle = '#6c5ce7';
    ctx.lineWidth = 20;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Add decorative corner designs
    const cornerSize = 80;
    const drawCorner = (x, y, rotate) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotate * Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(cornerSize, 0);
      ctx.lineTo(0, cornerSize);
      ctx.closePath();
      ctx.fillStyle = '#6c5ce7';
      ctx.fill();
      ctx.restore();
    };
    
    // Draw corners
    drawCorner(20, 20, 0);
    drawCorner(canvas.width - 20, 20, 1);
    drawCorner(canvas.width - 20, canvas.height - 20, 2);
    drawCorner(20, canvas.height - 20, 3);
    
    // Add header text
    ctx.fillStyle = '#2d3748';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 150);

    // Add AI LMS logo text (changed from ZenLearn)
    ctx.fillStyle = '#6c5ce7';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('AI LMS', canvas.width / 2, 220);
    
    // Add main certificate text
    ctx.fillStyle = '#2d3748';
    ctx.font = '30px Arial';
    ctx.fillText('This certifies that', canvas.width / 2, 320);
    
    // Add student name (from user input)
    ctx.font = 'bold italic 50px Arial';
    ctx.fillText(userName, canvas.width / 2, 400);
    
    // Add course completion text
    ctx.font = '30px Arial';
    ctx.fillText('has successfully completed the course', canvas.width / 2, 480);
    
    // Add course name
    ctx.font = 'bold 40px Arial';
    ctx.fillText(course.title, canvas.width / 2, 550);
    
    // Add score
    ctx.font = '30px Arial';
    ctx.fillText(`with a score of ${score}%`, canvas.width / 2, 620);
    
    // Add date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    ctx.fillText(`Issued on ${dateString}`, canvas.width / 2, 680);
    
    // Convert canvas to image and download
    const certificateImage = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = certificateImage;
    downloadLink.download = `${course.title.replace(/\s+/g, '_')}_Certificate.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (loading) {
    return <div className="exam-loading">Loading exam questions...</div>;
  }

  return (
    <div className="exam-page">
      <header className="exam-header">
        <div className="exam-info">
          <h1>{course.title} - Final Exam</h1>
          <p>Answer all 30 questions before the time runs out.</p>
        </div>
        <div className="exam-timer">
          <div className={`time-remaining ${timeLeft < 300 ? 'time-critical' : ''}`}>
            <i className="fa fa-clock-o"></i>
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {examSubmitted ? (
        <div className="exam-results">
          <div className="result-card">
            <h2>Exam Completed</h2>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-value">{score}%</span>
              </div>
            </div>
            <p className="result-message">
              {score >= 70 
                ? 'Congratulations! You passed the exam.' 
                : 'You did not pass the exam. Please review the course materials and try again.'}
            </p>
            {score >= 70 && (
              <div className="certificate-section">
                <button 
                  className="btn-download-certificate"
                  onClick={() => generateCertificate()}
                >
                  <i className="fa fa-certificate"></i> Download Certificate
                </button>
              </div>
            )}
            <div className="result-actions">
              <button 
                className="btn-review-questions"
                onClick={() => setExamSubmitted(false)}
              >
                Review Questions
              </button>
              <button 
                className="btn-return-course" 
                onClick={handleReturnToCourse}
              >
                Return to Course
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="exam-content">
          <div className="questions-container">
            {questions.map((question, index) => (
              <div className="question-card" key={question.id}>
                <div className="question-header">
                  <span className="question-number">Question {index + 1}</span>
                  <span className="question-type">
                    {question.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
                  </span>
                </div>
                <div className="question-text">
                  {question.question}
                </div>
                <div className="answer-options">
                  {question.options.map((option, optIndex) => (
                    <div 
                      className={`answer-option ${answers[question.id] === optIndex ? 'selected' : ''}`} 
                      key={optIndex}
                      onClick={() => handleAnswerSelect(question.id, optIndex)}
                    >
                      <div className="option-selector">
                        {answers[question.id] === optIndex ? (
                          <i className="fa fa-check-circle"></i>
                        ) : (
                          <i className="fa fa-circle-o"></i>
                        )}
                      </div>
                      <div className="option-text">{option}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="exam-footer">
            <div className="progress-info">
              <span>
                {Object.values(answers).filter(a => a !== null).length} of {questions.length} questions answered
              </span>
            </div>
            <button 
              className="btn-submit-exam"
              onClick={submitExam}
            >
              Submit Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage; 