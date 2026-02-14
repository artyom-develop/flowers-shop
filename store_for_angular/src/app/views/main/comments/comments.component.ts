import {Component} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {trackById} from "../../../shared/utils/track-by";

@Component({
  selector: 'section-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent  {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 26,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
  };





  protected readonly trackById = trackById;
}
