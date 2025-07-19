"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const studentData = localStorage.getItem("student");
    
        setStudent(studentData);
      
    }
  }, []);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5000/api";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!student) return;
        
        const response = await axios.get(
          `${backendUrl}/bookings/student/${student}/history`
        );
        console.log("Bookings data:", response.data);
        setBookings(response.data.bookings);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load booking history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [student, backendUrl]);
  if (!student) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please login to view your booking history</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Booking History | MentorConnect</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Booking History</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600 mb-4">
              You don't have any bookings yet.
            </p>
            <a
              href="/mentors"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Find a Mentor
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Mentor Info */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 bg-blue-500 rounded-full h-12 w-12 flex items-center justify-center text-white font-bold">
                        {booking.mentorId?.name?.charAt(0) || "M"}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.mentorId?.name || "Mentor"}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {booking.mentorId?.domain?.map((domain, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {domain}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {booking.mentorId?.skills?.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex flex-col items-end">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-gray-600">
                          {booking.time} (30 mins)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}