import {Injectable} from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) {
  }

  public showToast(status: 'error' | 'success' | 'info' | 'warn', summary: string, detail: string, life?: number) {
    this.messageService.add({severity: status, summary: summary, detail: detail, life: life ? life : 2000});
  }
}
