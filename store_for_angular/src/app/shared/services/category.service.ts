import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {CategoryType} from "../../../types/category/category.type";
import {environment} from "../../../environments/environment";
import {TypeOfCategory} from "../../../types/category/types.type";
import {MapType} from "../../../types/category/mapType.type";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + '/categories');
  }

  getTypesOfCategories(): Observable<MapType[]> {
    return this.http.get<TypeOfCategory[]>(environment.api + '/types')
      .pipe(
        map((types: TypeOfCategory[]) => {
          const array: MapType[] = [];
          types.forEach((type: TypeOfCategory) => {
            const foundCategory = array.find(item => item.id === type.category.id);
            if (foundCategory) {
              foundCategory.types.push({
                id: type.id,
                name: type.name,
                url: type.url
              });
            } else {
              array.push({
                id: type.category.id,
                name: type.category.name,
                url: type.category.url,
                types: [{id: type.id, name: type.name, url: type.url}]
              });
            }

          });
          return array;
        })
      );
  }
}
