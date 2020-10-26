export class InstanceOperationsError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InstanceOperations';
  }
}
