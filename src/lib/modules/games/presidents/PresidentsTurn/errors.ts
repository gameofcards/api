export class PresidentsTurnError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'PresidentsTurnError';
  }
}
