import { userIdAtom } from '@/utils/atoms';
import axios from 'axios';
import { useAtom } from 'jotai';
import NextAuth, { NextAuthOptions } from 'next-auth';
import LineProvider from 'next-auth/providers/line';

// /api/userからuserIDを元にuserを取得して返す関数
const getUser = async (userId: string) => {
  const { data } = await axios.get(`/api/user?id=${userId}`);
  return data;
};

const [userId, setUserId] = useAtom(userIdAtom);

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
      getUser(token.sub).then((user) => {
        
        // userが存在しない場合は、userを作成する
        if (!user) {
          //setUserIdを行う
          setUserId(token.sub || '')
          // LINEのuser idをDBに保存する
          fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: token.sub,
              name: '',
              email: '',
              image: '',
              createdAt: new Date(),
              updatedAt: new Date(),
            }),
          })
            .then((response) => {
              console.log('response', response);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        }
      });
      return session; // The return type will match the one returned in `useSession()`
    },
  },
}

export default NextAuth(authOptions)
