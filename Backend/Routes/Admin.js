import express from "express"
import { GetAllAppointmetns, GetLatestAppointments, GetTotalEarnings } from "../Controllers/Admin.js";

const router=express.Router();
router.get("/GetLatestAppointments",GetLatestAppointments);
router.get("/GetAllAppointments",GetAllAppointmetns);
router.get("/TotalEarnings",GetTotalEarnings)

export default router;