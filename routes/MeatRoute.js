import express from "express";
import { deleteMeat, getMeatById, getMeats, saveMeat, updateMeat } from "../controllers/MeatController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router()

router.get('/meats', verifyUser, getMeats)
router.get('/meats/:id', verifyUser, getMeatById)
router.post('/meats', verifyUser, saveMeat)
router.patch('/meats/:id', verifyUser, updateMeat)
router.delete('/meats/:id', verifyUser, deleteMeat)

export default router