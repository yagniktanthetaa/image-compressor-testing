import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Easily compress images at optimal quality in seconds",
  description:
    "Compress IMAGE. Compress JPG, PNG, SVG or GIF with the best quality and compression. Reduce the filesize of your images at once.This online image optimizer uses a smart combination of the best optimization and lossy compression algorithms to shrink JPEG, GIF and PNG images to the minimum possible size while keeping the required level of quality.",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
};
export default RootLayout;
