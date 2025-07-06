export class IError extends Error {
  public errorCode: number;

  constructor(message: string, codeError: number) {
    super(message);
    this.errorCode = codeError;
  }
}
