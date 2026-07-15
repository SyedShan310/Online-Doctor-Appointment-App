import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, CheckCircle, Loader2 } from "lucide-react";
import { axiosInstance } from "../../Lib/axios"; // Adjust path
import toast from "react-hot-toast";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User"));
    const doctorId = user?.id;

    if (!doctorId) {
      setError("Doctor ID not found. Please log in.");
      setLoading(false);
      toast.error("Please log in to view appointments", { id: "login-error" });
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get(`/doctor/get-appointments/${doctorId}`);
        setAppointments(response.data.appointments || []);
      } catch (err) {
        setError("Failed to fetch appointments. Please try again.");
        toast.error(err.response?.data?.message || "Error loading appointments", {
          id: "fetch-error",
        });
        console.error("Fetch appointments error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

 

  const handleCompleteAppointment = async (appointmentId) => {
    if (window.confirm("Mark this appointment as completed?")) {
      try {
        const user = JSON.parse(localStorage.getItem("User"));
        const doctorId = user?.id;
        if (!doctorId) {
          toast.error("Doctor ID not found", { id: "doctor-id-error" });
          return;
        }

        const response = await axiosInstance.put(`/doctor/complete-appointments/${doctorId}/${appointmentId}`);
        toast.success(response.data.message || "Appointment marked as completed");
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === appointmentId ? { ...appt, status: "Completed" } : appt
          )
        );
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to complete appointment", {
          id: "complete-error",
        });
        console.error("Complete appointment error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center  bg-gray-50">
        <div className="flex items-center gap-3 bg-white p-6 rounded-lg shadow-lg">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <p className="text-lg font-medium text-red-600">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto  px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-500">
        <h2 className="text-2xl sm:text-3xl text-gray-900 font-bold mb-6">
          Your Appointments
        </h2>
        {appointments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500 font-medium">No appointments scheduled.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="p-4 text-sm font-semibold rounded-tl-lg">Patient</th>
                  <th className="p-4 text-sm font-semibold hidden sm:table-cell">Payment</th>
                  <th className="p-4 text-sm font-semibold hidden md:table-cell">Age</th>
                  <th className="p-4 text-sm font-semibold">Date & Time</th>
                  <th className="p-4 text-sm font-semibold rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr
                    key={appt._id || index}
                    className={`border-b border-gray-100 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-teal-50/50"
                    } hover:bg-teal-100/50 hover:shadow-sm`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={appt.patientImage || "https://via.placeholder.com/40"}
                          alt={appt.patientName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-teal-400 shadow-sm"
                        />
                        <span className="text-gray-800 font-medium text-sm">{appt.patientName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm hidden sm:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.feePaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {appt.feePaid ? "PAID" : "CASH"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-sm hidden md:table-cell">
                      {appt.patientAge || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {new Date(appt.appointmentDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {appt.time}
                    </td>
                    <td className="p-4">
                      {appt.status === "Cancelled" ? (
                        <span className="text-red-600 font-medium text-sm flex items-center gap-2">
                          <XCircle className="w-4 h-4" /> Cancelled
                        </span>
                      ) : appt.status === "Completed" ? (
                        <span className="text-green-600 font-medium text-sm flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Completed
                        </span>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleCompleteAppointment(appt._id)}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 text-sm shadow-sm hover:shadow-md"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Complete</span>
                            <span className="sm:hidden">Done</span>
                          </button>
                          
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;