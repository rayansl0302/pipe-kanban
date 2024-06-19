import { Card } from './card.model';

export interface Quadro {
  id: string;
  titulo: string;
  descricao: string;
  card: Card[];
  cardId: string;
}
