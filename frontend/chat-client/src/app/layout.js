import { Inter } from "next/font/google";
import "./globals.css";
import Authorize from "./authorize";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat App - Team 6",
  description: "Created by Team 6 with love.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}><Authorize>{children}</Authorize></body>
    </html>
  );
}
