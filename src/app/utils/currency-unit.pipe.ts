import { Pipe, PipeTransform } from "@angular/core";
import { round } from "lodash-es";

@Pipe({ name: "currencyUnit" })
export class CurrencyUnitPipe implements PipeTransform {
  transform(value: number, precision = 2): string {
    return getCurrencyUnit(value, precision);
  }
}

export const getCurrencyUnit = (value: number, precision = 2): string => {
  if (value >= 100) {
    return "₹ " + round(value / 100, precision) + "L";
  } else {
    return "₹ " + round(value, precision) + "K";
  }
};
