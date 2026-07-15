import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const RefundRequestForm = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  console.log(appointmentId)
  const [appointment, setAppointment] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const user = JSON.parse(localStorage.getItem("User") || "{}");
    const patientId = user?.id;

    if (!token || !patientId) {
      setError("Please log in to submit a refund request.");
      setLoading(false);
      toast.error("Please log in to submit a refund request", { id: "login-error" });
      navigate("/login");
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchAppointment = async () => {
      try {
        const response = await axiosInstance.get(`/user/appointment/${appointmentId}`);
        console.log(response)
        setAppointment(response.data.appointment);
      } catch (err) {
        setError("Failed to fetch appointment details. Please try again.");
        toast.error(err.response?.data?.message || "Error loading appointment", {
          id: "fetch-error",
        });
        console.error("Fetch appointment error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for the refund", { id: "reason-error" });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("Token");
      const response = await axiosInstance.post(
        "/refund/request",
        {
          appointmentId,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Refund request submitted successfully");
      setTimeout(() => navigate("/booked-appointments"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit refund request", {
        id: "submit-error",
      });
      console.error("Submit refund request error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-teal-500 animate-spin" />
          <p className="mt-4 text-lg text-gray-700 font-medium">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-red-500 font-medium bg-white p-6 rounded-lg shadow-md border border-red-200">
          {error || "Appointment not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border-t-4 border-teal-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-800 mb-6 text-center">
          Refund Request Form
        </h2>
        <div className="mb-6 space-y-4">
          <p className="text-gray-700">
            <span className="font-semibold">Doctor:</span> {appointment.doctorName}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Specialty:</span> {appointment.specialty || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Date & Time:</span>{" "}
            {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            {appointment.time}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Fees Paid:</span> ${appointment.fees || "N/A"}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="reason" className="block text-gray-700 font-semibold mb-2">
              Reason for Refund
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              rows="5"
              placeholder="Please explain why you are requesting a refund..."
              required
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full sm:w-auto px-6 py-3 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-all duration-300 shadow-md hover:shadow-lg ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Submit Refund Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundRequestForm;