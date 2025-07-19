"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";

export default function MentorRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    domain: "",
    experience: "",
    bio: "",
    skills: "",
    availableSlots: []
  });
  
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000/api";

  const domains = ["UI/UX", "Design", "Technology", "Marketing", "Business", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const addTimeSlot = () => {
    if (!slotDate || !slotTime) return;
    
    const newSlot = {
      date: slotDate,
      time: slotTime
    };
    
    setFormData({
      ...formData,
      availableSlots: [...formData.availableSlots, newSlot]
    });
    
    setSlotDate("");
    setSlotTime("");
  };

  const removeTimeSlot = (index) => {
    const updatedSlots = [...formData.availableSlots];
    updatedSlots.splice(index, 1);
    setFormData({
      ...formData,
      availableSlots: updatedSlots
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
  
    if (!formData.domain) newErrors.domain = "Domain is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const mentorData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        domain: formData.domain.split(',').map(d => d.trim()),
        experience: parseInt(formData.experience),
        bio: formData.bio,
        skills: formData.skills.split(',').map(s => s.trim()),
        avaliableSlots: formData.availableSlots
      };

      const response = await axios.post(`${backendUrl}/mentors`, mentorData);
      
      console.log("Registration successful:", response.data);
      alert("Registration successful! You can now log in.");
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Mentor Registration | Mentor Booking</title>
        <meta name="description" content="Register as a mentor to offer your expertise" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Become a Mentor
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Share your knowledge and help others grow in their careers
            </p>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                          errors.name ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                            </div>  
                   
                  {/* Mentor Profile */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Mentor Profile</h3>
                    
                    <div>
                      <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                        Domain/Expertise
                      </label>
                      <select
                        id="domain"
                        name="domain"
                        value={formData.domain}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                          errors.domain ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      >
                        <option value="">Select your domain</option>
                        {domains.map(domain => (
                          <option key={domain} value={domain}>{domain}</option>
                        ))}
                      </select>
                      {errors.domain && <p className="mt-1 text-sm text-red-600">{errors.domain}</p>}
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                        Years of Experience
                      </label>
                      <input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                          errors.experience ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio/Introduction
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                        className={`mt-1 block w-full border ${
                          errors.bio ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                    </div>

                    <div>
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                        Skills (comma separated)
                      </label>
                      <input
                        id="skills"
                        name="skills"
                        type="text"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Figma, Sketch, Adobe XD"
                        className={`mt-1 block w-full border ${
                          errors.skills ? "border-red-300" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
                    </div>
                  </div>
                </div>

                {/* Time Slots Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Available Time Slots</h3>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="slotDate" className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        id="slotDate"
                        type="date"
                        value={slotDate}
                        onChange={(e) => setSlotDate(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="slotTime" className="block text-sm font-medium text-gray-700">
                        Time
                      </label>
                      <input
                        id="slotTime"
                        type="time"
                        value={slotTime}
                        onChange={(e) => setSlotTime(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addTimeSlot}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Slot
                      </button>
                    </div>
                  </div>

                  {formData.availableSlots.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Added Slots</h4>
                      <ul className="space-y-2">
                        {formData.availableSlots.map((slot, index) => (
                          <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                            <span>
                              {new Date(slot.date).toLocaleDateString()} at {slot.time}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTimeSlot(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Registering...
                      </>
                    ) : (
                      "Register as Mentor"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}