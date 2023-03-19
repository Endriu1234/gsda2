import { HttpContextToken } from "@angular/common/http";

export const enum SpinnerType {NoSpinner, FullScreen}
export const TYPE_OF_SPINNER = new HttpContextToken<SpinnerType>(() => SpinnerType.NoSpinner);