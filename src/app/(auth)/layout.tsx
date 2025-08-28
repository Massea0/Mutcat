export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-senegal-green-50 to-senegal-yellow-50">
      {children}
    </div>
  );
}