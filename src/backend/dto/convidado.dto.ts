import { Convidado } from '../interfaces/convidado.interface';

export type CreateConvidadoDTO = Pick<Convidado, 'nome' | 'email' | 'telefone'> & {
    status?: boolean
}
export type UpdateConvidadoDTO = Partial<Pick<Convidado, 'nome' | 'email' | 'telefone' | 'status'>>