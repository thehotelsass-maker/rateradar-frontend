/**
 * Ommaviy huquqiy / kompaniya sahifalari uchun kontent (uz / ru / en).
 *
 * To'lovlar bo'yicha ma'lumot ATMOS to'lov shlyuzi hujjatlariga asoslangan
 * (apigw.atmos.uz — UzCard, Humo, Visa, Mastercard).
 * Har bir sahifa `useLang` orqali joriy tilni tanlaydi.
 */

export const CONTACT = {
  email: 'info@thehotelsaas.com',
  telegram: '@rateradar_support',
  telegramUrl: 'https://t.me/rateradar_support',
  brand: 'TheHotelSaaS',
};

const uz = {
  about: {
    title: 'Biz haqimizda',
    intro:
      "TheHotelSaaS (RateRadar) — mehmonxonalar uchun narx va reyting monitoringi platformasi. Biz O'zbekiston va mintaqadagi mehmonxonalarga raqobatchilar narxlarini kuzatish, OTA kanallaridagi ma'lumotlarni bir joyda ko'rish va sun'iy intellekt yordamida daromadni oshirishga yordam beramiz.",
    sections: [
      {
        h: 'Bizning vazifamiz',
        p: "Mehmonxona egalari va revenue-menejerlarga aniq, real vaqtdagi ma'lumot berish orqali to'g'ri narx qarorlarini qabul qilishga ko'maklashish. Booking.com, Expedia, Agoda va boshqa platformalardagi narxlarni avtomatik yig'ib, tushunarli tahlilga aylantiramiz.",
      },
      {
        h: 'Nima taklif qilamiz',
        list: [
          "Raqobatchilar narxlarini avtomatik kuzatish va taqqoslash",
          "OTA kanallari va reytinglarni yagona panelda birlashtirish",
          "AI asosidagi narx tavsiyalari va daromad tahlili",
          "Mehmonlar uchun QR orqali xizmat buyurtma tizimi",
        ],
      },
      {
        h: 'To\'lovlar',
        p: "Platformadagi to'lovlar ATMOS to'lov shlyuzi orqali xavfsiz amalga oshiriladi. UzCard, Humo, Visa va Mastercard kartalari qo'llab-quvvatlanadi.",
      },
    ],
  },
  contact: {
    title: "Bog'lanish",
    intro:
      "Savollaringiz, takliflaringiz yoki texnik yordam kerak bo'lsa — biz bilan bog'laning. Odatda ish kunlari 24 soat ichida javob beramiz.",
    sections: [],
  },
  terms: {
    title: 'Foydalanish shartlari',
    updated: "Oxirgi yangilanish: 2026-yil 1-iyul",
    intro:
      "Ushbu shartlar TheHotelSaaS (RateRadar) platformasidan foydalanishni tartibga soladi. Xizmatdan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz.",
    sections: [
      {
        h: '1. Xizmat tavsifi',
        p: "TheHotelSaaS mehmonxonalar uchun narx monitoringi, reyting tahlili va daromad boshqaruvi vositalarini taqdim etadi. Biz uchinchi tomon platformalaridan (OTA) ochiq ma'lumotlarni yig'amiz va tahlil qilamiz.",
      },
      {
        h: '2. Akkaunt va foydalanish',
        p: "Ro'yxatdan o'tishda to'g'ri ma'lumot berishingiz kerak. Akkaunt xavfsizligi va parol maxfiyligi uchun siz javobgarsiz. Xizmatdan qonunga zid maqsadlarda foydalanish taqiqlanadi.",
      },
      {
        h: '3. To\'lov va obuna',
        p: "Pullik rejalar obuna asosida ishlaydi. To'lovlar ATMOS to'lov shlyuzi orqali UzCard, Humo, Visa va Mastercard kartalari bilan amalga oshiriladi. Barcha to'lovlar xavfsiz shifrlangan ulanish orqali qayta ishlanadi; biz karta ma'lumotlarini saqlamaymiz.",
      },
      {
        h: '4. Bekor qilish va qaytarish',
        p: "Obunani istalgan vaqtda bekor qilishingiz mumkin — bu joriy hisob-kitob davri oxirigacha amal qiladi. Qaytarish masalalari bo'yicha info@thehotelsaas.com manziliga murojaat qiling.",
      },
      {
        h: '5. Javobgarlikni cheklash',
        p: "Xizmat \"borligicha\" (as is) taqdim etiladi. Biz uchinchi tomon ma'lumotlarining to'liq aniqligini kafolatlamaymiz va ulardan foydalanish natijasida kelib chiqadigan bilvosita zararlar uchun javobgar emasmiz.",
      },
      {
        h: '6. Shartlarga o\'zgartirish',
        p: "Biz ushbu shartlarni vaqti-vaqti bilan yangilashimiz mumkin. Muhim o'zgarishlar haqida platformada yoki email orqali xabar beramiz.",
      },
    ],
  },
  privacy: {
    title: 'Maxfiylik siyosati',
    updated: "Oxirgi yangilanish: 2026-yil 1-iyul",
    intro:
      "Ushbu siyosat biz qanday ma'lumotlarni yig'ishimiz, ulardan qanday foydalanishimiz va ularni qanday himoya qilishimizni tushuntiradi.",
    sections: [
      {
        h: '1. Yig\'iladigan ma\'lumotlar',
        list: [
          "Akkaunt ma'lumotlari: ism, email, mehmonxona nomi va joylashuvi",
          "Foydalanish ma'lumotlari: platformadagi harakatlar va sozlamalar",
          "To'lov ma'lumotlari: to'lovlar ATMOS orqali amalga oshiriladi, biz karta raqamlarini saqlamaymiz",
        ],
      },
      {
        h: "2. Ma'lumotlardan foydalanish",
        p: "Yig'ilgan ma'lumotlardan xizmatni taqdim etish, yaxshilash, texnik yordam ko'rsatish va sizni muhim yangilanishlar haqida ogohlantirish uchun foydalanamiz.",
      },
      {
        h: '3. To\'lov ma\'lumotlari xavfsizligi',
        p: "Barcha to'lovlar ATMOS to'lov shlyuzi (apigw.atmos.uz) orqali qayta ishlanadi. Karta ma'lumotlari to'g'ridan-to'g'ri ATMOS xavfsiz muhitida shifrlanadi — biz to'liq karta raqami yoki CVV kabi maxfiy ma'lumotlarni saqlamaymiz va ko'rmaymiz.",
      },
      {
        h: "4. Ma'lumotlarni uchinchi tomonlarga berish",
        p: "Biz sizning shaxsiy ma'lumotlaringizni sotmaymiz. Ma'lumotlar faqat xizmatni ta'minlash uchun zarur bo'lgan hollarda (masalan, to'lov shlyuzi) yoki qonun talab qilganda ulashiladi.",
      },
      {
        h: "5. Ma'lumotlar xavfsizligi",
        p: "Ma'lumotlaringizni himoya qilish uchun shifrlash, kirishni cheklash va monitoring kabi zamonaviy xavfsizlik choralaridan foydalanamiz.",
      },
      {
        h: '6. Sizning huquqlaringiz',
        p: "Siz o'z ma'lumotlaringizga kirish, ularni tuzatish yoki o'chirishni so'rash huquqiga egasiz. Buning uchun info@thehotelsaas.com manziliga murojaat qiling.",
      },
    ],
  },
  offer: {
    title: 'Ommaviy oferta (Litsenziya shartnomasi)',
    updated: "Oxirgi yangilangan sana: 02.07.2026",
    intro:
      "Ushbu hujjat Lochin ekspres plyus MChJ (keyingi o'rinlarda — «Litsenziar») tomonidan yuridik shaxslar va yakka tartibdagi tadbirkorlarga (keyingi o'rinlarda — «Litsenziat» yoki «Foydalanuvchi») thehotelsaas.com SaaS-platformasidan oddiy (noeksklyuziv) litsenziya shartlarida foydalanish huquqini berish to'g'risidagi Shartnomani tuzish bo'yicha rasmiy taklif (Ommaviy oferta) hisoblanadi. O'zbekiston Respublikasi Fuqarolik kodeksining 369-moddasiga muvofiq, ushbu oferta shartlarini to'liq va so'zsiz qabul qilish (aksept) — Foydalanuvchining Tizimda ro'yxatdan o'tishi yoki istalgan Tarif rejasi uchun to'lovni amalga oshirishi hisoblanadi.",
    sections: [
      {
        h: '1. Shartnoma predmeti',
        p: "Litsenziar Litsenziatga thehotelsaas.com dasturiy majmuasiga (AI narx tahlili moduli, sharhlar agregatori va QR-buyurtma tizimini o'z ichiga oladi) internet orqali masofaviy kirish huquqini beradi, Litsenziat esa Tariflarga muvofiq obunani o'z vaqtida to'lash majburiyatini oladi.",
      },
      {
        h: "2. To'lov va obuna shartlari",
        list: [
          "2.1. Kirish tanlangan davr (oy/yil) uchun 100% oldindan to'lov (prepayment) asosida taqdim etiladi.",
          "2.2. Shaxsiy kabinetda bank kartasi ulanganida avtomatik uzaytirish (Auto-Renewal) funksiyasi yoqiladi. Litsenziat uni istalgan vaqtda o'chirishi mumkin.",
          "2.3. Obuna uchun to'langan mablag'lar qaytarilmaydi, chunki dasturiy ta'minotga kirish huquqi tranzaksiyadan so'ng darhol to'liq taqdim etilgan hisoblanadi.",
        ],
      },
      {
        h: "3. Mas'uliyatni cheklash (Disclaimer — Muhim!)",
        list: [
          "3.1. Dasturiy ta'minot «Qanday bo'lsa, shunday» («As Is») tamoyili asosida taqdim etiladi. Litsenziar Tizim Foydalanuvchining barcha kutganlariga to'liq mos kelishiga kafolat bermaydi.",
          "3.2. AI narx tavsiyalari: sun'iy intellektning narxlarni o'zgartirish bo'yicha barcha tahliliy ma'lumotlari va tavsiyalari faqat axborot tavsifiga ega. Litsenziar ushbu narxlarni qo'llash natijasida mehmonxona ko'rgan boy berilgan daromad, zarar yoki moliyaviy natijalar uchun javobgar emas.",
          "3.3. AI tarjimalari va javoblari: QR-tizim orqali mehmonlar xabarlarini avtomatik tarjima qilish va sharhlarga javob generatsiyasi AI algoritmlari tomonidan bajariladi. Litsenziar tarjimadagi mazmuniy, kontekstual yoki grammatik xatolar hamda shu sabab mehmonxona va uning mehmonlari o'rtasida yuzaga kelishi mumkin bo'lgan nizolar uchun javobgar emas.",
          "3.4. Overbuking va tashqi kanallar: Litsenziar tashqi kanallar (Booking.com, Expedia va b.) tomonidagi ma'lumot uzatishdagi kechikishlar (API kechikishi) va ular natijasida yuzaga kelgan overbuking (ikki marta bron) uchun javobgar emas.",
        ],
      },
      {
        h: "4. Bloklash va ma'lumotlarni o'chirish",
        list: [
          "4.1. Obunaning keyingi davri to'lanmagan taqdirda Tizimga kirish to'xtatiladi.",
          "4.2. Litsenziar mehmonxona ma'lumotlar bazasini (mehmonlar ma'lumotlari, buyurtmalar tarixi) to'langan davr tugagan paytdan boshlab 30 kalendar kun davomida saqlash majburiyatini oladi. Ushbu muddat o'tgach, obuna uzaytirilmasa, Litsenziar barcha ma'lumotlarni serverlardan qaytarib bo'lmaydigan tarzda o'chirish huquqiga ega.",
        ],
      },
      {
        h: '5. Litsenziar rekvizitlari',
        list: [
          "Nomi: Lochin ekspres plyus MChJ",
          "Manzil: Buxoro shahri, Islom Karimov ko'chasi, 21-uy",
          "Email: info@thehotelsaas.com",
        ],
      },
    ],
  },
};

const ru = {
  about: {
    title: 'О нас',
    intro:
      'TheHotelSaaS (RateRadar) — платформа мониторинга цен и рейтингов для отелей. Мы помогаем отелям в Узбекистане и регионе отслеживать цены конкурентов, видеть данные OTA-каналов в одном месте и увеличивать доход с помощью искусственного интеллекта.',
    sections: [
      {
        h: 'Наша миссия',
        p: 'Предоставлять владельцам отелей и revenue-менеджерам точные данные в реальном времени, чтобы принимать правильные ценовые решения. Мы автоматически собираем цены с Booking.com, Expedia, Agoda и других платформ и превращаем их в понятную аналитику.',
      },
      {
        h: 'Что мы предлагаем',
        list: [
          'Автоматический мониторинг и сравнение цен конкурентов',
          'Объединение OTA-каналов и рейтингов в единой панели',
          'Ценовые рекомендации и анализ дохода на базе AI',
          'Система заказа услуг для гостей через QR-код',
        ],
      },
      {
        h: 'Платежи',
        p: 'Платежи на платформе безопасно обрабатываются через платёжный шлюз ATMOS. Поддерживаются карты UzCard, Humo, Visa и Mastercard.',
      },
    ],
  },
  contact: {
    title: 'Связаться с нами',
    intro:
      'Если у вас есть вопросы, предложения или нужна техническая поддержка — свяжитесь с нами. Обычно мы отвечаем в течение 24 часов в рабочие дни.',
    sections: [],
  },
  terms: {
    title: 'Условия использования',
    updated: 'Последнее обновление: 1 июля 2026 г.',
    intro:
      'Настоящие условия регулируют использование платформы TheHotelSaaS (RateRadar). Используя сервис, вы соглашаетесь с этими условиями.',
    sections: [
      {
        h: '1. Описание сервиса',
        p: 'TheHotelSaaS предоставляет инструменты мониторинга цен, анализа рейтингов и управления доходом для отелей. Мы собираем и анализируем открытые данные со сторонних платформ (OTA).',
      },
      {
        h: '2. Аккаунт и использование',
        p: 'При регистрации вы обязаны предоставлять достоверную информацию. Вы несёте ответственность за безопасность аккаунта и конфиденциальность пароля. Запрещается использовать сервис в противозаконных целях.',
      },
      {
        h: '3. Оплата и подписка',
        p: 'Платные тарифы работают на основе подписки. Платежи осуществляются через платёжный шлюз ATMOS картами UzCard, Humo, Visa и Mastercard. Все платежи обрабатываются по защищённому шифрованному соединению; мы не храним данные карт.',
      },
      {
        h: '4. Отмена и возврат',
        p: 'Вы можете отменить подписку в любое время — она действует до конца текущего расчётного периода. По вопросам возврата обращайтесь на info@thehotelsaas.com.',
      },
      {
        h: '5. Ограничение ответственности',
        p: 'Сервис предоставляется «как есть» (as is). Мы не гарантируем полную точность сторонних данных и не несём ответственности за косвенный ущерб, возникший в результате их использования.',
      },
      {
        h: '6. Изменение условий',
        p: 'Мы можем периодически обновлять эти условия. О существенных изменениях мы уведомим на платформе или по электронной почте.',
      },
    ],
  },
  privacy: {
    title: 'Политика конфиденциальности',
    updated: 'Последнее обновление: 1 июля 2026 г.',
    intro:
      'Эта политика объясняет, какие данные мы собираем, как их используем и как защищаем.',
    sections: [
      {
        h: '1. Собираемые данные',
        list: [
          'Данные аккаунта: имя, email, название и расположение отеля',
          'Данные использования: действия и настройки на платформе',
          'Платёжные данные: платежи проходят через ATMOS, мы не храним номера карт',
        ],
      },
      {
        h: '2. Использование данных',
        p: 'Мы используем собранные данные для предоставления и улучшения сервиса, технической поддержки и уведомления вас о важных обновлениях.',
      },
      {
        h: '3. Безопасность платёжных данных',
        p: 'Все платежи обрабатываются через платёжный шлюз ATMOS (apigw.atmos.uz). Данные карты шифруются непосредственно в защищённой среде ATMOS — мы не храним и не видим полный номер карты или CVV.',
      },
      {
        h: '4. Передача данных третьим лицам',
        p: 'Мы не продаём ваши персональные данные. Данные передаются только когда это необходимо для работы сервиса (например, платёжному шлюзу) или по требованию закона.',
      },
      {
        h: '5. Безопасность данных',
        p: 'Для защиты ваших данных мы применяем современные меры безопасности: шифрование, ограничение доступа и мониторинг.',
      },
      {
        h: '6. Ваши права',
        p: 'Вы имеете право на доступ, исправление или удаление ваших данных. Для этого обращайтесь на info@thehotelsaas.com.',
      },
    ],
  },
  offer: {
    title: 'Публичная оферта (Лицензионный договор)',
    updated: 'Последнее обновление: 02.07.2026',
    intro:
      'Настоящий документ представляет собой официальное предложение (Публичную оферту) компании Lochin ekspres plyus MChJ (далее — «Лицензиар») для юридических лиц и индивидуальных предпринимателей (далее — «Лицензиат» или «Пользователь») заключить Договор о предоставлении права использования SaaS-платформы thehotelsaas.com на условиях простой (неисключительной) лицензии. В соответствии со ст. 369 Гражданского кодекса Республики Узбекистан, полным и безоговорочным принятием (акцептом) условий настоящей оферты является регистрация Пользователя в Системе или осуществление оплаты за любой Тарифный план.',
    sections: [
      {
        h: '1. Предмет соглашения',
        p: 'Лицензиар предоставляет Лицензиату удалённый доступ к программному комплексу thehotelsaas.com (включая AI-модуль анализа цен, агрегатор отзывов и систему QR-заказов) через интернет, а Лицензиат обязуется своевременно оплачивать подписку согласно Тарифам.',
      },
      {
        h: '2. Условия оплаты и подписки',
        list: [
          '2.1. Доступ предоставляется на условиях 100% предоплаты за выбранный период (месяц/год).',
          '2.2. При привязке банковской карты в Личном кабинете включается функция автоматического продления (Auto-renewal). Лицензиат может отключить её в любой момент.',
          '2.3. Оплаченные за подписку денежные средства возврату не подлежат, так как доступ к программному обеспечению считается предоставленным в полном объёме сразу после транзакции.',
        ],
      },
      {
        h: '3. Ограничение ответственности (Disclaimer — Важно!)',
        list: [
          '3.1. Программное обеспечение предоставляется по принципу «Как есть» («As Is»). Лицензиар не гарантирует, что Система будет полностью соответствовать ожиданиям Пользователя.',
          '3.2. AI-рекомендации по ценам: все аналитические данные и рекомендации ИИ по изменению цен носят исключительно информационный характер. Лицензиар не несёт ответственности за любые упущенные доходы, убытки или финансовые результаты, полученные отелем в ходе применения этих цен.',
          '3.3. AI-переводы и ответы: автоматический перевод сообщений гостей через QR-систему и генерация ответов на отзывы выполняются алгоритмами ИИ. Лицензиар не отвечает за возможные смысловые, контекстные или грамматические ошибки в переводах и потенциальные споры между отелем и его гостями из-за этих ошибок.',
          '3.4. Овербукинг и внешние каналы: Лицензиар не несёт ответственности за задержки в передаче данных (API) со стороны внешних каналов (Booking.com, Expedia и др.) и возникшие вследствие этого овербукинги (двойные бронирования).',
        ],
      },
      {
        h: '4. Блокировка и удаление данных',
        list: [
          '4.1. В случае неоплаты следующего периода подписки доступ к Системе приостанавливается.',
          '4.2. Лицензиар обязуется хранить базу данных отеля (данные гостей, историю заказов) в течение 30 календарных дней с момента окончания оплаченного периода. По истечении этого срока, если подписка не продлена, Лицензиар имеет право безвозвратно удалить все данные с серверов.',
        ],
      },
      {
        h: '5. Реквизиты Лицензиара',
        list: [
          'Наименование: Lochin ekspres plyus MChJ',
          'Адрес: г. Бухара, ул. Ислама Каримова, дом 21',
          'Email: info@thehotelsaas.com',
        ],
      },
    ],
  },
};

const en = {
  about: {
    title: 'About Us',
    intro:
      'TheHotelSaaS (RateRadar) is a price and rating intelligence platform for hotels. We help hotels in Uzbekistan and the region track competitor prices, see OTA channel data in one place, and grow revenue with the help of artificial intelligence.',
    sections: [
      {
        h: 'Our mission',
        p: 'To give hotel owners and revenue managers accurate, real-time data so they can make the right pricing decisions. We automatically collect prices from Booking.com, Expedia, Agoda and other platforms and turn them into clear analytics.',
      },
      {
        h: 'What we offer',
        list: [
          'Automatic monitoring and comparison of competitor prices',
          'OTA channels and ratings unified in a single dashboard',
          'AI-powered pricing recommendations and revenue analysis',
          'QR-based service ordering system for guests',
        ],
      },
      {
        h: 'Payments',
        p: 'Payments on the platform are processed securely through the ATMOS payment gateway. UzCard, Humo, Visa and Mastercard are supported.',
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    intro:
      'If you have questions, suggestions, or need technical support — get in touch. We usually respond within 24 hours on business days.',
    sections: [],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'Last updated: July 1, 2026',
    intro:
      'These terms govern your use of the TheHotelSaaS (RateRadar) platform. By using the service you agree to these terms.',
    sections: [
      {
        h: '1. Service description',
        p: 'TheHotelSaaS provides price monitoring, rating analysis and revenue management tools for hotels. We collect and analyze publicly available data from third-party platforms (OTAs).',
      },
      {
        h: '2. Account and use',
        p: 'You must provide accurate information when registering. You are responsible for account security and password confidentiality. Using the service for unlawful purposes is prohibited.',
      },
      {
        h: '3. Payment and subscription',
        p: 'Paid plans work on a subscription basis. Payments are made through the ATMOS payment gateway using UzCard, Humo, Visa and Mastercard. All payments are processed over a secure encrypted connection; we do not store card details.',
      },
      {
        h: '4. Cancellation and refunds',
        p: 'You can cancel your subscription at any time — it remains active until the end of the current billing period. For refund matters, contact info@thehotelsaas.com.',
      },
      {
        h: '5. Limitation of liability',
        p: 'The service is provided "as is". We do not guarantee the full accuracy of third-party data and are not liable for indirect damages arising from its use.',
      },
      {
        h: '6. Changes to terms',
        p: 'We may update these terms from time to time. We will notify you of material changes on the platform or by email.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: July 1, 2026',
    intro:
      'This policy explains what data we collect, how we use it, and how we protect it.',
    sections: [
      {
        h: '1. Data we collect',
        list: [
          'Account data: name, email, hotel name and location',
          'Usage data: actions and settings on the platform',
          'Payment data: payments go through ATMOS; we do not store card numbers',
        ],
      },
      {
        h: '2. How we use data',
        p: 'We use collected data to provide and improve the service, offer technical support, and notify you about important updates.',
      },
      {
        h: '3. Payment data security',
        p: 'All payments are processed through the ATMOS payment gateway (apigw.atmos.uz). Card data is encrypted directly within the secure ATMOS environment — we do not store or see the full card number or CVV.',
      },
      {
        h: '4. Sharing with third parties',
        p: 'We do not sell your personal data. Data is shared only when necessary to provide the service (e.g. the payment gateway) or when required by law.',
      },
      {
        h: '5. Data security',
        p: 'We use modern security measures — encryption, access control and monitoring — to protect your data.',
      },
      {
        h: '6. Your rights',
        p: 'You have the right to access, correct or request deletion of your data. To do so, contact info@thehotelsaas.com.',
      },
    ],
  },
  offer: {
    title: 'Public Offer (License Agreement)',
    updated: 'Last updated: 02.07.2026',
    intro:
      'This document is an official offer (Public Offer) by Lochin ekspres plyus MChJ (hereinafter — the "Licensor") to legal entities and sole proprietors (hereinafter — the "Licensee" or "User") to conclude an Agreement granting the right to use the SaaS platform thehotelsaas.com under a simple (non-exclusive) license. Under Article 369 of the Civil Code of the Republic of Uzbekistan, full and unconditional acceptance of these offer terms is the User\'s registration in the System or payment for any Pricing plan.',
    sections: [
      {
        h: '1. Subject of the agreement',
        p: 'The Licensor grants the Licensee remote access, via the internet, to the thehotelsaas.com software suite (including the AI price analysis module, review aggregator and QR-order system), and the Licensee undertakes to pay the subscription on time according to the Tariffs.',
      },
      {
        h: '2. Payment and subscription terms',
        list: [
          '2.1. Access is granted on a 100% prepayment basis for the selected period (month/year).',
          '2.2. When a bank card is linked in the account, the automatic renewal (Auto-renewal) function is enabled. The Licensee may disable it at any time.',
          '2.3. Funds paid for a subscription are non-refundable, as access to the software is deemed fully provided immediately after the transaction.',
        ],
      },
      {
        h: '3. Limitation of liability (Disclaimer — Important!)',
        list: [
          '3.1. The software is provided "as is". The Licensor does not guarantee that the System will fully meet the User\'s expectations.',
          '3.2. AI price recommendations: all AI analytics and price-change recommendations are for informational purposes only. The Licensor is not liable for any lost income, losses or financial results incurred by the hotel from applying these prices.',
          '3.3. AI translations and replies: automatic translation of guest messages via the QR system and generation of review replies are performed by AI algorithms. The Licensor is not liable for possible semantic, contextual or grammatical errors in translations, nor for potential disputes between the hotel and its guests arising from such errors.',
          '3.4. Overbooking and external channels: the Licensor is not liable for delays in data transfer (API) from external channels (Booking.com, Expedia, etc.) and any resulting overbookings (double bookings).',
        ],
      },
      {
        h: '4. Suspension and deletion of data',
        list: [
          '4.1. If the next subscription period is not paid, access to the System is suspended.',
          '4.2. The Licensor undertakes to store the hotel database (guest data, order history) for 30 calendar days from the end of the paid period. After this period, if the subscription is not renewed, the Licensor has the right to permanently delete all data from the servers.',
        ],
      },
      {
        h: '5. Licensor requisites',
        list: [
          'Name: Lochin ekspres plyus MChJ',
          'Address: Bukhara city, Islom Karimov street, house 21',
          'Email: info@thehotelsaas.com',
        ],
      },
    ],
  },
};

const content = { uz, ru, en };

export function getLegalContent(lang, page) {
  const l = content[lang] || content.en;
  return l[page] || content.en[page];
}
