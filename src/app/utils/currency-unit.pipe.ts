import { Pipe, PipeTransform } from "@angular/core";
import { round } from "lodash-es";

@Pipe({
    name: "currencyUnit",
    standalone: false
})
export class CurrencyUnitPipe implements PipeTransform {
  transform(value: number, precision: number = 2): string {
    return getCurrencyUnit(value, precision);
  }
}

export let getCurrencyUnit = (value: number, precision: number = 2): string => {
  if (value >= 100) {
    return "₹ " + round(value / 100, precision) + "L";
  } else {
    return "₹ " + round(value, precision) + "K";
  }
};
