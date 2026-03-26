import { Router } from "express";
import { createConvidado, updateConvidado, deleteConvidado, getConvidados, getConvidadosById } from "../controller/convidadoController";

const router = Router()

router.get('/', getConvidados)
router.get('/:id', getConvidadosById)
router.post('/', createConvidado)
router.put('/:id', updateConvidado)
router.delete('/:id', deleteConvidado)

export default router;