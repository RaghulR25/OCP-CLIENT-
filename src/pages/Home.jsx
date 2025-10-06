import Footer from "../components/Footer";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";
import counImg from "../assets/coun.jpg";



const sampleCounselors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialty: "Mental Health",
    description:
      "Dr. John Doe is a licensed counselor with expertise in mental health. He specializes in providing support to individuals facing emotional challenges. With a focus on coping skills and therapeutic approaches, Dr. Doe is committed to helping clients achieve mental well-being. He offers a range of services, including counseling, therapy, and support groups. Clients can trust Dr. Doe for guidance, emotional support, and a safe space to explore their thoughts and feelings. Discripstion:Mental Health Counseling",
    experience: "8 years",
  },
  {
    id: 2,
    name: "Jane Smith",
    specialty: "Career Counseling",
    description:
      "Jane Smith is a certified career counselor dedicated to helping individuals navigate their professional journeys. With a deep understanding of career development, Jane provides personalized guidance to clients seeking clarity and direction in their careers. Her services include career assessments, resume building, interview preparation, and job search strategies. Jane is passionate about empowering clients to make informed decisions and achieve their career goals. Whether you're exploring new opportunities or looking to advance in your current field, Jane Smith is here to support your career aspirations. Discripstion:Career Counseling",
    experience: "5 years",
  },
  {
    id: 3,
    name: "Mary Johnson",
    specialty: "Relationship Advice",
    description:
      "Mary Johnson is a relationship counselor with a wealth of experience in helping individuals and couples build healthy and fulfilling relationships. With a compassionate approach, Mary provides guidance on communication, conflict resolution, and emotional intimacy. Her services include couples therapy, premarital counseling, and individual relationship coaching. Mary is dedicated to fostering understanding and connection between partners, helping them navigate challenges and strengthen their bonds. Whether you're facing relationship difficulties or seeking to enhance your connection, Mary Johnson is here to support your journey towards healthier relationships. Discripstion:Relationship Advice",
    experience: "10 years",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [counselors, setCounselors] = useState([]);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const { data } = await api.get("/counselors");
       
        setCounselors(data.length ? data : sampleCounselors);
      } catch (err) {
        console.error("Failed to fetch counselors, using sample data:", err);
        setCounselors(sampleCounselors);
      }
    };
    fetchCounselors();
  }, []);

  const handleViewProfile = (counselor) => {
    navigate("/profile", { state: { counselor } });
  };

  return(
  <div className="flex flex-col min-h-screen">
    <div className="flex-1 p-6 bg-gray-50">
     
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
        Welcome to Online Counseling Platform
      </h1>
      <p className="text-center text-gray-700 mb-8">
        Connect with counselors, book appointments, and manage your sessions securely.
      </p>

      
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
       
       <img
  src={counImg}
  alt="Counseling"
  className="w-full md:w-1/2 h-72 md:h-[600px] object-cover rounded-lg shadow-md"
/>

        
        <div className="w-full md:w-1/2 h-72 md:h-[600px] overflow-y-auto p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">🧠 What is Counseling?</h2>
          <p className="text-gray-700 leading-relaxed">
            Counseling is a professional process that provides individuals with a safe, confidential, 
            and supportive space to explore their thoughts, emotions, and challenges. It helps people 
            better understand themselves, develop healthier coping strategies, and make informed decisions 
            in their personal and professional lives. 
            <br /><br />
            A counselor acts as a guide, offering empathy, active listening, and evidence-based techniques 
            to help clients overcome difficulties and achieve personal growth. Counseling can address a wide 
            range of areas, including mental health, relationship issues, career guidance, stress management, 
            and self-improvement.
            <br /><br />
            Whether someone is experiencing emotional struggles, seeking clarity in their career path, 
            or aiming to strengthen their relationships, counseling provides the tools and support to 
            navigate life’s challenges more effectively.
            <br /> <br />
            Counseling is a professional and supportive process that helps individuals explore their thoughts, emotions, and behaviors in a safe environment.
             It provides guidance for people facing personal, emotional, social, or psychological challenges. Through counseling, individuals can gain clarity,
              develop coping strategies, and make informed decisions about their lives.
              <br /> <br />
               It is not only about solving problems but also about fostering personal growth, self-awareness, and resilience. Counselors listen without judgment, offer insights, and encourage clients to express themselves freely, which can significantly improve mental health and overall well-being.
                Whether dealing with stress, anxiety, career dilemmas, or relationship issues, counseling acts as a valuable tool for understanding oneself better and achieving a balanced life.

          </p>
        </div>
      </div>

    
      
        <h2 className="text-2xl font-semibold mb-4">Available Counselors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {counselors.map((c) => (
            <Card
              key={c._id || c.id} 
              counselor={c}
              actionText="View Profile"
              onAction={() => handleViewProfile(c)}
            />
          ))}
        </div>
    </div>

   
    <Footer />
  </div>
);
}
export default Home;
