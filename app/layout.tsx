import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { DevToolsBlocker } from "@/components/DevToolsBlocker";
import { TransitionProvider } from "@/app/TransitionProvider";

export const metadata: Metadata = {
  title: "مكتبة المهندس ناجي الدعاس",
  description: "كتب وشروحات تقنية في البرمجة وتطوير الويب والأمن السيبراني والذكاء الاصطناعي.",
  icons: {
    icon: "/images/NajiAlDaas2026.png",
    shortcut: "/images/NajiAlDaas2026.png",
    apple: "/images/NajiAlDaas2026.png",
  },
  openGraph: {
    title: "مكتبة المهندس ناجي الدعاس",
    description: "كتب وشروحات تقنية في البرمجة وتطوير الويب والأمن السيبراني والذكاء الاصطناعي.",
    url: "https://library.najialdaas.com/",
    siteName: "مكتبة المهندس ناجي الدعاس",
    images: [
      {
        url: "/images/NajiAlDaas2026.png",
        width: 1200,
        height: 630,
        alt: "مكتبة المهندس ناجي الدعاس",
      },
    ],
    locale: "ar_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مكتبة المهندس ناجي الدعاس",
    description: "كتب وشروحات تقنية في البرمجة وتطوير الويب والأمن السيبراني والذكاء الاصطناعي.",
    images: ["/images/NajiAlDaas2026.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="h-full antialiased font-sans"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "مكتبة المهندس ناجي الدعاس",
              "url": "https://library.najialdaas.com/",
              "author": {
                "@type": "Person",
                "name": "المهندس ناجي الدعاس",
                "url": "https://najialdaas.com"
              },
              "description": "مكتبة تقنية توفر كتب وشروحات في البرمجة وتطوير الويب والأمن السيبراني والذكاء الاصطناعي."
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <DevToolsBlocker />
        <TransitionProvider>
          <div className="flex-grow">{children}</div>
          <Footer />
          <FloatingActions />
        </TransitionProvider>
      </body>
    </html>
  );
}
