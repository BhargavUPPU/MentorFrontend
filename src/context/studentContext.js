"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000/api";

  const register = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${backendUrl}/students`, {
        name: formData.name,
        email: formData.email,
      });
      console.log("Registration response data:", response.data);
      console.log(
        "Registration response by id:",
        response.data.studentData._id
      );
      localStorage.setItem("student", response.data.studentData._id);
      setStudent(response.data.studentData);

      // router.push("/mentors");
      return { success: true };
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error.response.data?.message) {
          console.error("Error response data:", error.response.data);
          errorMessage = error.response.data.message;
        }
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    student,
    isLoading,
    error,
    register,
    setError,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
};
