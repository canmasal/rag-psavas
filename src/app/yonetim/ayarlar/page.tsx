import { getSettings, settingLabels } from "@/lib/settings";
import { PanelHeader } from "@/components/dashboard/Shell";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { isIyzicoEnabled } from "@/lib/payment";

export default async function AdminSettings() {
  const settings = await getSettings();
  return (
    <>
      <PanelHeader title="Site Ayarları" description="İletişim bilgileri, sosyal medya ve banka hesap bilgileri." />
      <SettingsForm settings={settings} labels={settingLabels} />
      <div className="card mt-6 p-6 text-sm">
        <p className="font-display text-xl">Ödeme altyapısı</p>
        <p className="mt-2 text-muted">
          Durum: {isIyzicoEnabled() ? <b className="text-emerald-700">iyzico canlı/sandbox bağlı</b> : <b className="text-amber-700">Test modu</b>}. API anahtarları güvenlik nedeniyle panelden değil, sunucudaki <code>.env</code> dosyasından (<code>IYZICO_API_KEY</code>, <code>IYZICO_SECRET_KEY</code>, <code>IYZICO_BASE_URL</code>) yönetilir.
        </p>
      </div>
    </>
  );
}
