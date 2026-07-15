import React, { useEffect, useState } from "react";
import { Calendar, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight, Info, Loader2, DollarSign } from "lucide-react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [latestAppointments, setLatestAppointments] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [selectedRefund, setSelectedRefund] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      let newErrors = {};

      try {
        const doctorsResponse = await axiosInstance.get("/doctor/total-doctors");
        setDoctorsCount(doctorsResponse.data.totalNoOfDoctors || 0);
      } catch (err) {
        newErrors.doctors = "Failed to fetch doctors count.";
        console.error("Doctors fetch error:", err);
        toast.error("Error loading doctors count");
      }

      try {
        const appointmentsResponse = await axiosInstance.get("/admin/TotalEarnings");
        setAppointmentsCount(appointmentsResponse.data.totalEarnings || 0);
      } catch (err) {
        newErrors.appointments = "Failed to fetch total earnings.";
        console.error("Appointments fetch error:", err);
        toast.error("Error loading appointments count");
      }

      try {
        const patientsResponse = await axiosInstance.get("/user/total-patients");
        setPatientsCount(patientsResponse.data.totalNoOfPatients || 0);
      } catch (err) {
        newErrors.patients = "Failed to fetch patients count.";
        console.error("Patients fetch error:", err);
        toast.error("Error loading patients count");
      }

      try {
        const appointmentsResponse = await axiosInstance.get("/admin/GetLatestAppointments");
        setLatestAppointments(appointmentsResponse.data || []);
      } catch (err) {
        newErrors.appointmentsList = "Failed to fetch latest appointments.";
        console.error("Appointments fetch error:", err);
        toast.error("Error loading latest appointments");
      }

      try {
        const refundRequestsResponse = await axiosInstance.get(`/refund/all-refund-requests?page=${page}&limit=${limit}`);
        setRefundRequests(refundRequestsResponse.data.refundRequests || []);
        setTotalPages(Math.ceil(refundRequestsResponse.data.total / limit));
      } catch (err) {
        newErrors.refundRequests = "Failed to fetch refund requests.";
        console.error("Refund requests fetch error:", err);
        toast.error("Error loading refund requests");
      }

      setErrors(newErrors);
      setLoading(false);
    };

    fetchDashboardData();
  }, [page, limit]);

  const handleRefundAction = async (requestId, action) => {
    if (window.confirm(`Are you sure you want to ${action} this refund request?`)) {
      try {
        const response = await axiosInstance.put(`/refund/ApproveRefund/${requestId}/${action}`);
        toast.success(response.data.message || `Refund request ${action}d successfully`);
        setRefundRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: action === "approve" ? "Approved" : "Rejected" } : req
          )
        );
      } catch (err) {
        toast.error(err.response?.data?.message || `Failed to ${action} refund request`);
        console.error(`Error ${action}ing refund request:`, err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const openRefundDetails = (refund) => {
    setSelectedRefund(refund);
  };

  const closeRefundDetails = () => {
    setSelectedRefund(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg border-t-4 border-teal-500 min-h-screen">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 text-center sm:text-left tracking-tight">
        Admin Dashboard
      </h2>

      {loading ? (
        <div className="flex justify-center items-center text-gray-600 text-lg">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-md flex items-center gap-4 transform hover:scale-105 transition-all duration-300">
              <Users className="w-10 h-10 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Total Doctors</p>
                {errors.doctors ? (
                  <p className="text-xs text-red-100">Error</p>
                ) : (
                  <p className="text-2xl font-bold">{doctorsCount}</p>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-md flex items-center gap-4 transform hover:scale-105 transition-all duration-300">
              <DollarSign className="w-10 h-10 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Total Earnings</p>
                {errors.appointments ? (
                  <p className="text-xs text-red-100">Error</p>
                ) : (
                  <p className="text-2xl font-bold">${appointmentsCount}</p>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-md flex items-center gap-4 transform hover:scale-105 transition-all duration-300">
              <Users className="w-10 h-10 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Total Patients</p>
                {errors.patients ? (
                  <p className="text-xs text-red-100">Error</p>
                ) : (
                  <p className="text-2xl font-bold">{patientsCount}</p>
                )}
              </div>
            </div>
          </div>

          {/* Latest Appointments */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-5">Latest Appointments</h3>
            {errors.appointmentsList ? (
              <p className="text-red-500 text-center text-lg">{errors.appointmentsList}</p>
            ) : latestAppointments.length === 0 ? (
              <p className="text-gray-500 text-center text-lg">No recent appointments found.</p>
            ) : (
              <div className="overflow-x-auto w-full shadow-lg rounded-xl">
                <table className="w-full bg-white rounded-xl">
                  <thead>
                    <tr className="bg-teal-600 text-white text-sm">
                      <th className="py-4 px-4 text-left font-semibold">Patient</th>
                      <th className="py-4 px-4 text-left font-semibold hidden sm:table-cell">Doctor</th>
                      <th className="py-4 px-4 text-left font-semibold hidden md:table-cell">Date</th>
                      <th className="py-4 px-4 text-left font-semibold">Time</th>
                      <th className="py-4 px-4 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestAppointments.map((appt, index) => (
                      <tr
                        key={appt.id}
                        className={`border-b hover:bg-teal-50 transition-colors duration-300 text-sm ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="py-4 px-4 text-gray-700 truncate max-w-[120px]">{appt.patient}</td>
                        <td className="py-4 px-4 text-gray-700 hidden sm:table-cell truncate max-w-[120px]">{appt.doctor}</td>
                        <td className="py-4 px-4 text-gray-700 hidden md:table-cell">{appt.date}</td>
                        <td className="py-4 px-4 text-gray-700">{appt.time}</td>
                        <td className="py-4 px-4 text-gray-700">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              appt.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : appt.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : appt.status === "Cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Refund Requests */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-5">Refund Requests</h3>
            {errors.refundRequests ? (
              <p className="text-red-500 text-center text-lg">{errors.refundRequests}</p>
            ) : refundRequests.length === 0 ? (
              <p className="text-gray-500 text-center text-lg">No refund requests found.</p>
            ) : (
              <>
                <div className="overflow-x-auto w-full shadow-lg rounded-xl">
                  <table className="w-full bg-white rounded-xl">
                    <thead>
                      <tr className="bg-teal-600 text-white text-sm">
                        <th className="py-4 px-4 text-left font-semibold">Patient</th>
                        <th className="py-4 px-4 text-left font-semibold">Status</th>
                        <th className="py-4 px-4 text-left font-semibold">Actions</th>
                        <th className="py-4 px-4 text-left font-semibold">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refundRequests.map((req, index) => (
                        <tr
                          key={req.id}
                          className={`border-b hover:bg-teal-50 transition-colors duration-300 text-sm ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="py-4 px-4 text-gray-700 truncate max-w-[120px]">{req.patient}</td>
                          <td className="py-4 px-4 text-gray-700">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                req.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : req.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {req.status === "Pending" ? (
                              <div className="flex flex-col gap-3">
                                <button
                                  onClick={() => handleRefundAction(req.id, "approve")}
                                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-105 text-sm transition-all duration-300"
                                >
                                  <CheckCircle className="w-5 h-5" /> Approve
                                </button>
                                <button
                                  onClick={() => handleRefundAction(req.id, "reject")}
                                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:scale-105 text-sm transition-all duration-300"
                                >
                                  <XCircle className="w-5 h-5" /> Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">No actions</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            <button
                              onClick={() => openRefundDetails(req)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 text-sm transition-all duration-300"
                            >
                              <Info className="w-5 h-5" /> Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="flex flex-col items-center mt-6 gap-4">
                    <div className="flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-teal-700 hover:scale-105 text-sm transition-all duration-300"
                      >
                        <ChevronLeft className="w-5 h-5" /> Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-teal-700 hover:scale-105 text-sm transition-all duration-300"
                      >
                        Next <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      Page {page} of {totalPages}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Refund Details Modal */}
          {selectedRefund && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-500">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 transform transition-all duration-500 animate-scale-in">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Refund Request Details</h3>
                <div className="space-y-4 text-base text-gray-700">
                  <p><span className="font-semibold">Patient:</span> {selectedRefund.patient}</p>
                  <p><span className="font-semibold">Doctor:</span> {selectedRefund.doctor}</p>
                  <p><span className="font-semibold">Date:</span> {selectedRefund.appointmentDate}</p>
                  <p><span className="font-semibold">Time:</span> {selectedRefund.appointmentTime}</p>
                  <p><span className="font-semibold">Amount:</span> ${selectedRefund.amount}</p>
                  <p><span className="font-semibold">Reason:</span> {selectedRefund.reason}</p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        selectedRefund.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedRefund.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedRefund.status}
                    </span>
                  </p>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={closeRefundDetails}
                    className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:scale-105 text-sm transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};