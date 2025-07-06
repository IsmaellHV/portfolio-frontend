export interface IFormSaveOneValues {
  name: string;
}

export type IFormSaveOneTouched = {
  [key in keyof IFormSaveOneValues]?: boolean;
};

export type IFormSaveOneError = {
  [key in keyof IFormSaveOneValues]?: boolean;
};
