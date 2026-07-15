import React, { useEffect, useState } from "react";
import { Trash2, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";

const DoctorList = () => {
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const approvedResponse = await axiosInstance.get("doctor/get-approved-doctors");
        setApprovedDoctors(approvedResponse.data || []);

        const requestsResponse = await axiosInstance.get("/doctor/get-requested-doctors");
        setDoctorRequests(requestsResponse.data || []);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemoveDoctor = async (doctorId) => {
    if (window.confirm("Are you sure you want to remove this doctor?")) {
      try {
        await axiosInstance.delete(`/doctor/delete-doctor/${doctorId}`);
        setApprovedDoctors(approvedDoctors.filter((doctor) => doctor._id !== doctorId));
        toast.success("Doctor removed successfully");
      } catch (err) {
        toast.error("Failed to remove doctor");
        console.error("Remove error:", err);
      }
    }
  };

  const handleApproveDoctor = async (requestId) => {
    if (window.confirm("Are you sure you want to approve this doctor?")) {
      try {
        const response = await axiosInstance.put(`/doctor/approve-doctor/${requestId}`);
        const approvedDoctor = response.data.doctor;
        setDoctorRequests(doctorRequests.filter((req) => req._id !== requestId));
        setApprovedDoctors([...approvedDoctors, approvedDoctor]);
        toast.success("Doctor approved successfully");
      } catch (err) {
        toast.error("Failed to approve doctor");
        console.error("Approve error:", err);
      }
    }
  };

  const handleRemoveRequest = async (requestId) => {
    if (window.confirm("Are you sure you want to remove this doctor application?")) {
      try {
        await axiosInstance.delete(`/doctor/delete-doctor/${requestId}`); // Adjust endpoint as needed
        setDoctorRequests(doctorRequests.filter((req) => req._id !== requestId));
        toast.success("Doctor application removed successfully");
      } catch (err) {
        toast.error("Failed to remove doctor application");
        console.error("Remove request error:", err);
      }
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md border-t-4 border-teal-500 min-h-screen">
      <h W2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 font-semibold mb-4 sm:mb-6">
        Doctor Management
      </h>

      {loading ? (
        <p className="text-gray-700 text-center text-sm sm:text-base">Loading data...</p>
      ) : error ? (
        <p className="text-red-500 text-center text-sm sm:text-base">{error}</p>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Approved Doctors Section */}
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Approved Doctors ({approvedDoctors.length})
            </h3>
            {approvedDoctors.length === 0 ? (
              <p className="text-gray-600 text-center text-sm sm:text-base">No approved doctors found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
                  <thead>
                    <tr className="bg-teal-500 text-white hidden sm:table-row">
                      <th className="p-2 sm:p-3 text-left font-semibold">Image</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Name</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Specialty</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Email</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Experience</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedDoctors.map((doctor, index) => (
                      <tr
                        key={doctor._id}
                        className={`border-b flex flex-col sm:table-row ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}
                      >
                        <td className="p-2 sm:p-3 flex items-center sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Image:</span>
                          <img
                            src={doctor.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={doctor.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-teal-500"
                          />
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Name:</span>
                          {doctor.name}
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Specialty:</span>
                          {doctor.specialty || "Not specified"}
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Email:</span>
                          {doctor.email || "N/A"}
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Experience:</span>
                          {doctor.experience || "Not specified"}
                        </td>
                        <td className="p-2 sm:p-3 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Actions:</span>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleRemoveDoctor(doctor._id)}
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                            <Link
                              to={`/doctors/${doctor._id}`}
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-[#007e85] text-white rounded-md hover:bg-teal-600 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              Details
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Doctor Requests Section */}
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              Doctor Applications ({doctorRequests.length})
            </h3>
            {doctorRequests.length === 0 ? (
              <p className="text-gray-600 text-center text-sm sm:text-base">No pending doctor applications.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
                  <thead>
                    <tr className="bg-yellow-500 text-white hidden sm:table-row">
                      <th className="p-2 sm:p-3 text-left font-semibold">Image</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Name</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Specialty</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Email</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Experience</th>
                      <th className="p-2 sm:p-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorRequests.map((request, index) => (
                      <tr
                        key={request._id}
                        className={`border-b flex flex-col sm:table-row ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}
                      >
                        <td className="p-2 sm:p-3 flex items-center sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Image:</span>
                          <img
                            src={request.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={request.name}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-yellow-500"
                          />
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Name:</span>
                          {request.name}
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Specialty:</span>
                          {request.specialty || "Not specified"}
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Email:</span>
                          {request.email || "N/A"}
                        </td>
                        <td className="p-2 sm:p-3 text-gray-700 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Experience:</span>
                          {request.experience || "Not specified"}
                        </td>
                        <td className="p-2 sm:p-3 flex sm:table-cell">
                          <span className="sm:hidden font-semibold mr-2">Actions:</span>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleApproveDoctor(request._id)}
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRemoveRequest(request._id)}
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                            <Link
                              to={`/doctors/${request._id}`}
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-[#007e85] text-white rounded-md hover:bg-teal-600 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              Details
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;