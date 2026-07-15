import React, { useState, useEffect } from "react";
import { Dashboard } from "../../Components/Admin/Dashboard";
import { Appointments } from "../../Components/Admin/Appoinments";
import AddDoctor from "../../Components/Admin/AddDoctor";
import DoctorList from "../../Components/Admin/DoctorList";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  LayoutDashboard,
  Calendar,
  UserPlus,
  Users,
} from "lucide-react";
import { AdminNavbar } from "../../Components/Admin/AdminNavbar";

// Mock data (replace with API calls later)


// Updated Dashboard Component with Enhanced Responsiveness


// Placeholder Components (unchanged)




// Category icons for the sidebar (unchanged)
const categoryIcons = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Appointments: <Calendar className="w-5 h-5" />,
  "Add Doctor": <UserPlus className="w-5 h-5" />,
  "Doctor List": <Users className="w-5 h-5" />,
};

const AdminPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Dashboard");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  const categories = ["Dashboard", "Appointments", "Add Doctor", "Doctor List"];

  const renderContent = () => {
    switch (selectedCategory) {
      case "Dashboard":
        return <Dashboard />;
      case "Appointments":
        return <Appointments />;
      case "Add Doctor":
        return <AddDoctor />;
      case "Doctor List":
        return <DoctorList />;
      default:
        return <Dashboard />;
    }
  };

  return (
   <>
   <AdminNavbar/>
    <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Heading with Background Image */}
        {/* <div
          data-aos="fade-up"
          className="relative mb-8 sm:mb-12 h-[240px] sm:h-[360px] flex items-center justify-center rounded-xl overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 to-teal-600/50" />
          <div className="relative z-10 text-center px-4 sm:px-6 py-8 sm:py-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold tracking-tight">
              Admin Panel
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 mt-3 sm:mt-4 max-w-2xl">
              Manage your healthcare system with ease and efficiency.
            </p>
          </div>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Categories Sidebar */}
          <div
            data-aos="fade-up"
            className="bg-white p-4 sm:p-6 rounded-xl shadow-md lg:sticky lg:top-16 sm:lg:top-20 h-fit border-t-4 border-teal-500"
          >
            <h2 className="text-xl sm:text-2xl text-gray-900 font-semibold mb-4 sm:mb-6 text-center">
              Categories
            </h2>
            <ul className="space-y-3 sm:space-y-4">
              {categories.map((category) => (
                <li
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer rounded-lg transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-[#007e85] text-white shadow-md"
                      : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                  }`}
                >
                  {categoryIcons[category]}
                  <span className="font-medium text-sm sm:text-base">{category}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div data-aos="fade-up" className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
   </>
  );
};

export default AdminPage;