import { Injectable } from '@nestjs/common';

export class UserDTO{
    id: string
    name: string
    email: string
    password: string
    otp?: number
}
@Injectable()
export class UserService {
    private user:any= []
  
    setUser = async(data) => {
      console.log(data)
        await this.user.push(data)
      
        return true
    }

    getAll = async () => {
      console.log(this.user)
      return await this.user
    }

    // getUser = async (id) => {
    //     const user =  await this.user.filter(user => +user.id === +id)
    //     if(user.length > 0){
    //       return user
    //     }else{
    //       return false
    //     }
    // }

    getUser = async (email) => {
      const user =  await this.user.filter(user => user.email === email)
      if(user.length > 0){
        return user
      }else{
        return false
      }
  }


    updateUser = async (id,body) => {
      const index =  await this.user.findIndex(user => +user.id === +id)
      if(index !== -1){
         this.user[index].name = body.name
         return true
      }
      return false
    }

}
