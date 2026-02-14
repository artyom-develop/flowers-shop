import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DefaultResponseType} from "../../../types/common/DefaultResponse.type";
import {FavoriteType} from "../../../types/personal/favorite/favorite.type";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http:HttpClient) { }

  getFavorite(): Observable<DefaultResponseType | FavoriteType[]> {
    return this.http.get<DefaultResponseType | FavoriteType[]>(environment.api + `/favorites`);
  }


  addFavorite(productId:string): Observable<DefaultResponseType | FavoriteType> {
    return this.http.post<DefaultResponseType | FavoriteType>(environment.api + `/favorites`, {productId});
  }

  deleteFavorite(productId:string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType >(environment.api + `/favorites`, {body: {productId}});
  }
}
