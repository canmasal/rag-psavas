import { requireUser } from "@/lib/auth";
import { PanelHeader } from "@/components/dashboard/Shell";
import { ProfileForm, PasswordForm } from "@/components/dashboard/ProfileForms";

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <>
      <PanelHeader title="Profil & Güvenlik" description="İletişim ve fatura bilgilerinizi güncelleyin." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <p className="font-display text-xl">Kişisel ve fatura bilgileri</p>
          <div className="mt-5">
            <ProfileForm user={{ name: user.name, email: user.email, phone: user.phone ?? "", address: user.address ?? "", city: user.city ?? "", identityNo: user.identityNo ?? "" }} />
          </div>
        </div>
        <div className="card self-start p-6">
          <p className="font-display text-xl">Şifre değiştir</p>
          <div className="mt-5"><PasswordForm /></div>
        </div>
      </div>
    </>
  );
}
