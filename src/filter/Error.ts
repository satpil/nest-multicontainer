export class CustomError extends Error{
   public status
   public timestamp;

  constructor(message,status){
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.timestamp = new Date().toISOString();
  }
}