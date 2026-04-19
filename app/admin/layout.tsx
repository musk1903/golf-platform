export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F2E1D] text-[#FFFFFF] p-6">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}

