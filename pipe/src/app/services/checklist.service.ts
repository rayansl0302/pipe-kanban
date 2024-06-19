import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChecklistItem } from '../models/checklist.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private checklistItems: ChecklistItem[] = [];
  private checklistSubject = new BehaviorSubject<ChecklistItem[]>([]);

  constructor() { }

  getChecklist() {
    return this.checklistSubject.asObservable();
  }

  adicionarItem(item: ChecklistItem) {
    this.checklistItems.push(item);
    this.checklistSubject.next(this.checklistItems);
  }

  removerItem(id: string) {
    this.checklistItems = this.checklistItems.filter(item => item.id !== id);
    this.checklistSubject.next(this.checklistItems);
  }
}
