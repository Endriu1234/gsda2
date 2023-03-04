import { NgrxValueConverter } from 'ngrx-forms';

//Converts value to trimmed uppercase value
export const trimUpperConverter: NgrxValueConverter<string | null, string | null> = {
    convertViewToStateValue(value: string | null) {
      if (value === null) {
        return null;
      }

      return value.trim().toUpperCase();;
    },
    convertStateToViewValue(value: string | null) {
      return value;
    },
  };