import { redirect } from 'next/navigation';
import { isAuthorizedBrewCommandViewer } from '@/lib/auth/brewcommand';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authorized = await isAuthorizedBrewCommandViewer();

  if (!authorized) {
    redirect('/login');
  }

  return children;
}
