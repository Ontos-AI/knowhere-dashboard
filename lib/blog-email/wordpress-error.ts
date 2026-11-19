export class WordpressFetchError extends Error {
  readonly status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "WordpressFetchError";
    this.status = status;
  }
}
