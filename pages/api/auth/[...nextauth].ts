import NextAuth, { NextAuthOptions } from 'next-auth';
import LineProvider from 'next-auth/providers/line';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID || '',
      clientSecret: process.env.LINE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    session({ session, token }) {
      // user.lineIdでDBを検索して、userを取得する
      // userが存在する場合は、何もしない
      // userが存在しない場合は、userを作成する
      // POST /api/userを呼び出す
      // LINEのuser idをDBにほぞんする
      // user.lineId = token.sub
      // 他のuserのパラメータは空で作成する
      return session // The return type will match the one returned in `useSession()`
    },
  },
}

export default NextAuth(authOptions)
