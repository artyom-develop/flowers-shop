// Универсальные trackBy-функции для *ngFor

// trackBy по id
export function trackById<T extends { id: any }>(index: number | string, item: T): any {
  return item.id;
}

// trackBy по индексу
export function trackByIndex(index: number, item: any): number {
  return index;
}


