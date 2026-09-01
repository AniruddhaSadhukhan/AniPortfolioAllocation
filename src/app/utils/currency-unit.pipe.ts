import { Pipe, PipeTransform } from "@angular/core";
import { round } from "lodash-es";

@Pipe({ name: "currencyUnit" })
export class CurrencyUnitPipe implements PipeTransform {
  transform(value: number, precision = 2): string {
    return getCurrencyUnit(value, precision);
  }
}

export const getCurrencyUnit = (value: number, precision = 2): string => {
  const sign = value < 0 ? "-" : "";
  const absValue = Math.abs(value);

  if (absValue >= 100) {
    return `${sign}₹ ${round(absValue / 100, precision)}L`;
  }

  return `${sign}₹ ${round(absValue, precision)}K`;
};