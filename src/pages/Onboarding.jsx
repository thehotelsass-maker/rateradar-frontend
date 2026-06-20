import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, Building2, Globe, Loader2, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { AuthBrandPanel } from '@/components/AuthBrandPanel';
import { SearchSelect } from '@/components/ui/search-select';
import { useT } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { searchApi, hotelApi, authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function Onboarding() {
  const t = useT();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const updateUser = useAuth((s) => s.updateUser);

  const [step, setStep] = useState(1);
  const [countries, setCountries] = useState([]);
  const [countryQuery, setCountryQuery] = useState('');
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [hotelManual, setHotelManual] = useState({ name: '', address: '' });
  const [useManual, setUseManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Shahar bo'yicha BARCHA hotellar (bir marta yuklanadi) + client-side filtr
  const [cityHotels, setCityHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelFilter, setHotelFilter] = useState('');

  useEffect(() => {
    searchApi.countries().then(setCountries).catch(console.error);
  }, []);

  useEffect(() => {
    setCity(null);
    setHotel(null);
    setUseManual(false);
    setHotelManual({ name: '', address: '' });
  }, [country?.code]);

  useEffect(() => {
    setHotel(null);
    setUseManual(false);
    setHotelManual({ name: '', address: '' });
    setCityHotels([]);
    setHotelFilter('');
  }, [city?.name, city?.lat, city?.lng]);

  const hotelSearchCity = city
    ? { city: city.name, lat: city.lat, lng: city.lng }
    : {};

  // 3-qadamga o'tilganda — shahardagi BARCHA hotelni bir marta yuklaymiz.
  useEffect(() => {
    if (step !== 3 || !city || useManual || cityHotels.length) return;
    setHotelsLoading(true);
    searchApi
      .hotels('', country?.code, hotelSearchCity)
      .then((list) => setCityHotels(list || []))
      .catch(() => setCityHotels([]))
      .finally(() => setHotelsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, city?.name, useManual]);

  // Yozilgan matn bo'yicha client-side filtr (darhol, so'rovsiz).
  const filteredHotels = (() => {
    const f = hotelFilter.trim().toLowerCase();
    if (!f) return cityHotels;
    return cityHotels.filter((h) => (h.name || '').toLowerCase().includes(f));
  })();

  // Davlat qidiruvi — nom, ISO kod yoki valyuta bo'yicha filtr.
  const filteredCountries = (() => {
    const q = countryQuery.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.code?.toLowerCase().includes(q) ||
        c.currency?.toLowerCase().includes(q)
    );
  })();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const hotelData = useManual
        ? {
            name: hotelManual.name,
            address: hotelManual.address,
            country: country.name,
            countryCode: country.code,
            city: city.name,
            lat: city.lat,
            lng: city.lng,
          }
        : {
            name: hotel.name,
            address: hotel.address,
            country: country.name,
            countryCode: country.code,
            city: city.name,
            lat: hotel.lat,
            lng: hotel.lng,
            googlePlaceId: hotel.placeId || '',
            osmId: hotel.osmId || '',
          };
      const created = await hotelApi.create(hotelData);

      // Yangi yaratilgan hotel'ni aktiv qilamiz — keyingi sahifalar shu hotel
      // ma'lumotlarini ko'rsatadi (X-Hotel-Id header orqali).
      if (created?._id) {
        localStorage.setItem('rr_active_hotel_id', String(created._id));
      }

      // Refresh user
      const { user: refreshedUser } = await authApi.me();
      updateUser(refreshedUser);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const canProceed =
    (step === 1 && country) ||
    (step === 2 && city) ||
    (step === 3 && (useManual ? hotelManual.name.length >= 2 : hotel));

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* CHAP — brending paneli */}
      <AuthBrandPanel />

      {/* O'NG — onboarding qadamlari */}
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="absolute top-5 right-5">
          <LanguageSwitcher />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[520px]"
        >
          {/* Mobil logo */}
          <Link to="/" className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[hsl(221_83%_42%)] grid place-items-center font-bold text-white shadow-lg">R</div>
            <span className="font-bold text-[15px]">TheHotelSaaS</span>
          </Link>

          <div className="bg-card border rounded-2xl p-8 shadow-lg">
        {/* Stepper */}
        <div className="flex gap-2 mb-7">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                s < step ? 'bg-primary' : s === step ? 'bg-primary/50' : 'bg-border'
              )}
            />
          ))}
        </div>

        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-wider text-primary font-semibold mb-1.5">
            {t('onboarding')} · {step}/3
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {step === 1 && t('selectCountry')}
            {step === 2 && t('selectCity')}
            {step === 3 && t('findHotel')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            {step === 1 && t('selectCountryDesc')}
            {step === 2 && t('selectCityDesc')}
            {step === 3 && t('findHotelDesc')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Step 1 — Country */}
        {step === 1 && (
          <div className="space-y-3">
            {/* Qidiruv */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={countryQuery}
                onChange={(e) => setCountryQuery(e.target.value)}
                placeholder={t('countrySearchPlaceholder')}
                className="pl-9"
                autoFocus
              />
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {countries.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {t('noResults')}
                </div>
              ) : (
                filteredCountries.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCountry(c)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left',
                      country?.code === c.code
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-input hover:bg-accent'
                    )}
                  >
                    <span className="text-2xl">{c.flag || '🌍'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {c.currency} · {c.languages?.[0] || 'N/A'}
                      </div>
                    </div>
                    {country?.code === c.code && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 2 — City */}
        {step === 2 && (
          <SearchSelect
            placeholder={t('cityPlaceholder')}
            fetchOptions={(q) => searchApi.cities(q, country?.code)}
            getKey={(c) => `${c.name}-${c.lat}`}
            getLabel={(c) => `${c.name}${c.region ? ', ' + c.region : ''}`}
            renderOption={(c) => (
              <div>
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {c.region && `${c.region}, `}
                  {c.country}
                  {c.population && ` · ${c.population.toLocaleString()} aholisi`}
                </div>
              </div>
            )}
            selected={city}
            onSelect={setCity}
          />
        )}

        {/* Step 3 — Hotel */}
        {step === 3 && (
          <div className="space-y-3">
            {!useManual ? (
              <>
                {/* Filtr (darhol, client-side) */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={hotelFilter}
                    onChange={(e) => setHotelFilter(e.target.value)}
                    placeholder={t('hotelPlaceholder')}
                    className="pl-9"
                    autoFocus
                  />
                </div>

                {/* Topilgan soni */}
                {!hotelsLoading && cityHotels.length > 0 && (
                  <div className="text-[11px] text-muted-foreground">
                    {filteredHotels.length} / {cityHotels.length} {t('hotelsFound')}
                  </div>
                )}

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {hotelsLoading ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : filteredHotels.length === 0 ? (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      {cityHotels.length === 0 ? t('noHotelsInCity') : t('noResults')}
                    </div>
                  ) : (
                    filteredHotels.map((h) => {
                      const key = h.placeId || h.osmId || h.name;
                      const selKey = hotel && (hotel.placeId || hotel.osmId || hotel.name);
                      const isSel = selKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setHotel(h)}
                          className={cn(
                            'w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left',
                            isSel ? 'border-primary bg-primary/5' : 'border-border hover:border-input hover:bg-accent'
                          )}
                        >
                          <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{h.name}</div>
                            {h.address && (
                              <div className="text-[11px] text-muted-foreground truncate">{h.address}</div>
                            )}
                          </div>
                          {isSel && <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* 2-qidiruv — to'g'ridan-to'g'ri Google API (ro'yxatda yo'q hotel uchun) */}
                <div className="pt-2 border-t">
                  <div className="text-[11px] text-muted-foreground mb-1.5">
                    {t('liveSearchLabel')}
                  </div>
                  <SearchSelect
                    placeholder={t('liveSearchPlaceholder')}
                    fetchOptions={(q) =>
                      searchApi.hotels(q, country?.code, hotelSearchCity, { direct: true })
                    }
                    getKey={(h) => h.placeId || h.osmId || h.name}
                    getLabel={(h) => h.name}
                    renderOption={(h) => (
                      <div>
                        <div className="text-sm font-medium">{h.name}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {h.address}
                        </div>
                      </div>
                    )}
                    selected={hotel}
                    onSelect={setHotel}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUseManual(true);
                    setHotel(null);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  {t('notListed')} →
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="hname">Hotel nomi</Label>
                  <Input
                    id="hname"
                    placeholder="Hotel Tashkent"
                    value={hotelManual.name}
                    onChange={(e) =>
                      setHotelManual({ ...hotelManual, name: e.target.value })
                    }
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="haddr">Manzil</Label>
                  <Input
                    id="haddr"
                    placeholder="Amir Temur ko'chasi 1"
                    value={hotelManual.address}
                    onChange={(e) =>
                      setHotelManual({ ...hotelManual, address: e.target.value })
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setUseManual(false)}
                  className="text-xs text-primary hover:underline"
                >
                  ← Ro'yxatdan tanlash
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-between gap-3 mt-7">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || loading}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Button>

          {step < 3 ? (
            <Button className="rounded-full" onClick={() => setStep(step + 1)} disabled={!canProceed}>
              {t('next')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="rounded-full" onClick={handleSubmit} disabled={!canProceed || loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {t('finish')}
            </Button>
          )}
        </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
