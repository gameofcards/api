export class PresidentsGameError extends Error {
  constructor(message?: string) {
    super(message); 
    this.name = 'PresidentsError'
  }
}