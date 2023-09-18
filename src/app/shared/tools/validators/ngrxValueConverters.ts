import { NgrxValueConverter, NgrxValueConverters } from 'ngrx-forms';

//Converts value to trimmed uppercase value
export const trimUpperConverter: NgrxValueConverter<string | null, string | null> = {
    convertViewToStateValue(value: string | null) {
      if (value === null) {
        return null;
      }

      return value.trim().toUpperCase();
    },
    convertStateToViewValue(value: string | null) {
      return value;
    },
};

//Converts value to trimmed uppercase value
export const dateValueConverter: NgrxValueConverter<Date | null, string | null> = {
  convertViewToStateValue(value: Date | null) {
    if (value === null) {
      return null;
    }

    value = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
    return NgrxValueConverters.dateToISOString.convertViewToStateValue(value);
  },
  convertStateToViewValue: NgrxValueConverters.dateToISOString.convertStateToViewValue,
};