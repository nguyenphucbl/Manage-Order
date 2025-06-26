import Layout from "../(public)/layout";

export default function GuestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full">
        {children}
      </div>
    </Layout>
  );
}
