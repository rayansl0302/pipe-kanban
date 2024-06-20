import { Card } from "./card.model";
import { Quadro } from "./quadro.model";

export interface AreaDeTrabalho {
    id: string;
    titulo: string;
    descricao: string;
    quadros: Quadro[];
    accessLevel?: string;
  }
  