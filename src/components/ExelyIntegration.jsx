import { useState, useEffect, useRef } from 'react';
import {
  Plug, Loader2, Check, AlertCircle, RefreshCw, Trash2, ShieldCheck, ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { integrationApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';

/**
 * EXELY ULANISHI (PMS / Channel Manager).
 *
 * Bu ulanish mahsulotdagi yagona joy: bu yergacha hamma narsa TASHQARIDAN
 * ko'rinadigan ma'lumot edi (raqiblar narxi, sharhlar). Bu yerdan keyin
 * mehmonxonaning O'Z sotuvi keladi — occupancy, ADR, RevPAR, bron sur'ati.
 *
 * Xavfsizlik: `clientSecret` faqat YUBORILADI. Backend uni AES-256-GCM
 * bilan shifrlab saqlaydi va hech qachon qaytarmaydi — shuning uchun
 * bu yerda ham hech qachon ko'rsatilmaydi, faqat "ulangan" holati.
 */

const TXT = {
  uz: {
    title: 'Exely (PMS / Channel Manager)',
    desc: 'O‘z bronlaringizni ulang — to‘lish darajasi, ADR va RevPAR taxmin emas, o‘lchov bo‘ladi.',
    clientId: 'Client ID', secret: 'Client Secret',
    idHint: 'api_connection_… ko‘rinishida',
    secretHint: 'Exely bergan maxfiy kalit — shifrlab saqlanadi, qayta ko‘rsatilmaydi',
    connect: 'Ulash', connecting: 'Tekshirilmoqda…',
    connected: 'Ulangan', syncing: 'Yuklanmoqda',
    sync: 'Yangilash', disconnect: 'Uzish',
    bookings: 'bron', lastSync: 'oxirgi yangilanish',
    loading: 'bronlar yuklanmoqda',
    confirmOff: 'Ulanish uzilsinmi? Yuklangan bronlar saqlanib qoladi.',
    where: 'Kalitni qayerdan olish kerak',
    whereHint: 'Exely’ga murojaat qiling — ular API ulanishini yaratib, client_id va client_secret’ni pochtangizga yuboradi.',
    err: 'Kalitlar qabul qilinmadi',
    never: 'Mehmonlar shaxsiy ma’lumoti (ism, telefon, hujjat) saqlanmaydi — faqat sana, xona turi va narx.',
  },
  ru: {
    title: 'Exely (PMS / Channel Manager)',
    desc: 'Подключите свои брони — загрузка, ADR и RevPAR станут измерением, а не оценкой.',
    clientId: 'Client ID', secret: 'Client Secret',
    idHint: 'в формате api_connection_…',
    secretHint: 'Секретный ключ Exely — хранится в зашифрованном виде и не показывается повторно',
    connect: 'Подключить', connecting: 'Проверка…',
    connected: 'Подключено', syncing: 'Загрузка',
    sync: 'Обновить', disconnect: 'Отключить',
    bookings: 'броней', lastSync: 'последнее обновление',
    loading: 'загружаются брони',
    confirmOff: 'Отключить интеграцию? Загруженные брони сохранятся.',
    where: 'Где взять ключ',
    whereHint: 'Обратитесь в Exely — они создадут API-подключение и вышлют client_id и client_secret на вашу почту.',
    err: 'Ключи не приняты',
    never: 'Персональные данные гостей (имя, телефон, документ) не сохраняются — только даты, тип номера и цена.',
  },
  en: {
    title: 'Exely (PMS / Channel Manager)',
    desc: 'Connect your own bookings — occupancy, ADR and RevPAR become measured, not estimated.',
    clientId: 'Client ID', secret: 'Client Secret',
    idHint: 'looks like api_connection_…',
    secretHint: 'Exely secret key — stored encrypted, never shown again',
    connect: 'Connect', connecting: 'Verifying…',
    connected: 'Connected', syncing: 'Loading',
    sync: 'Refresh', disconnect: 'Disconnect',
    bookings: 'bookings', lastSync: 'last sync',
    loading: 'loading bookings',
    confirmOff: 'Disconnect? Downloaded bookings will be kept.',
    where: 'Where to get the key',
    whereHint: 'Ask Exely — they create an API connection and email you the client_id and client_secret.',
    err: 'Keys were not accepted',
    never: 'Guest personal data (name, phone, document) is never stored — only dates, room type and price.',
  },
};

export default function ExelyIntegration() {
  const lang = useLang((s) => s.lang);
  const tx = TXT[lang] || TXT.en;

  const [integ, setInteg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState('');
  const [secret, setSecret] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const poll = useRef(null);

  const load = () => integrationApi.exely().then(setInteg).catch(() => setInteg(null));

  useEffect(() => {
    load().finally(() => setLoading(false));
    return () => clearInterval(poll.current);
  }, []);

  // Birinchi yuklash bir necha daqiqa davom etadi — progressni ko'rsatib
  // turamiz. Tugagach interval o'zi to'xtaydi (keraksiz so'rov qolmaydi).
  useEffect(() => {
    const busyNow = integ && (integ.sync?.running || integ.pendingDetails > 0);
    clearInterval(poll.current);
    if (busyNow) poll.current = setInterval(load, 8000);
    return () => clearInterval(poll.current);
  }, [integ?.sync?.running, integ?.pendingDetails]);

  async function connect(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const res = await integrationApi.connectExely(clientId.trim(), secret.trim());
      setInteg(res.integration);
      setSecret('');   // secret xotirada qolmasin
    } catch (err) {
      setError(err?.response?.data?.details || err?.response?.data?.error || tx.err);
    } finally { setBusy(false); }
  }

  async function doSync() {
    setBusy(true);
    try { await integrationApi.syncExely(); await load(); }
    catch { /* 409 — allaqachon ketyapti, holat pollingdan yangilanadi */ }
    finally { setBusy(false); }
  }

  async function doDisconnect() {
    if (!window.confirm(tx.confirmOff)) return;
    setBusy(true);
    try { await integrationApi.disconnectExely(false); setInteg(null); }
    finally { setBusy(false); }
  }

  const total = integ?.sync?.totalBookings || 0;
  const pending = integ?.pendingDetails || 0;
  const ready = Math.max(total - pending, 0);
  const pct = total ? Math.round((ready / total) * 100) : 0;
  const isLoadingData = integ && (integ.sync?.running || pending > 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 mt-0.5"><Plug className="h-4 w-4 text-primary" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle>{tx.title}</CardTitle>
              {integ?.status === 'active' && (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  <Check className="h-3 w-3 mr-1" />{tx.connected}
                </Badge>
              )}
              {integ?.status === 'error' && (
                <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">
                  <AlertCircle className="h-3 w-3 mr-1" />{integ.sync?.lastError?.slice(0, 40) || 'error'}
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1">{tx.desc}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

        {!loading && !integ && (
          <form onSubmit={connect} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="ex-id">{tx.clientId}</Label>
              <Input id="ex-id" value={clientId} onChange={(e) => setClientId(e.target.value)}
                placeholder="api_connection_xxxxx_xxxxxxxx" autoComplete="off" required />
              <p className="text-[11px] text-muted-foreground">{tx.idHint}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ex-secret">{tx.secret}</Label>
              <Input id="ex-secret" type="password" value={secret} onChange={(e) => setSecret(e.target.value)}
                autoComplete="new-password" required />
              <p className="text-[11px] text-muted-foreground">{tx.secretHint}</p>
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 px-3 py-2 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" /><span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={busy || !clientId || !secret}>
                {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {busy ? tx.connecting : tx.connect}
              </Button>
              <a href="https://exely.com/help/kb350837/" target="_blank" rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                {tx.where} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-[11px] text-muted-foreground">{tx.whereHint}</p>
          </form>
        )}

        {!loading && integ && (
          <div className="space-y-3">
            <div className="rounded-xl bg-muted/40 px-4 py-3">
              <div className="font-medium text-sm">{integ.property?.name || integ.propertyId}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {[integ.property?.cityName, integ.property?.currency,
                  integ.property?.roomTypeCount ? `${integ.property.roomTypeCount} ${lang === 'ru' ? 'типов номеров' : lang === 'en' ? 'room types' : 'xona turi'}` : null,
                ].filter(Boolean).join(' · ')}
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 tabular-nums">
                {total.toLocaleString()} {tx.bookings}
                {integ.sync?.lastSyncAt && ` · ${tx.lastSync}: ${new Date(integ.sync.lastSyncAt).toLocaleString()}`}
              </div>

              {isLoadingData && (
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" />{tx.loading}
                    </span>
                    <span className="tabular-nums">{ready.toLocaleString()} / {total.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={doSync} disabled={busy || integ.sync?.running}>
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${integ.sync?.running ? 'animate-spin' : ''}`} />
                {integ.sync?.running ? tx.syncing : tx.sync}
              </Button>
              <Button variant="ghost" size="sm" onClick={doDisconnect} disabled={busy}
                className="text-muted-foreground hover:text-rose-600">
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />{tx.disconnect}
              </Button>
            </div>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground flex items-start gap-1.5 pt-1 border-t border-border/60">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
          {tx.never}
        </p>
      </CardContent>
    </Card>
  );
}
