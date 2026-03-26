import { Request, Response } from "express";
import { db } from '../config/knex';
import { CreateConvidadoDTO, UpdateConvidadoDTO } from '../dto/convidado.dto';
import { Convidado } from '../interfaces/convidado.interface';

export async function getConvidados(req:Request, res:Response) {
    //try catch
    const data = await db<Convidado>("convidado").select("*");
    return res.status(200).json({data})
}

export async function createConvidado(req:Request, res:Response) {
    const body:CreateConvidadoDTO = req.body;
    await db<Convidado>("convidado").insert(body)
    if ("convidado.email" != null){
        return res.status(409).json({error: 'Não pode cadastrar dois convidados com o mesmo e-mail'})
    } 
    return res.status(201).json({ message: "Adicionado com sucesso" });
}

export async function updateConvidado(req:Request, res:Response) {
    const id = +req.params.id
    const body:UpdateConvidadoDTO = req.body;
    const convidado = await db<Convidado>('convidado').where({id}).first()
    await db<Convidado>('convidado').where({id}).update(body)
    return res.status(200).json({message: 'Convidado alterado com sucesso'})
}

export async function deleteConvidado(req:Request, res:Response) {
    const id = +req.params.id
    const convidado = await db<Convidado>('convidado').where({id}).del()
    return res.status(200).json({message: 'Convidado deletado com sucesso', convidado})
}