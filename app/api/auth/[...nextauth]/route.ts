import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Github profil fotoğrafı ve ismini session'a ekle
      if (session.user) {
        session.user.id = token.sub;
        session.user.image = token.picture;
        session.user.name = token.name;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 