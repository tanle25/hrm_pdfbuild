import { ProfileData, Language } from "../types";
import { translations } from "../translations";
import defaultAssociationLogo from "../../logo-500.png";
import { 
  MapPin, 
  Calendar, 
  User, 
  Briefcase, 
  Star, 
  Settings, 
  Globe, 
  Trophy, 
  Gem, 
  ThumbsUp, 
  Clock, 
  DollarSign, 
  Headphones, 
  Users, 
  Activity, 
  TrendingUp, 
  Phone, 
  Mail, 
  Search,
  Check
} from "lucide-react";

interface Props {
  data: ProfileData;
  lang: Language;
}

export default function ProfilePreview({ data, lang }: Props) {
  // Translate UI labels based on language
  const labels = translations[lang].previewLabels;
  const memberName = data.info.name[lang].replace(/<br\s*\/?>/gi, " ");

  // Generate pseudo-random QR pattern
  const qrCells = [];
  const seed = data.website || "hamrongmedia.com";
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  
  for (let i = 0; i < 64; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    const isOff = (h >> 8) % 2 === 0;
    qrCells.push(isOff);
  }

  const isFinderSquare = (idx: number) => {
    const r = Math.floor(idx / 8);
    const c = idx % 8;
    const finders = [[0, 0], [0, 5], [5, 0]];
    for (const [fr, fc] of finders) {
      if (r >= fr && r < fr + 3 && c >= fc && c < fc + 3) {
        const dr = r - fr;
        const dc = c - fc;
        return dr === 0 || dr === 2 || dc === 0 || dc === 2;
      }
    }
    return null;
  };

  return (
    <div className="preview-root">
      <div className="preview-page">
        {/* ============ HEADER ============ */}
        <header className="header">
          <div className="header-inner">
            <div className="brand">
              <div className="logo-mark">
                <img src={data.logoUrl} alt="Logo" />
              </div>
              <div className="brand-divider"></div>
              <div className="brand-text">
                <div className="company-prefix">{data.companyPrefix[lang]}</div>
                <div className="company-name">
                  {data.companyName[lang].split(" ").map((word, i, arr) => (
                    <span key={i} className={i === arr.length - 1 ? "accent" : ""}>
                      {word}{" "}
                    </span>
                  ))}
                </div>
                <div className="company-slogan">{data.slogan[lang]}</div>
              </div>
            </div>
            <div className="header-image">
              <img src={data.heroUrl} alt="Hero" />
            </div>
          </div>
          <div className="gold-band"></div>
        </header>

        {/* ============ BODY ============ */}
        <main className="body" style={{ direction: 'ltr' }}>
          {/* LEFT: info card */}
          <div className="info-card">
            <div className="info-row info-member-row">
              <div className="member-chip">
                <div className="member-chip-logo">
                  <img src={defaultAssociationLogo} alt="Hội doanh nghiệp giao thương Việt Trung" />
                </div>
                <div className="member-chip-text">
                  <div className="member-chip-name">{memberName}</div>
                </div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <MapPin />
              </div>
              <div>
                <div className="info-label">{labels.addressLabel}</div>
                <div className="info-value" dangerouslySetInnerHTML={{ __html: data.info.address[lang] }}></div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <Calendar />
              </div>
              <div>
                <div className="info-label">{labels.yearsLabel}</div>
                <div className="info-value">{data.info.years[lang]}</div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <User />
              </div>
              <div>
                <div className="info-label">{labels.repLabel}</div>
                <div className="info-value">{data.info.rep[lang]}</div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-icon">
                <Briefcase />
              </div>
              <div>
                <div className="info-label">{labels.industryLabel}</div>
                <div className="info-value">{data.info.industry[lang]}</div>
              </div>
            </div>
          </div>

          {/* RIGHT: intro + stats */}
          <div className="intro">
            <div className="intro-head">
              <h2 className="intro-title">{labels.introTitle}</h2>
            </div>
            <div className="intro-text">
              {data.intro[lang].map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="stats">
              {data.stats.map((s, i) => (
                <div key={i} className="stat">
                  <div className="stat-icon">
                    {i === 0 && <Users className="w-5 h-5" />}
                    {i === 1 && <Clock className="w-5 h-5" />}
                    {i === 2 && <Activity className="w-5 h-5" />}
                    {i === 3 && <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div className="stat-num">
                    {s.num}
                    <sup>{s.sup}</sup>
                  </div>
                  <div className="stat-label">{s.label[lang]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* LEFT: products */}
          <section className="sec-card">
            <div className="section-head">
              <span className="icon">
                <Star />
              </span>
              {labels.productsTitle}
            </div>
            <div className="sec-card-body">
              <div className="products">
                {data.products.map((p, i) => (
                  <div key={i} className="product-item">
                    <div className="product-thumb">
                      <img src={p.img} alt={p.title[lang]} />
                    </div>
                    <div className="product-num">{String(i + 1).padStart(2, "0")}</div>
                    <div className="product-text">
                      <div className="product-title">{p.title[lang]}</div>
                      <div className="product-desc">{p.desc[lang]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: capability + market + achievements */}
          <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div className="sec-card">
              <div className="section-head">
                <span className="icon">
                  <Settings />
                </span>
                {labels.capabilityTitle}
              </div>
              <div className="sec-card-body">
                <div className="capability-row">
                  <ul className="bullet-list">
                    {data.capability[lang].map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                  <div className="trophy">
                    <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&q=70" alt="Achievement" />
                  </div>
                </div>
              </div>
            </div>

            <div className="sec-card">
              <div className="section-head">
                <span className="icon">
                  <Globe />
                </span>
                {labels.marketTitle}
              </div>
              <div className="sec-card-body">
                <div className="markets">
                  <div className="markets-row">
                    <strong>{labels.marketKey}</strong> <span>{data.market[lang]}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sec-card">
              <div className="section-head">
                <span className="icon">
                  <Trophy />
                </span>
                {labels.achievementsTitle}
              </div>
              <div className="sec-card-body">
                <div className="achievements-row">
                  <ul className="bullet-list">
                    {data.achievements[lang].map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                  <div className="cert-images">
                    <div className="cert-thumb">
                      <img src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=200&q=70" alt="Cert" />
                    </div>
                    <div className="cert-thumb">
                      <img src="https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=200&q=70" alt="Cert" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BOTTOM ROW: strengths + needs */}
          <div className="strengths-needs">
            <div className="panel-red">
              <div className="panel-head">
                <span className="icon">
                  <Gem className="w-4 h-4" />
                </span>
                <span className="label">{labels.strengthsTitle}</span>
              </div>
              <div className="strength-icons">
                {data.strengths[lang].map((s, i) => (
                  <div key={i} className="strength">
                    <div className="strength-circle">
                      {i === 0 && <ThumbsUp className="w-[18px] h-[18px]" />}
                      {i === 1 && <Settings className="w-[18px] h-[18px]" />}
                      {i === 2 && <Clock className="w-[18px] h-[18px]" />}
                      {i === 3 && <DollarSign className="w-[18px] h-[18px]" />}
                      {i === 4 && <Headphones className="w-[18px] h-[18px]" />}
                    </div>
                    <div className="strength-label" dangerouslySetInnerHTML={{ __html: s }}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-cream">
              <div>
                <div className="panel-head">
                  <span className="icon">
                    <Search className="w-4 h-4" />
                  </span>
                  <span className="label">{labels.needsTitle}</span>
                </div>
                <ul className="needs-list">
                  {data.needs[lang].map((n, i) => (
                    <li key={i}>
                      <span className="check">
                        <Check />
                      </span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="needs-image">
                <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&q=70" alt="Needs" />
              </div>
            </div>
          </div>
        </main>

        {/* ============ FOOTER ============ */}
        <footer className="footer">
          <div className="contact">
            <div className="contact-icon">
              <Phone />
            </div>
            <div>
              <div className="contact-label">{labels.hotlineLabel}</div>
              <div className="contact-value">{data.hotline}</div>
            </div>
          </div>
          <div className="contact">
            <div className="contact-icon">
              <Mail />
            </div>
            <div>
              <div className="contact-label">{labels.emailLabel}</div>
              <div className="contact-value">{data.email}</div>
            </div>
          </div>
          <div className="contact">
            <div className="contact-icon">
              <Globe />
            </div>
            <div>
              <div className="contact-label">{labels.websiteLabel}</div>
              <div className="contact-value">{data.website}</div>
            </div>
          </div>
          <div className="qr-block">
            <div className="qr-box">
              {data.wechatQrUrl ? (
                <img src={data.wechatQrUrl} className="qr-image" alt="WeChat QR" />
              ) : (
                qrCells.map((isOff, i) => {
                  const finderState = isFinderSquare(i);
                  let className = "";
                  if (finderState === true) className = ""; // On
                  else if (finderState === false) className = "off"; // Off
                  else if (isOff) className = "off";
                  
                  return <span key={i} className={className}></span>;
                })
              )}
            </div>
            <div className="qr-text">
              <strong>{labels.qrTitle}</strong>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
