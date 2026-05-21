# OnlyStát — Design Book

Živá reference pro redesign. Reflektuje aktuální implementaci (home screen jako vzor).  
Při práci na každém dalším screenu: otevři tenhle soubor, nekopíruj hodnoty z hlavy.

---

## 1 · Tón a hlas

**Sentence case s tečkou na headlinech.**  
"Dobré ráno, Avatare." "Tvůj daňový rok." "Životní situace."

**Tykání.** "Tvoje stěhování", "Letos jsi přispěl", "Čeká tě".

**Konkrétno místo abstrakce.** Ne "12 571 Kč na školství" — ale "12 obědů ve školní jídelně, průměrný oběd 30 Kč".

**CTA vždy se šipkou:** "Zobrazit detail →", "Kam přesně to teče →", "Otevřít průvodce →", "Více příkladů →"

---

## 2 · Design tokens (`css/variables.css`)

### Nový design systém (používej pro nové screeny)

```css
/* Brand */
--c-cyan:        #0AA4BC;   /* primární brand, badge, grafy */
--c-cyan-light:  #7DD3E5;   /* eyebrow na dark kartách, badge text */
--c-cyan-pale:   #F0FAFC;   /* impact row pozadí, chip pozadí */
--c-cyan-ghost:  #E0F7FB;   /* (rezerva, nepoužito) */
--c-navy:        #0E2A47;   /* primární text, dark karty, aktivní nav */
--c-navy-light:  #1F4E7A;   /* (rezerva) */

/* Tab identity — hero a pulled-up karty */
--c-teal-hero:   #0891B2;   /* Home hero */
--c-teal-dark:   #0F766E;   /* Projekty hero */
--c-green-hero:  #047857;   /* Situace hero */
--c-sky:         #60A5FA;   /* Projekty pulled-up karta */
--c-amber:       #FBBF24;   /* Situace pulled-up karta */

/* Akcenty */
--c-yellow-warm: #F5A623;   /* warning, situace border, situace eyebrow */
/* pozn: žlutá dekorativní orb = #FFD43B (hardcoded, není token) */
--c-mint:        #10B981;   /* success (zatím nepoužito) */
/* pozn: urgentní červená = #E14D2A (hardcoded v home.css jako .list-dot--urgent) */

/* Povrchy */
--c-bg-soft:     #F5F8FA;   /* list-card pozadí */
--c-bg-tint:     #F0FAFC;   /* (totéž jako cyan-pale, alias) */
--c-bg-warm:     #FFF7E0;   /* aktivní situace karta */

/* Text */
--c-text-soft:   #8A99AB;   /* next-step-label, tertiary */
--c-text-light:  #B8D4E5;   /* text na dark navy kartách (meta-light) */
--c-text-on-cyan: #FFFFFF;

/* Borders */
--c-border-soft:   rgba(14,42,71,0.06);
--c-border-strong: rgba(14,42,71,0.15);

/* Radii */
--r-pill:        999px;
--r-card-lg:     18px;   /* contribution card */
--r-card:        16px;   /* běžné karty */
--r-card-sm:     14px;   /* impact row */
--r-icon:        10px;   /* icon square */
--r-hero-bottom: 32px;   /* zaoblení spodku hero */

/* Spacing */
--s-screen-x:  18px;   /* horizontální padding screenu */
--s-section:   22px;   /* gap mezi sekcemi v home-body */
--s-card:      14px;   /* padding uvnitř karet (nepoužito explicitně, orientační) */
```

### Starý systém (stále aktivní pro ostatní screeny — nemazat)

```css
--c-primary: #094672;   --c-bg-card: #ebf2f9;
--c-accent:  #1e7a87;   --c-divider: #e8eef4;
--c-text:    #0d1b2a;   --c-text-sub: #7a8fa6;
```

---

## 3 · Typografie

| Element | Size | Weight | Letter-spacing | Token / třída |
|---|---|---|---|---|
| Hero greeting | 32px | 700 | -0.03em | `.hero-greeting` |
| Hero subtitle | 13px | 400 | — | `.hero-subtitle` (opacity 0.92) |
| Card title (dark) | 17px | 700 | -0.02em | `.card-title-light` |
| Hero number big | 32px | 700 | -0.03em | `.hero-number-big` |
| Hero number unit | 16px | 700 | — | `.hero-number-unit` |
| Section title (H2) | 18px | 700 | -0.02em | `.section-title` |
| Section header title | 14px | 700 | — | `.section-header-title` |
| Card/situation title | 16px | 700 | -0.015em | `.active-situation-title`, `.local-card-title` |
| Impact title | 13px | 700 | — | `.impact-title` |
| Body / row title | 13px | 700 | — | `.list-row-title` |
| Meta / popis | 11–12px | 400 | — | `.impact-desc`, `.list-row-meta`, `.next-step-meta` |
| Eyebrow (uppercase) | 11px | 700 | 1.2px | `.eyebrow`, `.active-situation-eyebrow` |
| Badge / chip | 11–12px | 700 | — | `.badge-soft`, `.chip-pill` |
| CTA pill | 12px | 700 | — | `.btn-pill` |
| Link / btn-link | 12px | 700 | — | `.btn-link`, `.section-header-link` |

**Pravidla:**
- Headliny vždy `font-weight: 700` + negative letter-spacing.
- Žádný `font-weight: 600` (výjimka: hero-top-name je 600, legacy).
- Čísla s `font-feature-settings: 'tnum'` (hero-number, badge-soft, impact-amount, list-row-date).
- Žádný font-size pod 11px.

---

## 4 · Layoutové patterny

### 4.1 · Hero

```html
<div class="hero">
  <div class="orb orb--lg"></div>
  <div class="orb orb--yellow"></div>
  <div class="hero-top-bar">
    <div class="hero-top-left">
      <div class="hero-avatar">A</div>
      <span class="hero-top-name">Jan Občan</span>
    </div>
    <button class="hero-search-btn" aria-label="Hledat"><!-- SVG --></button>
  </div>
  <h1 class="hero-greeting">Dobré ráno,<br>Avatare.</h1>
  <p class="hero-subtitle">Středa 21. května · v Ostravě 14 °C, polojasno.</p>
</div>
```

Klíčové hodnoty: `background: var(--c-teal-hero)`, `padding: 16px 22px 60px`, `border-radius: 0 0 var(--r-hero-bottom) var(--r-hero-bottom)`.

#### Hero barevné varianty (tab identity)

Každý hlavní tab má vlastní barvu hero — vizuální identita sekce. Přidáváš modifier třídu vedle `.hero`.

| Tab | Třída | Pozadí | Orb--lg |
|-----|-------|--------|---------|
| Home | `.hero` (default) | `var(--c-teal-hero)` | `var(--c-navy)` opacity 0.14 |
| Daně | `.hero.hero--navy` | `var(--c-navy)` | `var(--c-teal-hero)` |
| Projekty | `.hero.hero--teal-dark` | `var(--c-teal-dark)` | `rgba(255,255,255,0.1)` |
| Situace | `.hero.hero--green` | `var(--c-green-hero)` | `rgba(255,255,255,0.1)` |
| Profil | `.hero.hero--amber` | `var(--c-amber)` | `var(--c-navy)` opacity 0.1 |

### 4.2 · Pulled-up karta

Karta s `margin: -36px var(--s-screen-x) 0` se vyšplhá přes zaoblený spodek hera. **Klíčový vizuální tah.**

```html
<div class="card-pulled">
  <div class="contribution-card">...</div>
</div>
```

#### Barva pulled-up karty (per-tab)

Každá sekce má kontrastní kartu k hero. Použij color-modifier + `card--light` pro světlé karty.

| Tab | Hero | Karta | Třídy |
|-----|------|-------|-------|
| Home | teal `#0891B2` | navy | `.contribution-card` (default, bílý text) |
| Daně | navy `#0E2A47` | teal `#0891B2` | `.contribution-card.contribution-card--teal` (bílý text, bez card--light) |
| Projekty | teal-dark `#0F766E` | sky `#60A5FA` | `.proj-summary-card.card--light` |
| Situace | green `#047857` | amber `#FBBF24` | `.contribution-card.contribution-card--amber.card--light` |
| Profil | amber `#FBBF24` | green `#047857` | `.contribution-card.contribution-card--green` (bílý text, bez card--light) |

#### Utility třída `card--light`

Přepisuje bílý/cyan text na tmavý navy — nutné na všech světlých kartách (sky, amber).  
Definice v `css/home.css`, použitelná na libovolné komponentě.

```html
<!-- světlá karta s tmavým textem -->
<div class="contribution-card contribution-card--sky card--light">
  <div class="eyebrow eyebrow--light">...</div>   <!-- → rgba(14,42,71,0.65) -->
  <div class="card-title-light">...</div>          <!-- → var(--c-navy) -->
  <div class="hero-number-big">...</div>           <!-- → var(--c-navy) -->
  <div class="meta-light">...</div>                <!-- → rgba(14,42,71,0.55) -->
  <div class="badge-soft">...</div>                <!-- → rgba(14,42,71,0.1) bg -->
</div>
```

### 4.3 · Home body

```html
<div class="home-body">
  <!-- sekce 3–7, gap: var(--s-section) = 22px -->
</div>
```

### 4.4 · Sekce s titulkem

```html
<!-- Standardní sekce -->
<section>
  <h2 class="section-title">Tvoje peníze tento týden.</h2>
  <p class="section-sub">Konkrétně z těch 4 029 Kč v květnu.</p>
  <div class="section-body"><!-- obsah --></div>
</section>

<!-- Sekce s inline linkem (chips) -->
<section>
  <div class="section-header">
    <span class="section-header-title">Co dalšího potřebuješ zařídit?</span>
    <button class="section-header-link" onclick="switchTab('screen-situace')">Všechny situace →</button>
  </div>
  <!-- obsah přímo pod, bez section-body -->
</section>
```

---

## 5 · Komponenty

### 5.1 · Contribution card

**Dark varianta (Home — default):**

```html
<div class="contribution-card" onclick="navigateTo('screen-dane','forward')">
  <div class="orb-deco"></div>
  <div class="row-spread">
    <div>
      <div class="eyebrow eyebrow--light">Tvůj daňový rok</div>
      <div class="card-title-light">Příspěvek 2026.</div>
    </div>
    <div class="badge-soft">+4 029 Kč v květnu</div>
  </div>
  <div class="hero-number">
    <div class="hero-number-big">23 840</div>
    <div class="hero-number-unit">Kč zaplaceno</div>
  </div>
  <div class="meta-light">z 48 350 Kč ročního příspěvku · 49 %</div>
  <div class="contribution-progress">
    <div class="contribution-progress-fill" style="width:49%"></div>
  </div>
  <button class="btn-pill btn-pill--white">Kam přesně to teče →</button>
</div>
```

`badge-soft` na dark kartě: bg `rgba(125,211,229,0.2)`, text `var(--c-cyan-light)`.  
`orb-deco`: pozice `bottom: -30px; right: -30px`, `opacity: 0.18`.

**Světlá varianta (Daně / Situace) — přidej color-modifier + `card--light`:**

```html
<div class="contribution-card contribution-card--sky card--light">
  <!-- stejná struktura, card--light přepíše barvy textu na navy -->
</div>
```

Dostupné color-modifiery: `.contribution-card--sky` · `.contribution-card--amber`

### 5.2 · Aktivní situace karta

```html
<div class="active-situation">
  <div class="active-situation-header">
    <div class="active-situation-icon">🚛</div>   <!-- emoji nebo Tabler icon -->
    <div class="active-situation-header-text">
      <div class="active-situation-eyebrow">Probíhá · 3 ze 6</div>
      <div class="active-situation-title">Tvoje stěhování.</div>
    </div>
  </div>
  <div class="next-step">
    <div class="next-step-label">Další krok · zítra</div>
    <div class="next-step-title">Přepis na nové trvalé bydliště</div>
    <div class="next-step-meta">Úřad Ostrava-Poruba, 8:00–12:00 · OP, doklad k bydlení, 50 Kč</div>
  </div>
  <div class="active-situation-actions">
    <button class="btn-pill btn-pill--navy" onclick="navigateTo('screen-s12','forward')">Otevřít průvodce →</button>
    <button class="active-situation-dismiss">Odložit</button>
  </div>
</div>
```

Pozadí `var(--c-bg-warm)`, border-left `4px solid var(--c-yellow-warm)`.  
Eyebrow barva: `#8B6914` (tmavá zlatá, čitelná na warm pozadí).  
`next-step` vnitřní karta: `rgba(255,255,255,0.7)`.

### 5.3 · Impact row (týdenní dopad daní)

```html
<div class="impact-list">
  <div class="impact-row">
    <div class="impact-icon impact-icon--cyan">🏫</div>
    <div class="impact-body">
      <div class="impact-title">12 obědů ve školní jídelně</div>
      <div class="impact-desc">ZŠ Ostrava, průměrný oběd 30 Kč</div>
    </div>
    <div class="impact-amount">360 Kč</div>
  </div>
  <!-- impact-icon--navy, impact-icon--yellow pro rotaci barev -->
</div>
```

Pozadí řádku: `var(--c-cyan-pale)`, border `0.5px solid var(--c-border-soft)`.  
Icon barvy: `--cyan` = solid cyan/white · `--navy` = solid navy/white · `--yellow` = `#FFD43B`/navy.  
Amount: `var(--c-cyan)`, `font-feature-settings: 'tnum'`.

### 5.4 · List card (Čeká tě / notifikace)

```html
<div class="list-card">
  <div class="list-row">
    <div class="list-row-left">
      <span class="list-dot list-dot--urgent"></span>
      <div>
        <div class="list-row-title">Vyprší ti pas</div>
        <div class="list-row-meta">19. června · stihni žádost online</div>
      </div>
    </div>
    <span class="list-row-date list-row-date--urgent">30 dní</span>
  </div>
  <!-- list-dot--warn → žlutá / list-dot--info → cyan -->
  <!-- list-row-date--warn → žlutá / bez modifikátoru → šedá -->
</div>
```

Urgentní červená: `#E14D2A`.  
Warn oranžová: `var(--c-yellow-warm)`.  
Info/default: `var(--c-text-muted)`.

### 5.5 · Local / dark karta (Ve tvojí čtvrti)

```html
<div class="local-card" onclick="navigateTo('screen-projekty','forward')">
  <div class="local-card-deco"></div>
  <div class="local-card-eyebrow">Ve tvojí čtvrti</div>
  <div class="local-card-title">Probíhá rekonstrukce<br>ulice Hlavní třída.</div>
  <div class="local-card-meta">Z rozpočtu města 2,4 mil. Kč · plánovaný konec říjen 2026.</div>
  <div class="local-card-actions">
    <button class="btn-pill btn-pill--cyan">Zobrazit na mapě →</button>
    <span class="local-card-more">3 další projekty v okolí</span>
  </div>
</div>
```

Pozadí `var(--c-navy)`, orb `opacity: 0.18` cyan vpravo dole.  
Eyebrow: `var(--c-cyan-light)` · Title: white · Meta: `var(--c-text-light)`.

### 5.6 · Pill tlačítka

```css
.btn-pill          /* navy bg, white text — default */
.btn-pill--white   /* white bg, navy text — na dark kartách */
.btn-pill--cyan    /* cyan bg, white text */
.btn-pill--navy    /* navy bg, white text, margin-top: 0 — inline v kartě */
```

Padding: `10px 20px`, font-size: `12px`, font-weight: `700`, radius: `var(--r-pill)`.

### 5.7 · Eyebrow

```css
.eyebrow           /* tmavá varianta — na světlém pozadí */
.eyebrow--light    /* var(--c-cyan-light) — na navy kartách */
```

Vždy: `font-size: 11px`, `font-weight: 700`, `letter-spacing: 1.2px`, `text-transform: uppercase`.

### 5.8 · Situace chips

```html
<div class="chips-bar">
  <button class="chip-pill" onclick="navigateTo(...)">👶 Narození dítěte</button>
  <button class="chip-pill" onclick="navigateTo(...)">🪪 Ztráta dokladů</button>
  <button class="chip-pill" onclick="navigateTo(...)">📦 Stěhování</button>
</div>
```

Horizontální scroll (`overflow-x: auto`), `white-space: nowrap`.  
Pozadí: `var(--c-cyan-pale)`, border: `0.5px solid rgba(14,42,71,0.08)`.

### 5.9 · Dekorativní orby

Jen v hero a dark kartách. Nikde jinde.

| Třída | Pozice | Velikost | Barva | Opacity |
|---|---|---|---|---|
| `.orb--lg` | top: 20px; right: -50px | 140×140px | `var(--c-navy)` | 0.14 |
| `.orb--yellow` | top: 110px; right: 36px | 14×14px | #FFD43B | 1 |
| `.orb-deco` | bottom: -30px; right: -30px | 100×100px | `var(--c-cyan)` | 0.18 |
| `.local-card-deco` | bottom: -20px; right: -20px | 80×80px | `var(--c-cyan)` | 0.18 |

### 5.10 · Bottom nav (global.css)

Aktivní tab: navy pill `background: var(--c-navy)`, bílý text + ikona.  
Neaktivní: `color: var(--c-nav-inactive) = #b0c4d8`.  
Výška: `72px` (`--bottom-nav-height`).

---

## 6 · Detail screeny (sub-screeny)

Screeny otevírané přes `navigateTo()` — **ne** main tapy s bottom navem.

**Pravidla:**
- `class="screen"` bez `has-nav` — bottom nav se nezobrazuje
- Začínají `top-bar` (sticky, z `global.css`) s back buttonem
- **Žádný hero, žádný pull-up trik**
- Tokeny, typografie a spacing jsou stejné jako u main screenů
- Každý screen má vlastní layout — žádná povinná šablona

**Top bar pattern:**
```html
<div class="top-bar">
  <button class="top-bar-back" onclick="goBack()"><!-- SVG šipka vlevo --></button>
  <div class="top-bar-title">Název screenu</div>
  <div class="top-bar-spacer"></div>  <!-- nebo akční tlačítko napravo -->
</div>
```

**Page header (volitelný) — inline stats místo hero:**

Když screen potřebuje kontext (lokace, počty, sumy) — nezobrazuj hero, ale kompaktní textový blok pod top barem.

```html
<div class="proj-page-header">
  <div class="proj-page-eyebrow">📍 Ostrava-Poruba · 5 km</div>
  <h2 class="proj-page-title">Tvoje daně staví.</h2>
  <div class="proj-page-stats">8 projektů · 259 mil. Kč · tvůj příspěvek ~129 Kč</div>
</div>
```

| Třída | Velikost | Váha | Barva |
|-------|----------|------|-------|
| `.proj-page-eyebrow` | 11px | 700 | `var(--c-text-soft)`, uppercase, 1.2px spacing |
| `.proj-page-title` | 22px | 700 | `var(--c-text)`, -0.025em |
| `.proj-page-stats` | 12px | 700 | `var(--c-text-soft)`, tnum |

---

## 7 · Home screen — 7 modulů

| # | Modul | Třída / pattern | Personalizace |
|---|---|---|---|
| 1 | Hero | `.hero` | Jméno, datum, počasí |
| 2 | Kontribuční karta | `.card-pulled` + `.contribution-card` | Roční příspěvek, měsíční delta |
| 3 | Aktivní situace | `.active-situation` | Zobrazuje se jen pokud existuje `active_situation` v localStorage |
| 4 | Týdenní dopad | `.impact-list` + `.impact-row` | 3 konkrétní položky z daňového odvodu |
| 5 | Čeká tě | `.list-card` + `.list-row` | Osobní deadliny (pas, TP, daně) |
| 6 | Ve tvojí čtvrti | `.local-card` | Lokální projekt (fixture pro prototyp) |
| 7 | Situace chips | `.chips-bar` + `.chip-pill` | Univerzální, emoji + label |

---

## 7 · Headline knihovna

| Kde | Headline |
|---|---|
| Home greeting | "Dobré ráno, [Jméno]." |
| Home subtitle | "[Den] [Datum] · v [Město] [Teplota] °C, [počasí]." |
| Kontribuce eyebrow | "Tvůj daňový rok" |
| Kontribuce title | "Příspěvek [Rok]." |
| Aktivní situace | "Tvoje stěhování." / "Tvoje narození dítěte." |
| Situace eyebrow | "Probíhá · [X] ze [Y]" |
| Týdenní dopad | "Tvoje peníze tento týden." |
| Čeká tě | "Čeká tě." |
| Lokální | eyebrow "Ve tvojí čtvrti" (malé na dark kartě) |
| Situace chips | "Co dalšího potřebuješ zařídit?" |
| Daně screen | "Kam tečou tvoje peníze." |
| Projekty | "Tvoje daně staví." |
| Profil | "Tvůj státní profil." |

---

## 8 · Implementační pořadí screenů

1. ✅ **Home** — vzor pro vše ostatní
2. **Daně** (`css/dane.css`) — hero podobný home hero, donutový graf
3. **Situace list** (`css/situace.css`) — 2×2 grid sem patří (z home přesunut)
4. **Situace detaily** (`css/situace-detail.css`) — stěhování jako template
5. **Projekty** (`css/projekty.css`) — karty projektů
6. **Profil** (`css/profil.css`)
7. **Ostatní** (report, feedback, onboarding, ukoly)
8. **Nakonec** — přepis `css/global.css` sdílených komponent

Po každém screenu: commit + `/clear`.

---

## 9 · Pravidla (co NEDĚLAT)

1. **Žádné hardcoded hex barvy** mimo `variables.css` — vše přes `var(--c-...)`.  
   Výjimky: `#E14D2A` (urgentní červená), `#FFD43B` (žlutá orb), `#8B6914` (eyebrow na warm bg `.active-situation-eyebrow`) — zatím nemají token.
2. **Žádný `font-weight: 600`** — heading = 700, body = 500 nebo 400.
3. **Žádné drop shadows ani gradienty** — hloubka přes color contrast a border-radius.
4. **Žádné `!important`.**
5. **Žádný font-size pod 11px.**
6. **Orby jen v hero a dark kartách** — nikde jinde.
7. **Žádné inline styly** — výjimka: `style="width:X%"` na progress barech (dynamická hodnota).
8. **Multi-file struktura** — každý screen má vlastní CSS soubor.
