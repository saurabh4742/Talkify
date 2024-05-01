import  { type DefaultSession } from "next-auth"
export type ExtendedUser =DefaultSession["user"] & {
    banned?:boolean
}
declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

import {JWT} from "next-auth/jwt"
 declare module "next-auth/jwt"{
    interface JWT{
      banned?:boolean
    }
 }