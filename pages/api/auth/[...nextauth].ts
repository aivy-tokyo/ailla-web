import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import LineProvider from "next-auth/providers/line";

// /api/userからuserIDを元にuserを取得して返す関数
const getUser = async (userId: string) => {
  const { data } = await axios.get(`/api/user?id=${userId}`);
  return data;
};

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID || "",
      clientSecret: process.env.LINE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    session: async function ({ session, token }) {
      if (!token.sub) {
        return session;
      }

      try {
        const user = await getUser(token.sub);

        // userが存在しない場合は、userを作成する
        if (!user) {
          // LINEのuser idをDBに保存する
          const response = await axios.post(
            "/api/user",
            {
              id: token.sub,
              userName: "",
              userPrefecture: "",
              userBirthday: "",
              userGender: "",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log('ユーザー新規追加', response.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
