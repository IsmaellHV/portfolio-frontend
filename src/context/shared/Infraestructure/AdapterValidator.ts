import { FormikErrors } from 'formik';

export class AdapterValidator {
  public static validate(validate: FormikErrors<object>): void {
    const valueValidate: string[] = Object.values(validate);
    if (valueValidate.length) {
      const message: string = valueValidate.map((row) => (typeof row === 'object' ? row['_id'] : row))[0];
      throw Error(message);
    }
  }
}
