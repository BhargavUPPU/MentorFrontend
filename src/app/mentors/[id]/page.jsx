"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStudent } from "@/context/studentContext";
import axios from "axios";
import Head from "next/head";

export default function MentorProfile() {
  const router = useRouter();
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [student, setStudent] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const studentData = localStorage.getItem("student");

      setStudent(studentData);
    }
  }, []);
  useEffect(() => {
    if (!student) {
      router.push("/student");
      return; // Prevent rendering while redirecting
    }
  }, [student]);
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000/api";

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`${backendUrl}/mentors/${id}`);
        console.log("Fetched mentor:", response.data);

        // Transform the data to match expected structure
        const transformedData = {
          ...response.data,
          // Ensure availableSlots is properly formatted
          availableSlots: response.data.avaliableSlots
            ? response.data.avaliableSlots.map((slot) => ({
                ...slot,
                date: new Date(slot.date), // Convert string date to Date object
              }))
            : [],
        };

        setMentor(transformedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching mentor:", error);
        setIsLoading(false);
      }
    };

    fetchMentor();
  }, [id, backendUrl]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Mentor not found</p>
      </div>
    );
  }

  // Helper functions for calendar display
  const getMonthName = (offset = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toLocaleString("default", { month: "long" });
  };

  const getYear = (offset = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.getFullYear();
  };

  const renderCalendarDays = (monthOffset = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset, 1);
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get first day of month (0-6, where 0 is Sunday)
    const firstDay = new Date(year, month, 1).getDay();
    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create array of days with mentor availability
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const slot = mentor.availableSlots.find((s) => {
        const slotDate = new Date(s.date);
        return (
          slotDate.getDate() === currentDate.getDate() &&
          slotDate.getMonth() === currentDate.getMonth() &&
          slotDate.getFullYear() === currentDate.getFullYear()
        );
      });

      days.push({
        day: i,
        hasSlot: !!slot,
        isBooked: slot?.booked || false,
        slotId: slot?._id,
        time: slot?.time,
      });
    }

    // Create calendar grid
    const blanks = Array(firstDay).fill(null);
    const allDays = [...blanks, ...days];
    const weeks = [];
    while (allDays.length > 0) {
      weeks.push(allDays.splice(0, 7));
    }

    return weeks.map((week, weekIndex) => (
      <tr key={`week-${weekIndex}`}>
        {week.map((day, dayIndex) => (
          <td
            key={`day-${dayIndex}`}
            className={`p-2 text-center ${
              day
                ? day.hasSlot
                  ? day.isBooked
                    ? "text-gray-400"
                    : "cursor-pointer hover:bg-blue-50"
                  : "text-gray-300"
                : ""
            }`}
            onClick={() => {
              if (day?.hasSlot && !day.isBooked) {
                setSelectedSlot({
                  id: day.slotId,
                  date: new Date(year, month, day.day),
                  time: day.time,
                });
              }
            }}
          >
            {day ? day.day : ""}
            {day?.hasSlot && (
              <div
                className={`h-1 w-1 mx-auto rounded-full ${
                  day.isBooked ? "bg-gray-400" : "bg-blue-500"
                }`}
              ></div>
            )}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <>
      <Head>
        <title>{mentor.name} | Mentor Profile</title>
        <meta name="description" content={mentor.bio} />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Mentor Header */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="bg-blue-500 rounded-full h-24 w-24 flex items-center justify-center text-white text-3xl font-bold">
                  {mentor.name.charAt(0)}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {mentor.name}
                </h1>
                <p className="text-xl text-blue-600 mb-2">
                  {mentor.domain.join(" & ")} Mentor • {mentor.experience} years
                  of experience
                </p>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{mentor.bio}</p>
          </div>

          {/* Skills Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {mentor.skills.map((skill, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {skill}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Proficient
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Availability
            </h2>

            <div className="flex justify-between mb-4">
              <button
                onClick={() => setSelectedMonth(0)}
                className={`px-4 py-2 rounded-md ${
                  selectedMonth === 0 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {getMonthName(0)} {getYear(0)}
              </button>
              <button
                onClick={() => setSelectedMonth(1)}
                className={`px-4 py-2 rounded-md ${
                  selectedMonth === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {getMonthName(1)} {getYear(1)}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {["SU", "M", "TU", "W", "T", "F", "S"].map((day) => (
                      <th
                        key={day}
                        className="p-2 text-center text-sm font-medium text-gray-500"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{renderCalendarDays(selectedMonth)}</tbody>
              </table>
            </div>
          </div>

          {/* Booking Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Book a session
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                30 minute session • $50
              </h3>
              <p className="text-gray-600">
                All sessions are conducted via video call
              </p>
            </div>

            {selectedSlot && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Selected Session</h4>
                <p>
                  {selectedSlot.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                  {" • "}
                  {selectedSlot.time}
                </p>
                <button
                  onClick={async () => {
                    try {
                      // Book the selected slot
                      await axios.post(`${backendUrl}/bookings`, {
                        mentorId: id,
                        studentId: student,
                        date: selectedSlot.date,
                        time: selectedSlot.time,
                      });
                      alert("Booking confirmed!");
                      // Refresh mentor data to update availability
                      const response = await axios.get(
                        `${backendUrl}/mentors/${id}`
                      );
                      setMentor({
                        ...response.data,
                        availableSlots: response.data.avaliableSlots || [],
                      });
                      setSelectedSlot(null);
                    } catch (error) {
                      console.error("Booking failed:", error);
                      alert("Booking failed. Please try again.");
                    }
                  }}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                >
                  Confirm Booking
                </button>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">What you'll learn</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>UI/UX Design principles</li>
                <li>Design Thinking methodologies</li>
                <li>Industry best practices</li>
                <li>Portfolio review and feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
