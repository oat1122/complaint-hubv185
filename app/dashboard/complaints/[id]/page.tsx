import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';

async function getComplaint(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ''}/api/admin/complaints/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ComplaintDetailPage({ params }: { params: { id: string } }) {
  const complaint = await getComplaint(params.id);
  if (!complaint) {
    notFound();
  }
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">{complaint.title}</h1>
      <p className="text-sm text-gray-500">{formatDate(new Date(complaint.createdAt))}</p>
      <p className="whitespace-pre-line">{complaint.description}</p>
    </div>
  );
}
