import { Injectable } from '@angular/core';

import { IngredientOutDto } from '../../SharedKernel/model/ingredientOutDto.model';
import { ListPagination } from '../../SharedKernel/model/listPagination.model';
import { RecipeInDto } from '../../SharedKernel/model/recipeInDto.model';
import { StepType, StepCategory } from '../../SharedKernel/model/recipeStepInDto.model';
import { RecipeTileOutDto } from '../../SharedKernel/model/recipeTileOutDto.model';
import { RecipeReviewOutDto } from '../../SharedKernel/model/review.model';
import { MixingTexture } from '../../SharedKernel/model/texture.model';
import { UnitOutDto } from '../../SharedKernel/model/unitOutDto.model';
import { ApiService } from './../../../services/api.service';
import {forEach} from '@angular/router/src/utils/collection';
import {isNull} from 'util';

export interface GetRecipeCommandPayload {
    page: number,
    orderBy?: string,
    sort?: string,
    salted?: boolean,
    dishTypeId?: number,
    seasons?: number,
    ageRangeId?: number,
    ingredients?: Array<number>,
    filter?: number,
    locale?: string,
}
export interface GetNewRecipeCommandPayload {
    page: number,
    orderBy?: string,
    sort?: string,
    salted?: boolean,
    dishTypeId?: number,
    seasons?: number,
    ageRangeId?: number,
    ingredients?: Array<number>,
    filter?: number,
    locale?: string,
    index?: Array<number>,
}

export interface TranslateRecipePayload {
    name: string,
    cookTip: string,
    recipeTip: string,
    locale: string,
    steps: Array<any>
}

export type RecipeStepOutDto = {
    id: number,
    stepIndex: number,
    stepType: StepType,
    bakingDuration: number,
    bakingLevel: number,
    bakingAutoMix: boolean,
    mixingTexture: MixingTexture,
    freeInstruction: string,
    ingredient: {
        id: number,
        name: string,
        energy: number,
        carbohydrates: number,
        proteins: number,
        lipids: number,
        cooking_index: number,
        mixing_index: number,
        nutritionalTip?: string,
        dietPlans?: Array<any>,
        allergenics?: Array<any>
    },
    ingredientQuantity: number,
    ingredientUnit: string,
    ingredientUnitId: number,
    stepCategory: StepCategory
}

export type RecipeOverviewOutDto = {
    id: number,
    name: string,
    status: number,
    imageUrl: string,
    score: number,
    author: string,
    isParentReferent: boolean,
    isSalted: boolean,
    cookTip: string,
    recipeTip: string,
    dishTypeId: number,
    seasonsId: Array<number>,
    ingredients: Array<IngredientOutDto>,
    steps: Array<RecipeStepOutDto>,
    favorite: boolean,
    ageRangeId: number,
    preparationTime: number,
    bakingTime: number,
    protein: number,
    carbohydrate: number,
    lipid: number,
    energy: number
}

export const defaultRecipeOverviewOutDto: RecipeOverviewOutDto = {
    id: 0,
    name: '',
    status: 0,
    imageUrl: '',
    score: 0,
    author: '',
    isParentReferent: false,
    isSalted: false,
    cookTip: '',
    recipeTip: '',
    dishTypeId: 0,
    seasonsId: [],
    ingredients: [],
    steps: [],
    favorite: false,
    ageRangeId: 0,
    preparationTime: 0,
    bakingTime: 0,
    protein: 0,
    carbohydrate: 0,
    lipid: 0,
    energy: 0
}

export enum TypeOfRecipe {
    "public" = 0,
    "favorite" = 1,
    "personnal" = 3
}

@Injectable()
export class RecipeService {

    token: string = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJaOHdabUtiNlIxSWNUMmV4bENCTS0xeEhmT3lVVFVuYmJrdEMwSVpGSm5rIn0.eyJqdGkiOiI4MjUzYTc1Yy04YTI1LTQ1NmItODE1Mi1mMThkODlkYWZjZGMiLCJleHAiOjE1MTk4OTQxMDAsIm5iZiI6MCwiaWF0IjoxNTE5ODkzODAwLCJpc3MiOiJodHRwczovL2F1dGguYmVhYmEuY29tL2F1dGgvcmVhbG1zL2JlYWJhX2RldiIsImF1ZCI6ImJlYWJhLW1vYmlsZSIsInN1YiI6IjIwMWEzN2EzLWY2YjEtNDY3My05NGZmLWY0YjlkODdjZjc3YyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJlYWJhLW1vYmlsZSIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImVmY2MyZDU5LWNmZDMtNGE4NC05YzZkLWZkZjczZjBkMTcyYSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicGFyZW50IiwiYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiIsInVzZXIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50Iiwidmlldy1wcm9maWxlIl19fSwibmFtZSI6IldpdGVraW9UZXN0IFdpdGVraW9UZXN0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoid2l0ZWtpb3Rlc3QiLCJnaXZlbl9uYW1lIjoiV2l0ZWtpb1Rlc3QiLCJmYW1pbHlfbmFtZSI6IldpdGVraW9UZXN0IiwiZW1haWwiOiJqYmVuZXRodWlsaWVyZUB3aXRla2lvLmNvbSJ9.S6LCeHppzp4eJX57I8nshgcvQ3eH4urr0eTNKGnzEiso-v6JQ26ucd9Ftc8odE_nDr3l9d8sRmBi0wWfoueXiKGM24aQH4AlTKM2prXDU-Kw6-8ii8Tf8IGk6bi_IT3748ZWjYVsp5cPVynZUUlvqAy4MZX328UuOjVroeUWrSMwUvz7IeXv8c3TruB5f6j0R92HnfgS9hotFNDqboaUjWIK7SWPBTg5GN0xtRmckipEW58xSolbpMbM2Q1BbVhVGpHg4x27XM0HZRmpRwGQW3_AdcuTyEUS2TlR88WEiemwW4UqoqTv_4xxyLn0GQraibJMwd_R5hukPU140m4AXg";

    newRecipesIndexs: Array<number> = [];
    newRecipesPageSize: number = 15;



    constructor(private api: ApiService) { }

    getRecipe(payload: GetRecipeCommandPayload): Promise<ListPagination<RecipeTileOutDto>> {
        // TODO FORMAT PARAMS HERE
        return new Promise((resolve, reject) => {
            let params = '?page=' + payload.page + '&filter=' + payload.filter || 0;

            if (payload.sort && payload.sort != "pertinence") params += "&orderBy=" + payload.sort + "&sort=ASC";
            else if (payload.sort && payload.sort == "inFavorites") params += "&orderBy=" + "inFavorites" + "&sort=DESC";
            else params += "&orderBy=" + "pertinence" + "&sort=DESC";
            if (payload.locale) params += "&locale=" + payload.locale;
            this.api.get('/api/v1/recipes/search' + params).subscribe(
                (res: any) => {
                    resolve(res.payload);
                },
                (err) => {
                    console.error('getRecipe error', err);
                    reject({
                        isError: true,
                        reqData: {},
                        respData: 'error can\'t get recipes'
                    });
                });
        });
    }

    unpublishRecipe(recipeId: number) {
        return new Promise((resolve, reject) => {
            this.api.delete('/api/v1/recipes/' + recipeId + '/unpublish').toPromise()
            .then((res) => {
                let result: any = res;
                if (result.success) {
                    resolve(result.payload.results)
                }
                else {
                    reject(false);
                }
            })
            .catch((err) => {
                console.error('ERR', err);
                reject(err);
            });
        });
    }

    getUnitAll(locale?: string): Promise<UnitOutDto[]> {

        return new Promise((resolve, reject) => {
          let params = (isNull(locale)) ?"?locale=" + locale: '';

          this.api.get('/api/v1/units/all' + params).subscribe((res: any) => {
                resolve(res.payload.results);
            },
                err => {
                    console.error('getUnitAll error', err);
                    reject(err);
                });
        })
    }

    searchRecipe(payload: GetRecipeCommandPayload): Promise<ListPagination<RecipeTileOutDto>> {
        return new Promise((resolve, reject) => {
            this.api.get('/api/v1/recipes' + this.mapToSearchParams(payload)).subscribe(
                (resFav: any) => {
                    if(payload.page == 1){
                        this.newRecipesIndexs = [];
                        this.api.get('/api/v1/recipes' + this.mapToSearchParamsNew(payload)).subscribe(
                            (resNumberNew: any) => {
                                var resNumberNew = resNumberNew.payload;
// console.log("resNumberNew",resNumberNew);
                                for (let i = 0; i < resNumberNew.totalCount; i++) {
                                    this.newRecipesIndexs.push(i);
                                }
                                // console.log("index this.newRecipesIndexs", this.newRecipesIndexs);
                                let m = this.newRecipesIndexs.length, t, i;
                                // While there remain elements to shuffle
                                while (m) {
                                    // Pick a remaining element…
                                    i = Math.floor(Math.random() * m--);

                                    // And swap it with the current element.
                                    t = this.newRecipesIndexs[m];
                                    this.newRecipesIndexs[m] = this.newRecipesIndexs[i];
                                    this.newRecipesIndexs[i] = t;
                                }

                                let indexs = [];
                                for (let i = (payload.page  - 1) * this.newRecipesPageSize; i < (payload.page) * this.newRecipesPageSize; i++) {
                                    if (i < this.newRecipesIndexs.length) {
                                        indexs.push(this.newRecipesIndexs[i]);
                                    }
                                }
                                // console.log("index indexs", indexs);

                                // indexRecipeGet$.next(indexs);

                                let newPayload = {
                                    page: payload.page,
                                    orderBy: payload.orderBy,
                                    sort: payload.sort,
                                    salted: payload.salted,
                                    dishTypeId: payload.dishTypeId,
                                    seasons: payload.seasons,
                                    ageRangeId: payload.ageRangeId,
                                    ingredients: payload.ingredients,
                                    filter: payload.filter,
                                    locale: payload.locale,
                                    index: indexs,
                                };

                                this.api.get('/api/v1/recipes' + this.mapToSearchParamsNew(newPayload)).subscribe(
                                    (resNew: any) => {
                                        let recipeFav =resFav.payload;
                                        let recipeNew =resNew.payload;
                                        console.log();
                                        let recipes: ListPagination<RecipeTileOutDto> = {
                                            results:  Array<RecipeTileOutDto>(),
                                            count: 0,
                                            totalCount: recipeFav.totalCount
                                        };

                                        // console.log("Recipe order init");
                                            let count_fav = 0;
                                            let count_new = 0;
                                        // console.log("Recipes fav",recipeFav.results);
                                        // console.log("Recipes new",recipeNew.results);

                                        for(let i =0; i < recipeFav.results.length + recipeNew.results.length; i++) {
                                            if (i % 3 == 0) {
                                                if (count_new < recipeNew.results.length) {
                                                    // console.log("Recipe order new", recipeNew.results[count_new].id);

                                                    recipes.results.push(recipeNew.results[count_new]);
                                                    count_new++;
                                                } else if (count_fav < recipeFav.results.length) {
                                                    // console.log("Recipe order ☆", recipeFav.results[count_fav].id);

                                                    recipes.results.push(recipeFav.results[count_fav]);
                                                    count_fav++;
                                                }
                                            } else {
                                                if (count_fav < recipeFav.results.length) {
                                                    // console.log("Recipe order ☆", recipeFav.results[count_fav].id);

                                                    recipes.results.push(recipeFav.results[count_fav]);
                                                    count_fav++;
                                                } else if (count_new < recipeNew.results.length) {
                                                    // console.log("Recipe order new", recipeNew.results[count_new].id);

                                                    recipes.results.push(recipeNew.results[count_new]);
                                                    count_new++;
                                                }
                                            }
                                        }
                                        // console.log("Recipes in order",recipes.results);
                                        recipes.count = recipeFav.results.length + recipeNew.results.length;

                                        // TODO
                                        resolve(recipes);
                                    },
                                    (err) => {
                                        console.error('searchNewRecipe error', err);
                                        reject({
                                            isError: true,
                                            reqData: {},
                                            respData: 'error can\'t get new recipes'
                                        });
                                    });




                            },
                            (err) => {
                                console.error('searchNewRecipe error', err);
                                reject({
                                    isError: true,
                                    reqData: {},
                                    respData: 'error can\'t get new recipes'
                                });
                            });

                    }else {

                        let indexs = [];
                        for (let i = (payload.page - 1) * this.newRecipesPageSize; i < (payload.page) * this.newRecipesPageSize; i++) {
                            if (i < this.newRecipesIndexs.length) {
                                indexs.push(this.newRecipesIndexs[i]);
                            }
                        }
                        // console.log("index indexs", indexs);
                        let newPayload = {
                            page: payload.page,
                            orderBy: payload.orderBy,
                            sort: payload.sort,
                            salted: payload.salted,
                            dishTypeId: payload.dishTypeId,
                            seasons: payload.seasons,
                            ageRangeId: payload.ageRangeId,
                            ingredients: payload.ingredients,
                            filter: payload.filter,
                            locale: payload.locale,
                            index: indexs,
                        };
                        this.api.get('/api/v1/recipes' + this.mapToSearchParamsNew(newPayload)).subscribe(
                            (resNew: any) => {

                                let recipeFav =resFav.payload;
                                let recipeNew =resNew.payload;
                                let recipes: ListPagination<RecipeTileOutDto> = {
                                    results:  Array<RecipeTileOutDto>(),
                                    count: 0,
                                    totalCount: recipeFav.totalCount
                                };

                                // console.log("Recipe order init");
                                let count_fav = 0;
                                let count_new = 0;
                                // console.log("Recipes fav",recipeFav.results);
                                // console.log("Recipes new",recipeNew.results);

                                for(let i =0; i < recipeFav.results.length + recipeNew.results.length; i++) {
                                    if (i % 3 == 0) {
                                        if (count_new < recipeNew.results.length) {
                                            // console.log("Recipe order new", recipeNew.results[count_new].id);

                                            recipes.results.push(recipeNew.results[count_new]);
                                            count_new++;
                                        } else if (count_fav < recipeFav.results.length) {
                                            // console.log("Recipe order ☆", recipeFav.results[count_fav].id);

                                            recipes.results.push(recipeFav.results[count_fav]);
                                            count_fav++;
                                        }
                                    } else {
                                        if (count_fav < recipeFav.results.length) {
                                            // console.log("Recipe order ☆", recipeFav.results[count_fav].id);

                                            recipes.results.push(recipeFav.results[count_fav]);
                                            count_fav++;
                                        } else if (count_new < recipeNew.results.length) {
                                            // console.log("Recipe order new", recipeNew.results[count_new].id);

                                            recipes.results.push(recipeNew.results[count_new]);
                                            count_new++;
                                        }
                                    }
                                }
                                // console.log("Recipes in order",recipes.results);
                                recipes.count = recipeFav.results.length + recipeNew.results.length;

                                //TODO
                                resolve(recipes);

                            },
                            (err) => {
                                console.error('searchNewRecipe error', err);
                                reject({
                                    isError: true,
                                    reqData: {},
                                    respData: 'error can\'t get new recipes'
                                });
                            });
                    }

                },
                (err) => {
                    console.error('searchRecipe error', err);
                    reject({
                        isError: true,
                        reqData: {},
                        respData: 'error can\'t get recipes'
                    });
                });

        });
    }

    getIngredients(payload: any): Promise<Array<IngredientOutDto>> {

        return new Promise((resolve, reject) => {

            this.api.get('/api/v1/ingredients/all?' + 'autocomplete=' + payload.autocomplete + '&limit=3').subscribe((res: any) => {
                resolve(res.payload.results);
            },
                err => {
                    console.error('getIngredients error', err);
                    reject({ 'api error': err });
                });
        });
    }

    getRecipeOverview(payload: {id: number, quantity?: number, numberPortion?: number, locale_translate?: string, locale?: string}): Promise<RecipeOverviewOutDto> {

        return new Promise((resolve, reject) => {
            let endpoint = '/api/v1/recipes/' + payload.id + '/overview?';
            if(payload.quantity) endpoint += 'quantity=' + payload.quantity;
            if(payload.numberPortion) endpoint += '&numberPortion=' + payload.numberPortion;
            if(payload.locale_translate) endpoint += '&locale_translate=' + payload.locale_translate;
            if(payload.locale) endpoint += '&locale=' + payload.locale;
            this.api.get(endpoint, {}).subscribe(
                (res: any) => {
                    if (res.success) {
                        resolve(<RecipeOverviewOutDto>this.toRealRecipeOverviewOutDto(res.payload));
                    }
                    else {
                        reject(res);
                    }
                },
                err => {
                    reject(err);
                });
        });
    }

    mapToSearchParams(payload: GetRecipeCommandPayload): string {
        if (payload.salted) payload.salted = (<any>payload.salted == "true");

        let params = '/search?page=' + payload.page + '&filter=';
        params += payload.filter ? payload.filter : 0;

        if (payload.sort && payload.sort != "pertinence") params += "&orderBy=" + payload.sort + "&sort=ASC";
        else if (payload.sort && payload.sort == "inFavorites") params += "&orderBy=" + "inFavorites" + "&sort=DESC";
        else params += "&orderBy=" + "pertinence" + "&sort=DESC";

        if (payload.locale) params += "&locale=" + payload.locale;

        if (payload.salted) params += "&salted=true";

        if (payload.salted == false) params += "&salted=false";

        if (payload.dishTypeId) params += "&types=" + payload.dishTypeId;

        if (payload.seasons) params += "&seasons=" + payload.seasons;

        let maxAge = -1;
        // if (payload.ageRangeId == 0)
        //     maxAge = 6;
        if (payload.ageRangeId == 1)
            maxAge = 6;
        if (payload.ageRangeId == 2)
            maxAge = 8;
        if (payload.ageRangeId == 3)
            maxAge = 12;
        if (payload.ageRangeId == 4)
            maxAge = 24;
        if (payload.ageRangeId == 5)
            maxAge = 36;
        if (payload.ageRangeId == 6)
            maxAge = 1200;
        if (maxAge >= 0)
            params += "&maxAge=" + maxAge;

        let allergenics: Array<number> = [];
        let excludedIngs: Array<number> = [];

        if (payload.ingredients) {
            params += "&includeIngs=";
            payload.ingredients.forEach( ingredient => {
              params += ingredient + ";";
            }
        )
        }
        return params;
    }

    mapToSearchParamsNew(payload: GetNewRecipeCommandPayload): string {
        if (payload.salted) payload.salted = (<any>payload.salted == "true");

        let params = '/search/new?page=' + payload.page + '&filter=';
        params += payload.filter ? payload.filter : 0;
        if (payload.index ){
            params+= "&index=";
            payload.index.forEach( index => {
                    params += index + ";";
                }
            )
        }

        if (payload.sort && payload.sort != "pertinence") params += "&orderBy=" + payload.sort + "&sort=ASC";
        else if (payload.sort && payload.sort == "inFavorites") params += "&orderBy=" + "inFavorites" + "&sort=DESC";
        else params += "&orderBy=" + "pertinence" + "&sort=DESC";

        if (payload.locale) params += "&locale=" + payload.locale;

        if (payload.salted) params += "&salted=true";

        if (payload.salted == false) params += "&salted=false";

        if (payload.dishTypeId) params += "&types=" + payload.dishTypeId;

        if (payload.seasons) params += "&seasons=" + payload.seasons;

        let maxAge = -1;
        // if (payload.ageRangeId == 0)
        //     maxAge = 6;
        if (payload.ageRangeId == 1)
            maxAge = 6;
        if (payload.ageRangeId == 2)
            maxAge = 8;
        if (payload.ageRangeId == 3)
            maxAge = 12;
        if (payload.ageRangeId == 4)
            maxAge = 24;
        if (payload.ageRangeId == 5)
            maxAge = 36;
        if (payload.ageRangeId == 6)
            maxAge = 1200;
        if (maxAge >= 0)
            params += "&maxAge=" + maxAge;

        let allergenics: Array<number> = [];
        let excludedIngs: Array<number> = [];

        if (payload.ingredients) {
            params += "&includeIngs=";
            payload.ingredients.forEach( ingredient => {
                    params += ingredient + ";";
                }
            )
        }
        return params;
    }
    getPendingRecipes(locale?: string): Promise<any> {

        return new Promise((resolve, reject) => {

            let endpoint = '/api/v1/recipes/pending';

            if(locale){
                endpoint += '?locale=' + locale;
            }
            this.api.get(endpoint, {}).toPromise()
                .then((res) => {
                    let result: any = res;
                    if (result.success) {
                        resolve(result.payload.results)
                    }
                    else {
                        reject(false);
                    }
                })
                .catch((err) => {
                    reject(err);
                });

        });

    }

    postNewRecipe(payload: { recipe: RecipeInDto, thumbnail: File }): Promise<any> {
        return new Promise((resolve, reject) => {

            this.api.post('/api/v1/recipes', payload.recipe).subscribe((res: any) => {
                if (!res.success) {
                    console.error('the recipe could not be created: ', res);
                } else {
                    if (payload.thumbnail) {
                        let opts = {
                            fileKey: 'thumbnail_recipe',
                            fileName: 'thumbnail_recipe',
                            chunkedMode: false,
                            mimeType: "image/jpeg"
                        }
                        this.api.transferFile('/api/v1/recipes/' + res.payload.id + '/thumbnail', payload.thumbnail, opts)
                            .then(uploadRes => resolve(res.payload))
                            .catch(err => reject('PICTURE_ERROR'));
                    } else {
                        resolve(res.payload);
                    }
                }
            })
        })
    }

    postApproveModeration(recipeId: number, isBakingTimeAuto: string, isForParentReferent: string, isForFutureMom: string): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!recipeId) {
                reject(false);
            }

            let response = {
                validation: true,
                isBakingTimeAuto: isBakingTimeAuto,
                isForParentReferent: isForParentReferent,
                isForPregnantMother: isForFutureMom
            }

            this.api.post('/api/v1/recipes/' + recipeId + '/moderate' , response, {}).toPromise()
                .then((res) => {
                    let result: any = res;
                    if (result.success) {
                        resolve(result.payload.results)
                    }
                    else {
                        reject(false);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    postRefusedModeration(recipeId: number, whyText: string): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!recipeId || !whyText) {
                reject(false);
            }

            let response = {
                validation: false,
                reasons: [
                    {
                        "reason": "Motif",
                        "text": whyText
                    }
                ]
            }

            this.api.post('/api/v1/recipes/' + recipeId + '/moderate', response, {}).toPromise()
                .then((res) => {
                    let result: any = res;
                    if (result.success) {
                        resolve(result.payload.results)
                    }
                    else {
                        reject(false);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    translateRecipe(recipeId: number, payload: TranslateRecipePayload): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!recipeId || !payload) {
                reject(false);
            }

            this.api.put('/api/v1/recipes/' + recipeId + '/translate', payload, {}).toPromise()
                .then((res) => {
                    console.info("[TRANSLATE] ", res);
                    let result: any = res;
                    if (result.success) {
                        resolve(result.payload.results);
                    }
                    else {
                        reject(false);
                    }
                })
                .catch((err) => {
                    console.error("translateRecipe error", err);
                    reject(err);
                });
        });
    }

    getRecipeReview(recipeId: number, page: number): Promise<Array<RecipeReviewOutDto>> {
        return new Promise<Array<RecipeReviewOutDto>>((resolve, reject) => {
            let endpoint = '/api/v1/recipes/' + recipeId + '/reviews?page=' + page;
            this.api.get('/api/v1/recipes/' + recipeId + '/reviews?page=' + page)
                .subscribe((res: any) => {
                    if (res.success) {
                        resolve(res.payload.reviews);
                    } else {
                        reject(res);
                    }
                }, err => reject(err))
        });
    }

    postRecipeReview(recipeId: number, review: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.api.post('/api/v1/recipes/' + recipeId + '/reviews', { comment: review })
                .subscribe((res: any) => {
                    if (res.success) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }, err => reject(err))
        });
    }

    deleteRecipe(recipeId: number) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete('/api/v1/recipes/' + recipeId + '/delete')
                .subscribe((res: any) => {
                    if (res.success) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }, err => reject(err))
        })
    }

    deleteReview(recipeId: number, reviewId: number) {
        return new Promise<any>((resolve, reject) => {
            this.api.delete('/api/v1/recipes/' + recipeId + '/reviews/' + reviewId)
                .subscribe((res: any) => {
                    if (res.success) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }, err => reject(err));
        });
    }

    updateRecipe(payload: { id: number, recipe: RecipeInDto, thumbnail: any }) {
        return new Promise<any>((resolve, reject) => {
            this.api.put('/api/v1/recipes/' + payload.id, payload.recipe).subscribe((res: any) => {
                if (!res.success) {
                    console.error('the recipe could not be updated: ', res);
                    reject(res);
                } else {
                    if (payload.thumbnail && typeof payload.thumbnail != 'string') {
                        let opts = {
                            fileKey: 'thumbnail_recipe',
                            fileName: 'thumbnail_recipe',
                            chunkedMode: false,
                            mimeType: "image/jpeg"
                        };
                        this.api.transferFile('/api/v1/recipes/' + res.payload.id + '/thumbnail', payload.thumbnail, opts)
                            .then(uploadRes => resolve(res.payload))
                            .catch(err => {console.error('PICTURE_UPLOAD_ERROR', err); reject('PICTURE_ERROR');});
                    } else {
                        resolve(res);
                    }
                }
            })
        });
    }

    toRealRecipeOverviewOutDto(recipe: any): RecipeOverviewOutDto {
        // change ingreId and unitId to id
        recipe.ingredients = recipe.ingredients.map(ingredient => {
            return <IngredientOutDto>{
                id: ingredient.ingredientId,
                name: ingredient.name,
                energy: ingredient.energy,
                carbohydrates: ingredient.carbohydrates,
                proteins: ingredient.proteins,
                lipids: ingredient.lipids,
                nutritionalTip: ingredient.nutritionalTip,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                unitId: ingredient.unitId
            }
        });
        recipe.steps = recipe.steps.map(step => {
            return <RecipeStepOutDto>{
                id: step.id,
                stepIndex: step.stepIndex,
                stepType: step.stepType,
                bakingLevel: step.bakingLevel,
                bakingDuration: step.bakingDuration,
                bakingAutoMix: step.bakingAutoMix,
                mixingTexture: step.mixingTexture,
                freeInstruction: step.freeInstruction,
                ingredientQuantity: parseInt(step.ingredientQuantity),
                ingredientUnit: step.ingredientUnit,
                ingredientUnitId: step.ingredientUnitId,
                ingredient: step.ingredient ? {
                    id: step.ingredient.id,
                    name: step.ingredient.name,
                    energy: step.ingredient.energy,
                    carbohydrates: step.ingredient.carbohydrates,
                    proteins: step.ingredient.proteins,
                    lipids: step.ingredient.lipids,
                    cooking_index: step.ingredient.cooking_index,
                    mixing_index: step.ingredient.mixing_index,
                } : null,
                stepCategory: step.stepCategory
            }
        });
        recipe.steps = this.sortSteps(recipe.steps);
        return <RecipeOverviewOutDto>recipe;
    }

    sortSteps(steps: Array<RecipeStepOutDto>) {
        let newSteps = [];
        steps.forEach((step, index) => {
            newSteps.push(steps.filter(step=>step.stepIndex == index + 1)[0]);
        });
        return newSteps;
    }

    submitRecipe(recipeId: number) {

        return new Promise((resolve, reject) => {

            if (!recipeId) {
                reject(false);
            }

            this.api.post('/api/v1/recipes/' + recipeId + '/publish', {}, {}).toPromise()
                .then((res) => {
                    let result: any = res;
                    if (result.success) {
                        resolve(true)
                    }
                    else {
                        reject(false);
                    }
                })
                .catch((err) => {
                    console.error("submitRecipe error", err);
                    reject(err);
                });
        });
    }

    changeFavoriteState(recipeId: number, state: boolean) {
        return new Promise<any>((resolve, reject) => {
            this.api.put('/api/v1/recipes/' + recipeId + '/favorites/' + state, null)
                .subscribe((res: any) => {
                    if (res.success) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }, err => reject(err))
        });
    }
}
