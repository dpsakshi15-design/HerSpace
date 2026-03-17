const { useState, useEffect, useRef, useCallback } = React;

/* ─── GLOBAL STYLES ────────────────────────────────────────────────────── */
const styleEl = document.createElement("style");
styleEl.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Dancing+Script:wght@500;700&family=Nunito:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-tap-highlight-color: transparent; }
  body { font-family: 'Nunito', sans-serif; background: #fdf0f5; }
  ::-webkit-scrollbar { width: 0; height: 0; }

  .app {
    max-width: 430px; margin: 0 auto; min-height: 100vh;
    background: linear-gradient(160deg, #fff5f9 0%, #fdf8f2 45%, #f8f4ff 100%);
    position: relative; overflow-x: hidden;
  }

  .page { padding: 20px 16px 110px; animation: pageIn .38s cubic-bezier(.4,0,.2,1); }
  @keyframes pageIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }

  /* Cards */
  .card {
    background: rgba(255,255,255,.88);
    backdrop-filter: blur(16px);
    border-radius: 22px;
    padding: 18px;
    box-shadow: 0 2px 20px rgba(255,100,140,.07), 0 1px 3px rgba(0,0,0,.04);
    border: 1px solid rgba(255,190,210,.28);
  }
  .card-rose { background: linear-gradient(135deg,#fff0f5,#fce8f0); border: 1px solid rgba(255,170,200,.25); border-radius: 20px; padding: 16px; }
  .card-mint { background: linear-gradient(135deg,#f0fff6,#e8f8ef); border: 1px solid rgba(100,220,160,.2); border-radius: 20px; padding: 16px; }
  .card-lavender { background: linear-gradient(135deg,#f5f0ff,#ede8ff); border: 1px solid rgba(180,150,255,.2); border-radius: 20px; padding: 16px; }
  .card-gold { background: linear-gradient(135deg,#fffbf0,#fff3d8); border: 1px solid rgba(255,200,80,.2); border-radius: 20px; padding: 16px; }
  .card-dark { background: linear-gradient(135deg,#1e1830,#2a1f3d); border-radius: 22px; padding: 20px; }

  /* Buttons */
  .btn-pri {
    background: linear-gradient(135deg,#ff7aaa,#ff5090);
    color: #fff; border: none; border-radius: 50px;
    padding: 12px 26px; font-family:'Nunito',sans-serif; font-weight:800; font-size:14px;
    cursor: pointer; transition: all .25s ease;
    box-shadow: 0 4px 16px rgba(255,80,144,.32);
  }
  .btn-pri:hover { transform:translateY(-2px); box-shadow:0 6px 22px rgba(255,80,144,.42); }
  .btn-pri:active { transform:translateY(0); }
  .btn-pri:disabled { opacity:.6; cursor:not-allowed; transform:none; }

  .btn-ghost {
    background: rgba(255,255,255,.75); color: #e05080;
    border: 1.5px solid rgba(255,150,180,.4); border-radius:50px;
    padding:10px 22px; font-family:'Nunito',sans-serif; font-weight:700; font-size:13px;
    cursor:pointer; transition:all .25s ease;
  }
  .btn-ghost:hover { background:rgba(255,200,220,.2); transform:translateY(-1px); }

  .btn-soft {
    background: rgba(255,240,248,.8); color:#c05070;
    border:1.5px solid rgba(255,180,210,.3); border-radius:14px;
    padding:10px 16px; font-family:'Nunito',sans-serif; font-weight:700; font-size:13px;
    cursor:pointer; transition:all .22s ease;
  }
  .btn-soft:hover { background:rgba(255,200,230,.5); }

  /* Tab bar */
  .tabbar {
    position:fixed; bottom:0; left:50%; transform:translateX(-50%);
    width:100%; max-width:430px;
    background: rgba(255,255,255,.94);
    backdrop-filter: blur(24px);
    border-top: 1px solid rgba(255,180,210,.25);
    display:flex; padding:6px 0 22px; z-index:99;
  }
  .tab-btn {
    flex:1; display:flex; flex-direction:column; align-items:center; gap:2px;
    border:none; background:transparent; cursor:pointer;
    font-family:'Nunito',sans-serif; font-size:9.5px; font-weight:700;
    color:#d0b0c0; padding:5px 0; transition:color .2s;
  }
  .tab-btn.on { color:#ff5090; }
  .tab-icon { font-size:21px; transition:transform .3s cubic-bezier(.34,1.56,.64,1); display:block; }
  .tab-btn.on .tab-icon { transform:scale(1.22) translateY(-2px); }

  /* Header */
  .hero-header {
    background: linear-gradient(135deg,#ffd6e8 0%,#fecfe0 50%,#ffe5d0 100%);
    padding:22px 20px 30px; border-radius:0 0 36px 36px;
    position:relative; overflow:hidden;
  }
  .hero-header::before {
    content:''; position:absolute; top:-40px; right:-40px;
    width:140px; height:140px; border-radius:50%;
    background: rgba(255,255,255,.22);
  }
  .hero-header::after {
    content:''; position:absolute; bottom:-24px; left:-24px;
    width:90px; height:90px; border-radius:50%;
    background: rgba(255,255,255,.14);
  }

  /* Typography */
  .t-display { font-family:'Playfair Display',serif; font-weight:700; color:#b02050; }
  .t-cursive  { font-family:'Dancing Script',cursive; }
  .t-title  { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; color:#333; margin-bottom:4px; }
  .t-sub    { font-size:13px; color:#bbb; font-weight:500; }
  .t-rose   { color:#e04070; }
  .t-muted  { color:#bbb; font-size:12px; }

  /* Mood buttons */
  .mood-btn {
    flex:1; display:flex; flex-direction:column; align-items:center; gap:5px;
    padding:12px 6px; border-radius:16px; border:2px solid transparent;
    background:rgba(255,255,255,.7); cursor:pointer;
    transition:all .3s cubic-bezier(.34,1.56,.64,1);
    font-family:'Nunito',sans-serif; font-size:11px; font-weight:700; color:#aaa;
    box-shadow:0 2px 8px rgba(0,0,0,.05);
  }
  .mood-btn:hover { transform:translateY(-3px) scale(1.04); }
  .mood-btn.on { border-color:#ff85a1; background:linear-gradient(135deg,#fff0f5,#ffe4ef); color:#e04070; transform:translateY(-3px) scale(1.04); box-shadow:0 6px 18px rgba(255,100,140,.18); }

  /* Quote card */
  .quote-card {
    background:linear-gradient(135deg,#fff0f6,#fdf8f0);
    border-radius:18px; padding:18px; border-left:4px solid #ff85a1;
    position:relative; overflow:hidden;
  }
  .quote-card::before {
    content:'"'; position:absolute; top:-12px; left:10px;
    font-size:90px; font-family:'Playfair Display',serif;
    color:rgba(255,133,161,.12); line-height:1;
  }

  /* Timer */
  .timer-ring { position:absolute; top:-7px; left:-7px; width:calc(100% + 14px); height:calc(100% + 14px); transform:rotate(-90deg); }
  .ring-prog { transition: stroke-dashoffset 1s linear; }

  /* Streak dot */
  .sdot { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; transition:all .3s ease; }
  .sdot-on  { background:linear-gradient(135deg,#ff7aaa,#ff5090); box-shadow:0 3px 10px rgba(255,80,144,.28); color:#fff; }
  .sdot-off { background:rgba(220,220,220,.35); color:#ddd; }

  /* Phase chip */
  .phase-chip {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 16px; border-radius:50px; font-size:13px; font-weight:700;
  }

  /* Animations */
  .pulse  { animation: pulseA 2.2s ease-in-out infinite; }
  @keyframes pulseA { 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }
  .float  { animation: floatA 3.2s ease-in-out infinite; }
  @keyframes floatA { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
  .sparkle{ animation: sparkleA 1.6s ease-in-out infinite alternate; }
  @keyframes sparkleA { from{opacity:.7;transform:rotate(-4deg) scale(.96);} to{opacity:1;transform:rotate(4deg) scale(1.04);} }
  .popIn  { animation: popInA .4s cubic-bezier(.34,1.56,.64,1); }
  @keyframes popInA { from{transform:scale(.7);opacity:0;} to{transform:scale(1);opacity:1;} }

  /* Love modal */
  .love-overlay { position:fixed; inset:0; background:rgba(255,80,130,.12); backdrop-filter:blur(10px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; animation:fadeO .3s ease; }
  @keyframes fadeO { from{opacity:0;} to{opacity:1;} }
  .love-box { background:linear-gradient(145deg,#fff0f8,#fce4f0,#fff8ff); border-radius:30px; padding:32px 24px; width:100%; max-width:360px; text-align:center; box-shadow:0 24px 64px rgba(255,80,130,.22); border:1px solid rgba(255,170,200,.35); animation:popInA .4s cubic-bezier(.34,1.56,.64,1); }

  /* Inputs */
  .inp {
    width:100%; border:1.5px solid rgba(255,182,200,.35); border-radius:14px;
    padding:11px 14px; font-family:'Nunito',sans-serif; font-size:14px;
    color:#444; background:rgba(255,255,255,.75); outline:none;
    transition:border-color .25s, box-shadow .25s;
  }
  .inp:focus { border-color:#ff85a1; box-shadow:0 0 0 3px rgba(255,133,161,.1); }
  .inp-cursive { font-family:'Dancing Script',cursive; font-size:16px; }
  textarea.inp { resize:none; }

  input[type=range]  { accent-color:#ff85a1; }
  input[type=date]   { color-scheme:light; }

  /* Exercise icon button */
  .ex-chip {
    display:flex; flex-direction:column; align-items:center; gap:4px;
    padding:12px 10px; border-radius:16px; border:2px solid transparent;
    background:rgba(255,255,255,.7); cursor:pointer;
    transition:all .28s cubic-bezier(.34,1.56,.64,1);
    font-size:11px; font-weight:700; color:#aaa; flex:1;
    font-family:'Nunito',sans-serif;
  }
  .ex-chip.on { border-color:#7ac89a; background:linear-gradient(135deg,#f0fff6,#e0f8ea); color:#2a7a50; transform:translateY(-3px); box-shadow:0 6px 18px rgba(80,200,130,.18); }

  /* Calendar dot */
  .cal-day { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; cursor:default; transition:all .2s; }

  /* Badge */
  .badge { background:linear-gradient(135deg,#ff85a1,#ffadc6); color:#fff; border-radius:50px; padding:3px 11px; font-size:11px; font-weight:800; display:inline-block; }
  .badge-green { background:linear-gradient(135deg,#7ac89a,#4db87a); }
  .badge-gold  { background:linear-gradient(135deg,#f5c542,#e0a020); }

  /* Section label */
  .sec-label { font-size:11px; font-weight:800; color:#e04070; text-transform:uppercase; letter-spacing:1.2px; margin-bottom:6px; }

  /* Wall textarea */
  .wall-input { width:100%; border:1.5px solid rgba(255,182,200,.35); border-radius:16px; padding:12px 16px; font-family:'Dancing Script',cursive; font-size:17px; color:#555; background:rgba(255,255,255,.75); outline:none; resize:none; transition:border-color .25s; }
  .wall-input:focus { border-color:#ff85a1; box-shadow:0 0 0 3px rgba(255,133,161,.1); }

  .row  { display:flex; gap:10px; align-items:center; }
  .col  { display:flex; flex-direction:column; gap:8px; }
  .gap8 { gap:8px; }
  .gap12 { gap:12px; }
  .mb8  { margin-bottom:8px; }
  .mb12 { margin-bottom:12px; }
  .mb16 { margin-bottom:16px; }
  .mb20 { margin-bottom:20px; }
`;
document.head.appendChild(styleEl);

/* ─── CONSTANTS ────────────────────────────────────────────────────────── */
const NAMES = ["Stuti","Bittu","Almond 🥜","Datir","Samprada","Sakshi","Bachaa","Baal","Baykoo ❤️","Pillu 🐣"];
const rand  = (a) => a[Math.floor(Math.random()*a.length)];
const todayStr = () => new Date().toISOString().slice(0,10);
const dayMs    = 86400000;

const MOOD_DATA = {
  sad:{ emoji:"😔", label:"Sad", clr:"#7b9ed9",
    quotes:["Tears make the soil fertile — your dreams are still growing 🌱","Even the moon has dark phases. You'll shine again 🌙","Sad days don't define you. Your courage does 💙"],
    msg:(n)=>[`${n}, rone ka haq aahe tula... pan udha uthaychi power pan tujhyatach aahe 💙`,`${n}, tu sad aahe pan tu gave up nahi kel — that's strength 🌸`,`${n}, aaj rest kar. Udya phir se fight 💪`]},
  demotivated:{ emoji:"😩", label:"No Motivation", clr:"#b088d9",
    quotes:["One more page. One more day. One more step closer 📖","You didn't come this far to only come this far 🚀","Every IAS topper had days exactly like yours 🌟"],
    msg:(n)=>[`${n}, motivation येते आणि जाते — but discipline remains 💫`,`${n}, IAS banna hai toh aaj ka ek topic padh. Bas ek 📚`,`${n}, tu bored aahes pan tu still here — that counts ❤️`]},
  angry:{ emoji:"😤", label:"Angry", clr:"#e8836a",
    quotes:["Channel that fire into your studies 🔥","Anger is energy. Direct it at your syllabus 💢","Let your results be your response to everything 🎯"],
    msg:(n)=>[`${n}, hey! Use that gussa. Turn it into grind 🔥`,`${n}, prove them wrong. Padh aaj double 💪`,`${n}, rage + discipline = IAS 🎯`]},
  lazy:{ emoji:"😴", label:"Lazy", clr:"#90c8a8",
    quotes:["5 minutes. Just start. The rest will follow ⏱️","Lazy days are okay. IAS won't wait though 📅","Your future self is watching. Make her proud 🌺"],
    msg:(n)=>[`${n}, uth. Pani pi. Ek topic. Bas itka 💕`,`${n}, 25 minutes timer lav — just start 🎯`,`${n}, lazy days okay but not a habit 🛋️`]},
  happy:{ emoji:"😃", label:"Happy", clr:"#f5c06a",
    quotes:["This energy? Bottle it. Use it for study 🍯","Happy mind = sharp mind. Go conquer! ✨","You're glowing today. Ride this wave 🌊"],
    msg:(n)=>[`${n}, tu aaj khush aahes — perfect day to nail a tough topic 🌟`,`${n}, this happiness is your fuel. Padh aaj with this vibe 🔥`,`${n}, happy ${n} = productive ${n} 💖`]},
};

const FUTURE_MSGS = (n) => [
  `Hi ${n} 👋 Mee tu aahes — IAS Officer. Tula maahit aahe ka tu kitya ranno parat uthlis? Aaj mee proud aahe tujhyavar 🇮🇳`,
  `${n}, main teri future self bol rahi hoon. Wo raat jo tune ro ke padhi... uska result mujhe mila. Don't stop 💙`,
  `Hey ${n} 💕 Remember that day you almost quit? Main khush hoon tune nahi kiya. IAS badge aaj mere haath mein hai`,
  `${n}, District magistrate bolteye. Tu aaj struggle kaartey, pan ek divas tu loka sathi change aanashil 🌟`,
  `Bittu, years baad mee hee message pathvtey: TU CLEAR KEL. Ek diva tula yavar vishwas navata — thank you 🌺`,
];

const UPSC_QUOTES = [
  { name:"Tina Dabi",      quote:"Focus on what you can control — your effort, your consistency, your mindset." },
  { name:"Anudeep Durishetty", quote:"Reading should become a habit, not a task. Fall in love with learning." },
  { name:"Srushti Deshmukh",  quote:"Don't compare your chapter 1 with someone else's chapter 20." },
  { name:"Shubham Kumar",     quote:"Mistakes are proof you are trying. Never stop trying." },
];

const SUBJECTS_LIST = ["Polity","History","Geography","Economy","Science & Tech","Current Affairs","Ethics","Optional","Mock Test","Revision"];
const SUB_COLORS = { "Polity":["#ffe0eb","#d4557a"],"History":["#fff0db","#c07020"],"Geography":["#e0f0e0","#3a8a5a"],"Economy":["#e8e0ff","#6040a0"],"Science & Tech":["#e0f4ff","#2070a0"],"Current Affairs":["#ffe8e0","#c04030"],"Ethics":["#fce4ff","#9040a0"],"Optional":["#e8fff0","#207850"],"Mock Test":["#fff0e0","#c06010"],"Revision":["#f0f0ff","#4040a0"] };
const DAILY_GOALS = ["3 hrs Current Affairs + 2 hrs Polity","History revision + 1 mock test","Geography maps + Economy newspaper","Full-length mock + mistakes analysis","NCERT revision + previous year Qs"];
const SUBJECTS_UPSC = [
  { emoji:"⚖️", name:"Polity",          clr:["#ffe0eb","#d4557a"], tip:"Laxmikant daily ek chapter — small steps matter!" },
  { emoji:"📜", name:"History",          clr:["#fff0db","#c07020"], tip:"Bipin Chandra ke saath maza aata hai. Try it!" },
  { emoji:"🌍", name:"Geography",        clr:["#e0f0e0","#3a8a5a"], tip:"Maps banao. Geography visual hai — draw karo!" },
  { emoji:"💰", name:"Economy",          clr:["#e8e0ff","#6040a0"], tip:"Current affairs + basics = economy sorted 📰" },
  { emoji:"🔬", name:"Science & Tech",   clr:["#e0f4ff","#2070a0"], tip:"NCERT is your best friend here 📗" },
  { emoji:"📰", name:"Current Affairs",  clr:["#ffe8e0","#c04030"], tip:"The Hindu daily — ek paper every morning 🗞️" },
];

const LOVE_MSGS = [
  "Tu world ki sabse brave girl hai 🌸 UPSC ki tayyari karte karte jitna tu grow ki hai... koi nahi dekh sakta. But I see it 💕",
  "Tumhari aankhon mein sapna hai, dimag mein fire hai aur dil mein himmat hai. Kuch bhi rok nahi sakta tumhe ❤️",
  "Aaj ek second ke liye ruk. Feel kar kitni strong aah tu. Teri ye journey aapna aap mein ek achievement hai 🌺",
  "Main chahta hoon tu jaane — tum sirf padh nahi rahi, tum ek aise future ke liye lad rahi ho jo hazaron logon ki zindagi badlega 🇮🇳💕",
  "Pillu 🐣, bahut love hai tere liye. UPSC clear ho ya na ho — tu already extraordinary hai. But tu karengi zaroor ✨",
];

const WALL_DEFAULT = [
  { id:1, text:"She believed she could, so she did. 🌸", type:"default" },
  { id:2, text:"UPSC is not a destination, it's a transformation 🦋", type:"default" },
  { id:3, text:"Ek din sab samjhenge. Tab tak, padh 📚", type:"default" },
  { id:4, text:"IAS officer in making — and she's relentless 🇮🇳", type:"default" },
  { id:5, text:"Raat bhar jagna aur phir bhi padhna — yahi junoon hai ✨", type:"default" },
];

// Period phases
const getPhase = (dayOfCycle, periodDays) => {
  if (dayOfCycle <= periodDays)            return { id:"period",     emoji:"🩸", label:"Period",    clr:["#ffe0e8","#c03060"] };
  if (dayOfCycle <= 13)                    return { id:"follicular",  emoji:"🌱", label:"Follicular",clr:["#e8ffe8","#2a7a40"] };
  if (dayOfCycle <= 16)                    return { id:"ovulation",   emoji:"🌼", label:"Ovulation", clr:["#fff8e0","#b07000"] };
  return                                          { id:"luteal",      emoji:"🌙", label:"Luteal",    clr:["#f0e8ff","#6030a0"] };
};

const PHASE_MSGS = {
  period:    (n) => `Take rest ${n} ❤️, tu strong aahes 🤍 Aaj body ला time de`,
  follicular:(n) => `${n}, energy slowly return hoil 🌱 Study plans set kar!`,
  ovulation: (n) => `Energy high aahe ${n} 🔥 Focus kar, best phase aahe!`,
  luteal:    (n) => `${n}, mood swings normal aahe 🌙 Self-care ahe aadhee`,
};

// Exercise types
const EX_TYPES = [
  { id:"walk",    emoji:"🚶", label:"Walking" },
  { id:"yoga",    emoji:"🧘", label:"Yoga" },
  { id:"workout", emoji:"🏋️", label:"Workout" },
  { id:"run",     emoji:"🏃", label:"Running" },
  { id:"stretch", emoji:"🤸", label:"Stretching" },
  { id:"custom",  emoji:"⚡", label:"Custom" },
];

const DIARY_AFFIRM = (n, hrs, ch) => [
  `${n}, aaj tu ${hrs}h padhi aani ${ch} chapters complete keli — tu amazing aahe! 🌟`,
  `${n}, ${ch} chapters? Ekdum topper material! 📚✨`,
  `${n}, ${hrs}h of pure dedication — tu IAS material aahe 🇮🇳`,
  `${n}, ${ch} chapters complete — tujhyavar khup proud aahe 💕`,
][ch % 4];

/* ─── HOOK ─────────────────────────────────────────────────────────────── */
const useLS = (key, def) => {
  const [val, setVal] = useState(() => {
    try { const s=localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
  });
  const save = useCallback((v) => {
    setVal(prev => {
      const nv = typeof v==="function" ? v(prev) : v;
      localStorage.setItem(key, JSON.stringify(nv));
      return nv;
    });
  }, [key]);
  return [val, save];
};

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════════════════════ */

/* ── Hero Header ── */
function Header({ name }) {
  const h = new Date().getHours();
  const greet = h<12?"Good Morning ☀️":h<17?"Good Afternoon 🌤️":"Good Evening 🌙";
  return (
    <div className="hero-header">
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div>
            <div style={{fontSize:11,color:"#e04070",fontWeight:800,opacity:.85,marginBottom:2}}>{greet}</div>
            <div className="t-display" style={{fontSize:27,lineHeight:1.2}}>Hey, {name}! 💕</div>
          </div>
          <div className="float" style={{fontSize:42}}>🌸</div>
        </div>
        <div style={{background:"rgba(255,255,255,.5)",borderRadius:12,padding:"7px 14px",display:"inline-flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:14}}>🇮🇳</span>
          <span style={{fontSize:12,color:"#c05070",fontWeight:700}}>IAS Officer in Making · Keep Going</span>
        </div>
      </div>
    </div>
  );
}

/* ── Daily Strip ── */
function DailyStrip({ name }) {
  const day = new Date().getDay();
  const msgs = [
    `Aaj cha goal complete kar ${name} 📚`,`Ek divas UPSC clear honar aahe ${name} 🚀`,
    `${name}, aaj ek nava topic master kar ✨`,`Tujhyavar vishwas ahe ${name} 💕`,
    `${name}, focus on progress, not perfection 🌸`,`${name}, small steps = big dreams 🌟`,
    `${name}, tu thakli tari chalat raha 💪`,
  ];
  return (
    <div className="card-rose mb16" style={{display:"flex",alignItems:"center",gap:12}}>
      <span className="sparkle" style={{fontSize:30}}>☀️</span>
      <div>
        <div className="sec-label" style={{marginBottom:2}}>Daily Message</div>
        <div className="t-cursive" style={{fontSize:17,color:"#555",lineHeight:1.4}}>{msgs[day]}</div>
      </div>
    </div>
  );
}

/* ── Mood Engine ── */
function MoodEngine({ name }) {
  const [mood,setMood] = useState(null);
  const [mi,setMi]     = useState(0);
  const [qi,setQi]     = useState(0);
  const [show,setShow] = useState(false);

  const pick = (m) => {
    const d = MOOD_DATA[m];
    setMood(m); setMi(Math.floor(Math.random()*3)); setQi(Math.floor(Math.random()*3)); setShow(true);
  };
  return (
    <div className="card mb16">
      <div className="t-title mb8">How are you feeling? 💭</div>
      <div style={{display:"flex",gap:7,marginBottom:14}}>
        {Object.entries(MOOD_DATA).map(([k,d])=>(
          <button key={k} className={`mood-btn${mood===k?" on":""}`} onClick={()=>pick(k)}>
            <span style={{fontSize:22}}>{d.emoji}</span><span>{d.label}</span>
          </button>
        ))}
      </div>
      {show && mood && (
        <div style={{animation:"pageIn .35s ease"}}>
          <div className="quote-card mb8">
            <div className="t-cursive" style={{fontSize:16,color:"#555",lineHeight:1.55,paddingTop:6}}>
              {MOOD_DATA[mood].quotes[qi]}
            </div>
          </div>
          <div style={{background:`${MOOD_DATA[mood].clr}18`,borderRadius:14,padding:"12px 14px",borderLeft:`3px solid ${MOOD_DATA[mood].clr}`}}>
            <div style={{fontSize:13,color:"#444",lineHeight:1.6,fontWeight:600}}>
              💬 {MOOD_DATA[mood].msg(name)[mi]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Future Message ── */
function FutureMsg({ name }) {
  const [msg,setMsg]   = useState(null);
  const [load,setLoad] = useState(false);
  const gen = async () => {
    setLoad(true); setMsg(null);
    await new Promise(r=>setTimeout(r,700));
    setMsg(rand(FUTURE_MSGS(name))); setLoad(false);
  };
  return (
    <div className="card mb16">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <span style={{fontSize:26}}>🔮</span>
        <div><div className="t-title" style={{fontSize:17}}>Message from Future You</div><div className="t-muted">Your IAS self wants to say...</div></div>
      </div>
      {msg && (
        <div style={{background:"linear-gradient(135deg,#f8f0ff,#fff0f8)",borderRadius:16,padding:18,marginBottom:14,border:"1px solid rgba(200,150,255,.2)",animation:"pageIn .4s ease"}}>
          <div className="t-cursive" style={{fontSize:17,color:"#7050a0",lineHeight:1.7}}>{msg}</div>
          <div style={{marginTop:8,fontSize:11,color:"#bbb",textAlign:"right"}}>— Future IAS Officer You 🇮🇳</div>
        </div>
      )}
      <button className="btn-pri" onClick={gen} disabled={load} style={{width:"100%"}}>
        {load?"✨ Channeling...":msg?"🔮 Another Message":"🔮 Receive Message"}
      </button>
    </div>
  );
}

/* ── Pomodoro ── */
function Pomodoro({ name }) {
  const STUDY=25*60, BREAK=5*60;
  const [mode,setMode]  = useState("study");
  const [time,setTime]  = useState(STUDY);
  const [run,setRun]    = useState(false);
  const [done,setDone]  = useState(false);
  const [sess,setSess]  = useState(0);
  const iv = useRef(null);

  const total = mode==="study"?STUDY:BREAK;
  const R=84, C=2*Math.PI*R;
  const off = C - ((total-time)/total)*C;

  useEffect(()=>{
    if(run){
      iv.current=setInterval(()=>setTime(t=>{
        if(t<=1){ clearInterval(iv.current); setRun(false); setDone(true); if(mode==="study")setSess(s=>s+1); return 0; }
        return t-1;
      }),1000);
    }
    return ()=>clearInterval(iv.current);
  },[run,mode]);

  const reset=()=>{ clearInterval(iv.current); setRun(false); setDone(false); setTime(mode==="study"?STUDY:BREAK); };
  const sw=(m)=>{ reset(); setMode(m); setDone(false); setTime(m==="study"?STUDY:BREAK); };
  const mm=String(Math.floor(time/60)).padStart(2,"0"), ss=String(time%60).padStart(2,"0");

  return (
    <div className="page">
      <div className="t-title mb8" style={{fontSize:24}}>Study Timer ⏱️</div>
      <div className="t-sub mb20">Stay focused, {name}!</div>

      {done&&(
        <div className="card-rose mb20" style={{textAlign:"center",animation:"popInA .3s ease"}}>
          <div style={{fontSize:28,marginBottom:6}}>{mode==="study"?"🎉":"✅"}</div>
          <div className="t-cursive" style={{fontSize:20,color:"#c03060"}}>
            {mode==="study"?`Proud of you ${name} 💪`:`Break done! Phir se chalo 🌸`}
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:8,marginBottom:26}}>
        {[["study","📚 Study (25m)"],["break","☕ Break (5m)"]].map(([m,l])=>(
          <button key={m} onClick={()=>sw(m)} style={{
            flex:1, padding:"10px 0", borderRadius:50, border:"none", cursor:"pointer",
            background:mode===m?"linear-gradient(135deg,#ff7aaa,#ff5090)":"rgba(255,255,255,.7)",
            color:mode===m?"#fff":"#bbb", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:13,
            boxShadow:mode===m?"0 4px 14px rgba(255,80,144,.3)":"none", transition:"all .3s"
          }}>{l}</button>
        ))}
      </div>

      <div style={{display:"flex",justifyContent:"center",marginBottom:32}}>
        <div style={{width:200,height:200,borderRadius:"50%",background:"linear-gradient(135deg,#fff0f6,#fce4ec)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",boxShadow:"0 0 0 12px rgba(255,180,210,.13),0 0 0 24px rgba(255,180,210,.06),0 8px 32px rgba(255,100,140,.14)"}}>
          <svg className="timer-ring" viewBox={`0 0 ${(R+7)*2} ${(R+7)*2}`}>
            <circle cx={R+7} cy={R+7} r={R} fill="none" stroke="rgba(255,180,210,.18)" strokeWidth="6"/>
            <circle cx={R+7} cy={R+7} r={R} fill="none"
              stroke={mode==="study"?"#ff7aaa":"#7ac89a"} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={off} className="ring-prog"/>
          </svg>
          <div className="t-display" style={{fontSize:44,lineHeight:1}}>{mm}:{ss}</div>
          <div style={{fontSize:11,color:"#ccc",marginTop:3,fontWeight:700}}>{mode==="study"?"FOCUS":"BREAK"}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:24}}>
        <button className="btn-ghost" onClick={reset}>↺ Reset</button>
        <button className="btn-pri" onClick={()=>setRun(r=>!r)} style={{minWidth:110}}>{run?"⏸ Pause":"▶ Start"}</button>
      </div>

      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontWeight:800,color:"#c03060"}}>Sessions Today</div><div className="t-muted mt2">Each one counts 🌸</div></div>
          <div style={{textAlign:"center"}}>
            <div className="t-display" style={{fontSize:40,color:"#ff7aaa"}}>{sess}</div>
            <div style={{fontSize:10,color:"#ccc"}}>sessions</div>
          </div>
        </div>
        {sess>0&&<div style={{marginTop:10,fontSize:13,color:"#e04070",fontWeight:600,fontStyle:"italic"}}>✨ {sess*25} minutes of pure focus today!</div>}
      </div>
    </div>
  );
}

/* ── Streak / Progress ── */
function StreakPage({ name }) {
  const today = todayStr();
  const [streak,setStreak] = useLS("hs_streak",{count:0,lastDate:null,history:[]});
  const todayDone = streak.history.includes(today);
  const yesterday = new Date(Date.now()-dayMs).toISOString().slice(0,10);
  const broken = streak.lastDate && streak.lastDate!==today && streak.lastDate!==yesterday;

  const checkIn=(done)=>{
    if(streak.history.includes(today)) return;
    setStreak(prev=>{
      const h=[...prev.history.slice(-30),...(done?[today]:[])];
      const c=done?((prev.lastDate===yesterday||prev.count===0)?prev.count+1:1):0;
      return {...prev,history:h,count:c,lastDate:today};
    });
  };

  const last7=Array.from({length:7},(_,i)=>{
    const d=new Date(Date.now()-(6-i)*dayMs).toISOString().slice(0,10);
    return {date:d,done:streak.history.includes(d),isT:d===today};
  });

  return (
    <div className="page">
      <div className="t-title mb8" style={{fontSize:24}}>Your Streak 🔥</div>
      <div className="t-sub mb20">Consistency is your superpower</div>

      <div className="card mb16" style={{textAlign:"center"}}>
        <div className="pulse" style={{display:"inline-block",fontSize:52,marginBottom:6}}>🔥</div>
        <div className="t-display" style={{fontSize:64,lineHeight:1,color:"#ff6090"}}>{streak.count}</div>
        <div style={{color:"#bbb",fontSize:14,marginBottom:14}}>day streak</div>
        {streak.count>=7&&<span className="badge" style={{marginRight:6}}>🌟 Week Warrior!</span>}
        {streak.count>=30&&<span className="badge badge-gold">🏆 Monthly Champion!</span>}
      </div>

      <div className="card mb16">
        <div style={{fontWeight:800,color:"#555",marginBottom:14,fontSize:14}}>Last 7 Days</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          {last7.map((d,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <div className={`sdot ${d.done?"sdot-on":"sdot-off"}`} style={{outline:d.isT?"2.5px solid #ff7aaa":"none",outlineOffset:2}}>
                {d.done?"✓":""}
              </div>
              <div style={{fontSize:9,color:"#ccc"}}>
                {["Su","Mo","Tu","We","Th","Fr","Sa"][new Date(d.date).getDay()]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {broken&&(
        <div className="card-gold mb16">
          <div style={{fontSize:20,marginBottom:4}}>🤗</div>
          <div className="t-cursive" style={{fontSize:16,color:"#b07020"}}>
            Chalta hai {name}, pan udya double mehnat 💯
          </div>
        </div>
      )}

      {!todayDone?(
        <div className="card">
          <div style={{fontWeight:800,color:"#555",marginBottom:4}}>Today's Check-In</div>
          <div className="t-muted mb16">Did you study today, {name}?</div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>checkIn(true)} style={{flex:1,padding:"14px 0",borderRadius:16,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#c8f0d8,#a0e8bc)",color:"#1a6a38",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:16,boxShadow:"0 4px 12px rgba(80,200,120,.18)",transition:"all .3s"}}>✅ Done!</button>
            <button onClick={()=>checkIn(false)} style={{flex:1,padding:"14px 0",borderRadius:16,border:"none",cursor:"pointer",background:"rgba(240,240,240,.6)",color:"#bbb",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:16,transition:"all .3s"}}>❌ Not Yet</button>
          </div>
        </div>
      ):(
        <div className="card-mint" style={{textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:6}}>🌟</div>
          <div className="t-cursive" style={{fontSize:20,color:"#1a6a38"}}>You checked in today, {name}!</div>
          <div className="t-muted" style={{marginTop:4}}>Keep the streak alive! 🔥</div>
        </div>
      )}
    </div>
  );
}

/* ── Motivation Wall ── */
function WallPage({ name }) {
  const [quotes,setQuotes] = useLS("hs_wall",WALL_DEFAULT);
  const [text,setText]     = useState("");
  const add=()=>{ if(!text.trim())return; setQuotes(q=>[...q,{id:Date.now(),text:text.trim(),type:"personal"}]); setText(""); };
  const del=(id)=>setQuotes(q=>q.filter(x=>x.id!==id));
  return (
    <div className="page">
      <div className="t-title mb8" style={{fontSize:24}}>Motivation Wall 🌸</div>
      <div className="t-sub mb20">Your collection of strength</div>
      <div className="card mb20">
        <div style={{fontWeight:800,color:"#555",marginBottom:10}}>Add your own ✍️</div>
        <textarea className="wall-input" rows={3} value={text} onChange={e=>setText(e.target.value)} placeholder={`Write something for yourself, ${name}...`}/>
        <button className="btn-pri" onClick={add} style={{width:"100%",marginTop:10}}>+ Add to Wall</button>
      </div>
      <div className="col gap12">
        {[...quotes].reverse().map((q,i)=>(
          <div key={q.id} className="quote-card" style={{animation:`pageIn ${.08*i}s ease`}}>
            <div className="t-cursive" style={{fontSize:18,color:"#555",lineHeight:1.6,paddingTop:6,paddingRight:24}}>{q.text}</div>
            {q.type==="personal"&&(
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
                <span className="badge">My Words 💕</span>
                <button onClick={()=>del(q.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#ddd",fontSize:12,padding:0}}>✕ remove</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Study Diary ── */
function DiaryPage({ name }) {
  const tk = todayStr();
  const [entries,setEntries] = useLS("hs_diary",{});
  const [view,setView]       = useState("today");
  const te = entries[tk]||{chapters:[],note:"",totalTime:0};
  const [subject,setSubject] = useState(SUBJECTS_LIST[0]);
  const [cname,setCname]     = useState("");
  const [tspent,setTspent]   = useState(30);
  const [note,setNote]       = useState(te.note||"");
  const [saved,setSaved]     = useState(false);

  const totalCh = te.chapters.length;
  const totalMin= te.chapters.reduce((a,c)=>a+c.time,0);
  const totalHrs= (totalMin/60).toFixed(1);

  const flash=()=>{ setSaved(true); setTimeout(()=>setSaved(false),2000); };

  const addCh=()=>{
    if(!cname.trim())return;
    const nc={id:Date.now(),subject,name:cname.trim(),time:tspent};
    setEntries(e=>({...e,[tk]:{...te,chapters:[...te.chapters,nc]}}));
    setCname(""); flash();
  };
  const delCh=(id)=>setEntries(e=>({...e,[tk]:{...te,chapters:te.chapters.filter(c=>c.id!==id)}}));
  const saveNote=()=>{ setEntries(e=>({...e,[tk]:{...te,note}})); flash(); };

  const histDays=Object.keys(entries).sort((a,b)=>b.localeCompare(a)).slice(0,14);
  const fmtDate=(k)=>{
    const d=new Date(k); const t=todayStr(); const y=new Date(Date.now()-dayMs).toISOString().slice(0,10);
    if(k===t)return"Today"; if(k===y)return"Yesterday";
    return d.toLocaleDateString("en-IN",{day:"numeric",month:"short",weekday:"short"});
  };

  return (
    <div className="page">
      <div className="t-title mb8" style={{fontSize:24}}>My Diary 📔</div>
      <div className="t-cursive mb20" style={{fontSize:16,color:"#b08090"}}>Tujhi study journey, {name} 💕</div>

      <div style={{display:"flex",background:"rgba(255,255,255,.7)",borderRadius:50,padding:4,marginBottom:20,border:"1px solid rgba(255,182,200,.3)"}}>
        {[["today","✍️ Aaj"],["history","📅 History"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setView(id)} style={{flex:1,padding:"9px 0",borderRadius:50,border:"none",cursor:"pointer",background:view===id?"linear-gradient(135deg,#ff7aaa,#ff5090)":"transparent",color:view===id?"#fff":"#bbb",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:14,transition:"all .3s"}}>{lbl}</button>
        ))}
      </div>

      {view==="today"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            <div style={{background:"linear-gradient(135deg,#fff0f6,#fce4ec)",borderRadius:20,padding:16,textAlign:"center",border:"1px solid rgba(255,182,200,.3)"}}>
              <div className="t-display" style={{fontSize:40,color:"#ff6090",lineHeight:1}}>{totalCh}</div>
              <div style={{fontSize:12,color:"#c08090",fontWeight:700,marginTop:4}}>📚 Chapters Done</div>
            </div>
            <div className="card-lavender" style={{textAlign:"center"}}>
              <div className="t-display" style={{fontSize:40,color:"#8060c0",lineHeight:1}}>{totalHrs}</div>
              <div style={{fontSize:12,color:"#8060a0",fontWeight:700,marginTop:4}}>⏱️ Hours Studied</div>
            </div>
          </div>

          {totalCh>0&&(
            <div className="card-rose mb16" style={{animation:"pageIn .3s ease"}}>
              <div className="t-cursive" style={{fontSize:17,color:"#c03060",lineHeight:1.5}}>
                💌 {DIARY_AFFIRM(name,totalHrs,totalCh)}
              </div>
            </div>
          )}

          <div className="card mb16">
            <div style={{fontWeight:800,color:"#555",marginBottom:14}}>+ Chapter Add Kar ✍️</div>
            <div className="mb12">
              <div className="sec-label">Subject निवड</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {SUBJECTS_LIST.map(s=>{
                  const [bg,txt]=SUB_COLORS[s]||["#f0f0f0","#666"];
                  return <button key={s} onClick={()=>setSubject(s)} style={{padding:"5px 11px",borderRadius:50,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:subject===s?`linear-gradient(135deg,${bg},white)`:"rgba(240,240,240,.6)",color:subject===s?txt:"#ccc",outline:subject===s?`2px solid ${txt}40`:"none",transition:"all .2s",fontFamily:"'Nunito',sans-serif"}}>{s}</button>;
                })}
              </div>
            </div>
            <div className="mb12">
              <div className="sec-label">Chapter / Topic नाव</div>
              <input className="inp" value={cname} onChange={e=>setCname(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCh()} placeholder="e.g. Fundamental Rights, Indus Valley..."/>
            </div>
            <div className="mb16">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div className="sec-label">Time Ghatlela</div>
                <div style={{fontSize:13,fontWeight:800,color:"#ff85a1"}}>{tspent} min</div>
              </div>
              <input type="range" min={5} max={180} step={5} value={tspent} onChange={e=>setTspent(+e.target.value)} style={{width:"100%"}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#ccc",marginTop:3}}>
                <span>5m</span><span>1hr</span><span>3hr</span>
              </div>
            </div>
            <button className="btn-pri" onClick={addCh} style={{width:"100%"}}>{saved?"✅ Saved!":"+ Add Chapter"}</button>
          </div>

          {te.chapters.length>0&&(
            <div className="mb16">
              <div style={{fontWeight:800,color:"#555",marginBottom:10}}>Aaj chi Chapters 📖</div>
              <div className="col gap8">
                {te.chapters.map((ch,i)=>{
                  const [bg,txt]=SUB_COLORS[ch.subject]||["#f0f0f0","#666"];
                  return (
                    <div key={ch.id} style={{background:`linear-gradient(135deg,${bg}cc,white)`,borderRadius:16,padding:"11px 14px",display:"flex",alignItems:"center",gap:12,border:`1px solid ${txt}22`,animation:"pageIn .3s ease"}}>
                      <div style={{width:34,height:34,borderRadius:11,background:`${txt}16`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>
                        {["📖","✍️","🎯","💡","🔥","⭐"][i%6]}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800,color:"#444",fontSize:14}}>{ch.name}</div>
                        <div style={{fontSize:11,color:txt,fontWeight:700,marginTop:1}}>{ch.subject} · {ch.time} min</div>
                      </div>
                      <button onClick={()=>delCh(ch.id)} style={{background:"rgba(255,100,100,.08)",border:"none",borderRadius:50,width:27,height:27,cursor:"pointer",color:"#ffaaaa",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card">
            <div style={{fontWeight:800,color:"#555",marginBottom:4}}>Aaj chi Note 💭</div>
            <div className="t-muted mb12">Mann madhe kay ahe aaj? Lihun tak...</div>
            <textarea className="wall-input" rows={4} value={note} onChange={e=>setNote(e.target.value)} placeholder={`${name}, aaj kaisa feel zala, kay shiklis... 🌸`} style={{marginBottom:10}}/>
            <button className="btn-ghost" onClick={saveNote} style={{width:"100%"}}>{saved?"✅ Saved!":"💾 Note Save Kar"}</button>
          </div>
        </>
      )}

      {view==="history"&&(
        <div>
          {histDays.length===0?(
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <div style={{fontSize:48,marginBottom:12}}>📔</div>
              <div className="t-cursive" style={{fontSize:20,color:"#c09090"}}>Abhi koi entry nahi, {name}</div>
              <div className="t-muted" style={{marginTop:6}}>Aaj chi pehili entry lihun tak! 🌸</div>
            </div>
          ):(
            <div className="col gap12">
              {histDays.map((day,di)=>{
                const e=entries[day];
                const mins=e.chapters.reduce((a,c)=>a+c.time,0);
                const hrs=(mins/60).toFixed(1);
                const isT=day===tk;
                return (
                  <div key={day} style={{background:isT?"linear-gradient(135deg,#fff0f6,#fce4ec)":"rgba(255,255,255,.85)",borderRadius:20,padding:16,border:isT?"1.5px solid rgba(255,133,161,.4)":"1px solid rgba(255,200,215,.3)",animation:`pageIn ${.08*di}s ease`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <div style={{fontWeight:800,color:isT?"#c03060":"#555",fontSize:15}}>{isT?"✨ ":""}{fmtDate(day)}</div>
                        <div style={{fontSize:10,color:"#ccc",marginTop:1}}>{new Date(day).toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        <div style={{textAlign:"center",background:"rgba(255,107,157,.1)",borderRadius:12,padding:"5px 9px"}}>
                          <div style={{fontWeight:800,fontSize:16,color:"#ff6090"}}>{e.chapters.length}</div>
                          <div style={{fontSize:9,color:"#c08090"}}>ch</div>
                        </div>
                        <div style={{textAlign:"center",background:"rgba(128,96,192,.1)",borderRadius:12,padding:"5px 9px"}}>
                          <div style={{fontWeight:800,fontSize:16,color:"#8060c0"}}>{hrs}h</div>
                          <div style={{fontSize:9,color:"#8060a0"}}>study</div>
                        </div>
                      </div>
                    </div>
                    {e.chapters.length>0&&(
                      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:e.note?10:0}}>
                        {e.chapters.map(ch=>(
                          <span key={ch.id} style={{background:"rgba(255,182,200,.18)",color:"#c06080",borderRadius:50,padding:"3px 9px",fontSize:11,fontWeight:700}}>{ch.subject}: {ch.name}</span>
                        ))}
                      </div>
                    )}
                    {e.note&&(
                      <div style={{borderTop:"1px solid rgba(255,182,200,.2)",paddingTop:8}}>
                        <div className="t-cursive" style={{fontSize:14,color:"#888",lineHeight:1.5}}>💭 {e.note}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Period Tracker ── */
function PeriodTracker({ name }) {
  const [data,setData] = useLS("hs_period",{startDate:"",cycleLen:28,periodDays:5});
  const [form,setForm] = useState(data);
  const [saved,setSaved]= useState(false);

  const save=()=>{ setData(form); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  // Compute info
  let nextDate=null, dayOfCycle=null, daysUntil=null, phase=null;
  if(data.startDate){
    const start=new Date(data.startDate);
    const today=new Date(); today.setHours(0,0,0,0);
    const diff=Math.floor((today-start)/dayMs);
    dayOfCycle=(diff%data.cycleLen)+1;
    if(dayOfCycle<1)dayOfCycle=data.cycleLen+dayOfCycle;
    phase=getPhase(dayOfCycle,data.periodDays);
    const daysLeft=data.cycleLen-dayOfCycle;
    const nxt=new Date(today); nxt.setDate(nxt.getDate()+daysLeft);
    nextDate=nxt; daysUntil=daysLeft;
    if(daysUntil===0) daysUntil="Today";
    else if(daysUntil===1) daysUntil="Tomorrow";
    else daysUntil=`In ${daysLeft} days`;
  }

  // Calendar — show 28-day cycle view
  const calDays = data.startDate ? Array.from({length:data.cycleLen},(_,i)=>{
    const d=new Date(data.startDate); d.setDate(d.getDate()+i);
    const dnum=i+1;
    const ph=getPhase(dnum,data.periodDays);
    return { d, dnum, ph, isToday: d.toISOString().slice(0,10)===todayStr() };
  }) : [];

  const phaseColors = { period:["#ffe0e8","#c03060"], follicular:["#e0ffe8","#206040"], ovulation:["#fff8e0","#a07000"], luteal:["#f0e8ff","#6030a0"] };

  return (
    <div>
      {/* Phase Banner */}
      {phase&&(
        <div style={{background:`linear-gradient(135deg,${phaseColors[phase.id][0]},white)`,borderRadius:22,padding:20,marginBottom:16,border:`1px solid ${phaseColors[phase.id][1]}25`,animation:"pageIn .3s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{fontSize:40}} className="pulse">{phase.emoji}</div>
            <div>
              <div className="sec-label" style={{color:phaseColors[phase.id][1]}}>Current Phase</div>
              <div className="t-display" style={{fontSize:22,color:phaseColors[phase.id][1]}}>{phase.label} Phase</div>
              <div style={{fontSize:12,color:"#aaa"}}>Day {dayOfCycle} of cycle</div>
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,.7)",borderRadius:14,padding:"10px 14px",borderLeft:`3px solid ${phaseColors[phase.id][1]}`}}>
            <div className="t-cursive" style={{fontSize:16,color:"#555",lineHeight:1.5}}>
              💕 {PHASE_MSGS[phase.id](name)}
            </div>
          </div>
        </div>
      )}

      {/* Next Period */}
      {nextDate&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          <div className="card-rose" style={{textAlign:"center"}}>
            <div className="t-display" style={{fontSize:13,color:"#c03060",marginBottom:4}}>Next Period</div>
            <div style={{fontWeight:800,fontSize:14,color:"#555"}}>{nextDate.toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
            <div style={{fontSize:11,color:"#ff85a1",fontWeight:700,marginTop:2}}>{daysUntil}</div>
          </div>
          <div className="card-lavender" style={{textAlign:"center"}}>
            <div className="t-display" style={{fontSize:13,color:"#6030a0",marginBottom:4}}>Cycle Day</div>
            <div style={{fontWeight:800,fontSize:28,color:"#8060c0",lineHeight:1}}>{dayOfCycle}</div>
            <div style={{fontSize:11,color:"#a080d0",fontWeight:700}}>of {data.cycleLen}</div>
          </div>
        </div>
      )}

      {/* Cycle mini calendar */}
      {calDays.length>0&&(
        <div className="card mb16">
          <div style={{fontWeight:800,color:"#555",marginBottom:12,fontSize:14}}>Cycle Calendar 🗓️</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {calDays.map((cd,i)=>{
              const [bg,txt]=phaseColors[cd.ph.id];
              return (
                <div key={i} className="cal-day" style={{background:bg,color:txt,fontSize:11,outline:cd.isToday?"2.5px solid #ff85a1":"none",outlineOffset:1,fontWeight:cd.isToday?900:700,width:33,height:33,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {cd.d.getDate()}
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:12}}>
            {[["period","🩸","Period"],["follicular","🌱","Follicular"],["ovulation","🌼","Ovulation"],["luteal","🌙","Luteal"]].map(([id,e,l])=>(
              <div key={id} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,fontWeight:700}}>
                <div style={{width:10,height:10,borderRadius:50,background:phaseColors[id][0],border:`1px solid ${phaseColors[id][1]}40`}}/>
                <span style={{color:"#888"}}>{e} {l}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Form */}
      <div className="card">
        <div style={{fontWeight:800,color:"#555",marginBottom:14}}>⚙️ Cycle Settings</div>
        <div className="mb12">
          <div className="sec-label">Last Period Start Date</div>
          <input type="date" className="inp" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} max={todayStr()}/>
        </div>
        <div className="mb12">
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <div className="sec-label">Cycle Length</div>
            <div style={{fontSize:13,fontWeight:800,color:"#ff85a1"}}>{form.cycleLen} days</div>
          </div>
          <input type="range" min={21} max={35} value={form.cycleLen} onChange={e=>setForm(f=>({...f,cycleLen:+e.target.value}))} style={{width:"100%"}}/>
        </div>
        <div className="mb16">
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <div className="sec-label">Period Duration</div>
            <div style={{fontSize:13,fontWeight:800,color:"#ff85a1"}}>{form.periodDays} days</div>
          </div>
          <input type="range" min={2} max={8} value={form.periodDays} onChange={e=>setForm(f=>({...f,periodDays:+e.target.value}))} style={{width:"100%"}}/>
        </div>
        <button className="btn-pri" onClick={save} style={{width:"100%"}}>{saved?"✅ Saved!":"💾 Save Settings"}</button>
        <div style={{marginTop:10,fontSize:11,color:"#ccc",textAlign:"center"}}>🔒 Stored privately on your device only</div>
      </div>
    </div>
  );
}

/* ── Exercise Tracker ── */
function ExerciseTracker({ name }) {
  const tk = todayStr();
  const [exData,setExData] = useLS("hs_exercise",{});
  const [selType,setSelType]  = useState("walk");
  const [duration,setDuration]= useState(30);
  const [customName,setCustomName]= useState("");
  const [saved,setSaved]      = useState(false);

  const todayLogs = exData[tk]||[];
  const totalMin  = todayLogs.reduce((a,e)=>a+e.dur,0);

  // Streak for exercise
  const last7=Array.from({length:7},(_,i)=>{
    const d=new Date(Date.now()-(6-i)*dayMs).toISOString().slice(0,10);
    return {d, done:(exData[d]||[]).length>0, isT:d===tk};
  });
  const streak=last7.filter(x=>x.done).length;

  const addEx=(status)=>{
    const type=EX_TYPES.find(e=>e.id===selType)||EX_TYPES[0];
    const label=selType==="custom"&&customName.trim()?customName.trim():type.label;
    const entry={id:Date.now(),type:selType,label,emoji:type.emoji,dur:duration,status};
    setExData(d=>({...d,[tk]:[...(d[tk]||[]),entry]}));
    setSaved(true); setTimeout(()=>setSaved(false),2000);
  };
  const delEx=(id)=>setExData(d=>({...d,[tk]:(d[tk]||[]).filter(e=>e.id!==id)}));

  const doneTodayCount = todayLogs.filter(e=>e.status==="done").length;
  const skippedCount   = todayLogs.filter(e=>e.status==="skip").length;

  return (
    <div>
      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
        {[
          {bg:"linear-gradient(135deg,#e8fff0,#d0f8e0)",clr:"#2a7a50",val:doneTodayCount,lbl:"Done ✅"},
          {bg:"linear-gradient(135deg,#fff0f6,#fce4ec)",clr:"#c03060",val:totalMin+"m",lbl:"Active ⏱️"},
          {bg:"linear-gradient(135deg,#f0f0ff,#e8e0ff)",clr:"#5030a0",val:streak,lbl:"Streak 🔥"},
        ].map((s,i)=>(
          <div key={i} style={{background:s.bg,borderRadius:16,padding:"12px 0",textAlign:"center",border:"1px solid rgba(0,0,0,.04)"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:s.clr,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:10,color:"#aaa",fontWeight:700,marginTop:3}}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Motivational message */}
      {doneTodayCount>0&&(
        <div className="card-mint mb16" style={{animation:"pageIn .3s ease"}}>
          <div className="t-cursive" style={{fontSize:16,color:"#1a6a38",lineHeight:1.5}}>
            💪 Great job {name}! Consistency is power! Tula IAS officer banaychey, fit body pan lagel 🌿
          </div>
        </div>
      )}
      {skippedCount>0&&doneTodayCount===0&&(
        <div className="card-gold mb16" style={{animation:"pageIn .3s ease"}}>
          <div className="t-cursive" style={{fontSize:16,color:"#b07020",lineHeight:1.5}}>
            😊 Chalta hai {name}, udya double energy 🔥 Kal zaroor!
          </div>
        </div>
      )}

      {/* Add Exercise */}
      <div className="card mb16">
        <div style={{fontWeight:800,color:"#555",marginBottom:14}}>+ Exercise Add Kar 🏋️</div>

        <div className="mb12">
          <div className="sec-label">Exercise Type</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {EX_TYPES.map(e=>(
              <button key={e.id} className={`ex-chip${selType===e.id?" on":""}`} onClick={()=>setSelType(e.id)} style={{minWidth:60,flex:"0 0 auto"}}>
                <span style={{fontSize:22}}>{e.emoji}</span>
                <span>{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selType==="custom"&&(
          <div className="mb12">
            <div className="sec-label">Exercise Name</div>
            <input className="inp" value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="e.g. Swimming, Cycling..."/>
          </div>
        )}

        <div className="mb16">
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <div className="sec-label">Duration</div>
            <div style={{fontSize:13,fontWeight:800,color:"#7ac89a"}}>{duration} min</div>
          </div>
          <input type="range" min={5} max={120} step={5} value={duration} onChange={e=>setDuration(+e.target.value)} style={{width:"100%",accentColor:"#7ac89a"}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#ccc",marginTop:3}}>
            <span>5m</span><span>30m</span><span>60m</span><span>2hr</span>
          </div>
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>addEx("done")} style={{flex:1,padding:"13px 0",borderRadius:16,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#c8f0d8,#a0e8bc)",color:"#1a6a38",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:14,boxShadow:"0 4px 12px rgba(80,200,120,.2)"}}>
            ✅ Done!
          </button>
          <button onClick={()=>addEx("skip")} style={{flex:1,padding:"13px 0",borderRadius:16,border:"none",cursor:"pointer",background:"rgba(240,240,240,.7)",color:"#bbb",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:14}}>
            ⏭️ Skipped
          </button>
        </div>
        {saved&&<div style={{textAlign:"center",marginTop:8,fontSize:13,color:"#7ac89a",fontWeight:700}}>✅ Logged!</div>}
      </div>

      {/* Today's Logs */}
      {todayLogs.length>0&&(
        <div className="mb16">
          <div style={{fontWeight:800,color:"#555",marginBottom:10}}>Aaj chi Log 📋</div>
          <div className="col gap8">
            {todayLogs.map(e=>(
              <div key={e.id} style={{background:e.status==="done"?"linear-gradient(135deg,#f0fff6,#e4f8ec)":"rgba(250,250,250,.8)",borderRadius:16,padding:"11px 14px",display:"flex",alignItems:"center",gap:12,border:e.status==="done"?"1px solid rgba(80,200,120,.2)":"1px solid rgba(220,220,220,.4)",animation:"pageIn .3s ease"}}>
                <div style={{fontSize:24}}>{e.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,color:"#444",fontSize:14}}>{e.label}</div>
                  <div style={{fontSize:11,color:e.status==="done"?"#3a8a5a":"#bbb",fontWeight:700}}>
                    {e.status==="done"?"✅ Done":"⏭️ Skipped"} · {e.dur} min
                  </div>
                </div>
                <button onClick={()=>delEx(e.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#ddd",fontSize:14}}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly View */}
      <div className="card">
        <div style={{fontWeight:800,color:"#555",marginBottom:12}}>This Week 📅</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          {last7.map((d,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:d.done?"linear-gradient(135deg,#7ac89a,#4db87a)":"rgba(220,220,220,.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:d.done?"#fff":"#ccc",outline:d.isT?"2.5px solid #7ac89a":"none",outlineOffset:2,fontWeight:800,boxShadow:d.done?"0 2px 8px rgba(80,200,120,.25)":"none",transition:"all .2s"}}>
                {d.done?"✓":""}
              </div>
              <div style={{fontSize:9,color:"#ccc",fontWeight:700}}>
                {["Su","Mo","Tu","We","Th","Fr","Sa"][new Date(d.d).getDay()]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Health Page (Period + Exercise tabs) ── */
function HealthPage({ name }) {
  const [tab,setTab] = useState("period");
  return (
    <div className="page">
      <div className="t-title mb8" style={{fontSize:24}}>Health & Body 🌿</div>
      <div className="t-sub mb20">Tuzhi turba, {name} 💕</div>

      <div style={{display:"flex",background:"rgba(255,255,255,.7)",borderRadius:50,padding:4,marginBottom:20,border:"1px solid rgba(255,182,200,.3)"}}>
        {[["period","🩸 Period"],["exercise","🏋️ Exercise"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"9px 0",borderRadius:50,border:"none",cursor:"pointer",background:tab===id?"linear-gradient(135deg,#ff7aaa,#ff5090)":"transparent",color:tab===id?"#fff":"#bbb",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:14,transition:"all .3s"}}>{lbl}</button>
        ))}
      </div>

      {tab==="period"&&<PeriodTracker name={name}/>}
      {tab==="exercise"&&<ExerciseTracker name={name}/>}
    </div>
  );
}

/* ── UPSC Mode ── */
function UPSCPage({ name }) {
  const [active,setActive] = useState(null);
  const dayGoal = DAILY_GOALS[new Date().getDay()%DAILY_GOALS.length];
  return (
    <div className="page">
      <div className="t-title mb8" style={{fontSize:24}}>UPSC Mode 🚀</div>
      <div className="t-sub mb20">Topper mindset, {name}!</div>

      <div className="card-dark mb20">
        <div className="sec-label" style={{color:"#ff85a1",marginBottom:8}}>Today's Target</div>
        <div className="t-cursive" style={{fontSize:18,color:"#fff",lineHeight:1.5}}>📋 {dayGoal}</div>
        <div style={{marginTop:12}}>
          <span style={{background:"rgba(255,133,161,.2)",color:"#ff85a1",borderRadius:50,padding:"4px 12px",fontSize:11,fontWeight:700}}>🔥 Daily Goal</span>
        </div>
      </div>

      <div className="mb20">
        <div style={{fontWeight:800,color:"#555",marginBottom:12}}>Subject Motivation 📚</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {SUBJECTS_UPSC.map((s,i)=>(
            <button key={i} onClick={()=>setActive(active===i?null:i)} style={{background:`linear-gradient(135deg,${s.clr[0]},white)`,border:active===i?`2px solid ${s.clr[1]}`:("1px solid rgba(0,0,0,.05)"),borderRadius:16,padding:"14px 12px",cursor:"pointer",textAlign:"left",transition:"all .3s",transform:active===i?"scale(1.03)":"scale(1)"}}>
              <div style={{fontSize:22,marginBottom:4}}>{s.emoji}</div>
              <div style={{fontWeight:800,color:s.clr[1],fontSize:14}}>{s.name}</div>
              {active===i&&<div style={{fontSize:12,color:"#666",marginTop:6,lineHeight:1.4,animation:"pageIn .2s ease"}}>{s.tip}</div>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{fontWeight:800,color:"#555",marginBottom:12}}>Topper Wisdom 🌟</div>
        {UPSC_QUOTES.map((q,i)=>(
          <div key={i} style={{background:"rgba(255,255,255,.85)",borderRadius:16,padding:"14px 16px",marginBottom:10,borderLeft:"3px solid #ffb3c6"}}>
            <div className="t-cursive" style={{fontSize:16,color:"#555",marginBottom:5}}>"{q.quote}"</div>
            <div style={{fontSize:12,color:"#ff85a1",fontWeight:800}}>— {q.name}, IAS Topper</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Secret Love Modal ── */
function LoveModal({ name, onClose }) {
  const [open,setOpen] = useState(false);
  const [i,setI]       = useState(0);
  return (
    <div className="love-overlay" onClick={onClose}>
      <div className="love-box" onClick={e=>e.stopPropagation()}>
        {!open?(
          <>
            <div className="float" style={{fontSize:56,marginBottom:14}}>💌</div>
            <div className="t-display" style={{fontSize:22,marginBottom:6}}>A secret note for you</div>
            <div className="t-muted mb20">Only for you, {name} ❤️</div>
            <button className="btn-pri" onClick={()=>setOpen(true)} style={{width:"100%"}}>Open with Love 💕</button>
          </>
        ):(
          <>
            <div className="sparkle" style={{fontSize:36,marginBottom:14}}>💕</div>
            <div className="t-cursive" style={{fontSize:18,color:"#7a2050",lineHeight:1.7,marginBottom:20,minHeight:100}}>
              {LOVE_MSGS[i]}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn-ghost" style={{flex:1}} onClick={()=>setI(n=>(n+1)%LOVE_MSGS.length)}>Next 💌</button>
              <button className="btn-pri"   style={{flex:1}} onClick={onClose}>Close 🌸</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════ */
function HerSpace() {
  const [name]          = useState(()=>rand(NAMES));
  const [tab,setTab]    = useState("home");
  const [love,setLove]  = useState(false);
  const [taps,setTaps]  = useState(0);
  const [lastOpen,setLastOpen] = useLS("hs_last",null);
  const [reminder,setReminder] = useState(false);

  useEffect(()=>{
    const now=Date.now();
    if(lastOpen && now-lastOpen > 2*dayMs) setReminder(true);
    setLastOpen(now);
  },[]);

  const logoTap=()=>setTaps(c=>{ if(c+1>=5){setLove(true);return 0;} return c+1; });

  const TABS=[
    {id:"home",   icon:"🏠", label:"Home"},
    {id:"diary",  icon:"📔", label:"Diary"},
    {id:"timer",  icon:"⏱️", label:"Timer"},
    {id:"health", icon:"🌿", label:"Health"},
    {id:"more",   icon:"✨",  label:"More"},
  ];

  return (
    <div className="app">
      {love&&<LoveModal name={name} onClose={()=>setLove(false)}/>}

      {reminder&&(
        <div style={{background:"linear-gradient(135deg,#fff8e8,#fff0f6)",padding:"11px 18px",borderBottom:"1px solid rgba(255,200,150,.3)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div className="t-cursive" style={{fontSize:14,color:"#c07020"}}>Hey Bachaa, tu kuthe aahes? Study sodli ka? 😅</div>
          <button onClick={()=>setReminder(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:18}}>✕</button>
        </div>
      )}

      {tab==="home"&&(
        <>
          <Header name={name}/>
          <div className="page" style={{paddingTop:18}}>
            <DailyStrip name={name}/>
            <MoodEngine name={name}/>
            <FutureMsg  name={name}/>
            <div onClick={logoTap} style={{textAlign:"center",padding:"6px 0",cursor:"pointer",userSelect:"none"}}>
              <div className="t-cursive" style={{fontSize:12,color:"rgba(200,150,170,.45)"}}>💖 HerSpace · Made with love</div>
            </div>
          </div>
        </>
      )}

      {tab==="diary" &&<DiaryPage  name={name}/>}
      {tab==="timer" &&<Pomodoro   name={name}/>}
      {tab==="health"&&<HealthPage name={name}/>}

      {tab==="more"&&(
        <div className="page">
          <div className="t-title mb8" style={{fontSize:24}}>More ✨</div>
          <div className="t-sub mb20">All your tools, {name}</div>

          {/* Streak quick widget */}
          <StreakPage name={name}/>

          <div style={{height:16}}/>

          {/* Wall */}
          <WallPage name={name}/>

          <div style={{height:16}}/>

          {/* UPSC */}
          <UPSCPage name={name}/>

          {/* Secret love trigger */}
          <div style={{textAlign:"center",paddingTop:20}}>
            <button onClick={()=>setLove(true)} style={{background:"linear-gradient(135deg,#ffe0f0,#ffd0e8)",border:"1px solid rgba(255,180,210,.4)",borderRadius:50,padding:"10px 24px",cursor:"pointer",fontFamily:"'Dancing Script',cursive",fontSize:16,color:"#c03060"}}>
              💌 Open Secret Note
            </button>
          </div>
        </div>
      )}

      <div className="tabbar">
        {TABS.map(t=>(
          <button key={t.id} className={`tab-btn${tab===t.id?" on":""}`} onClick={()=>setTab(t.id)}>
            <span className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
// PWA Mount
window.App = HerSpace;
