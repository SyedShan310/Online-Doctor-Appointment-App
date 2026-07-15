import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/admin/GetAllAppointments");
        setAppointments(response.data || []);
      } catch (err) {
        setError("Failed to fetch appointments.");
        console.error("Appointments fetch error:", err);
        toast.error("Error loading appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await axiosInstance.delete(`/dashboard/appointments/${appointmentId}`);
        setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
        toast.success("Appointment deleted successfully");
      } catch (err) {
        console.error("Error deleting appointment:", err);
        toast.error(err.response?.data?.message || "Failed to delete appointment");
      }
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-white rounded-xl shadow-md border-t-4 border-teal-500">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-6">Appointments</h2>

      {loading ? (
        <p className="text-gray-700 text-center text-xs sm:text-sm lg:text-base">Loading appointments...</p>
      ) : error ? (
        <p className="text-red-500 text-center text-xs sm:text-sm lg:text-base">{error}</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600 text-center text-xs sm:text-sm lg:text-base">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-[#007e85] text-white text-[10px] xs:text-xs sm:text-sm lg:text-base">
                <th className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-left font-medium">Patient</th>
                <th className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-left font-medium">Doctor</th>
                <th className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-left font-medium">Date</th>
                <th className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-left font-medium">Time</th>
                <th className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-left font-medium">Status</th>
                <th className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b hover:bg-teal-50 text-[10px] xs:text-xs sm:text-sm lg:text-md">
                  <td className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-gray-700 truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[150px]">{appointment.patient}</td>
                  <td className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-gray-700 truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[150px]">{appointment.doctor}</td>
                  <td className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-gray-700">{appointment.date}</td>
                  <td className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-gray-700">{appointment.time}</td>
                  <td className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6">
                    <span
                      className={`px-1 xs:px-2 sm:px-3 lg:px-4 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs sm:text-sm lg:text-[13px] font-medium ${
                        appointment.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-1 xs:py-2 sm:py-3 lg:py-4 px-1 xs:px-2 sm:px-4 lg:px-6 text-gray-700">
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="text-red-600 hover:text-red-800 text-[10px] xs:text-xs sm:text-sm lg:text-base"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;