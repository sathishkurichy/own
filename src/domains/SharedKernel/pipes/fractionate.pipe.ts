import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fractionate' })
export class FractionatePipe implements PipeTransform {
    transform(value: any) {
        switch (value % 1) {
            case 0.25:
                return value > 1 ? Math.round(value) + '¼' : '¼';
            case 0.33:
                return value > 1 ? Math.round(value) + '⅓' : '⅓';
            case 0.5:
                return value > 1 ? Math.round(value) + '½' : '½';
            case 0.66:
                return value > 1 ? Math.round(value) + '⅔' : '⅔';
            case 0.75:
                return value > 1 ? Math.round(value) + '¾' : '¾';
            default:
                return Math.round(value * 100) / 100;
        }
    }
}