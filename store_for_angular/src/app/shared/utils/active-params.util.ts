import {ActiveParamsType} from "../../../types/product/active-params.type";
import {Params} from "@angular/router";

export class ActiveParamsUtil{

  static processParams(params:Params){
      const activateParams: ActiveParamsType = {
        types: []
      };

      if (params.hasOwnProperty("types")) {
        activateParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];
      }

      if (params.hasOwnProperty("heightTo")) {
        activateParams.heightTo = params['heightTo'];
      }

      if (params.hasOwnProperty("heightFrom")) {
        activateParams.heightFrom = params['heightFrom'];
      }

      if (params.hasOwnProperty("diameterTo")) {
        activateParams.diameterTo = params['diameterTo'];
      }


      if (params.hasOwnProperty("diameterFrom")) {
        activateParams.diameterFrom = params['diameterFrom'];
      }


      if (params.hasOwnProperty("page")) {
        activateParams.page = +params['page'];
      }


      if (params.hasOwnProperty("sort")) {
        activateParams.sort = params['sort'];
      }


      return activateParams;
  }
}
