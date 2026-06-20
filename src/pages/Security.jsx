import { useState, useEffect, useRef } from 'react';
import {
  Shield, ShieldAlert, Ban, Activity, Loader2, RefreshCw, AlertTriangle, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/lib/i18n';
import { securityApi } from '@/lib/api';
import { parseUA, deviceIcon } from '@/lib/ua';

const SEV_COLOR = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-amber-500/15 text-amber-600',
  high: 'bg-orange-500/15 text-orange-600',
  critical: 'bg-red-500/15 text-red-600',
};

const TYPE_LABEL = {
  rate_abuse: 'Flood',
  brute_force: 'Brute-force',
  failed_login: 'Failed login',
  suspicious_path: 'Probe',
  injection: 'Injection',
  large_payload: 'Large payload',
  blocked: 'Blocked',
  ip_banned: 'IP banned',
  ip_unbanned: 'IP unbanned',
};

export default function Security() {
  const t = useT();
  const [overview, setOverview] = useState(null);
  const [events, setEvents] = useState([]);
  const [banned, setBanned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [banForm, setBanForm] = useState({ ip: '', permanent: false });
  // Bitta IP faoliyatini filtrlash (qaysi sahifa, qaysi qurilma)
  const [ipFilter, setIpFilter] = useState('');
  const ipFilterRef = useRef('');

  async function load() {
    setBusy(true);
    try {
      const ipQ = ipFilterRef.current || undefined;
      const [ov, ev, bn] = await Promise.all([
        securityApi.overview(),
        securityApi.events({ limit: 100, ip: ipQ }),
        securityApi.banned(),
      ]);
      setOverview(ov);
      setEvents(ev.events || []);
      setBanned(bn.banned || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
      setBusy(false);
    }
  }

  function applyIpFilter(ip) {
    ipFilterRef.current = ip;
    setIpFilter(ip);
    load();
  }
  function clearIpFilter() {
    ipFilterRef.current = '';
    setIpFilter('');
    load();
  }
  useEffect(() => {
    load();
    const id = setInterval(load, 30_000); // har 30s yangilanadi
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleBan(e) {
    e.preventDefault();
    if (!banForm.ip.trim()) return;
    await securityApi.ban({ ip: banForm.ip.trim(), permanent: banForm.permanent, reason: 'Admin' });
    setBanForm({ ip: '', permanent: false });
    load();
  }
  async function handleUnban(ip) {
    await securityApi.unban(ip);
    load();
  }
  async function banDirect(ip, reason) {
    await securityApi.ban({ ip, reason: reason || 'Admin' });
    load();
  }

  const fmtTime = (d) => new Date(d).toLocaleString('uz-UZ', { hour12: false });
  const maxHour = Math.max(1, ...(overview?.byHour || []).map((h) => h.count));

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {t('securityTitle')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('securitySub')}</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={busy}>
          <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
          {t('secRefresh')}
        </Button>
      </div>

      {/* Stat kartalar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Activity} label={t('secEvents24h')} value={overview?.last24h ?? 0} />
        <StatCard icon={Ban} label={t('secBannedActive')} value={overview?.bannedActive ?? 0} accent="red" />
        <StatCard
          icon={ShieldAlert}
          label="Injection / Probe"
          value={(overview?.byType || []).filter((x) => ['injection', 'suspicious_path'].includes(x.type)).reduce((s, x) => s + x.count, 0)}
          accent="orange"
        />
        <StatCard
          icon={AlertTriangle}
          label="Flood / Brute"
          value={(overview?.byType || []).filter((x) => ['rate_abuse', 'brute_force', 'failed_login'].includes(x.type)).reduce((s, x) => s + x.count, 0)}
          accent="amber"
        />
      </div>

      {/* 24 soatlik faollik grafigi */}
      {overview?.byHour?.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-medium mb-4">{t('secEvents24h')}</div>
          <div className="flex items-end gap-1 h-24">
            {overview.byHour.map((h) => (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t transition-colors relative"
                  style={{ height: `${(h.count / maxHour) * 100}%`, minHeight: '2px' }}
                  title={`${h.hour} — ${h.count}`}
                />
                <span className="text-[9px] text-muted-foreground">{h.hour.slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Hodisa turlari + top IP */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5">
            <div className="text-sm font-medium mb-3">{t('secByType')}</div>
            {(overview?.byType || []).length === 0 ? (
              <p className="text-xs text-muted-foreground">{t('secNoEvents')}</p>
            ) : (
              <div className="space-y-2">
                {overview.byType.map((x) => (
                  <div key={x.type} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{TYPE_LABEL[x.type] || x.type}</span>
                    <span className="font-semibold tabular-nums">{x.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5">
            <div className="text-sm font-medium mb-3">{t('secTopOffenders')}</div>
            {(overview?.topIps || []).length === 0 ? (
              <p className="text-xs text-muted-foreground">—</p>
            ) : (
              <div className="space-y-2">
                {overview.topIps.map((x) => (
                  <div key={x.ip} className="flex items-center justify-between text-sm gap-2">
                    <code className="text-xs truncate">{x.ip}</code>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground tabular-nums">{x.count}</span>
                      <button
                        onClick={() => banDirect(x.ip, 'Top offender')}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        {t('secBan')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Qo'lda bloklash */}
          <div className="rounded-xl border bg-card p-5">
            <div className="text-sm font-medium mb-3">{t('secBanIpTitle')}</div>
            <form onSubmit={handleBan} className="space-y-3">
              <Input
                placeholder={t('secBanIpPlaceholder')}
                value={banForm.ip}
                onChange={(e) => setBanForm({ ...banForm, ip: e.target.value })}
              />
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={banForm.permanent}
                  onChange={(e) => setBanForm({ ...banForm, permanent: e.target.checked })}
                />
                {t('secPermanent')}
              </label>
              <Button type="submit" variant="destructive" size="sm" className="w-full">
                <Ban className="h-4 w-4" />
                {t('secBan')}
              </Button>
            </form>
          </div>
        </div>

        {/* So'nggi hodisalar */}
        <div className="lg:col-span-2 rounded-xl border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b text-sm font-medium flex items-center justify-between gap-3">
            <span>{t('secRecentEvents')}</span>
            {ipFilter && (
              <button
                onClick={clearIpFilter}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
              >
                <code>{ipFilter}</code>
                <X className="h-3 w-3" />
                <span className="text-[10px] opacity-70">{t('secClearFilter')}</span>
              </button>
            )}
          </div>
          {events.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">{t('secEmptyState')}</div>
          ) : (
            <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground bg-muted/30 sticky top-0">
                  <tr>
                    <th className="text-left font-medium px-4 py-2">{t('secTime')}</th>
                    <th className="text-left font-medium px-4 py-2">{t('secType')}</th>
                    <th className="text-left font-medium px-4 py-2">{t('secIp')}</th>
                    <th className="text-left font-medium px-4 py-2">{t('secDevice')}</th>
                    <th className="text-left font-medium px-4 py-2">{t('secRequest')}</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => {
                    const ua = parseUA(e.userAgent);
                    return (
                      <tr key={e._id} className="border-t hover:bg-accent/30 align-top">
                        <td className="px-4 py-2 text-xs text-muted-foreground whitespace-nowrap">{fmtTime(e.createdAt)}</td>
                        <td className="px-4 py-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${SEV_COLOR[e.severity] || ''}`}>
                            {TYPE_LABEL[e.type] || e.type}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => applyIpFilter(e.ip)}
                            title={t('secFilterByIp')}
                            className="text-xs font-mono text-primary hover:underline"
                          >
                            {e.ip}
                          </button>
                        </td>
                        <td className="px-4 py-2 text-xs whitespace-nowrap" title={e.userAgent || '—'}>
                          <span className="mr-1">{deviceIcon(ua.device)}</span>
                          <span className={ua.bot ? 'text-red-500 font-medium' : 'text-foreground'}>{ua.label}</span>
                        </td>
                        <td className="px-4 py-2 max-w-[260px]" title={`${e.detail || ''}\n${e.method || ''} ${e.path || ''}\n${e.userAgent || ''}`}>
                          {e.detail && <div className="text-xs text-foreground truncate">{e.detail}</div>}
                          {e.path && (
                            <div className="text-[11px] text-muted-foreground font-mono truncate">
                              {e.method && <span className="text-primary/70">{e.method} </span>}{e.path}
                            </div>
                          )}
                          {!e.detail && !e.path && <span className="text-xs text-muted-foreground">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bloklangan IP'lar */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b text-sm font-medium flex items-center gap-2">
          <Ban className="h-4 w-4 text-red-500" />
          {t('secBannedList')} ({banned.length})
        </div>
        {banned.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">{t('secNoBanned')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/30">
                <tr>
                  <th className="text-left font-medium px-4 py-2">{t('secIp')}</th>
                  <th className="text-left font-medium px-4 py-2">{t('secReason')}</th>
                  <th className="text-left font-medium px-4 py-2">{t('secExpires')}</th>
                  <th className="text-right font-medium px-4 py-2">{t('secAction')}</th>
                </tr>
              </thead>
              <tbody>
                {banned.map((b) => (
                  <tr key={b._id} className="border-t hover:bg-accent/30">
                    <td className="px-4 py-2"><code className="text-xs">{b.ip}</code></td>
                    <td className="px-4 py-2 text-xs text-muted-foreground max-w-[260px] truncate">{b.reason || '—'}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {b.permanent ? (
                        <Badge variant="secondary" className="text-[10px]">{t('secPermanentLabel')}</Badge>
                      ) : (
                        fmtTime(b.until)
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleUnban(b.ip)}>
                        {t('secUnban')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  const accentCls =
    accent === 'red' ? 'text-red-500 bg-red-500/10'
    : accent === 'orange' ? 'text-orange-500 bg-orange-500/10'
    : accent === 'amber' ? 'text-amber-500 bg-amber-500/10'
    : 'text-primary bg-primary/10';
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accentCls}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
