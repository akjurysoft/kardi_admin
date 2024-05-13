import { Inter } from "next/font/google";
import "./globals.css";
import SnackbarProvider from "./SnackbarProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kardify",
  description: "Multiple Car Accessories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SnackbarProvider>
        <body className={inter.className}>{children}</body>
      </SnackbarProvider>
    </html>
  );
}
