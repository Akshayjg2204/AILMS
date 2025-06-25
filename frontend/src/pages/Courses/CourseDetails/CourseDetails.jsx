import { useEffect, useState, useRef } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import "./CourseDetails.css"
import lottie from "lottie-web"
import { useAuth0 } from "@auth0/auth0-react"

const CourseDetail = ({ courses }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const [course, setCourse] = useState(null)
  const [relatedCourses, setRelatedCourses] = useState([])
  const [debug, setDebug] = useState({ 
    foundCourse: false, 
    courseID: id, 
    error: null 
  })
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const animationRef = useRef(null)

  useEffect(() => {
    console.log("CourseDetails component mounted. Looking for course with ID:", id)
    console.log("Available courses:", courses)
    
    try {
    // Find the course with the matching ID
    const foundCourse = courses.find((c) => c.course_id === id)
      console.log("Found course:", foundCourse)
      
      setDebug(prev => ({ 
        ...prev, 
        foundCourse: !!foundCourse, 
        courseData: foundCourse 
      }))
      
      if (foundCourse) {
        // Ensure course has all required properties with default values if missing
        const completeFoundCourse = {
          ...foundCourse,
          price: foundCourse.price || { amount: 1499, currency: "INR", payment_options: ["One-time"] },
          course_materials: foundCourse.course_materials || {
            lectures: 24,
            assignments: 12,
            quizzes: 6,
            projects: 3,
            resources: ["Course Notes", "Video Lectures", "Practice Exercises", "Additional Resources"]
          },
          support: foundCourse.support || {
            instructor_office_hours: "Weekly",
            teaching_assistants: true,
            discussion_forum: true,
            email_support: true,
            mentorship: false
          },
          instructor: {
            ...foundCourse.instructor,
            bio: foundCourse.instructor.bio || `${foundCourse.instructor.name} is an expert instructor with years of experience in ${foundCourse.department}.`,
            years_teaching: foundCourse.instructor.years_teaching || 10
          },
          estimated_study_time: foundCourse.estimated_study_time || foundCourse.duration_weeks * foundCourse.hours_per_week,
          level: foundCourse.level || "Intermediate",
          certification: foundCourse.certification !== undefined ? foundCourse.certification : true
        }
        
        console.log("Complete course data:", completeFoundCourse)
        
        // Generate course videos
        const courseVideos = generateVideoPreview(completeFoundCourse);
        completeFoundCourse.previewVideo = courseVideos.mainVideo;
        completeFoundCourse.recommendedVideos = courseVideos.recommendedVideos;
        
        setCourse(completeFoundCourse)
      }
      // If no course is found, create a default one based on the ID
      else {
        console.log("Course not found, creating fallback course for ID:", id)
        const defaultDepartment = id.substring(0, 2) === "CS" ? "Computer Science" : 
                                 id.substring(0, 2) === "DS" ? "Data Science" :
                                 id.substring(0, 2) === "LA" ? "Languages" :
                                 id.substring(0, 2) === "PS" ? "Psychology" :
                                 id.substring(0, 2) === "BU" ? "Business" : "General Education";
        
        const defaultTitle = id === "LANG220" ? "Intermediate Spanish" :
                            id === "DS250" ? "Data Structures & Algorithms" :
                            id === "PSYCH235" ? "Cognitive Psychology" :
                            `Course ${id}`;
        
        const defaultCourse = {
          course_id: id,
          title: defaultTitle,
          description: `Learn essential concepts and practical skills in this comprehensive ${defaultDepartment} course.`,
          instructor: {
            name: `Dr. ${defaultDepartment.split(' ')[0]} Expert`,
            rating: 4.7,
            expertise: generateFakeExpertise(defaultDepartment),
            years_teaching: 15,
            bio: `Expert instructor with extensive experience in ${defaultDepartment} and related fields.`
          },
          department: defaultDepartment,
          level: "Intermediate",
          difficulty: "medium",
          prerequisites: [],
          credits: 3,
          duration_weeks: 14,
          hours_per_week: 8,
          format: "Online",
          language: "English",
          tags: generateTags(defaultDepartment),
          skills_gained: generateSkills(defaultDepartment),
          topics: generateTopics(defaultDepartment),
          rating: 4.8,
          total_ratings: 450,
          reviews: generateReviews(),
          price: {
            amount: 1499,
            currency: "INR",
            payment_options: ["One-time", "Installment"]
          },
          certification: true,
          completion_rate: 0.85,
          difficulty_rating: 3.2,
          last_updated: "2024-09-15",
          next_session_start: "2025-04-01",
          popular_career_paths: generateCareerPaths(defaultDepartment),
          success_rate: 88,
          estimated_study_time: 112,
          learning_style: ["Practical", "Theoretical", "Interactive"],
          course_materials: {
            lectures: 24,
            assignments: 12,
            quizzes: 8,
            projects: 3,
            resources: ["Course Notes", "Video Lectures", "Practice Exercises", "Additional Resources"]
          },
          support: {
            instructor_office_hours: "Weekly",
            teaching_assistants: true,
            discussion_forum: true,
            email_support: true,
            mentorship: false
          }
        };
        
        console.log("Created fallback course:", defaultCourse);
        setCourse(defaultCourse);
        
        // Generate related courses for the fallback course
        const fakeCourses = generateFakeRelatedCourses(defaultCourse);
        setRelatedCourses(fakeCourses);
      }

    // Display real related courses or generate fake ones
    if (foundCourse && foundCourse.related_courses) {
      const related = courses
        .filter((c) => foundCourse.related_courses.includes(c.course_id))
        .slice(0, 3)
      if (related.length > 0) {
        setRelatedCourses(related)
      } else {
        const fakeCourses = generateFakeRelatedCourses(foundCourse)
        setRelatedCourses(fakeCourses)
      }
      } else if (foundCourse) {
      const fakeCourses = generateFakeRelatedCourses(foundCourse)
      setRelatedCourses(fakeCourses)
    }
    } catch (error) {
      console.error("Error in CourseDetails component:", error)
      setDebug(prev => ({ ...prev, error: error.message }))
    }
  }, [id, courses])

  // Function to generate fake related courses
  const generateFakeRelatedCourses = (currentCourse) => {
    const { department, difficulty, level } = currentCourse || {}
    const fakeCourses = []

    // Generate 1-3 fake courses
    const numCourses = Math.floor(Math.random() * 3) + 1 // Random number between 1 and 3

    for (let i = 0; i < numCourses; i++) {
      const courseNumber = Math.floor(Math.random() * 900) + 100
      const fakeCourse = {
        course_id: `${department?.substring(0, 2) || 'CS'}${courseNumber}`,
        title: generateFakeTitle(department || 'Computer Science', difficulty || 'medium'),
        description: generateFakeDescription(department || 'Computer Science', difficulty || 'medium'),
        instructor: {
          name: generateFakeInstructorName(),
          rating: (Math.random() * 0.5 + 4).toFixed(1),
          expertise: generateFakeExpertise(department || 'Computer Science'),
          years_teaching: Math.floor(Math.random() * 15) + 5
        },
        department: department || 'Computer Science',
        level: level || 'Intermediate',
        difficulty: difficulty || 'medium',
        duration_weeks: Math.floor(Math.random() * 8) + 8,
        hours_per_week: Math.floor(Math.random() * 5) + 5,
        rating: (Math.random() * 0.5 + 4).toFixed(1),
        price: {
          amount: Math.floor(Math.random() * 1000) + 999,
          currency: "INR",
          payment_options: ["One-time", "Installment"]
        },
        total_ratings: Math.floor(Math.random() * 1000) + 100,
        format: ["Online", "Hybrid", "In-Person"][Math.floor(Math.random() * 3)],
        language: "English",
        tags: generateTags(department || 'Computer Science'),
        skills_gained: generateSkills(department || 'Computer Science'),
        topics: generateTopics(department || 'Computer Science')
      }
      fakeCourses.push(fakeCourse)
    }

    return fakeCourses
  }

  // Helper functions for generating fake course data
  const generateFakeTitle = (department, difficulty) => {
    const titles = {
      "Computer Science": ["Advanced Programming", "Web Development", "Mobile App Design", "Cloud Computing"],
      "Data Science": ["Data Analysis", "Machine Learning", "Data Visualization", "Statistical Methods"],
      "Business": ["Strategic Management", "Marketing Analytics", "Financial Planning", "Entrepreneurship"],
      "Languages": ["Advanced Conversation", "Business Communication", "Cultural Studies", "Translation Techniques"],
      "Psychology": ["Cognitive Behavior", "Developmental Psychology", "Personality Theory", "Social Psychology"],
      "Default": ["Course in", "Studies in", "Foundations of", "Principles of"]
    }
    
    const deptTitles = titles[department] || titles["Default"]
    return deptTitles[Math.floor(Math.random() * deptTitles.length)]
  }

  const generateFakeDescription = (department, difficulty) => {
    return `A comprehensive course in ${department} focusing on advanced topics and practical applications.`
  }

  const generateFakeInstructorName = () => {
    const firstNames = ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "Robert", "Maria"]
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia"]
    
    return `Dr. ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
  }

  const generateFakeExpertise = (department) => {
    const expertise = {
      "Computer Science": ["Programming", "Algorithms", "Software Development", "Web Technologies"],
      "Data Science": ["Statistics", "Machine Learning", "Big Data", "Visualization"],
      "Business": ["Management", "Marketing", "Finance", "Strategy"],
      "Languages": ["Linguistics", "Translation", "Grammar", "Cultural Studies"],
      "Psychology": ["Cognitive Science", "Behavioral Theory", "Research Methods", "Therapy Techniques"],
      "Default": ["Research", "Teaching", "Analysis", "Theory"]
    }
    
    const deptExpertise = expertise[department] || expertise["Default"]
    return deptExpertise.slice(0, 3)
  }

  const generateTags = (department) => {
    const tags = {
      "Computer Science": ["Programming", "Technology", "Software", "Web", "Mobile", "Algorithms"],
      "Data Science": ["Data", "Analytics", "Statistics", "Machine Learning", "Big Data", "Visualization"],
      "Business": ["Management", "Marketing", "Finance", "Strategy", "Entrepreneurship", "Leadership"],
      "Languages": ["Communication", "Cultural", "International", "Grammar", "Conversation", "Vocabulary"],
      "Psychology": ["Mental Health", "Behavior", "Cognition", "Development", "Social", "Research"],
      "Default": ["Education", "Skills", "Professional", "Career", "Knowledge", "Learning"]
    }
    
    const deptTags = tags[department] || tags["Default"]
    return deptTags.slice(0, 5)
  }

  const generateSkills = (department) => {
    const skills = {
      "Computer Science": ["Programming", "Problem Solving", "Algorithm Design", "Web Development", "Software Engineering"],
      "Data Science": ["Data Analysis", "Statistical Modeling", "Machine Learning", "Data Visualization", "Big Data Processing"],
      "Business": ["Strategic Planning", "Financial Analysis", "Marketing Strategy", "Leadership", "Project Management"],
      "Languages": ["Fluent Communication", "Reading Comprehension", "Writing", "Cultural Understanding", "Translation"],
      "Psychology": ["Research Methods", "Critical Thinking", "Analysis", "Communication", "Behavioral Assessment"],
      "Default": ["Critical Thinking", "Problem Solving", "Communication", "Analysis", "Research"]
    }
    
    const deptSkills = skills[department] || skills["Default"]
    return deptSkills.slice(0, 5)
  }

  const generateTopics = (department) => {
    const topics = {
      "Computer Science": ["Programming Languages", "Data Structures", "Algorithms", "Web Technologies", "Software Design"],
      "Data Science": ["Statistical Analysis", "Machine Learning Models", "Data Cleaning", "Big Data Technologies", "Visualization"],
      "Business": ["Strategic Management", "Marketing", "Finance", "Operations", "Organizational Behavior"],
      "Languages": ["Grammar", "Vocabulary", "Conversation", "Reading", "Writing", "Cultural Context"],
      "Psychology": ["Cognitive Processes", "Development", "Social Behavior", "Research Methods", "Theories"],
      "Default": ["Fundamentals", "Advanced Concepts", "Practical Applications", "Case Studies", "Best Practices"]
    }
    
    const deptTopics = topics[department] || topics["Default"]
    return deptTopics.slice(0, 5)
  }

  const generateCareerPaths = (department) => {
    const careers = {
      "Computer Science": ["Software Engineer", "Web Developer", "Mobile Developer", "System Architect", "IT Consultant"],
      "Data Science": ["Data Scientist", "Data Analyst", "Machine Learning Engineer", "Business Intelligence Analyst", "Research Scientist"],
      "Business": ["Manager", "Consultant", "Entrepreneur", "Financial Analyst", "Marketing Specialist"],
      "Languages": ["Translator", "Teacher", "International Relations", "Content Writer", "Cultural Consultant"],
      "Psychology": ["Therapist", "Researcher", "Counselor", "HR Specialist", "Social Worker"],
      "Default": ["Specialist", "Consultant", "Researcher", "Educator", "Analyst"]
    }
    
    const deptCareers = careers[department] || careers["Default"]
    return deptCareers.slice(0, 4)
  }

  const generateLearningStyles = () => {
    const styles = ["Visual", "Practical", "Theoretical", "Interactive", "Self-paced", "Structured"]
    const numStyles = Math.floor(Math.random() * 3) + 1
    const selectedStyles = []
    
    for (let i = 0; i < numStyles; i++) {
      const randomStyle = styles[Math.floor(Math.random() * styles.length)]
      if (!selectedStyles.includes(randomStyle)) {
        selectedStyles.push(randomStyle)
      }
    }
    
    return selectedStyles
  }

  const generateReviews = () => {
    const comments = [
      "Great course! I learned a lot and enjoyed the material.",
      "The instructor was knowledgeable and engaging. Highly recommended.",
      "Comprehensive content with practical applications. Worth the investment.",
      "Well-structured course with clear explanations and good examples."
    ]
    
    return [
      {
        user_id: `user${Math.floor(Math.random() * 10000)}`,
        rating: Math.floor(Math.random() * 2) + 4,
        comment: comments[Math.floor(Math.random() * comments.length)],
        date: "2024-09-01"
      },
      {
        user_id: `user${Math.floor(Math.random() * 10000)}`,
        rating: Math.floor(Math.random() * 2) + 4,
        comment: comments[Math.floor(Math.random() * comments.length)],
        date: "2024-08-15"
      }
    ]
  }

  const handleEnrollClick = () => {
    // If the course has an external link, open it
    if (course.external_link) {
      window.open(course.external_link, '_blank');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      })
      return
    }

    // Only proceed if user is authenticated
    if (course.price && course.price.amount > 0 && !isEnrolled) {
      setShowPaymentModal(true)
    } else if (isEnrolled) {
      // Navigate to course content
      navigate(`/courses/${id}/learn`)
    } else {
      // Free course enrollment logic
      setIsEnrolled(true)
      alert("You've successfully enrolled in this free course!")
    }
  }

  const closePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedPaymentMethod(null)
    setIsProcessingPayment(false)
    setPaymentSuccess(false)
  }

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method)
  }

  const processPayment = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method")
      return
    }
    
    setIsProcessingPayment(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false)
      setPaymentSuccess(true)
      
      // Create the lottie animation after payment success
      if (animationRef.current) {
        const animation = lottie.loadAnimation({
          container: animationRef.current,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          path: 'https://assets1.lottiefiles.com/packages/lf20_9xRElzvSQZ.json'
        })
        
        // Don't automatically close modal anymore - let user click the continue button
        animation.addEventListener('complete', () => {
          // Animation is complete, but modal stays open for user to click continue
        })
      }
    }, 2000)
  }

  // Use course ID to force different videos for different courses
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

  // Check if loading or course not found
  if (!course) {
    return (
      <div className="loading">
        <h2>Loading course details...</h2>
        <p>If this message persists, the course may not exist.</p>
        <div className="debug-info">
          <h3>Debug Information:</h3>
          <p>Course ID: {debug.courseID}</p>
          <p>Found Course: {debug.foundCourse ? "Yes" : "No"}</p>
          {debug.error && <p>Error: {debug.error}</p>}
          <p>Number of available courses: {courses?.length || 0}</p>
          {debug.courseData && (
            <div>
              <p>Course data found but not rendering:</p>
              <pre>{JSON.stringify(debug.courseData, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="course-details-page">
      <div className="course-header">
          <div className="difficulty-badges">
            <span className={`difficulty-badge ${course.difficulty}`}>
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </span>
            <span className="level-badge">{course.level}</span>
            {course.certification && <span className="certification-badge">Certification</span>}
          </div>
          <h1 className="course-title">{course.title}</h1>
          <p className="course-description">{course.description}</p>

          <div className="course-meta">
          <div className="instructor-info">
              <span>Instructor:</span> {course.instructor.name}
            </div>
            <div className="rating">
              <span>Rating:</span> {course.rating} ★ ({course.total_ratings})
            </div>
            <div className="duration">
              <span>Duration:</span> {course.duration_weeks} weeks
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="course-main">
          <section className="course-section">
            <h2>Course Details</h2>
              <div className="instructor-info">
                <div className="instructor-name">
                  <span>Instructor:</span> {course.instructor.name}
              </div>
                <div className="instructor-rating">
                  <span>Rating:</span> {course.instructor.rating || course.rating} ★
              </div>
                <div className="instructor-experience">
                  <span>Experience:</span> {course.instructor.years_teaching} years
              </div>
                <div className="instructor-bio">
                  <p>{course.instructor.bio || `${course.instructor.name} is an expert in ${course.instructor.expertise.join(', ')}.`}</p>
              </div>
                <div className="instructor-expertise">
                  <span>Expertise:</span> {course.instructor.expertise.join(", ")}
              </div>
              </div>
          
              <div className="course-topics">
                <h3>Skills Gained</h3>
                <ul className="skills-list">
              {course.skills_gained.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
            </div>
          
              <div className="course-topics">
                <h3>Topics Covered</h3>
                <ul className="topics-list">
              {course.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
              ))}
                </ul>
            </div>
          </section>

          <section className="course-section">
              <h2>Course Materials</h2>
              <div className="materials-grid">
                {course.course_materials ? (
                  <>
                    <div className="material-item">
                      <h4>Lectures</h4>
                      <p>{course.course_materials.lectures} lectures</p>
                </div>
                    <div className="material-item">
                      <h4>Assignments</h4>
                      <p>{course.course_materials.assignments} assignments</p>
            </div>
                    <div className="material-item">
                      <h4>Quizzes</h4>
                      <p>{course.course_materials.quizzes} quizzes</p>
              </div>
                    <div className="material-item">
                      <h4>Projects</h4>
                      <p>{course.course_materials.projects} projects</p>
                </div>
                    <div className="material-item resources">
                      <h4>Resources</h4>
                      <ul>
                        {course.course_materials.resources.map((resource, index) => (
                          <li key={index}>{resource}</li>
              ))}
                      </ul>
                </div>
                  </>
                ) : (
                  <div className="no-materials">
                    <p>Course materials information will be provided after enrollment.</p>
              </div>
                )}
            </div>
          </section>

          <section className="course-section">
              <h2>Support & Learning</h2>
              <div className="support-grid">
                {course.support ? (
                  <>
                    <div className="support-item">
                      <h4>Instructor Support</h4>
                      <p>Office Hours: {course.support.instructor_office_hours}</p>
                      {course.support.teaching_assistants && <p>Teaching Assistants Available</p>}
                    </div>
                    <div className="support-item">
                      <h4>Community</h4>
                      {course.support.discussion_forum && <p>Discussion Forum</p>}
                      {course.support.networking_events && <p>Networking Events</p>}
                  </div>
                    <div className="support-item">
                      <h4>Additional Support</h4>
                      {course.support.email_support && <p>Email Support</p>}
                      {course.support.mentorship && <p>Mentorship Available</p>}
                </div>
                  </>
                ) : (
                  <div className="no-support">
                    <p>Support information will be provided after enrollment.</p>
                  </div>
                )}
            </div>
          </section>

          <section className="course-section related-courses-section">
            <h2>Related Courses</h2>
            <div className="related-courses-grid">
                {relatedCourses && relatedCourses.length > 0 ? (
                relatedCourses.map((relatedCourse) => (
                  <Link
                    key={relatedCourse.course_id}
                    to={`/courses/${relatedCourse.course_id}`}
                    className="related-course-card"
                  >
                    <div className="related-course-header">
                      <h4>{relatedCourse.title}</h4>
                      <div className="related-course-badges">
                        <span className={`difficulty-badge ${relatedCourse.difficulty}`}>
                          {relatedCourse.difficulty.charAt(0).toUpperCase() + relatedCourse.difficulty.slice(1)}
                        </span>
                        <span className="level-badge">{relatedCourse.level}</span>
                      </div>
                    </div>
                    <p className="related-course-description">{relatedCourse.description}</p>
                    <div className="related-course-meta">
                      <div className="meta-item">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{relatedCourse.duration_weeks} weeks</span>
                      </div>
                      <div className="meta-item">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 20V10"></path>
                          <path d="M18 20V4"></path>
                          <path d="M6 20v-6"></path>
                        </svg>
                        <span>{relatedCourse.hours_per_week} hrs/week</span>
                      </div>
                      <div className="meta-item">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span>{relatedCourse.rating} ★</span>
                      </div>
                    </div>
                    <div className="related-course-price">
                        <span className="price-amount">
                          {relatedCourse.price && relatedCourse.price.amount === 0 ? "Free" : `₹${(relatedCourse.price?.amount || 1499).toLocaleString()}`}
                        </span>
                        {relatedCourse.price && relatedCourse.price.amount > 0 && (
                          <span className="price-currency">{relatedCourse.price.currency || "INR"}</span>
                        )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-related-courses">
                  <p>No related courses available at the moment.</p>
                </div>
              )}
            </div>
          </section>

          <section className="course-section video-section">
            <h2>Course Preview & Related Videos</h2>
            
            <div className="video-preview">
              <div className="main-video">
                <h3>Course Preview</h3>
                <div className="video-container">
                  <iframe 
                    src={course.previewVideo || "https://www.youtube.com/embed/PkZNo7MFNFg"} 
                    title={`${course.title} Preview`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              
              <div className="recommended-videos">
                <h3>Related Videos</h3>
                <div className="video-list">
                  {course.recommendedVideos && course.recommendedVideos.map((videoUrl, index) => (
                    videoUrl !== course.previewVideo && (
                      <div className="video-item" key={index}>
                        <div className="video-thumbnail">
                          <iframe 
                            src={videoUrl}
                            title={`Related video ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="video-info">
                          <h4>{course.department} - Tutorial {index + 1}</h4>
                          <p>Learn more about {course.topics[index % course.topics.length]}</p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="course-sidebar">
          <div className="course-card">
            <div className="course-price">
                <span className="price-amount">
                  {course.price && course.price.amount === 0 ? "Free" : `₹${(course.price?.amount || 1499).toLocaleString()}`}
                </span>
                {course.price && course.price.amount > 0 && <span className="price-currency">{course.price.currency || "INR"}</span>}
            </div>

            <div className="payment-options">
              <h4>Payment Options</h4>
              <ul>
                  {course.price && course.price.payment_options && 
                   course.price.payment_options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>

              <button 
                className={`enroll-button ${isEnrolled ? 'enrolled' : ''} ${!isAuthenticated && !course.external_link ? 'sign-in' : ''} ${course.external_link ? 'linkedin' : ''}`} 
                onClick={handleEnrollClick}
              >
                {course.external_link 
                  ? "Enroll on LinkedIn" 
                  : (!isAuthenticated 
                      ? "Sign in to Enroll" 
                      : (isEnrolled 
                          ? "Start Course" 
                          : (course.price && course.price.amount === 0 ? "Enroll for Free" : "Enroll Now")))}
              </button>

            <div className="course-meta-info">
              <div className="meta-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                  <span>{course.duration_weeks} weeks, {course.hours_per_week} hrs/week</span>
              </div>
              <div className="meta-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                  <span>Starts {new Date(course.next_session_start).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                  <span>Instructor: {course.instructor.name}</span>
              </div>
              <div className="meta-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                    <path d="M12 20V10"></path>
                    <path d="M18 20V4"></path>
                    <path d="M6 20v-6"></path>
                </svg>
                  <span>Study time: {course.estimated_study_time} hours</span>
                </div>
              </div>
            </div>
          </div>
              </div>
            </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <h3>Complete Your Enrollment</h3>
              <button className="close-button" onClick={closePaymentModal}>×</button>
            </div>
            
            {!paymentSuccess ? (
              <div className="payment-modal-content">
                <div className="course-summary">
                  <h4>{course.title}</h4>
                  <p className="price">₹{(course.price?.amount || 1499).toLocaleString()} {course.price?.currency || "INR"}</p>
                </div>
                
                {!isProcessingPayment ? (
                  <>
                    <div className="payment-methods">
                      <h4>Select Payment Method</h4>
                      <div className="payment-options-grid">
                        {["Credit Card", "Debit Card", "UPI", "Net Banking", "Wallet"].map((method) => (
                          <div 
                            key={method} 
                            className={`payment-option ${selectedPaymentMethod === method ? 'selected' : ''}`}
                            onClick={() => handlePaymentMethodSelect(method)}
                          >
                            <div className="payment-icon">
                              {method === "Credit Card" && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                  <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                              )}
                              {method === "Debit Card" && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                  <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                              )}
                              {method === "UPI" && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M17 9l-5 10-5-10"></path>
                                  <path d="M12 13V6"></path>
                                </svg>
                              )}
                              {method === "Net Banking" && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="1 6 1 22 23 22 23 6"></polyline>
                                  <rect x="1" y="6" width="22" height="16"></rect>
                                  <path d="M12 2v4"></path>
                                  <path d="M1 12h22"></path>
                                </svg>
                              )}
                              {method === "Wallet" && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                  <circle cx="16" cy="12" r="2"></circle>
                                  <path d="M22 10V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h18"></path>
                                </svg>
                              )}
                            </div>
                            <span>{method}</span>
                          </div>
              ))}
            </div>
          </div>
                    <button 
                      className="pay-now-button" 
                      onClick={processPayment}
                      disabled={!selectedPaymentMethod}
                    >
                      Pay Now
                    </button>
                  </>
                ) : (
                  <div className="processing-payment">
                    <div className="loader"></div>
                    <p>Processing your payment...</p>
        </div>
                )}
      </div>
            ) : (
              <div className="payment-success">
                <div className="animation-container" ref={animationRef}></div>
                <div className="success-checkmark">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
    </div>
                <h3>Payment Successful!</h3>
                <p>You're now enrolled in this course.</p>
                <button 
                  className="continue-button"
                  onClick={() => {
                    closePaymentModal();
                    setIsEnrolled(true);
                    // Navigate to course content page after setting isEnrolled
                    setTimeout(() => {
                      navigate(`/courses/${id}/learn`);
                    }, 500);
                  }}
                >
                  Continue to Course
                </button>
              </div>
            )}
      </div>
    </div>
      )}
    </>
  )
}

export default CourseDetail

