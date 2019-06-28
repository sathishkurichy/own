import { Injectable } from '@angular/core';
import { Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { RecipeTileOutDto } from '../../model/recipeTileOutDto.model';
import { KeycloakService } from '../keycloak/keycloak.service';
import { Api } from './../../../SharedKernel/core/api/api';
import { ApiResponse } from './../../../SharedKernel/core/api/api-response';
import { Connectivity } from './../../../SharedKernel/services/connectivity/connectivity.service';
import { Allergy } from './../../model/allergy.model';
import { Diet } from './../../model/diet.model';

export interface GetRecipeCommandPayload {
    page: number,
    allergenics?: Array<Allergy>,
    diets?: Array<Diet>,
    orderBy?: string,
    sort?: string,
    maxAge?: number
}

export interface RecipeSearchResponse {
    fromPage: number,
    count: number,
    totalCount: number,
    recipes: Array<RecipeTileOutDto>
}

@Injectable()
export class RecipeQueryService {

    constructor(public connectivity: Connectivity,
        public api: Api,
        private keycloakSrv: KeycloakService) {
        console.warn('RecipeQueryService CONSTRUCTOR');
    }

    private token = () => {
        return this.keycloakSrv.keycloak.token;
    }

    getRecipesSearch(payload: string, page: number) {
        const recipeGet$: Subject<ApiResponse<RecipeSearchResponse>> = new Subject<ApiResponse<RecipeSearchResponse>>();
        if (this.connectivity.isOffline()) {
            recipeGet$.error({
                isError: true,
                reqData: payload,
                respData: 'error offline'
            });
        } else {
            let endpoint: string = '/api/v1/recipes/search' + payload + '&page=' + page;

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.token());


            let options: RequestOptionsArgs = JSON.parse('{ "headers": "" }');
            options.headers = headers;

            this.api.get(endpoint, options).subscribe(
                (res: any) => {
                    let result = JSON.parse(res["_body"]).payload;
                    if (result.count > 0 && result.results) {
                        // var receivedRecipes = result.results.map(recipe => {
                        //     return <RecipeTileOutDto> {
                        //         id: recipe.id,
                        //         name: recipe.name,
                        //         status: recipe.status,
                        //         imageUrl: recipe.imageUrl,
                        //         imageUrlMobile: recipe.imageUrlMobile,
                        //         favorite: recipe.favorite,
                        //         score: recipe.score,
                        //         ageRangeId: recipe.ageRangeId,
                        //         ageRangeMin: recipe.ageRangeMin,
                        //         ageRangeMax: recipe.ageRangeMax,
                        //         preparationTime: recipe.preparationTime,
                        //         bakingTime: recipe.bakingTime,
                        //         isBeabaRecipe: recipe.IsBeabaRecipe
                        //     }
                        // });
                        recipeGet$.next({
                            isError: false,
                            reqData: {},
                            respData: {
                                fromPage: page,
                                totalCount: result.totalCount,
                                count: result.count,
                                recipes: result.results
                            }
                        });
                    } else {
                        recipeGet$.next({
                            isError: false,
                            reqData: {},
                            respData: {
                                fromPage: page,
                                totalCount: result.totalCount,
                                count: 0,
                                recipes: []
                            }
                        });
                    }
                }, err => {
                    console.error('getRecipes error', err);
                    recipeGet$.next({
                        isError: true,
                        reqData: {},
                        respData: {
                            fromPage: page,
                            totalCount: 0,
                            count: 0,
                            recipes: []
                        }
                    });
                });
        }
        return recipeGet$.asObservable();
    }

    getRecipes(payload: GetRecipeCommandPayload): Observable<ApiResponse<any>> {
        const recipeGet$: Subject<ApiResponse<any>> = new Subject<ApiResponse<any>>();
        if (this.connectivity.isOffline()) {
            recipeGet$.error({
                isError: true,
                reqData: payload,
                respData: 'error offline'
            });
        }
        else {
            let params: string = "";
            if (payload.allergenics && payload.allergenics.length > 0) {
                params += "&allergenics=";
                let index: number = 0;
                payload.allergenics.forEach((allergy: Allergy) => {
                    index += 1;
                    params += allergy.id;
                    if (index < payload.allergenics.length) {
                        params += ",";
                    }
                });
            }
            if (payload.diets && payload.diets.length > 0) {
                params += "&diets=";
                let index: number = 0;
                payload.diets.forEach((diet: Diet) => {
                    index += 1;
                    params += diet.id;
                    if (index < payload.diets.length) {
                        params += ",";
                    }
                });
            }
            if (payload.sort) {
                params += "&sort=" + payload.sort;
            }
            if (payload.orderBy) {
                params += "&orderBy=" + payload.orderBy;
            }

            let endpoint: string = '/api/v1/recipes/search?page=' + payload.page + params;

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.token());

            let options: RequestOptionsArgs = JSON.parse('{ "headers": "" }');
            options.headers = headers;

            this.api.get(endpoint, options).subscribe(
                (res: any) => {
                    let result = JSON.parse(res["_body"]).payload;
                    if (result.count > 0 && result.results) {
                        var receivedRecipes = result.results.map(recipe => {
                            return <RecipeTileOutDto>{
                                id: recipe.id,
                                name: recipe.name,
                                status: recipe.status,
                                imageUrl: recipe.imageUrl,
                                score: recipe.score,
                                ageRangeId: recipe.ageRangeId,
                                ageRangeMin: recipe.ageRangeMin,
                                ageRangeMax: recipe.ageRangeMax,
                                preparationTime: recipe.preparationTime,
                                bakingTime: recipe.bakingTime,
                                isBeabaRecipe: recipe.IsBeabaRecipe,
                                isNewRecipe: recipe.isNewRecipe,
                                favorite: recipe.favorite,
                                imageUrlMobile: recipe.imageUrlMobile
                            }
                        });
                        recipeGet$.next({
                            isError: false,
                            reqData: {},
                            respData: {
                                fromPage: payload.page,
                                count: result.count,
                                recipes: receivedRecipes
                            }
                        });
                    }
                    else {
                        recipeGet$.next({
                            isError: false,
                            reqData: {},
                            respData: {
                                fromPage: payload.page,
                                count: 0,
                                recipes: []
                            }
                        });
                    }
                },
                err => {
                    console.error('getRecipes error', err);
                    recipeGet$.error({
                        isError: true,
                        reqData: {},
                        respData: 'error can\'t get recipes'
                    });
                });
        }
        return recipeGet$.asObservable();
    }
}