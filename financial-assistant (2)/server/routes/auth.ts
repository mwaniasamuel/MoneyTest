import express from "express"
import { register, login, getCurrentUser } from "../controllers/authController"
import { authenticateUser } from "../middleware/auth"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/me", authenticateUser, getCurrentUser)

export default router

