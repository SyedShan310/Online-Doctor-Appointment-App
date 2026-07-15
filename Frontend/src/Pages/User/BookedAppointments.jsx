import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { XCircle, CheckCircle, Trash2 } from "lucide-react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const BookedAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const user = JSON.parse(localStorage.getItem("User") || "{}");
    const patientId = user?.id;

    if (!token || !patientId) {
      setError("Please log in to view your appointments.");
      setLoading(false);
      toast.error("Please log in to view appointments", { id: "login-error" });
      navigate("/login");
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get(`user/get-appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
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

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment? You will need to request a refund.")) {
      try {
        console.log(appointmentId)
        const token = localStorage.getItem("Token");
        const user = JSON.parse(localStorage.getItem("User") || "{}");
        const patientId = user?.id;

        if (!token || !patientId) {
          toast.error("Please log in again", { id: "auth-error" });
          navigate("/login");
          return;
        }

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axiosInstance.put(
          `/user/cancel-appointments/${patientId}/${appointmentId}`
        );
        toast.success(response.data.message || "Cancellation requested successfully");
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === appointmentId ? { ...appt, status: "Cancellation Requested" } : appt
          )
        );
        // // Redirect to refund request form
        navigate(`/RefundRequest/${appointmentId}`);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to request cancellation", {
          id: "cancel-error",
        });
        console.error("Cancel appointment error:", err);
      }
    }
  };

  // Placeholder for delete action (to be implemented if needed)
  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await axiosInstance.delete(`/user/delete-appointment/${appointmentId}`);
      toast.success(response.data.message || "Appointment deleted successfully");
      setAppointments((prev) => prev.filter((appt) => appt._id !== appointmentId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete appointment", {
        id: "delete-error",
      });
      console.error("Delete appointment error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-teal-500 animate-spin" />
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-red-500 font-medium bg-white p-6 rounded-lg shadow-md border border-red-200">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-16 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-teal-700 mb-8 text-center tracking-tight">
          My Booked Appointments
        </h2>
        {appointments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center border-t-4 border-teal-500">
            <p className="text-xl font-semibold text-gray-800">No appointments booked yet</p>
            <p className="mt-2 text-gray-600">Schedule a visit with a doctor to get started!</p>
            <Link
              to="/doctors"
              className="mt-6 inline-block bg-teal-600 text-white py-2 px-6 rounded-full hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Find a Doctor
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-xl mt-12 overflow-hidden  border-t-4 border-teal-500">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-teal-600 text-white">
                    <tr>
                      <th className="p-4 text-sm font-semibold">Doctor</th>
                      <th className="p-4 text-sm font-semibold">Specialty</th>
                      <th className="p-4 text-sm font-semibold">Date & Time</th>
                      <th className="p-4 text-sm font-semibold">Fees</th>
                      <th className="p-4 text-sm font-semibold">Status</th>
                      <th className="p-4 text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt, index) => (
                      <tr
                        key={appt._id || index}
                        className={`border-b border-gray-200 transition-all duration-200`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={appt.doctorImage || "https://via.placeholder.com/40"}
                              alt={appt.doctorName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 shadow-sm"
                            />
                            <span className="text-gray-900 font-semibold">{appt.doctorName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700 font-medium">{appt.specialty || "N/A"}</td>
                        <td className="p-4 text-teal-700 font-bold text">
                          {new Date(appt.appointmentDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          <span className="font-semibold text-gray-700">{appt.time}</span>
                        </td>
                        <td className="p-4 text-gray-700 font-medium">${appt.fees || "N/A"}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                              appt.status === "Cancellation Requested"
                                ? "bg-orange-100 text-orange-800"
                                : appt.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : appt.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {appt.status === "Pending" ? (
                            <button
                              onClick={() => handleCancelAppointment(appt._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <XCircle className="w-5 h-5" /> Cancel
                            </button>
                          ) : appt.status === "Cancellation Requested" ? (
                            <span className="text-gray-500 text-sm italic">Awaiting Refund Approval</span>
                          ) : appt.status === "Cancelled" ? (
                            <button
                              onClick={() => handleDeleteAppointment(appt._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              <Trash2 className="w-5 h-5" /> Delete
                            </button>
                          ) : (
                            <span className="text-gray-500 text-sm italic">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="bg-white rounded-xl shadow-lg p-5 border-t-4 transform transition-all hover:scale-[1.02] duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={appt.doctorImage || "https://via.placeholder.com/40"}
                      alt={appt.doctorName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-teal-500 shadow-sm"
                    />
                    <div>
                      <p className="text-gray-900 font-semibold text-lg">{appt.doctorName}</p>
                      <p className="text-gray-600 text-sm font-medium">{appt.specialty || "N/A"}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <span className="font-semibold text-teal-700">Date & Time:</span>{" "}
                      {new Date(appt.appointmentDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      <span className="font-semibold">{appt.time}</span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-teal-700">Fees:</span> ${appt.fees || "N/A"}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-teal-700">Status:</span>{" "}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                          appt.status === "Cancellation Requested"
                            ? "bg-orange-100 text-orange-800"
                            : appt.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : appt.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </p>
                    <div className="flex flex-col gap-2">
                      {appt.status === "Pending" && (
                        <button
                          onClick={() => handleCancelAppointment(appt._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg w-full justify-center"
                        >
                          <XCircle className="w-5 h-5" /> Cancel Appointment
                        </button>
                      )}
                      {appt.status === "Cancellation Requested" && (
                        <span className="text-gray-500 text-sm italic text-center">
                          Awaiting Refund Approval
                        </span>
                      )}
                      {appt.status === "Cancelled" && (
                        <button
                          onClick={() => handleDeleteAppointment(appt._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg w-full justify-center"
                        >
                          <Trash2 className="w-5 h-5" /> Delete Appointment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookedAppointments;