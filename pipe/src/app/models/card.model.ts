import { Comentarios } from "./comentarios.model";

export interface Card{
    id: string;
    autor:string;
    atribuido:string;
    titulo: string;
    descricao:string;
    checklist:string;
    dataCriacao:Date;
    imgUrl:string;
    comentarios:Comentarios;
}