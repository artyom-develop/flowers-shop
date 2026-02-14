import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  @Input() count: number = 1;
  @Output() onCountChange:EventEmitter<number> = new EventEmitter<number>();
  constructor() { }


  countChange() {
    this.onCountChange.emit(this.count);
  }

  incrementCount() {
    this.count++;
    this.countChange();
  }

  decrementCount() {
    if(this.count  > 1){
      this.count--;
      this.countChange();
    }

  }


}
