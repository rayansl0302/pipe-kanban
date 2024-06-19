import { ChecklistItem } from "./checklist.model";
import { Comentarios } from "./comentarios.model";

export interface Card{
    id: string;
    autor:string;
    atribuido:string;
    titulo: string;
    descricao:string;
    checklist: ChecklistItem[];
    dataCriacao:Date;
    status:string;
    imgUrl:string;
    comentarios:Comentarios[];
    quadroId: string;

}