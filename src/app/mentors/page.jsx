"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useStudent } from "@/context/studentContext";
import Head from "next/head";

export default function MentorDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    domain: "",
    experience: "",
    availability: "",
  });
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState("");
  const [isClient, setIsClient] = useState(false);

  const [mentorId, setMentorId] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const studentData = localStorage.getItem("student");
      const mentorData = localStorage.getItem("mentor");
      console.log("mentor", mentorData);
      setMentorId(mentorData);
      setStudent(studentData);
    }
  }, []);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000/api";
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedStudent = localStorage.getItem("student");
      const storedMentorId = localStorage.getItem("mentor");
      setStudent(storedStudent);
      setMentorId(storedMentorId);
    }
  }, []);

  useEffect(() => {
    if (isClient && (!student || !mentorId)) {
      router.push("/student");
    }
  }, [isClient, student, mentorId]);
  useEffect(() => {
    // Fetch mentors from your API endpoint
    const fetchMentors = async () => {
      try {
        const response = await axios.get(`${backendUrl}/mentors`);
        const data = response.data;
        setMentors(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    // Search term filter
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase());

    // Domain filter (now checks array of domains)
    const matchesDomain =
      !filters.domain || mentor.domain.includes(filters.domain);

    // Experience filter
    const matchesExperience =
      !filters.experience ||
      (filters.experience === "junior" && mentor.experience < 5) ||
      (filters.experience === "senior" && mentor.experience >= 5);

    // Availability filter (using availableSlots array)
    const matchesAvailability =
      !filters.availability || mentor.availableSlots.length > 0;

    return (
      matchesSearch && matchesDomain && matchesExperience && matchesAvailability
    );
  });

  return (
    <>
      <Head>
        <title>Find a Mentor | Connect with Professionals</title>
        <meta
          name="description"
          content="Connect with experienced professionals in your field"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
              Find a Mentor
            </h1>
            <p className="max-w-xl mx-auto text-xl text-gray-600">
              Connect with experienced professionals in your field.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="w-full md:w-1/2">
                <label htmlFor="search" className="sr-only">
                  Search for mentors
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                    placeholder="Search for mentors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center h-5">
                  <input
                    id="available-now"
                    name="available-now"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={filters.availability === "available"}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        availability: e.target.checked ? "available" : "",
                      })
                    }
                  />
                </div>
                <label
                  htmlFor="available-now"
                  className="text-sm font-medium text-gray-700"
                >
                  Available now
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="domain"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Domain
                </label>
                <select
                  id="domain"
                  name="domain"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.domain}
                  onChange={(e) =>
                    setFilters({ ...filters, domain: e.target.value })
                  }
                >
                  <option value="">All Domains</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Design">Design</option>
                  <option value="Technology">Technology</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Experience Level
                </label>
                <select
                  id="experience"
                  name="experience"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.experience}
                  onChange={(e) =>
                    setFilters({ ...filters, experience: e.target.value })
                  }
                >
                  <option value="">Any Experience</option>
                  <option value="junior">Junior (1-4 years)</option>
                  <option value="senior">Senior (5+ years)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mentors List */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Mentors
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMentors.map((mentor) => (
                    <div
                      key={mentor._id}
                      className="bg-white overflow-hidden shadow rounded-lg"
                    >
                      <div className="px-6 py-5">
                        <div className="flex items-center mb-4">
                          <div className="flex-shrink-0 bg-blue-500 rounded-full h-12 w-12 flex items-center justify-center text-white font-bold">
                            {mentor.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              {mentor.name}
                            </h3>
                            <p className="text-sm text-blue-600">
                              {mentor.domain.join(" & ")} • {mentor.experience}+
                              years
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{mentor.bio}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {mentor.domain.map((domain) => (
                            <span
                              key={domain}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {domain}
                            </span>
                          ))}
                          {mentor.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                          onClick={() => router.push(`/mentors/${mentor._id}`)}
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredMentors.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No mentors found
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
