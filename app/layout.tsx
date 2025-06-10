import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "سوق اليمن الدولي",
    description:
        "An application based on facilitating the life of the Yemeni community in partnership with the Pi Network",
    generator: 'v0.dev'
};

        export default function RootLayout({
          children,
          }: {
            children: React.ReactNode;
            }) {
              return (
                  <html lang="en">
                        <head>
                                <Script
                                          src="https://sdk.minepi.com/pi-sdk.js"
                                                    strategy="beforeInteractive"
                                                            />
                                                                    <Script id="pi-init" strategy="beforeInteractive">
                                                                              {`Pi.init({ version: "2.0" });`}
                                                                                      </Script>
                                                                                            </head>
                                                                                                  <body className={inter.className}>{children}</body>
                                                                                                      </html>
                                                                                                        );
                                                                                                        }
