// src/dtos/user.dto.js
export class CurrentUserDTO {
  constructor(user) {
    this.uid = String(user._id);
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = user.role;
    this.age = user.age;
    this.cart = user.cart ?? null;
   
  }
}
