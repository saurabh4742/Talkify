import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./utils/db"
import NextAuth from "next-auth"

export const {
  handlers: { GET, POST },
  auth,signIn,signOut
} = NextAuth({
  events:{
    async linkAccount({user}){
      await db.user.update({
        where:{id:user.id},
        data:{
            emailVerified:new Date()
        }
      })
    }
  },
  callbacks:{
    async session({session,token}){
      if(token.sub && session.user){
        session.user.id=token.sub
        const existuser= await db.user.findUnique({where:{id:session.user.id}})
        session.user.banned=existuser?.banned
      }
      return session;
    },
    async jwt({token}){
      return token
    }
  },
  adapter:PrismaAdapter(db),
  session:{strategy:"jwt"},
  ...authConfig,
})