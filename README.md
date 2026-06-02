This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🔐 لوحة التحكم وإدارة المكتبة (Admin Dashboard)

يحتوي المشروع على لوحة تحكم متكاملة ومحمية مخصصة لمدير المنصة (المهندس ناجي) لإضافة وتعديل وحذف الكتب، الشروحات، والأقسام بكل سهولة.

### 🔑 بيانات الدخول الافتراضية:
* **كلمة المرور الافتراضية:** تم تعيينها عبر متغير البيئة `ADMIN_SECRET_PASSWORD`

### 💻 كيفية فتح لوحة التحكم محلياً (Localhost):
1. تأكد أولاً من تشغيل خادم التطوير المحلي عبر الأمر:
   ```bash
   npm run dev
   ```
2. افتح المتصفح وتوجه إلى رابط تسجيل الدخول المباشر: [http://localhost:3000/login](http://localhost:3000/login)
3. أدخل كلمة المرور أعلاه واضغط على زر **"تسجيل الدخول"**.
4. بمجرد التحقق بنجاح، سيقوم النظام تلقائياً بإظهار زر **"لوحة التحكم"** في شريط التنقل العلوي (Navbar) في الموقع، ويمكنك الانتقال إلى لوحة التحكم مباشرةً عبر الرابط: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

### 🚀 تفعيل لوحة التحكم على موقعك المرفوع في Netlify (خطوة هامة):
لكي تعمل كلمة المرور على موقعك المنشور على الإنترنت، يجب عليك تزويد خوادم Netlify بكلمة السر الخاصة بك:
1. توجه إلى حسابك في **Netlify Dashboard** وافتح مشروعك.
2. اذهب إلى **Site configuration** ➡️ **Environment variables** من القائمة الجانبية.
3. اضغط على زر **Add a variable** ثم اختر **Add a single variable**.
4. املأ الحقول كالتالي:
   - **Key**: اكتب `ADMIN_SECRET_PASSWORD`
   - **Value**: اكتب كلمة المرور السرية التي تريدها (لا تشاركها مع أحد)
5. اضغط على **Create variable** أو **Save**.
6. اذهب إلى قسم **Deploys** واعمل **Trigger deploy** ➡️ **Clear cache and deploy site** لكي يتعرف الموقع على كلمة المرور الجديدة.
