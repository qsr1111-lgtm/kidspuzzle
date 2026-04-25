function encodeSvg(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function cat({
  x,
  y,
  scale = 1,
  fur = "#ff914d",
  shirt = "#ffffff",
  mood = "smile",
  accessory = ""
}) {
  const mouth =
    mood === "happy"
      ? `<path d="M94 130 Q110 150 126 130" stroke="#2b1b10" stroke-width="8" fill="none" stroke-linecap="round"/>`
      : mood === "wow"
      ? `<ellipse cx="110" cy="135" rx="10" ry="14" fill="#2b1b10"/>`
      : `<path d="M96 132 Q110 142 124 132" stroke="#2b1b10" stroke-width="7" fill="none" stroke-linecap="round"/>`;

  return `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="110" cy="245" rx="62" ry="78" fill="${shirt}"/>
    <circle cx="110" cy="112" r="78" fill="${fur}"/>
    <path d="M50 60 L78 5 L98 76 Z" fill="${fur}"/>
    <path d="M170 60 L142 5 L122 76 Z" fill="${fur}"/>
    <path d="M66 58 L78 28 L90 70 Z" fill="#ffd6b0" opacity=".8"/>
    <path d="M154 58 L142 28 L130 70 Z" fill="#ffd6b0" opacity=".8"/>
    <circle cx="82" cy="108" r="11" fill="#20140d"/>
    <circle cx="138" cy="108" r="11" fill="#20140d"/>
    <ellipse cx="110" cy="123" rx="9" ry="6" fill="#5b2b18"/>
    ${mouth}
    <path d="M55 132 H15 M58 150 H20 M165 132 H205 M162 150 H200" stroke="#7a4323" stroke-width="5" stroke-linecap="round"/>
    <path d="M48 230 Q20 265 38 298" stroke="${fur}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M172 230 Q202 265 184 298" stroke="${fur}" stroke-width="18" fill="none" stroke-linecap="round"/>
    <circle cx="75" cy="310" r="22" fill="${fur}"/>
    <circle cx="145" cy="310" r="22" fill="${fur}"/>
    ${accessory}
  </g>`;
}

function houseScene({ title, bg1, bg2, grass, mainCat, secondCat, roof, extra }) {
  return encodeSvg(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="100%" stop-color="${bg2}"/>
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000" flood-opacity=".18"/>
      </filter>
    </defs>

    <rect width="900" height="900" rx="60" fill="url(#bg)"/>
    <circle cx="745" cy="125" r="70" fill="#fff3a6"/>
    <circle cx="135" cy="145" r="38" fill="#fff" opacity=".55"/>
    <circle cx="190" cy="135" r="50" fill="#fff" opacity=".55"/>
    <circle cx="250" cy="150" r="35" fill="#fff" opacity=".55"/>

    <path d="M0 690 C160 620 270 750 430 675 C600 595 720 700 900 625 L900 900 L0 900 Z" fill="${grass}"/>
    <path d="M0 770 C170 700 285 830 470 750 C650 670 750 790 900 720 L900 900 L0 900 Z" fill="#fff" opacity=".22"/>

    <g filter="url(#shadow)">
      <rect x="250" y="280" width="410" height="335" rx="42" fill="#fff7df"/>
      <path d="M200 330 L455 140 L710 330 Z" fill="${roof}"/>
      <rect x="335" y="430" width="100" height="185" rx="18" fill="#c77b43"/>
      <circle cx="415" cy="525" r="8" fill="#5a3522"/>
      <rect x="492" y="410" width="105" height="90" rx="18" fill="#94dcff"/>
      <path d="M545 410 V500 M492 455 H597" stroke="#fff" stroke-width="10"/>
    </g>

    ${cat({ x: 130, y: 375, scale: 0.95, fur: mainCat, shirt: "#fff5f5", mood: "happy" })}
    ${cat({ x: 505, y: 405, scale: 0.82, fur: secondCat, shirt: "#d9f7ff", mood: "smile" })}

    ${extra}

    <text x="450" y="825" text-anchor="middle" font-size="54" font-weight="900" fill="#4a2a16" font-family="Arial, sans-serif">${title}</text>
  </svg>`);
}

function picnicScene() {
  return encodeSvg(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#b9f8c9"/>
        <stop offset="100%" stop-color="#fff4a8"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000" flood-opacity=".18"/></filter>
    </defs>
    <rect width="900" height="900" rx="60" fill="url(#bg)"/>
    <circle cx="745" cy="125" r="72" fill="#fff3a6"/>
    <path d="M0 650 C180 585 280 720 450 655 C640 585 740 700 900 630 L900 900 L0 900 Z" fill="#77d96a"/>
    <path d="M160 665 L735 665 L650 805 L250 805 Z" fill="#ff5d5d" filter="url(#shadow)"/>
    <path d="M210 665 L260 805 M310 665 L360 805 M410 665 L460 805 M510 665 L560 805 M610 665 L660 805" stroke="#fff" stroke-width="12"/>
    <path d="M160 710 H705 M185 760 H680" stroke="#fff" stroke-width="12"/>
    ${cat({ x: 115, y: 335, scale: 1.02, fur: "#ff9d4d", shirt: "#fff3f3", mood: "happy" })}
    ${cat({ x: 525, y: 350, scale: 0.92, fur: "#62c7ff", shirt: "#fff", mood: "smile" })}
    <g filter="url(#shadow)">
      <circle cx="450" cy="690" r="32" fill="#ffcf5a"/>
      <circle cx="520" cy="705" r="28" fill="#ff914d"/>
      <rect x="355" y="690" width="70" height="48" rx="18" fill="#8f7aff"/>
      <path d="M390 690 V738 M355 714 H425" stroke="#fff" stroke-width="8"/>
      <path d="M610 620 C660 555 730 600 720 670" stroke="#8b5a2b" stroke-width="18" fill="none" stroke-linecap="round"/>
      <circle cx="720" cy="672" r="36" fill="#ff6f61"/>
    </g>
    <text x="450" y="835" text-anchor="middle" font-size="58" font-weight="900" fill="#4a2a16" font-family="Arial">Пикник</text>
  </svg>`);
}

function seaScene() {
  return encodeSvg(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#9eefff"/>
        <stop offset="100%" stop-color="#fff0a8"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000" flood-opacity=".18"/></filter>
    </defs>
    <rect width="900" height="900" rx="60" fill="url(#bg)"/>
    <circle cx="735" cy="120" r="76" fill="#fff3a6"/>
    <path d="M0 610 C150 555 260 655 420 605 C620 540 730 650 900 590 L900 900 L0 900 Z" fill="#50c8ee"/>
    <path d="M0 690 C130 630 250 735 415 675 C600 610 740 730 900 665 L900 900 L0 900 Z" fill="#2daee0"/>
    <path d="M90 650 Q155 610 220 650 Q285 690 350 650" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M500 710 Q575 670 650 710 Q725 750 800 710" stroke="#fff" stroke-width="18" fill="none" stroke-linecap="round"/>
    ${cat({ x: 125, y: 300, scale: 1.0, fur: "#ff934a", shirt: "#fffbe2", mood: "happy", accessory: `<path d="M60 205 Q110 165 160 205" stroke="#ff5d5d" stroke-width="18" fill="none" stroke-linecap="round"/>` })}
    <g filter="url(#shadow)">
      <path d="M570 455 L715 455 L790 580 L500 580 Z" fill="#fff7df"/>
      <path d="M638 455 L638 300" stroke="#74451f" stroke-width="18" stroke-linecap="round"/>
      <path d="M650 315 L770 430 L650 430 Z" fill="#ff6f61"/>
      <path d="M630 325 L520 430 L630 430 Z" fill="#ffcf5a"/>
      <circle cx="700" cy="690" r="38" fill="#ff6f61"/>
      <path d="M660 690 H740 M700 650 V730" stroke="#fff" stroke-width="12"/>
      <path d="M460 735 Q505 690 550 735 Q505 780 460 735Z" fill="#ffd93d"/>
      <circle cx="535" cy="728" r="7" fill="#222"/>
    </g>
    <text x="450" y="835" text-anchor="middle" font-size="58" font-weight="900" fill="#4a2a16" font-family="Arial">Море</text>
  </svg>`);
}

function kitchenScene() {
  return encodeSvg(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff0b8"/>
        <stop offset="100%" stop-color="#ffd6a5"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000" flood-opacity=".18"/></filter>
    </defs>
    <rect width="900" height="900" rx="60" fill="url(#bg)"/>
    <rect x="90" y="180" width="720" height="500" rx="50" fill="#fff7df" filter="url(#shadow)"/>
    <rect x="130" y="230" width="250" height="140" rx="26" fill="#bdefff"/>
    <path d="M255 230 V370 M130 300 H380" stroke="#fff" stroke-width="12"/>
    <rect x="500" y="235" width="220" height="330" rx="28" fill="#ffcf5a"/>
    <rect x="530" y="270" width="160" height="85" rx="18" fill="#fff8dc"/>
    <rect x="530" y="385" width="160" height="135" rx="18" fill="#fff8dc"/>
    <rect x="0" y="650" width="900" height="250" fill="#f4c16e"/>
    <rect x="90" y="620" width="720" height="110" rx="32" fill="#d88a4d" filter="url(#shadow)"/>
    ${cat({ x: 110, y: 335, scale: 0.92, fur: "#ff934a", shirt: "#ffffff", mood: "happy", accessory: `<rect x="58" y="38" width="104" height="36" rx="18" fill="#fff"/><circle cx="85" cy="35" r="26" fill="#fff"/><circle cx="135" cy="35" r="26" fill="#fff"/>` })}
    <g filter="url(#shadow)">
      <ellipse cx="520" cy="675" rx="100" ry="42" fill="#ffffff"/>
      <circle cx="485" cy="650" r="30" fill="#ffcf5a"/>
      <circle cx="535" cy="650" r="30" fill="#ffcf5a"/>
      <circle cx="585" cy="660" r="26" fill="#ff914d"/>
      <path d="M620 605 Q670 555 720 605" stroke="#8b5a2b" stroke-width="20" fill="none" stroke-linecap="round"/>
      <rect x="655" y="610" width="90" height="75" rx="20" fill="#8f7aff"/>
    </g>
    <text x="450" y="835" text-anchor="middle" font-size="58" font-weight="900" fill="#4a2a16" font-family="Arial">Кухня</text>
  </svg>`);
}

function forestScene() {
  return encodeSvg(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#b8ffd1"/>
        <stop offset="100%" stop-color="#fff0a8"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000" flood-opacity=".18"/></filter>
    </defs>
    <rect width="900" height="900" rx="60" fill="url(#bg)"/>
    <circle cx="745" cy="110" r="68" fill="#fff3a6"/>
    <path d="M0 700 C160 610 310 760 460 675 C620 590 745 720 900 650 L900 900 L0 900 Z" fill="#69c85f"/>
    <g filter="url(#shadow)">
      <path d="M130 225 L60 470 H200 Z" fill="#2f9e44"/>
      <path d="M160 300 L75 570 H245 Z" fill="#38b000"/>
      <rect x="135" y="540" width="42" height="155" rx="12" fill="#8b5a2b"/>
      <path d="M730 210 L650 500 H810 Z" fill="#2f9e44"/>
      <path d="M760 300 L675 590 H845 Z" fill="#38b000"/>
      <rect x="735" y="560" width="42" height="150" rx="12" fill="#8b5a2b"/>
    </g>
    ${cat({ x: 250, y: 375, scale: 1.02, fur: "#ff9f43", shirt: "#e9ffd8", mood: "wow" })}
    <g filter="url(#shadow)">
      <circle cx="595" cy="645" r="48" fill="#ff5d5d"/>
      <circle cx="560" cy="700" r="34" fill="#ffd93d"/>
      <circle cx="660" cy="700" r="34" fill="#8f7aff"/>
      <path d="M505 610 C540 570 575 580 600 620" stroke="#7a4323" stroke-width="16" fill="none" stroke-linecap="round"/>
    </g>
    <text x="450" y="835" text-anchor="middle" font-size="58" font-weight="900" fill="#4a2a16" font-family="Arial">Лес</text>
  </svg>`);
}

function snowScene() {
  return encodeSvg(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#d5f2ff"/>
        <stop offset="100%" stop-color="#ffffff"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000" flood-opacity=".18"/></filter>
    </defs>
    <rect width="900" height="900" rx="60" fill="url(#bg)"/>
    <circle cx="150" cy="120" r="12" fill="#fff"/>
    <circle cx="270" cy="190" r="10" fill="#fff"/>
    <circle cx="720" cy="170" r="14" fill="#fff"/>
    <circle cx="650" cy="260" r="9" fill="#fff"/>
    <path d="M0 660 C170 610 290 730 450 665 C625 590 755 710 900 640 L900 900 L0 900 Z" fill="#dff6ff"/>
    ${cat({ x: 110, y: 360, scale: 0.95, fur: "#ff8c42", shirt: "#74b9ff", mood: "happy", accessory: `<rect x="50" y="185" width="120" height="38" rx="18" fill="#ff5d5d"/><path d="M55 205 H165" stroke="#fff" stroke-width="8"/>` })}
    <g filter="url(#shadow)">
      <circle cx="630" cy="690" r="70" fill="#fff"/>
      <circle cx="630" cy="590" r="52" fill="#fff"/>
      <circle cx="612" cy="580" r="7" fill="#222"/>
      <circle cx="650" cy="580" r="7" fill="#222"/>
      <path d="M630 595 L675 610" stroke="#ff914d" stroke-width="10" stroke-linecap="round"/>
      <rect x="580" y="525" width="100" height="38" rx="18" fill="#8f7aff"/>
      <rect x="600" y="490" width="60" height="45" rx="12" fill="#4a2a16"/>
      <path d="M560 650 L500 610 M700 650 L765 610" stroke="#8b5a2b" stroke-width="12" stroke-linecap="round"/>
    </g>
    <text x="450" y="835" text-anchor="middle" font-size="58" font-weight="900" fill="#4a2a16" font-family="Arial">Снег</text>
  </svg>`);
}

function birthdayScene() {
  return encodeSvg(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffd0e8"/>
        <stop offset="100%" stop-color="#fff4a8"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000" flood-opacity=".18"/></filter>
    </defs>
    <rect width="900" height="900" rx="60" fill="url(#bg)"/>
    <path d="M120 115 L190 235 L50 235 Z" fill="#ff6f61"/>
    <path d="M380 90 L455 230 L305 230 Z" fill="#8f7aff"/>
    <path d="M700 115 L785 240 L615 240 Z" fill="#4dc7a0"/>
    <path d="M0 690 C150 620 300 750 450 680 C620 600 740 710 900 640 L900 900 L0 900 Z" fill="#8ee06e"/>
    ${cat({ x: 90, y: 365, scale: 0.9, fur: "#ff9b4a", shirt: "#ffffff", mood: "happy", accessory: `<path d="M85 35 L110 -25 L135 35 Z" fill="#ffcf5a"/><circle cx="110" cy="-25" r="10" fill="#ff5d5d"/>` })}
    ${cat({ x: 520, y: 370, scale: 0.86, fur: "#ff6fb1", shirt: "#fff", mood: "happy", accessory: `<path d="M85 35 L110 -25 L135 35 Z" fill="#6ecbff"/><circle cx="110" cy="-25" r="10" fill="#fff"/>` })}
    <g filter="url(#shadow)">
      <rect x="330" y="610" width="220" height="135" rx="30" fill="#fff"/>
      <rect x="350" y="570" width="180" height="70" rx="28" fill="#ffcf5a"/>
      <path d="M370 570 V535 M440 570 V535 M510 570 V535" stroke="#ff6f61" stroke-width="14" stroke-linecap="round"/>
      <circle cx="370" cy="526" r="12" fill="#fff35a"/>
      <circle cx="440" cy="526" r="12" fill="#fff35a"/>
      <circle cx="510" cy="526" r="12" fill="#fff35a"/>
      <rect x="610" y="635" width="105" height="95" rx="20" fill="#8f7aff"/>
      <path d="M610 680 H715 M662 635 V730" stroke="#fff" stroke-width="12"/>
    </g>
    <text x="450" y="835" text-anchor="middle" font-size="58" font-weight="900" fill="#4a2a16" font-family="Arial">Праздник</text>
  </svg>`);
}

function rainScene() {
  return encodeSvg(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#9dc9ff"/>
        <stop offset="100%" stop-color="#d9ecff"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000" flood-opacity=".18"/></filter>
    </defs>
    <rect width="900" height="900" rx="60" fill="url(#bg)"/>
    <path d="M130 185 l-22 50 M260 135 l-22 50 M720 175 l-22 50 M620 260 l-22 50 M415 110 l-22 50" stroke="#328dff" stroke-width="14" stroke-linecap="round"/>
    <path d="M0 685 C160 610 270 755 450 675 C620 600 735 710 900 640 L900 900 L0 900 Z" fill="#78c96b"/>
    <g filter="url(#shadow)">
      <path d="M205 380 Q450 150 695 380 Z" fill="#ffdd55"/>
      <path d="M450 380 V695" stroke="#7a4a2a" stroke-width="18" stroke-linecap="round"/>
      <path d="M450 695 Q480 740 520 705" stroke="#7a4a2a" stroke-width="18" fill="none" stroke-linecap="round"/>
    </g>
    ${cat({ x: 290, y: 390, scale: 0.88, fur: "#ff8c42", shirt: "#fff", mood: "smile" })}
    <g filter="url(#shadow)">
      <ellipse cx="645" cy="720" rx="95" ry="34" fill="#65b7ff" opacity=".65"/>
      <ellipse cx="230" cy="735" rx="75" ry="28" fill="#65b7ff" opacity=".55"/>
    </g>
    <text x="450" y="835" text-anchor="middle" font-size="58" font-weight="900" fill="#4a2a16" font-family="Arial">Дождик</text>
  </svg>`);
}

function starsScene() {
  return encodeSvg(`
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#8f7aff"/>
        <stop offset="100%" stop-color="#ffd6f6"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#000" flood-opacity=".18"/></filter>
    </defs>
    <rect width="900" height="900" rx="60" fill="url(#bg)"/>
    <circle cx="130" cy="160" r="10" fill="#fff"/>
    <circle cx="250" cy="95" r="8" fill="#fff"/>
    <circle cx="740" cy="150" r="12" fill="#fff"/>
    <circle cx="675" cy="260" r="9" fill="#fff"/>
    <circle cx="410" cy="185" r="7" fill="#fff"/>
    <path d="M0 700 C150 630 300 750 450 685 C620 610 760 725 900 650 L900 900 L0 900 Z" fill="#77d66b"/>
    ${cat({ x: 120, y: 370, scale: 0.95, fur: "#ff9b4a", shirt: "#fff8dc", mood: "wow" })}
    <g filter="url(#shadow)">
      <path d="M610 455 L642 535 L730 535 L658 582 L687 670 L610 617 L533 670 L562 582 L490 535 L578 535 Z" fill="#fff35a"/>
      <path d="M640 315 L658 360 L706 360 L667 388 L682 435 L640 407 L598 435 L613 388 L574 360 L622 360 Z" fill="#ffcf5a"/>
      <path d="M455 610 Q500 555 545 610" stroke="#ffffff" stroke-width="16" fill="none" stroke-linecap="round"/>
    </g>
    <text x="450" y="835" text-anchor="middle" font-size="58" font-weight="900" fill="#4a2a16" font-family="Arial">Звёзды</text>
  </svg>`);
}

export const PUZZLES = [
  {
    id: "home",
    title: "Домик",
    image: houseScene({
      title: "Домик",
      bg1: "#9ee7ff",
      bg2: "#ffe9a6",
      grass: "#8bd66b",
      mainCat: "#ff914d",
      secondCat: "#6ecbff",
      roof: "#ff6f61",
      extra: `
        <g filter="url(#shadow)">
          <circle cx="710" cy="690" r="42" fill="#ff5c8a"/>
          <path d="M690 675 Q710 640 730 675" stroke="#fff" stroke-width="10" fill="none"/>
        </g>`
    })
  },
  {
    id: "picnic",
    title: "Пикник",
    image: picnicScene()
  },
  {
    id: "rain",
    title: "Дождик",
    image: rainScene()
  },
  {
    id: "birthday",
    title: "Праздник",
    image: birthdayScene()
  },
  {
    id: "kitchen",
    title: "Кухня",
    image: kitchenScene()
  },
  {
    id: "yard",
    title: "Двор",
    image: houseScene({
      title: "Двор",
      bg1: "#a8edff",
      bg2: "#d6ffb0",
      grass: "#73d66b",
      mainCat: "#ff9a45",
      secondCat: "#35b7ff",
      roof: "#8f7aff",
      extra: `
        <g filter="url(#shadow)">
          <circle cx="700" cy="690" r="52" fill="#ff6b6b"/>
          <path d="M665 690 H735 M700 655 V725" stroke="#fff" stroke-width="13" stroke-linecap="round"/>
          <rect x="115" y="640" width="80" height="55" rx="18" fill="#ffcf5a"/>
        </g>`
    })
  },
  {
    id: "forest",
    title: "Лес",
    image: forestScene()
  },
  {
    id: "sea",
    title: "Море",
    image: seaScene()
  },
  {
    id: "snow",
    title: "Снег",
    image: snowScene()
  },
  {
    id: "stars",
    title: "Звёзды",
    image: starsScene()
  }
];

export const LEVELS = [
  {
    key: "easy",
    title: "Лёгкий",
    icon: "🟢",
    grid: 2,
    pieces: 4
  },
  {
    key: "medium",
    title: "Средний",
    icon: "🟡",
    grid: 3,
    pieces: 9
  },
  {
    key: "hard",
    title: "Сложный",
    icon: "🔴",
    grid: 4,
    pieces: 16
  }
];