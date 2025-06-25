import { useState, useEffect } from "react"
import CourseCard from "../../../components/Course/CourseCard/CourseCard"
import SearchBar from "../../../components/Course/SearchBar/SearchBar"
import Filters from "../../../components/Course/Filters/Filters"
import "./CourseList.css"
import { Button, Tabs, Tab, Box } from "@mui/material"
import { NavLink } from "react-router-dom"

const CourseList = ({ courses }) => {
  const [filteredCourses, setFilteredCourses] = useState(courses)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState({
    level: "",
    difficulty: "",
    department: "",
    priceRange: "",
  })
  const [activeTab, setActiveTab] = useState(0)
  const [recommendedCourses, setRecommendedCourses] = useState([])
  const [freeCourses, setFreeCourses] = useState([])

  useEffect(() => {
    filterCourses()
  }, [searchTerm, activeFilters, courses])

  useEffect(() => {
    // Filter free courses (excluding "Introduction to Computer Science")
    const free = courses.filter(course => 
      course.price && 
      course.price.amount === 0 &&
      course.course_id !== "CS101" && // Exclude Introduction to Computer Science
      // Ensure courses have all required fields
      course.course_id &&
      course.title &&
      course.description
    );
    setFreeCourses(free);
    
    // Simulate getting user's past courses from localStorage or API
    const pastCourses = JSON.parse(localStorage.getItem('pastCourses') || '[]')
    if (pastCourses.length > 0) {
      // Get the most recent course
      const lastCourse = pastCourses[pastCourses.length - 1]
      
      // Find courses from the same department but different course_id
      const recommended = courses
        .filter(course => 
          course.department === lastCourse.department && 
          course.course_id !== lastCourse.course_id &&
          // Ensure recommended courses have all required fields
          course.course_id &&
          course.title &&
          course.description &&
          course.instructor &&
          course.instructor.name &&
          course.department &&
          course.level &&
          course.difficulty &&
          course.prerequisites &&
          course.credits &&
          course.duration_weeks &&
          course.hours_per_week &&
          course.format &&
          course.language &&
          course.tags &&
          course.tags.length > 0 &&
          course.skills_gained &&
          course.skills_gained.length > 0 &&
          course.topics &&
          course.topics.length > 0 &&
          course.rating &&
          course.total_ratings &&
          course.reviews &&
          course.reviews.length > 0 &&
          course.price &&
          course.price.amount &&
          course.price.currency &&
          course.price.payment_options &&
          course.certification !== undefined &&
          course.completion_rate &&
          course.difficulty_rating &&
          course.last_updated &&
          course.next_session_start &&
          course.popular_career_paths &&
          course.popular_career_paths.length > 0 &&
          course.success_rate &&
          course.estimated_study_time &&
          course.learning_style &&
          course.learning_style.length > 0 &&
          course.accessibility_features &&
          course.accessibility_features.length > 0
        )
        .slice(0, 6) // Show up to 6 recommended courses
      
      setRecommendedCourses(recommended)
    } else {
      // If no past courses, recommend based on popular courses
      const popular = courses
        .filter(course => 
          // Ensure popular courses have all required fields
          course.course_id &&
          course.title &&
          course.description &&
          course.instructor &&
          course.instructor.name &&
          course.department &&
          course.level &&
          course.difficulty &&
          course.prerequisites &&
          course.credits &&
          course.duration_weeks &&
          course.hours_per_week &&
          course.format &&
          course.language &&
          course.tags &&
          course.tags.length > 0 &&
          course.skills_gained &&
          course.skills_gained.length > 0 &&
          course.topics &&
          course.topics.length > 0 &&
          course.rating &&
          course.total_ratings &&
          course.reviews &&
          course.reviews.length > 0 &&
          course.price &&
          course.price.amount &&
          course.price.currency &&
          course.price.payment_options &&
          course.certification !== undefined &&
          course.completion_rate &&
          course.difficulty_rating &&
          course.last_updated &&
          course.next_session_start &&
          course.popular_career_paths &&
          course.popular_career_paths.length > 0 &&
          course.success_rate &&
          course.estimated_study_time &&
          course.learning_style &&
          course.learning_style.length > 0 &&
          course.accessibility_features &&
          course.accessibility_features.length > 0
        )
        .sort((a, b) => b.total_ratings - a.total_ratings)
        .slice(0, 6)
      setRecommendedCourses(popular)
    }
  }, [courses])

  const generateFakeRecommendedCourses = () => {
    const departments = ["Computer Science", "Data Science", "Business", "Fine Arts", "Languages", "Health Sciences"]
    const fakeCourses = []

    for (let i = 0; i < 6; i++) {
      const department = departments[Math.floor(Math.random() * departments.length)]
      const courseNumber = Math.floor(Math.random() * 900) + 100
      const difficulty = ["easy", "medium", "hard"][Math.floor(Math.random() * 3)]
      const level = ["Beginner", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)]
      
      const fakeCourse = {
        course_id: `${department.substring(0, 2)}${courseNumber}`,
        title: generateFakeTitle(department, difficulty),
        description: generateFakeDescription(department, difficulty),
        instructor: {
          name: generateFakeInstructorName(),
          rating: (Math.random() * 0.5 + 4).toFixed(1),
          expertise: generateFakeExpertise(department),
          years_teaching: Math.floor(Math.random() * 15) + 5
        },
        department: department,
        level: level,
        difficulty: difficulty,
        prerequisites: generatePrerequisites(department, level),
        credits: Math.floor(Math.random() * 3) + 2,
        duration_weeks: Math.floor(Math.random() * 8) + 8,
        hours_per_week: Math.floor(Math.random() * 5) + 5,
        format: ["Online", "Hybrid", "In-Person"][Math.floor(Math.random() * 3)],
        language: "English",
        tags: generateTags(department),
        skills_gained: generateSkills(department),
        topics: generateTopics(department),
        rating: (Math.random() * 0.5 + 4).toFixed(1),
        total_ratings: Math.floor(Math.random() * 1000) + 100,
        reviews: generateReviews(),
        price: {
          amount: Math.floor(Math.random() * 200) + 199,
          currency: "USD",
          payment_options: ["One-time", "Installment"]
        },
        certification: Math.random() > 0.5,
        completion_rate: Math.random() * 0.3 + 0.7,
        difficulty_rating: Math.floor(Math.random() * 2) + 2,
        last_updated: "2024-09-01",
        next_session_start: "2025-04-15",
        popular_career_paths: generateCareerPaths(department),
        success_rate: Math.floor(Math.random() * 20) + 80,
        estimated_study_time: Math.floor(Math.random() * 50) + 50,
        learning_style: generateLearningStyles(),
        accessibility_features: ["Closed Captions", "Transcripts", "Screen Reader Compatible"]
      }
      fakeCourses.push(fakeCourse)
    }

    return fakeCourses
  }

  const generateFakeTitle = (department, difficulty) => {
    const prefixes = {
      easy: ["Introduction to", "Fundamentals of", "Basics of", "Getting Started with"],
      medium: ["Advanced", "Intermediate", "Professional", "Comprehensive"],
      hard: ["Advanced", "Expert", "Master", "Specialized"]
    }
    const topics = {
      "Computer Science": ["Programming", "Software Development", "Web Development", "Mobile Apps", "Cloud Computing", "Cybersecurity", "AI", "Machine Learning"],
      "Data Science": ["Data Analysis", "Machine Learning", "Big Data", "Data Visualization", "Statistical Analysis", "Predictive Modeling", "Business Intelligence"],
      "Business": ["Management", "Marketing", "Finance", "Strategy", "Entrepreneurship", "Leadership", "Digital Marketing", "Business Analytics"],
      "Fine Arts": ["Digital Art", "Graphic Design", "UI/UX Design", "Animation", "Visual Communication", "3D Modeling", "Game Design"],
      "Languages": ["Conversational", "Business", "Academic", "Technical", "Cultural Studies", "Literature", "Translation"],
      "Health Sciences": ["Nutrition", "Fitness", "Mental Health", "Public Health", "Wellness", "Sports Medicine", "Healthcare Management"]
    }
    const prefix = prefixes[difficulty][Math.floor(Math.random() * prefixes[difficulty].length)]
    const topic = topics[department][Math.floor(Math.random() * topics[department].length)]
    return `${prefix} ${topic}`
  }

  const generateFakeDescription = (department, difficulty) => {
    const descriptions = {
      "Computer Science": [
        "Master the fundamentals of programming and software development with hands-on projects and real-world applications.",
        "Learn to build scalable applications using modern development tools and best practices.",
        "Explore cutting-edge technologies and frameworks for creating innovative solutions."
      ],
      "Data Science": [
        "Discover powerful techniques for analyzing and visualizing complex datasets to drive business decisions.",
        "Learn to build and deploy machine learning models for real-world applications.",
        "Master statistical analysis and data-driven decision making in this comprehensive course."
      ],
      "Business": [
        "Develop strategic thinking and business acumen for modern organizations.",
        "Learn to analyze market trends and make data-driven business decisions.",
        "Master the art of leadership and organizational management."
      ],
      "Fine Arts": [
        "Explore creative techniques and principles of digital art and design.",
        "Learn to create compelling visual experiences and user interfaces.",
        "Master the tools and techniques of professional digital artists."
      ],
      "Languages": [
        "Achieve fluency through immersive learning and practical conversation practice.",
        "Develop comprehensive language skills for professional and academic contexts.",
        "Explore cultural nuances while mastering language proficiency."
      ],
      "Health Sciences": [
        "Learn evidence-based approaches to health and wellness.",
        "Master the principles of nutrition and physical fitness.",
        "Understand the science behind healthy living and preventive care."
      ]
    }
    return descriptions[department][Math.floor(Math.random() * descriptions[department].length)]
  }

  const generateFakeInstructorName = () => {
    const titles = ["Dr.", "Prof.", "Mr.", "Ms.", "Mrs."]
    const names = [
      "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim", "Lisa Patel",
      "James Wilson", "Maria Garcia", "Robert Lee", "Jennifer Smith", "Thomas Brown",
      "Alexandra Wong", "Carlos Martinez", "Sophie Anderson", "Raj Patel", "Emma Thompson"
    ]
    return `${titles[Math.floor(Math.random() * titles.length)]} ${names[Math.floor(Math.random() * names.length)]}`
  }

  const generateFakeExpertise = (department) => {
    const expertise = {
      "Computer Science": ["Programming", "Algorithms", "Software Engineering", "Cloud Computing", "DevOps", "AI", "Cybersecurity"],
      "Data Science": ["Data Analysis", "Machine Learning", "Statistics", "Big Data", "Visualization", "Predictive Modeling"],
      "Business": ["Management", "Strategy", "Marketing", "Finance", "Leadership", "Business Analytics"],
      "Fine Arts": ["Digital Art", "Design", "Animation", "UI/UX", "Visual Communication", "3D Modeling"],
      "Languages": ["Linguistics", "Translation", "Cultural Studies", "Language Teaching", "Business Communication"],
      "Health Sciences": ["Nutrition", "Public Health", "Wellness", "Sports Medicine", "Healthcare Management"]
    }
    const numExpertise = Math.floor(Math.random() * 3) + 2 // 2-4 expertise areas
    const shuffled = expertise[department].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numExpertise)
  }

  const generatePrerequisites = (department, level) => {
    if (level === "Beginner") return []
    const prerequisites = {
      "Computer Science": ["CS101", "CS102", "MATH210", "CS150"],
      "Data Science": ["DS101", "STAT101", "CS101", "MATH210"],
      "Business": ["BUS101", "ECON101", "MATH101", "BUS102"],
      "Fine Arts": ["ART101", "DES101", "DIG101", "ART102"],
      "Languages": ["LANG101", "LANG102", "CULT101", "LANG103"],
      "Health Sciences": ["HEALTH101", "BIO101", "CHEM101", "HEALTH102"]
    }
    const numPrerequisites = Math.floor(Math.random() * 2) + 1 // 1-2 prerequisites
    const shuffled = prerequisites[department].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numPrerequisites)
  }

  const generateTags = (department) => {
    const tags = {
      "Computer Science": ["Programming", "Software", "Coding", "Development", "Web", "Mobile", "Python", "JavaScript", "Java", "Cloud", "Algorithms", "AI", "Machine Learning"],
      "Data Science": ["Data", "Analytics", "Machine Learning", "AI", "Statistics", "Visualization", "Big Data", "Python", "R", "SQL", "Predictive", "Business Intelligence"],
      "Business": ["Management", "Marketing", "Finance", "Strategy", "Leadership", "Entrepreneurship", "Analytics", "Project Management", "Communication", "Digital Marketing"],
      "Fine Arts": ["Design", "Creative", "Digital", "UI/UX", "Visual", "Typography", "Adobe", "Illustration", "Animation", "Web Design", "3D", "Game Design"],
      "Languages": ["Language", "Communication", "Cultural", "International", "Conversational", "Grammar", "Translation", "Business Language", "Academic"],
      "Health Sciences": ["Health", "Wellness", "Nutrition", "Fitness", "Mental Health", "Public Health", "Sports", "Medicine", "Healthcare", "Lifestyle"]
    }
    const numTags = Math.floor(Math.random() * 3) + 4 // 4-6 tags
    const shuffled = tags[department].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numTags)
  }

  const generateSkills = (department) => {
    const skills = {
      "Computer Science": [
        "Programming in Python", "Data Structures", "Algorithms", "Object-Oriented Design",
        "Web Development", "Software Testing", "Version Control", "Problem Solving",
        "Cloud Computing", "DevOps", "Cybersecurity", "AI/ML"
      ],
      "Data Science": [
        "Statistical Analysis", "Machine Learning", "Data Visualization", "SQL",
        "Data Cleaning", "Predictive Modeling", "Python/R Programming", "Data Ethics",
        "Big Data Processing", "Business Intelligence", "Data Mining"
      ],
      "Business": [
        "Strategic Planning", "Financial Analysis", "Marketing Strategy", "Leadership",
        "Project Management", "Business Communication", "Decision Making", "Negotiation",
        "Digital Marketing", "Business Analytics", "Risk Management"
      ],
      "Fine Arts": [
        "Digital Design", "Color Theory", "Typography", "UI/UX Principles",
        "Visual Composition", "Creative Thinking", "Adobe Creative Suite", "Prototyping",
        "3D Modeling", "Animation", "Game Design", "Brand Identity"
      ],
      "Languages": [
        "Conversational Skills", "Grammar", "Vocabulary", "Pronunciation",
        "Reading Comprehension", "Writing", "Cultural Understanding", "Translation",
        "Business Communication", "Academic Writing", "Public Speaking"
      ],
      "Health Sciences": [
        "Nutrition Planning", "Fitness Assessment", "Health Analysis", "Wellness Coaching",
        "Public Health", "Mental Health", "Sports Medicine", "Healthcare Management",
        "Preventive Care", "Health Education", "Lifestyle Management"
      ]
    }
    const numSkills = Math.floor(Math.random() * 4) + 5 // 5-8 skills
    const shuffled = skills[department].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numSkills)
  }

  const generateTopics = (department) => {
    const topics = {
      "Computer Science": [
        "Introduction and Setup", "Basic Programming Concepts", "Data Structures", 
        "Algorithms and Complexity", "Object-Oriented Programming", "Web Technologies",
        "Database Design", "Software Development Lifecycle", "Testing and Debugging",
        "Cloud Computing", "DevOps", "Cybersecurity"
      ],
      "Data Science": [
        "Introduction to Data Science", "Statistical Foundations", "Data Collection and Cleaning", 
        "Exploratory Data Analysis", "Machine Learning Fundamentals", "Supervised Learning",
        "Unsupervised Learning", "Data Visualization", "Big Data Technologies",
        "Predictive Modeling", "Business Intelligence", "Data Ethics"
      ],
      "Business": [
        "Business Fundamentals", "Market Analysis", "Financial Planning", 
        "Marketing Strategies", "Organizational Behavior", "Business Ethics",
        "Strategic Management", "Leadership and Communication", "Global Business Perspectives",
        "Digital Marketing", "Business Analytics", "Risk Management"
      ],
      "Fine Arts": [
        "Design Principles", "Digital Tools Introduction", "Typography and Color Theory", 
        "Layout and Composition", "UI/UX Design", "Visual Communication",
        "Interactive Design", "Portfolio Development", "Professional Practices",
        "3D Modeling", "Animation", "Game Design"
      ],
      "Languages": [
        "Grammar", "Vocabulary", "Conversation", "Culture", "Literature", "Film",
        "Idiomatic Expressions", "Business Communication", "Academic Writing",
        "Public Speaking", "Translation", "Cultural Studies"
      ],
      "Health Sciences": [
        "Macronutrients", "Micronutrients", "Diet Planning", "Exercise Science",
        "Mental Wellness", "Sleep Hygiene", "Stress Management", "Public Health",
        "Sports Medicine", "Healthcare Management", "Preventive Care"
      ]
    }
    const numTopics = Math.floor(Math.random() * 3) + 7 // 7-9 topics
    const shuffled = topics[department].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numTopics)
  }

  const generateCareerPaths = (department) => {
    const paths = {
      "Computer Science": [
        "Software Engineer", "Web Developer", "Mobile App Developer", 
        "DevOps Engineer", "Systems Architect", "AI/ML Engineer",
        "Cybersecurity Analyst", "Cloud Architect", "Full Stack Developer"
      ],
      "Data Science": [
        "Data Scientist", "Data Analyst", "Machine Learning Engineer", 
        "Business Intelligence Analyst", "Research Scientist", "Data Engineer",
        "Analytics Manager", "Data Architect", "AI Specialist"
      ],
      "Business": [
        "Business Analyst", "Project Manager", "Marketing Manager", 
        "Financial Analyst", "Management Consultant", "Entrepreneur",
        "Digital Marketing Specialist", "Business Intelligence Manager", "Strategy Director"
      ],
      "Fine Arts": [
        "UI/UX Designer", "Graphic Designer", "Digital Artist", 
        "Creative Director", "Web Designer", "3D Artist",
        "Game Designer", "Animation Director", "Brand Strategist"
      ],
      "Languages": [
        "Translator", "Teacher", "International Business", "Tourism",
        "Interpreter", "Content Localization", "Language Consultant",
        "Cultural Advisor", "International Relations"
      ],
      "Health Sciences": [
        "Nutritionist", "Wellness Coach", "Health Educator", "Fitness Instructor",
        "Public Health Specialist", "Healthcare Manager", "Sports Medicine Specialist",
        "Mental Health Counselor", "Health Policy Advisor"
      ]
    }
    const numPaths = Math.floor(Math.random() * 2) + 3 // 3-4 paths
    const shuffled = paths[department].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numPaths)
  }

  const generateLearningStyles = () => {
    const styles = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic", "Blended", "Project-based", "Interactive"]
    const numStyles = Math.floor(Math.random() * 2) + 2 // 2-3 styles
    const shuffled = styles.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numStyles)
  }

  const generateReviews = () => {
    const comments = [
      "This course exceeded my expectations. The content was well-organized and the instructor was excellent.",
      "Great course! I learned a lot and the exercises were practical and helpful.",
      "Very informative and engaging. The material was challenging but explained clearly.",
      "The instructor's expertise really shines through. Highly recommend this course.",
      "Excellent course content and structure. I've already applied what I learned in my job.",
      "Well-paced with good examples. The hands-on projects were particularly valuable.",
      "Top-notch course. Clear explanations and relevant material for today's industry.",
      "The practical assignments helped me understand the concepts better.",
      "Instructor was very responsive and helpful throughout the course.",
      "Great balance of theory and practical application."
    ]
    
    const numReviews = Math.floor(Math.random() * 3) + 2 // 2-4 reviews
    const reviews = []
    
    for (let i = 0; i < numReviews; i++) {
      reviews.push({
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        date: "2024-08-15",
        comment: comments[Math.floor(Math.random() * comments.length)]
      })
    }
    
    return reviews
  }

  const filterCourses = () => {
    let results = courses.filter(course => {
      // Check if course has all required fields
      return (
        course.course_id &&
        course.title &&
        course.description &&
        course.instructor &&
        course.instructor.name &&
        course.department &&
        course.level &&
        course.difficulty &&
        course.prerequisites &&
        course.credits &&
        course.duration_weeks &&
        course.hours_per_week &&
        course.format &&
        course.language &&
        course.tags &&
        course.tags.length > 0 &&
        course.skills_gained &&
        course.skills_gained.length > 0 &&
        course.topics &&
        course.topics.length > 0 &&
        course.rating &&
        course.total_ratings &&
        course.reviews &&
        course.reviews.length > 0 &&
        course.price &&
        course.price.amount &&
        course.price.currency &&
        course.price.payment_options &&
        course.certification !== undefined &&
        course.completion_rate &&
        course.difficulty_rating &&
        course.last_updated &&
        course.next_session_start &&
        course.popular_career_paths &&
        course.popular_career_paths.length > 0 &&
        course.success_rate &&
        course.estimated_study_time &&
        course.learning_style &&
        course.learning_style.length > 0 &&
        course.accessibility_features &&
        course.accessibility_features.length > 0
      )
    })

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term) ||
          course.instructor.name.toLowerCase().includes(term) ||
          course.tags.some((tag) => tag.toLowerCase().includes(term)),
      )
    }

    // Apply level filter
    if (activeFilters.level) {
      results = results.filter((course) => course.level === activeFilters.level)
    }

    // Apply difficulty filter
    if (activeFilters.difficulty) {
      results = results.filter((course) => course.difficulty === activeFilters.difficulty)
    }

    // Apply department filter
    if (activeFilters.department) {
      results = results.filter((course) => course.department === activeFilters.department)
    }

    // Apply price range filter
    if (activeFilters.priceRange) {
      const [min, max] = activeFilters.priceRange.split("-")
      if (max) {
        results = results.filter((course) => course.price.amount >= Number(min) && course.price.amount <= Number(max))
      } else {
        // Handle "700+" case
        results = results.filter((course) => course.price.amount >= Number(min.replace("+", "")))
      }
    }

    setFilteredCourses(results)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (filters) => {
    setActiveFilters(filters)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <div className="course-list-page">
      <h1>All Courses</h1>
      <NavLink to="/courseQuiz">
        <Button
          sx={{
            background: "#4251f5",
            color: "white",
            fontWeight: "800",
            fontFamily: "ailms",
            marginBottom: "10px",
          }}
        >
          Take Our Quiz Based Course Recommendation
        </Button>
      </NavLink>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="All Courses" />
          <Tab label="Free Courses" />
          <Tab label="AI Recommended" />
        </Tabs>
      </Box>

      <SearchBar onSearch={handleSearch} />

      <div className="course-list-container">
        <div className="filters-column">
          <Filters onFilterChange={handleFilterChange} />
        </div>

        {activeTab === 0 ? (
          <div className="courses-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => <CourseCard key={course.course_id} course={course} />)
            ) : (
              <div className="no-courses">
                <h3>No courses found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        ) : activeTab === 1 ? (
          <div className="courses-grid">
            {freeCourses.length > 0 ? (
              freeCourses.map((course) => <CourseCard key={course.course_id} course={course} />)
            ) : (
              <div className="no-courses">
                <h3>No free courses available</h3>
                <p>Check back later for free courses or explore our paid courses.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="recommended-courses">
            {recommendedCourses.length > 0 ? (
              recommendedCourses.map((course) => <CourseCard key={course.course_id} course={course} />)
            ) : (
              <div className="no-courses">
                <h3>No recommended courses available</h3>
                <p>Complete some courses to get personalized recommendations.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseList

