import { Router } from "express";
import { createConvidado, updateConvidado, deleteConvidado, getConvidados } from "../controller/convidadoController";

const router = Router()

router.get('/', getConvidados)
router.post('/', createConvidado)
router.delete('/:id', deleteConvidado)

export default router;