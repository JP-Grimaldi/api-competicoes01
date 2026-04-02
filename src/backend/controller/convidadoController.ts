import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { db } from '../config/db';
import { CreateConvidadoDTO, UpdateConvidadoDTO } from '../dto/convidado.dto';
import { Convidado } from '../interfaces/convidado.interface';

export async function getConvidados(req: Request, res: Response) {
  try {
    const [results] = await db.query<(Convidado & RowDataPacket)[]>('SELECT * FROM convidado ORDER BY id ASC');
    return res.status(200).json(results);
  } catch (err) {
    console.error('Erro no banco:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function getConvidadosById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const [results] = await db.query<(Convidado & RowDataPacket)[]>('SELECT * FROM convidado WHERE id = ?', [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Convidado não encontrado' });
    }

    return res.status(200).json(results[0]);
  } catch (err) {
    console.error('Erro no banco:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function createConvidado(req: Request, res: Response) {
    try {
        const body: CreateConvidadoDTO = req.body;
        const { nome, email, telefone } = body;

        if (!nome || !email || !telefone) {
            return res.status(400).json({ message: 'Nome, e-mail e telefone são obrigatórios' });
        }

        const [emailExistente] = await db.query<RowDataPacket[]>(
            'SELECT id FROM convidado WHERE email = ?',
            [email]
        );

        if (emailExistente.length > 0) {
            return res.status(409).json({ message: 'Esse e-mail já está cadastrado' });
        }

        const [telefoneExistente] = await db.query<RowDataPacket[]>(
            'SELECT id FROM convidado WHERE telefone = ?',
            [telefone]
        );

        if (telefoneExistente.length > 0) {
            return res.status(409).json({ message: 'Esse telefone já está cadastrado' });
        }

        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO convidado (nome, email, telefone) VALUES (?, ?, ?)',
            [nome, email, telefone]
        );

        return res.status(201).json({
            message: 'Adicionado com sucesso',
            id: result.insertId
        });
    } catch (err) {
        console.error("Erro no banco:", err);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
}

export async function updateConvidado(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const body: UpdateConvidadoDTO = req.body;
    const nome = body.nome?.trim();
    const email = body.email?.trim();
    const telefone = body.telefone?.trim();

    const [convidadoExistente] = await db.query<(Convidado & RowDataPacket)[]>('SELECT * FROM convidado WHERE id = ?', [id]);
    if (convidadoExistente.length === 0) {
      return res.status(404).json({ message: 'Convidado não encontrado' });
    }

    if (email) {
      const [emailExistente] = await db.query<RowDataPacket[]>('SELECT id FROM convidado WHERE email = ? AND id <> ?', [email, id]);
      if (emailExistente.length > 0) {
        return res.status(409).json({ message: 'Esse e-mail já está cadastrado' });
      }
    }

    if (telefone) {
      const [telefoneExistente] = await db.query<RowDataPacket[]>('SELECT id FROM convidado WHERE telefone = ? AND id <> ?', [telefone, id]);
      if (telefoneExistente.length > 0) {
        return res.status(409).json({ message: 'Esse telefone já está cadastrado' });
      }
    }

    const atual = convidadoExistente[0];
    await db.query<ResultSetHeader>(
      'UPDATE convidado SET nome = ?, email = ?, telefone = ? WHERE id = ?',
      [nome || atual.nome, email || atual.email, telefone || atual.telefone, id]
    );

    return res.status(200).json({ message: 'Convidado atualizado' });
  } catch (err) {
    console.error('Erro no banco:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function deleteConvidado(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const [result] = await db.query<ResultSetHeader>('DELETE FROM convidado WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Convidado não encontrado' });
    }

    return res.status(200).json({ message: 'Convidado removido' });
  } catch (err) {
    console.error('Erro no banco:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
