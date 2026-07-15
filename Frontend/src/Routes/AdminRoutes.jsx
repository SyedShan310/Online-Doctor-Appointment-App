import { Routes, Route } from "react-router-dom";
import AdminHome from "../Pages/Admin/AdminHome";
import DoctorProfile from "../Components/Admin/DoctorProfile";
import { AdminNavbar } from "../Components/Admin/AdminNavbar";
import DoctorList from "../Components/Admin/DoctorList";

function UserRoutes() {
  return (
    <>
    <AdminNavbar/>
     <Routes>
      <Route path="/" element={<AdminHome />} />
      <Route path="/doctors/:id" element={<DoctorProfile />}/>
      <Route path="/doctorslist" element={<DoctorList />}/>

    </Routes>
    </>
      );

   
}

export default UserRoutes;
