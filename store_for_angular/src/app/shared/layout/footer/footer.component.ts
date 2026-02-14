import {Component, Input} from '@angular/core';
import {trackById} from "../../utils/track-by";
import {MapType} from "../../../../types/category/mapType.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent  {
  protected readonly trackById = trackById;
  @Input() categories!: MapType[];

}
