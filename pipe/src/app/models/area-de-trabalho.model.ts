import { Card } from "./card.model";
import { Quadro } from "./quadro.model";

export interface AreaDeTrabalho{
    quadros:Quadro;
    cards:Card;
}