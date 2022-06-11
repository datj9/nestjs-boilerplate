export default class BadUserInput {
  constructor(
    public readonly code: string,
    public readonly field?: string,
    public readonly message?: string,
  ) {}
}
