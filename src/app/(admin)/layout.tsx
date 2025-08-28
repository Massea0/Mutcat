// Layout pour le groupe admin - pas de HTML/body car déjà défini dans le layout racine
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}