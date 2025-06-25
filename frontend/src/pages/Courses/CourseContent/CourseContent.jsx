import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./CourseContent.css";

const CourseContent = ({ courses }) => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExamButton, setShowExamButton] = useState(false);

  useEffect(() => {
    if (courses && courses.length > 0) {
      // Find the course with the matching ID
      const foundCourse = courses.find((c) => c.course_id === id);
      
      if (foundCourse) {
        // Generate course content sections if they don't exist
        const enhancedCourse = {
          ...foundCourse,
          sections: foundCourse.sections || generateCourseSections(foundCourse)
        };
        
        // Generate video previews if they don't exist
        if (!enhancedCourse.previewVideo || !enhancedCourse.recommendedVideos) {
          const videoData = generateVideoPreview(enhancedCourse);
          enhancedCourse.previewVideo = videoData.mainVideo;
          enhancedCourse.recommendedVideos = videoData.recommendedVideos;
        }
        
        setCourse(enhancedCourse);
        
        // Set first section as active by default
        if (enhancedCourse.sections && enhancedCourse.sections.length > 0) {
          setActiveSection(enhancedCourse.sections[0].id);
          
          // Set first video as current video
          if (enhancedCourse.sections[0].lectures && enhancedCourse.sections[0].lectures.length > 0) {
            setCurrentVideo(enhancedCourse.sections[0].lectures[0]);
          }
        }
        
        // Calculate initial progress
        const initialProgress = calculateProgress(enhancedCourse);
        
        // Show exam button if progress is 100%
        setShowExamButton(initialProgress === 100);
      }
    }
    
    setLoading(false);
  }, [id, courses]);

  // Add the video preview generator function from CourseDetails.jsx
  const generateVideoPreview = (course) => {
    // All video URLs organized by topic
    const allVideos = [
      // Programming videos
      "https://www.youtube.com/embed/zOjov-2OZ0E",
      "https://www.youtube.com/embed/rfscVS0vtbw",
      "https://www.youtube.com/embed/W6NZfCO5SIk",
      "https://www.youtube.com/embed/xfzGZB4HhEE",
      "https://www.youtube.com/embed/mU6anWqZJcc",
      "https://www.youtube.com/embed/yfoY53QXEnI",
      "https://www.youtube.com/embed/l_a8H5tp2VY",
      "https://www.youtube.com/embed/D6xkbGLQesk",
      "https://www.youtube.com/embed/8hly31xKli0",
      // Mobile development videos
      "https://www.youtube.com/embed/fis26HvvDII",
      "https://www.youtube.com/embed/0-S5a0eXPoc",
      "https://www.youtube.com/embed/Hf4MJH0jDb4",
      // Data science videos
      "https://www.youtube.com/embed/_isUaBW-3eU",
      "https://www.youtube.com/embed/ua-CiDNNj30",
      "https://www.youtube.com/embed/qFJeN9V1ZsI",
      "https://www.youtube.com/embed/aircAruvnKk",
      "https://www.youtube.com/embed/i_LwzRVP7bg",
      "https://www.youtube.com/embed/vmEHCJofslg",
      "https://www.youtube.com/embed/QUT1VHiLmmI",
      "https://www.youtube.com/embed/a9UrKTVEeZA",
      "https://www.youtube.com/embed/UO98lJQ3QGI",
      // Business videos
      "https://www.youtube.com/embed/4JICuqP7pkc",
      "https://www.youtube.com/embed/MxDCRHaekko",
      "https://www.youtube.com/embed/9VZsMY15xeU",
      "https://www.youtube.com/embed/q_hFK9CRD8w",
      "https://www.youtube.com/embed/bAlcP40_Bgo",
      "https://www.youtube.com/embed/WEDIj9JBTC8",
      "https://www.youtube.com/embed/Kr5D_tjUQzQ",
      "https://www.youtube.com/embed/uhfqXONF1u4",
      "https://www.youtube.com/embed/iuYlGRnC7J8",
      // Language videos
      "https://www.youtube.com/embed/rd4YeCYgYoI",
      "https://www.youtube.com/embed/o_XVt5rdpFY",
      "https://www.youtube.com/embed/iBt2aTjCNmI",
      "https://www.youtube.com/embed/TeQy0o79Zbs",
      "https://www.youtube.com/embed/C5EX2Rm0vUw",
      "https://www.youtube.com/embed/J_EQDtpYSNM",
      "https://www.youtube.com/embed/illApgaLgGA",
      "https://www.youtube.com/embed/uQYDgxhT0Kg",
      "https://www.youtube.com/embed/JwjAaixpYuU",
      // Psychology videos
      "https://www.youtube.com/embed/vo4pMVb0R6M",
      "https://www.youtube.com/embed/LuZFThlOiJI",
      "https://www.youtube.com/embed/mL2hyEGeQKo",
      "https://www.youtube.com/embed/2Iy0OBCnRJA",
      "https://www.youtube.com/embed/rMHus-0wFSo",
      "https://www.youtube.com/embed/ZyQIUvVJMRE",
      "https://www.youtube.com/embed/4YhpWZCdiZc",
      "https://www.youtube.com/embed/24k80ihM4tY",
      "https://www.youtube.com/embed/E0tCqzcHOTw",
      // Data Structures & Algorithms videos - new section
      "https://www.youtube.com/embed/RBSGKlAvoiM", // Data Structures Easy to Advanced Course
      "https://www.youtube.com/embed/0JUN9aDxVmI", // Big O Notation Tutorial
      "https://www.youtube.com/embed/zg9ih6SVACc", // Binary Search Tree Introduction
      "https://www.youtube.com/embed/09_LlHjoEiY", // Graph Theory Algorithms
      "https://www.youtube.com/embed/Qmt0QwzEmh0", // Merge Sort Tutorial
      "https://www.youtube.com/embed/pYT9F8_LFTM", // Quick Sort Tutorial
      "https://www.youtube.com/embed/SLauY6PpjW4", // Breadth First Search Algorithm
      "https://www.youtube.com/embed/GazC3A4OQTE", // Hashtable Data Structure
      "https://www.youtube.com/embed/B31LgI4Y4DQ", // Dynamic Programming Tutorial
      "https://www.youtube.com/embed/H_Nh-SxnKy4", // Bellman-Ford Algorithm
      "https://www.youtube.com/embed/pVfj6mxhdMw", // Algorithms Course - Graph Theory
      "https://www.youtube.com/embed/XB4MIexjvY0"  // Dijkstra's Algorithm
    ];

    // Check if this is a Data Structures & Algorithms course
    const isDSACourse = 
      (course.title && (
        course.title.toLowerCase().includes("data structure") || 
        course.title.toLowerCase().includes("algorithm") ||
        course.title.toLowerCase().includes("dsa")
      )) || 
      (course.topics && course.topics.some(topic => 
        topic.toLowerCase().includes("data structure") || 
        topic.toLowerCase().includes("algorithm")
      ));
    
    if (isDSACourse) {
      // Use specialized DSA videos
      const dsaVideos = allVideos.slice(-12); // Get the last 12 videos (DSA specific)
      
      // Deterministically select 3 different DSA videos
      let courseIdNum;
      try {
        courseIdNum = parseInt(course.course_id.replace(/\D/g, ''), 10);
        if (isNaN(courseIdNum)) {
          courseIdNum = Math.floor(Math.random() * 1000);
        }
      } catch (error) {
        courseIdNum = Math.floor(Math.random() * 1000);
      }
      
      // First video - primary course video
      const primaryIndex = courseIdNum % dsaVideos.length;
      const mainVideo = dsaVideos[primaryIndex];
      
      // Select two more unique videos
      let selectedVideos = [mainVideo];
      
      // Second video
      const secondIndex = (primaryIndex + 3) % dsaVideos.length;
      selectedVideos.push(dsaVideos[secondIndex]);
      
      // Third video
      const thirdIndex = (primaryIndex + 7) % dsaVideos.length;
      selectedVideos.push(dsaVideos[thirdIndex]);
      
      return {
        mainVideo: mainVideo,
        recommendedVideos: selectedVideos
      };
    }
    
    // For non-DSA courses, use the original algorithm
    // Extract number from course ID or use a random value
    let courseIdNum;
    try {
      courseIdNum = parseInt(course.course_id.replace(/\D/g, ''), 10);
      if (isNaN(courseIdNum)) {
        courseIdNum = Math.floor(Math.random() * 1000);
      }
    } catch (error) {
      courseIdNum = Math.floor(Math.random() * 1000);
    }

    // Deterministically select 3 different videos based on course ID
    let selectedVideos = [];
    
    // First video - primary course video
    const primaryIndex = courseIdNum % allVideos.length;
    selectedVideos.push(allVideos[primaryIndex]);
    
    // Second video - offset by course ID squared mod size
    const secondOffset = (courseIdNum * courseIdNum) % allVideos.length;
    let secondIndex = (primaryIndex + secondOffset) % allVideos.length;
    if (secondIndex === primaryIndex) {
      secondIndex = (secondIndex + 1) % allVideos.length;
    }
    selectedVideos.push(allVideos[secondIndex]);
    
    // Third video - offset by course name length
    const thirdOffset = (courseIdNum + (course.title.length * 3)) % allVideos.length;
    let thirdIndex = (primaryIndex + thirdOffset) % allVideos.length;
    if (thirdIndex === primaryIndex || thirdIndex === secondIndex) {
      thirdIndex = (thirdIndex + 2) % allVideos.length;
    }
    selectedVideos.push(allVideos[thirdIndex]);
    
    return {
      mainVideo: selectedVideos[0],
      recommendedVideos: selectedVideos
    };
  };

  // Generate course sections if they don't exist in the data
  const generateCourseSections = (course) => {
    const sectionCount = Math.floor(Math.random() * 5) + 3; // 3-7 sections
    const sections = [];
    
    // Generate video preview data if not already generated
    let videoData = { recommendedVideos: [] };
    if (!course.recommendedVideos) {
      videoData = generateVideoPreview(course);
    } else {
      videoData.recommendedVideos = course.recommendedVideos;
    }
    
    // Create a larger pool of videos by repeating the recommended videos
    const videoPool = [];
    for (let i = 0; i < 5; i++) {
      videoPool.push(...videoData.recommendedVideos);
    }
    
    // Define DSA-specific videos
    const dsaVideos = [
      "https://www.youtube.com/embed/RBSGKlAvoiM", // Data Structures Easy to Advanced Course
      "https://www.youtube.com/embed/0JUN9aDxVmI", // Big O Notation Tutorial
      "https://www.youtube.com/embed/zg9ih6SVACc", // Binary Search Tree Introduction
      "https://www.youtube.com/embed/09_LlHjoEiY", // Graph Theory Algorithms
      "https://www.youtube.com/embed/Qmt0QwzEmh0", // Merge Sort Tutorial
      "https://www.youtube.com/embed/pYT9F8_LFTM"  // Quick Sort Tutorial
    ];
    
    // Define Data Science specific videos
    const dataScienceVideos = [
      "https://www.youtube.com/embed/_isUaBW-3eU", // Data Science intro
      "https://www.youtube.com/embed/ua-CiDNNj30", // Machine learning
      "https://www.youtube.com/embed/qFJeN9V1ZsI", // Python for data analysis
      "https://www.youtube.com/embed/aircAruvnKk", // Neural networks
      "https://www.youtube.com/embed/i_LwzRVP7bg", // Machine learning algorithms
      "https://www.youtube.com/embed/vmEHCJofslg", // Pandas tutorial
      "https://www.youtube.com/embed/QUT1VHiLmmI"  // Python data science
    ];
    
    // Check if it's a DSA course
    const isDSACourse = course.title && 
      (course.title.toLowerCase().includes("data structure") || 
       course.title.toLowerCase().includes("algorithm"));
    
    // Check if it's the Data Science course (DS250)
    const isDataScienceCourse = course.course_id === "DS250";
    
    if (isDSACourse) {
      // For DSA courses, add these videos to the pool
      videoPool.push(...dsaVideos);
    }
    
    if (isDataScienceCourse) {
      // For Data Science course, add these videos to the pool
      videoPool.push(...dataScienceVideos);
    }
    
    // Generate sections
    for (let i = 1; i <= sectionCount; i++) {
      const lectureCount = Math.floor(Math.random() * 7) + 2; // 2-8 lectures per section
      const lectures = [];
      
      for (let j = 1; j <= lectureCount; j++) {
        const duration = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
        const completed = Math.random() > 0.7; // 30% chance of being completed
        
        let videoUrl;
        let lectureTitle;
        
        // Special case for Data Science course - first lecture
        if (isDataScienceCourse && i === 1 && j === 1) {
          // Use Neural Networks video for first lecture of Data Science course
          videoUrl = "https://www.youtube.com/embed/aircAruvnKk"; // Neural networks
          lectureTitle = "Neural Networks Fundamentals";
        } 
        // Special case for DSA course - first lecture
        else if (isDSACourse && i === 1 && j === 1) {
          videoUrl = "https://www.youtube.com/embed/RBSGKlAvoiM"; // Data Structures Easy to Advanced Course
          lectureTitle = "Introduction to Data Structures";
        }
        // Normal case for other lectures
        else {
          // Select a video URL from the pool using a deterministic algorithm
          const videoIndex = (i * 10 + j) % videoPool.length;
          videoUrl = videoPool[videoIndex];
          lectureTitle = generateLectureTitle(course.department, i, j);
        }
        
        lectures.push({
          id: `lec-${i}-${j}`,
          title: `Lecture ${j}: ${lectureTitle}`,
          duration: duration,
          completed: completed,
          type: j % 5 === 0 ? "quiz" : "video",
          videoUrl: videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ" // Default as fallback
        });
      }
      
      // Set special title for the first section based on course type
      let sectionTitle;
      if (isDataScienceCourse && i === 1) {
        sectionTitle = "Machine Learning Fundamentals";
      } else if (isDSACourse && i === 1) {
        sectionTitle = "Fundamentals of Data Structures";
      } else {
        sectionTitle = generateSectionTitle(course.department, i);
      }
      
      sections.push({
        id: `section-${i}`,
        title: `Section ${i}: ${sectionTitle}`,
        lectures: lectures,
        duration: lectures.reduce((total, lecture) => total + lecture.duration, 0)
      });
    }
    
    return sections;
  };
  
  const generateSectionTitle = (department, sectionNumber) => {
    const introTitles = ["Introduction to", "Getting Started with", "Fundamentals of", "Basics of"];
    const intermediateTitles = ["Advanced Concepts in", "Diving Deeper into", "Practical Applications of", "Building with"];
    const advancedTitles = ["Mastering", "Expert-level", "Professional", "Specialized Topics in"];
    
    if (sectionNumber === 1) {
      return `${introTitles[Math.floor(Math.random() * introTitles.length)]} ${department}`;
    } else if (sectionNumber < 4) {
      return `${intermediateTitles[Math.floor(Math.random() * intermediateTitles.length)]} ${department}`;
    } else {
      return `${advancedTitles[Math.floor(Math.random() * advancedTitles.length)]} ${department}`;
    }
  };
  
  const generateLectureTitle = (department, sectionNumber, lectureNumber) => {
    const csTitles = ["Variables & Data Types", "Control Structures", "Functions", "Classes & Objects", "Algorithms", "Data Structures", "APIs", "Debugging", "Performance Optimization"];
    const dataScienceTitles = ["Data Cleaning", "Visualization", "Statistical Analysis", "Machine Learning Models", "Feature Engineering", "Model Evaluation", "Big Data Processing", "Predictive Analytics"];
    const businessTitles = ["Market Analysis", "Strategic Planning", "Financial Models", "Leadership Skills", "Marketing Techniques", "Customer Engagement", "Business Ethics", "Organizational Behavior"];
    const languageTitles = ["Vocabulary Building", "Grammar Essentials", "Conversation Practice", "Reading Comprehension", "Writing Skills", "Cultural Context", "Pronunciation", "Idiomatic Expressions"];
    const psychologyTitles = ["Cognitive Processes", "Behavioral Analysis", "Development Theories", "Research Methods", "Therapeutic Approaches", "Social Dynamics", "Personality Assessment", "Mental Health"];
    
    let titles;
    if (department === "Computer Science") {
      titles = csTitles;
    } else if (department === "Data Science") {
      titles = dataScienceTitles;
    } else if (department === "Business") {
      titles = businessTitles;
    } else if (department === "Languages") {
      titles = languageTitles;
    } else if (department === "Psychology") {
      titles = psychologyTitles;
    } else {
      titles = [...csTitles, ...dataScienceTitles, ...businessTitles, ...languageTitles, ...psychologyTitles];
    }
    
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const calculateProgress = (courseData) => {
    if (!courseData || !courseData.sections) return 0;
    
    let totalLectures = 0;
    let completedLectures = 0;
    
    courseData.sections.forEach(section => {
      section.lectures.forEach(lecture => {
        totalLectures++;
        if (lecture.completed) {
          completedLectures++;
        }
      });
    });
    
    const calculatedProgress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
    setProgress(calculatedProgress);
    
    // Update exam button visibility based on progress
    setShowExamButton(calculatedProgress === 100);
    
    return calculatedProgress;
  };

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const handleLectureClick = (lecture) => {
    setCurrentVideo(lecture);
    
    // Mark lecture as completed when clicked
    if (course && course.sections) {
      const updatedSections = course.sections.map(section => ({
        ...section,
        lectures: section.lectures.map(lec => 
          lec.id === lecture.id ? { ...lec, completed: true } : lec
        )
      }));
      
      const updatedCourse = { ...course, sections: updatedSections };
      setCourse(updatedCourse);
      calculateProgress(updatedCourse);
    }
  };

  const handleTakeExam = () => {
    // Navigate to the exam page with course ID
    window.location.href = `/courses/${id}/exam`;
  };

  // Mark all lectures as complete (dev helper function)
  const markAllComplete = () => {
    if (course && course.sections) {
      const updatedSections = course.sections.map(section => ({
        ...section,
        lectures: section.lectures.map(lec => ({ ...lec, completed: true }))
      }));
      
      const updatedCourse = { ...course, sections: updatedSections };
      setCourse(updatedCourse);
      calculateProgress(updatedCourse);
    }
  };

  if (loading) {
    return <div className="course-content-loading">Loading course content...</div>;
  }

  if (!course) {
    return <div className="course-content-error">Course not found. Please try again later.</div>;
  }

  return (
    <div className="course-content-page">
      <header className="course-content-header">
        <div className="course-navigation">
          <Link to={`/courses/${id}`} className="back-to-course">
            <i className="fa fa-arrow-left"></i> Back to course overview
          </Link>
          <h1 className="course-title">{course.title}</h1>
        </div>
        <div className="course-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }} 
              aria-valuenow={progress} 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
          <span className="progress-text">{progress}% complete</span>
        </div>
        <div className="course-actions">
          <button className="btn-rating">
            <i className="fa fa-star"></i> Leave a rating
          </button>
          <div className="dropdown">
            <button className="btn-share">
              <i className="fa fa-share"></i> Share
            </button>
          </div>
          <button className="btn-more" onClick={markAllComplete}>
            <i className="fa fa-ellipsis-v"></i>
          </button>
        </div>
      </header>

      <div className="course-content-body">
        <div className="course-content-main">
          {currentVideo && (
            <div className="video-container">
              <iframe 
                src={currentVideo.videoUrl} 
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="video-info">
                <h2 className="video-title">{currentVideo.title}</h2>
                <div className="video-actions">
                  <button className="btn-mark-complete">
                    <i className="fa fa-check"></i> Mark as complete
                  </button>
                  <button className="btn-notes">
                    <i className="fa fa-sticky-note"></i> Notes
                  </button>
                  <div className="playback-speed">
                    <span>1x</span>
                    <i className="fa fa-caret-down"></i>
                  </div>
                </div>
              </div>
              
              {/* Take Exam Button - shown when all lectures are completed */}
              {showExamButton && (
                <div className="exam-container">
                  <div className="exam-info">
                    <h3>Course Complete!</h3>
                    <p>Congratulations on completing all lectures. You are now ready to take the final exam.</p>
                  </div>
                  <button className="btn-take-exam" onClick={handleTakeExam}>
                    <i className="fa fa-file-text"></i> Take Final Exam
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="course-content-sidebar">
          <div className="sidebar-header">
            <h2>Course content</h2>
            <div className="content-info">
              <span>{course.sections.length} sections • </span>
              <span>
                {course.sections.reduce((total, section) => total + section.lectures.length, 0)} lectures • 
              </span>
              <span>
                {Math.floor(course.sections.reduce((total, section) => total + section.duration, 0) / 60)}h {course.sections.reduce((total, section) => total + section.duration, 0) % 60}m total
              </span>
            </div>
          </div>
          
          <div className="sections-accordion">
            {course.sections.map((section) => (
              <div className="section" key={section.id}>
                <div 
                  className={`section-header ${activeSection === section.id ? 'active' : ''}`} 
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="section-title-container">
                    <i className={`dropdown-icon ${activeSection === section.id ? 'fa fa-chevron-down' : 'fa fa-chevron-right'}`}></i>
                    <h3 className="section-title">{section.title}</h3>
                  </div>
                  <div className="section-meta">
                    <span>{section.lectures.length} lectures • {Math.floor(section.duration / 60)}:{(section.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
                
                {activeSection === section.id && (
                  <div className="section-content">
                    {section.lectures.map((lecture) => (
                      <div 
                        key={lecture.id} 
                        className={`lecture ${currentVideo?.id === lecture.id ? 'active' : ''} ${lecture.completed ? 'completed' : ''}`}
                        onClick={() => handleLectureClick(lecture)}
                      >
                        <div className="lecture-info">
                          <div className="lecture-icon">
                            {lecture.type === 'video' ? (
                              <i className="fa fa-play-circle"></i>
                            ) : (
                              <i className="fa fa-question-circle"></i>
                            )}
                          </div>
                          <div className="lecture-title">{lecture.title}</div>
                        </div>
                        <div className="lecture-meta">
                          <span>{lecture.duration} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Take Exam Button in sidebar - shows when progress is 100% */}
          {showExamButton && (
            <div className="sidebar-exam-button">
              <button className="btn-take-exam-sidebar" onClick={handleTakeExam}>
                <i className="fa fa-file-text"></i> Take Final Exam
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseContent 