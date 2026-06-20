import React, { useState, useEffect, useRef, useMemo } from "react";

/* ══════════════════════════════════════════════════════════════
   GLOBAL CSS — ported 1:1 from the original stylesheet
   (kept as a single template string injected via <style>, since
   the design uses bespoke CSS vars / keyframes not expressible
   with utility classes alone)
══════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
:root{
  --void:#060608;--abyss:#0B0B10;--deep:#0F0F16;
  --surface:#14141E;--surface2:#1A1A26;--surface3:#20202E;
  --gold:#C9A84C;--gold2:#E8C46A;
  --gold-dim:rgba(201,168,76,0.1);--gold-glow:rgba(201,168,76,0.25);
  --ember:#C0392B;--ember2:#E74C3C;--ember-glow:rgba(192,57,43,0.3);
  --ice:#4FC3F7;--smoke:rgba(255,255,255,0.28);--ash:rgba(255,255,255,0.12);
  --border:rgba(255,255,255,0.06);--border2:rgba(255,255,255,0.11);
  --border-g:rgba(201,168,76,0.22);
  --r12:12px;--r18:18px;--r24:24px;
  --ff-title:'Cinzel',serif;--ff-body:'Crimson Pro',Georgia,serif;--ff-ui:'Barlow',sans-serif;
  --shadow-deep:0 32px 80px rgba(0,0,0,0.8);
}
.lh-root *,.lh-root *::before,.lh-root *::after{margin:0;padding:0;box-sizing:border-box;}
.lh-root{font-family:var(--ff-body);background:var(--void);color:rgba(255,255,255,0.85);font-size:17px;line-height:1.75;overflow-x:hidden;scroll-behavior:smooth;position:relative;}
.lh-root ::selection{background:var(--gold);color:var(--void);}
.lh-root ::-webkit-scrollbar{width:5px;}
.lh-root ::-webkit-scrollbar-track{background:var(--abyss);}
.lh-root ::-webkit-scrollbar-thumb{background:linear-gradient(var(--gold),var(--ember));border-radius:3px;}

.page{display:none;min-height:100vh;}
.page.active{display:block;}

#bg-canvas{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.6;}

/* NAV */
nav{position:sticky;top:0;z-index:300;height:72px;padding:0 5%;display:flex;align-items:center;justify-content:space-between;background:rgba(6,6,8,0.93);backdrop-filter:blur(24px);border-bottom:1px solid var(--border);}
.logo{font-family:var(--ff-title);font-size:1.5rem;font-weight:700;text-decoration:none;color:rgba(255,255,255,0.92);letter-spacing:0.12em;display:flex;align-items:center;gap:10px;}
.logo-gem{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--gold),var(--ember));display:flex;align-items:center;justify-content:center;font-size:1rem;box-shadow:0 0 16px var(--gold-glow);}
.logo em{color:var(--gold);font-style:normal;}
.nav-links{display:flex;gap:1.6rem;list-style:none;align-items:center;}
.nav-links a,.nav-links button{text-decoration:none;color:var(--smoke);background:none;border:none;cursor:pointer;font-family:var(--ff-ui);font-size:0.84rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;transition:color 0.2s;padding:0;}
.nav-links a:hover,.nav-links button:hover{color:var(--gold);}
.nav-links a.nav-active,.nav-links button.nav-active{color:var(--gold);}
.nav-pill{padding:9px 22px!important;border-radius:30px!important;border:1px solid var(--border-g)!important;background:var(--gold-dim)!important;color:var(--gold)!important;font-weight:600!important;transition:all 0.25s!important;}
.nav-pill:hover{background:var(--gold)!important;color:var(--void)!important;box-shadow:0 0 28px var(--gold-glow)!important;}
.nav-user{display:flex;align-items:center;gap:8px;background:var(--gold-dim);border:1px solid var(--border-g);border-radius:30px;padding:6px 14px;cursor:pointer;transition:all 0.2s;}
.nav-user:hover{background:var(--gold);color:var(--void)!important;}
.nav-user span{font-family:var(--ff-ui);font-size:0.8rem;font-weight:600;color:var(--gold);}
.nav-user:hover span{color:var(--void);}
.nav-avatar{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--ember));display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:#fff;}

/* BUTTONS */
.btn{padding:14px 34px;border-radius:50px;font-family:var(--ff-ui);font-size:0.88rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;text-decoration:none;border:none;display:inline-flex;align-items:center;gap:10px;transition:all 0.3s;}
.btn-flame{background:linear-gradient(135deg,var(--gold) 0%,var(--ember) 100%);color:#fff;box-shadow:0 6px 32px rgba(192,57,43,0.4),0 2px 8px rgba(201,168,76,0.3);}
.btn-flame:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 12px 48px rgba(192,57,43,0.55);}
.btn-ghost{background:transparent;color:rgba(255,255,255,0.8);border:1px solid var(--border2);}
.btn-ghost:hover{border-color:var(--gold);color:var(--gold);background:var(--gold-dim);transform:translateY(-3px);}
.btn-sm{padding:9px 22px;font-size:0.8rem;}

/* SHARED SECTION STYLES */
.lh-root section{padding:90px 5%;position:relative;}
.eyebrow{display:inline-flex;align-items:center;gap:10px;font-family:var(--ff-ui);font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem;}
.eyebrow::before,.eyebrow::after{content:'';width:20px;height:1px;background:var(--gold);opacity:0.5;}
.sec-title{font-family:var(--ff-title);font-size:clamp(2rem,3.5vw,3rem);font-weight:700;color:#fff;line-height:1.15;margin-bottom:0.75rem;letter-spacing:0.04em;}
.sec-title em{color:var(--gold);font-style:italic;font-family:'Crimson Pro',serif;}
.sec-sub{color:var(--smoke);max-width:520px;font-size:1rem;font-weight:300;line-height:1.8;font-style:italic;}

/* HERO */
.hero{position:relative;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px 5% 80px;overflow:hidden;}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% -10%,rgba(201,168,76,0.12) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 10% 90%,rgba(192,57,43,0.1) 0%,transparent 50%),var(--void);}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.04) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,black,transparent);}
.hero-content{position:relative;z-index:2;}
.hero-eyebrow{display:inline-flex;align-items:center;gap:12px;font-family:var(--ff-ui);font-size:0.72rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:2rem;}
.hero-eyebrow::before,.hero-eyebrow::after{content:'';width:30px;height:1px;background:var(--gold);opacity:0.5;}
.pulse-dot{width:7px;height:7px;border-radius:50%;background:var(--gold);animation:pulse 2.5s ease infinite;}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 var(--gold-glow);}50%{box-shadow:0 0 0 8px transparent;}}
.hero h1{font-family:var(--ff-title);font-size:clamp(3rem,7.5vw,6.5rem);font-weight:900;line-height:1.0;color:#fff;max-width:1000px;margin:0 auto 1.5rem;text-shadow:0 0 80px rgba(201,168,76,0.15);letter-spacing:0.04em;}
.hero h1 .gold{color:var(--gold);}
.hero h1 .ember{color:var(--ember2);}
.hero h1 .italic{font-style:italic;font-weight:600;}
.hero-sub{font-size:1.2rem;color:var(--smoke);max-width:580px;margin:0 auto 3rem;font-weight:300;line-height:1.85;font-style:italic;}
.hero-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
.hero-divider{width:1px;height:60px;background:linear-gradient(var(--gold),transparent);margin:3rem auto 2.5rem;opacity:0.6;}
.hero-stats{display:flex;gap:4rem;justify-content:center;flex-wrap:wrap;}
.stat-item{text-align:center;}
.stat-num{font-family:var(--ff-title);font-size:2.4rem;font-weight:700;color:var(--gold);display:block;line-height:1;}
.stat-lbl{font-family:var(--ff-ui);font-size:0.7rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:var(--smoke);margin-top:6px;display:block;}

/* GENRES */
#genres{background:var(--abyss);}
.genre-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:1rem;margin-top:3rem;}
@media(max-width:1100px){.genre-grid{grid-template-columns:repeat(4,1fr);}}
@media(max-width:600px){.genre-grid{grid-template-columns:repeat(2,1fr);}}
.genre-tile{background:var(--surface);border:1px solid var(--border);border-radius:var(--r18);padding:2rem 1rem;text-align:center;cursor:pointer;transition:all 0.35s cubic-bezier(0.23,1,0.32,1);position:relative;overflow:hidden;}
.genre-tile::before{content:'';position:absolute;inset:0;background:linear-gradient(160deg,var(--gold-dim),transparent 70%);opacity:0;transition:opacity 0.35s;}
.genre-tile::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transform:scaleX(0);transition:transform 0.35s;}
.genre-tile:hover,.genre-tile.active{border-color:var(--border-g);transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,0.5),0 0 0 1px var(--border-g);}
.genre-tile:hover::before,.genre-tile.active::before{opacity:1;}
.genre-tile:hover::after,.genre-tile.active::after{transform:scaleX(1);}
.genre-tile.active{background:var(--surface2);}
.g-icon{font-size:2.5rem;margin-bottom:0.75rem;display:block;position:relative;}
.g-name{font-family:var(--ff-title);font-size:0.8rem;font-weight:600;color:#fff;letter-spacing:0.08em;text-transform:uppercase;position:relative;}
.g-count{font-family:var(--ff-ui);font-size:0.72rem;color:var(--smoke);margin-top:4px;position:relative;}

/* FAMOUS */
#famous{background:var(--deep);border-top:1px solid var(--border);}
.famous-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:3rem;flex-wrap:wrap;gap:1rem;}
.see-all-btn{font-family:var(--ff-ui);font-size:0.8rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--gold);text-decoration:none;display:flex;align-items:center;gap:6px;border:1px solid var(--border-g);padding:9px 20px;border-radius:30px;background:var(--gold-dim);transition:all 0.2s;cursor:pointer;}
.see-all-btn:hover{background:var(--gold);color:var(--void);}
.famous-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;}
@media(max-width:1100px){.famous-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.famous-grid{grid-template-columns:1fr;}}
.famous-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r24);overflow:hidden;cursor:pointer;transition:all 0.4s cubic-bezier(0.23,1,0.32,1);display:flex;flex-direction:column;}
.famous-card:hover{transform:translateY(-8px) scale(1.01);border-color:var(--border-g);box-shadow:0 24px 64px rgba(0,0,0,0.6),0 0 0 1px var(--border-g);}
.fc-img-wrap{position:relative;height:220px;overflow:hidden;}
.fc-img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s cubic-bezier(0.23,1,0.32,1);display:block;}
.famous-card:hover .fc-img{transform:scale(1.08);}
.fc-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,6,8,0.1) 0%,rgba(6,6,8,0.75) 100%);}
.fc-pill{position:absolute;top:14px;left:14px;z-index:2;padding:5px 14px;border-radius:20px;font-family:var(--ff-ui);font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;}
.fc-rating{position:absolute;bottom:14px;right:14px;z-index:2;background:rgba(0,0,0,0.7);border:1px solid rgba(201,168,76,0.3);padding:4px 10px;border-radius:20px;font-family:var(--ff-ui);font-size:0.75rem;font-weight:600;color:var(--gold);}
.fc-classic-badge{position:absolute;top:14px;right:14px;z-index:2;background:linear-gradient(135deg,var(--gold),var(--ember));padding:4px 10px;border-radius:20px;font-family:var(--ff-ui);font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#fff;}
.fc-body{padding:1.4rem;flex:1;display:flex;flex-direction:column;}
.fc-title{font-family:var(--ff-title);font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:0.4rem;line-height:1.25;letter-spacing:0.04em;}
.fc-author{font-family:var(--ff-ui);font-size:0.78rem;color:var(--gold);font-weight:500;margin-bottom:0.85rem;letter-spacing:0.04em;}
.fc-summary{font-size:0.9rem;color:var(--smoke);line-height:1.7;flex:1;font-weight:300;margin-bottom:1rem;}
.fc-meta{display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem;}
.fc-tag{background:var(--surface3);border:1px solid var(--border);padding:3px 10px;border-radius:20px;font-family:var(--ff-ui);font-size:0.7rem;color:var(--smoke);}
.fc-footer{display:flex;align-items:center;justify-content:space-between;padding-top:0.9rem;border-top:1px solid var(--border);}
.fc-chars{font-family:var(--ff-ui);font-size:0.75rem;color:var(--smoke);}
.fc-chars strong{color:rgba(255,255,255,0.7);}
.fc-read-btn{padding:7px 20px;border-radius:20px;background:transparent;border:1px solid var(--border-g);color:var(--gold);font-family:var(--ff-ui);font-size:0.78rem;font-weight:600;cursor:pointer;transition:all 0.2s;}
.fc-read-btn:hover{background:var(--gold);color:var(--void);box-shadow:0 0 20px var(--gold-glow);}

/* PILL COLOURS */
.pill-fantasy{background:rgba(107,77,138,0.85);color:#D8B4FE;border:1px solid rgba(167,139,250,0.4);}
.pill-sci-fi{background:rgba(14,85,155,0.85);color:#93C5FD;border:1px solid rgba(147,197,253,0.4);}
.pill-mystery{background:rgba(120,10,70,0.85);color:#FBCFE8;border:1px solid rgba(251,207,232,0.4);}
.pill-romance{background:rgba(160,40,30,0.85);color:#FCA5A5;border:1px solid rgba(252,165,165,0.4);}
.pill-adventure{background:rgba(30,90,40,0.85);color:#86EFAC;border:1px solid rgba(134,239,172,0.4);}
.pill-children{background:rgba(160,100,0,0.85);color:#FDE68A;border:1px solid rgba(253,230,138,0.4);}
.pill-horror{background:rgba(20,10,10,0.92);color:#FCA5A5;border:1px solid rgba(252,165,165,0.3);}

/* HOME PREVIEW STORIES */
#home-preview{background:var(--abyss);border-top:1px solid var(--border);}
.preview-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.5rem;flex-wrap:wrap;gap:1rem;}
.preview-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.25rem;}
@media(max-width:1100px){.preview-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.preview-grid{grid-template-columns:1fr;}}

/* FEATURED */
#featured{background:radial-gradient(ellipse 70% 60% at 0% 50%,rgba(201,168,76,0.08) 0%,transparent 55%),var(--deep);border-top:1px solid var(--border);}
.feat-wrap{display:grid;grid-template-columns:1fr 1.5fr;gap:5rem;align-items:center;}
@media(max-width:900px){.feat-wrap{grid-template-columns:1fr;gap:2.5rem;}}
.feat-img-box{position:relative;}
.feat-img{width:100%;aspect-ratio:2/3;max-height:500px;object-fit:cover;border-radius:var(--r24);box-shadow:var(--shadow-deep),0 0 0 1px var(--border2);}
.feat-img-frame{position:absolute;inset:-10px;border-radius:calc(var(--r24) + 10px);border:1px solid var(--border-g);pointer-events:none;}
.feat-badge-wrap{position:absolute;top:-16px;right:-16px;}
.feat-badge{background:linear-gradient(135deg,var(--gold),var(--ember));color:#fff;font-family:var(--ff-ui);font-size:0.72rem;font-weight:700;padding:9px 20px;border-radius:30px;letter-spacing:0.1em;text-transform:uppercase;box-shadow:0 4px 24px var(--ember-glow);}
.feat-title{font-family:var(--ff-title);font-size:clamp(1.8rem,3vw,2.8rem);font-weight:700;color:#fff;line-height:1.1;margin-bottom:1rem;letter-spacing:0.05em;}
.feat-quote{font-size:1.1rem;color:var(--smoke);font-style:italic;border-left:2px solid var(--gold);padding-left:1.25rem;margin-bottom:1.5rem;line-height:1.8;font-weight:300;}
.feat-meta{list-style:none;margin-bottom:2rem;}
.feat-meta li{display:flex;gap:1rem;padding:0.55rem 0;border-bottom:1px solid var(--border);font-size:0.88rem;}
.fk{color:var(--gold);font-family:var(--ff-ui);font-weight:600;min-width:90px;font-size:0.75rem;letter-spacing:0.05em;text-transform:uppercase;}
.fv{color:var(--smoke);}
.feat-btns{display:flex;gap:1rem;flex-wrap:wrap;}

/* REVIEWS */
#reviews{background:var(--abyss);border-top:1px solid var(--border);}
.rev-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1.25rem;margin-bottom:3rem;}
.rev-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r18);padding:1.5rem;transition:border-color 0.25s;}
.rev-card:hover{border-color:var(--border-g);}
.rv-head{display:flex;align-items:center;gap:12px;margin-bottom:1rem;}
.rv-av{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--ff-title);font-weight:700;font-size:0.9rem;flex-shrink:0;border:2px solid;}
.rv-name{font-family:var(--ff-ui);font-weight:600;color:#fff;font-size:0.9rem;}
.rv-story{font-family:var(--ff-ui);font-size:0.75rem;color:var(--smoke);margin-top:2px;}
.rv-stars{color:var(--gold);margin-bottom:0.75rem;font-size:0.88rem;letter-spacing:2px;}
.rv-text{font-size:0.95rem;color:var(--smoke);line-height:1.7;font-style:italic;font-weight:300;}
.rv-date{font-family:var(--ff-ui);font-size:0.72rem;color:var(--ash);margin-top:0.75rem;}
.rev-form{background:var(--surface);border:1px solid var(--border);border-radius:var(--r24);padding:2.5rem;max-width:660px;}
.rev-form h3{font-family:var(--ff-title);font-size:1.6rem;font-weight:700;color:#fff;margin-bottom:2rem;letter-spacing:0.05em;}
.form-row{margin-bottom:1.2rem;}
.form-row label{display:block;font-family:var(--ff-ui);font-size:0.72rem;font-weight:700;color:var(--gold);margin-bottom:7px;letter-spacing:0.12em;text-transform:uppercase;}
.form-row input,.form-row select,.form-row textarea{width:100%;padding:12px 18px;background:var(--abyss);border:1px solid var(--border2);border-radius:10px;color:#fff;font-family:var(--ff-body);font-size:0.95rem;outline:none;transition:border-color 0.2s;}
.form-row input:focus,.form-row select:focus,.form-row textarea:focus{border-color:var(--gold);}
.form-row select option{background:var(--abyss);}
.form-row textarea{resize:vertical;min-height:110px;}
.star-row{display:flex;gap:8px;}
.star-row span{font-size:1.9rem;cursor:pointer;color:var(--surface3);transition:all 0.15s;}
.star-row span.lit{color:var(--gold);text-shadow:0 0 16px var(--gold-glow);}
.star-row span:hover{transform:scale(1.2);}
#rv-ok{display:none;background:rgba(79,195,247,0.08);border:1px solid rgba(79,195,247,0.25);color:var(--ice);border-radius:8px;padding:12px 18px;margin-top:1rem;font-family:var(--ff-ui);font-size:0.88rem;}
#rv-ok.show{display:block;}

/* ABOUT */
#about{background:var(--deep);border-top:1px solid var(--border);}
.about-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;margin-top:2.5rem;}
.about-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r18);padding:1.75rem;transition:all 0.3s;}
.about-card:hover{border-color:var(--border-g);transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,0.4);}
.a-icon{width:50px;height:50px;border-radius:14px;background:var(--gold-dim);border:1px solid var(--border-g);display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin-bottom:1.1rem;}
.about-card h3{font-family:var(--ff-title);font-size:0.95rem;font-weight:600;color:#fff;margin-bottom:0.5rem;letter-spacing:0.06em;}
.about-card p{font-size:0.9rem;color:var(--smoke);line-height:1.7;font-weight:300;}

/* CHATBOT */
#chatbot{background:radial-gradient(ellipse 60% 50% at 90% 50%,rgba(192,57,43,0.08) 0%,transparent 55%),var(--abyss);border-top:1px solid var(--border);}
.chat-shell{max-width:700px;background:var(--surface);border:1px solid var(--border2);border-radius:var(--r24);overflow:hidden;box-shadow:var(--shadow-deep);}
.chat-head{background:var(--surface2);border-bottom:1px solid var(--border);padding:1.1rem 1.5rem;display:flex;align-items:center;gap:14px;}
.chat-gem{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--gold),var(--ember));display:flex;align-items:center;justify-content:center;font-family:var(--ff-title);font-weight:700;color:#fff;font-size:1rem;box-shadow:0 0 20px rgba(201,168,76,0.35);}
.chat-head-info strong{color:#fff;font-family:var(--ff-ui);font-size:0.9rem;display:block;}
.chat-head-info span{color:rgba(79,195,247,0.8);font-family:var(--ff-ui);font-size:0.75rem;}
.chat-msgs{height:360px;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;}
.chat-msgs::-webkit-scrollbar{width:3px;}
.chat-msgs::-webkit-scrollbar-thumb{background:var(--gold);border-radius:3px;}
.msg{display:flex;gap:10px;align-items:flex-end;}
.msg.u{flex-direction:row-reverse;}
.msg-bub{max-width:78%;padding:11px 16px;border-radius:16px;font-family:var(--ff-body);font-size:0.92rem;line-height:1.6;}
.msg.b .msg-bub{background:var(--deep);color:var(--smoke);border:1px solid var(--border);border-radius:4px 16px 16px 16px;}
.msg.u .msg-bub{background:linear-gradient(135deg,var(--gold),#A87B2A);color:var(--void);font-weight:600;border-radius:16px 4px 16px 16px;}
.msg-av{width:30px;height:30px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:var(--ff-ui);font-size:0.7rem;font-weight:700;}
.msg.b .msg-av{background:var(--gold-dim);color:var(--gold);border:1px solid var(--border-g);}
.msg.u .msg-av{background:var(--surface3);color:var(--smoke);border:1px solid var(--border2);}
.chat-type{display:none;align-items:center;gap:8px;padding:0 1.5rem 0.75rem;color:var(--smoke);font-family:var(--ff-ui);font-size:0.78rem;}
.chat-type.show{display:flex;}
.tdots{display:flex;gap:4px;}
.tdots span{width:5px;height:5px;border-radius:50%;background:var(--gold);animation:td 1.2s infinite;display:block;}
.tdots span:nth-child(2){animation-delay:0.2s;}
.tdots span:nth-child(3){animation-delay:0.4s;}
@keyframes td{0%,80%,100%{transform:translateY(0);opacity:0.5;}40%{transform:translateY(-7px);opacity:1;}}
.chat-in-row{display:flex;gap:0.75rem;padding:1rem 1.25rem;border-top:1px solid var(--border);background:var(--surface2);}
.chat-in-row input{flex:1;background:var(--abyss);border:1px solid var(--border2);color:#fff;border-radius:30px;padding:11px 20px;font-family:var(--ff-body);font-size:0.9rem;outline:none;transition:border-color 0.2s;}
.chat-in-row input::placeholder{color:var(--smoke);}
.chat-in-row input:focus{border-color:var(--gold);}
.chat-send{background:linear-gradient(135deg,var(--gold),var(--ember));color:#fff;border:none;border-radius:30px;padding:11px 26px;font-family:var(--ff-ui);font-weight:700;font-size:0.85rem;cursor:pointer;transition:all 0.2s;}
.chat-send:hover{box-shadow:0 0 24px var(--gold-glow);transform:translateY(-1px);}

/* NEWSLETTER */
#newsletter{background:linear-gradient(135deg,#0C0A00 0%,#160F00 50%,#0C0A00 100%);border-top:1px solid rgba(201,168,76,0.12);text-align:center;padding:100px 5%;position:relative;overflow:hidden;}
#newsletter::before{content:'STORIES';position:absolute;font-family:var(--ff-title);font-size:20rem;font-weight:900;color:rgba(201,168,76,0.025);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;letter-spacing:0.1em;white-space:nowrap;}
.nl-inner{position:relative;max-width:540px;margin:0 auto;}
#newsletter .sec-sub{margin:0.75rem auto 2.5rem;max-width:440px;}
.nl-form{display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:center;}
.nl-form input{flex:1;min-width:220px;padding:14px 24px;border-radius:30px;border:1px solid rgba(201,168,76,0.25);background:rgba(255,255,255,0.04);color:#fff;font-family:var(--ff-body);font-size:1rem;outline:none;transition:border-color 0.2s;}
.nl-form input:focus{border-color:var(--gold);}
.nl-form input::placeholder{color:var(--smoke);}
.nl-form button{padding:14px 32px;border-radius:30px;border:none;background:linear-gradient(135deg,var(--gold),var(--ember));color:#fff;font-family:var(--ff-ui);font-weight:700;font-size:0.88rem;cursor:pointer;transition:all 0.25s;letter-spacing:0.06em;text-transform:uppercase;}
.nl-form button:hover{box-shadow:0 0 32px var(--ember-glow);transform:translateY(-2px);}
#nl-ok{display:none;color:var(--ice);margin-top:1rem;font-family:var(--ff-ui);font-size:0.9rem;}
#nl-ok.show{display:block;}

/* FOOTER */
footer{background:var(--void);border-top:1px solid var(--border);padding:70px 5% 32px;}
.foot-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3.5rem;margin-bottom:3rem;}
@media(max-width:768px){.foot-top{grid-template-columns:1fr 1fr;gap:2rem;}}
@media(max-width:480px){.foot-top{grid-template-columns:1fr;}}
.foot-brand-name{font-family:var(--ff-title);font-size:1.4rem;color:#fff;margin-bottom:1rem;display:block;letter-spacing:0.1em;}
.foot-brand-name em{color:var(--gold);font-style:normal;}
.foot-brand p{font-size:0.9rem;color:var(--smoke);line-height:1.75;font-weight:300;max-width:280px;}
.foot-col h4{font-family:var(--ff-ui);font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem;}
.foot-col a{display:block;color:var(--smoke);text-decoration:none;font-size:0.88rem;margin-bottom:0.55rem;transition:color 0.2s;font-weight:300;cursor:pointer;}
.foot-col a:hover{color:var(--gold);}
.foot-bottom{border-top:1px solid var(--border);padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;font-family:var(--ff-ui);font-size:0.78rem;color:var(--smoke);}

/* LIBRARY PAGE */
#page-library{background:var(--void);}
.lib-hero{background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(201,168,76,0.1) 0%,transparent 60%),var(--abyss);padding:80px 5% 60px;border-bottom:1px solid var(--border);}
.lib-hero-top{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;margin-bottom:2.5rem;}
.lib-title-wrap .eyebrow{margin-bottom:0.5rem;}
.lib-title-wrap h1{font-family:var(--ff-title);font-size:clamp(2rem,4vw,3.2rem);font-weight:700;color:#fff;letter-spacing:0.05em;line-height:1.1;}
.lib-title-wrap h1 em{color:var(--gold);font-style:italic;font-family:'Crimson Pro',serif;}
.lib-count{font-family:var(--ff-ui);font-size:0.82rem;color:var(--smoke);margin-top:0.4rem;}

.lib-search-wrap{display:flex;gap:1rem;align-items:center;flex-wrap:wrap;}
.search-box{position:relative;flex:1;min-width:280px;max-width:500px;}
.search-box input{width:100%;padding:14px 50px 14px 52px;background:var(--surface);border:1px solid var(--border2);border-radius:50px;color:#fff;font-family:var(--ff-body);font-size:1rem;outline:none;transition:all 0.25s;}
.search-box input:focus{border-color:var(--gold);background:var(--surface2);box-shadow:0 0 0 3px rgba(201,168,76,0.08);}
.search-box input::placeholder{color:var(--smoke);}
.search-icon{position:absolute;left:18px;top:50%;transform:translateY(-50%);color:var(--gold);font-size:1.1rem;pointer-events:none;}
.search-clear{position:absolute;right:16px;top:50%;transform:translateY(-50%);color:var(--smoke);font-size:1rem;cursor:pointer;background:none;border:none;padding:2px;transition:color 0.2s;display:none;}
.search-clear:hover{color:var(--gold);}
.search-clear.show{display:block;}
.search-stats{font-family:var(--ff-ui);font-size:0.82rem;color:var(--smoke);white-space:nowrap;}
.search-stats strong{color:var(--gold);}

.lib-filters{display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:1.5rem;}
.lf-btn{padding:8px 20px;border-radius:30px;border:1px solid var(--border);background:transparent;color:var(--smoke);font-family:var(--ff-ui);font-size:0.8rem;font-weight:500;cursor:pointer;transition:all 0.2s;letter-spacing:0.04em;}
.lf-btn:hover{border-color:var(--border-g);color:var(--gold);}
.lf-btn.active{background:var(--gold);color:var(--void);border-color:var(--gold);font-weight:700;}

.lib-toolbar{display:flex;align-items:center;justify-content:space-between;padding:0 5%;margin:2rem 0 0;flex-wrap:wrap;gap:1rem;}
.sort-wrap{display:flex;align-items:center;gap:10px;}
.sort-wrap label{font-family:var(--ff-ui);font-size:0.78rem;color:var(--smoke);letter-spacing:0.05em;text-transform:uppercase;}
.sort-wrap select{background:var(--surface);border:1px solid var(--border2);color:#fff;border-radius:20px;padding:7px 14px;font-family:var(--ff-ui);font-size:0.82rem;outline:none;cursor:pointer;transition:border-color 0.2s;}
.sort-wrap select:focus{border-color:var(--gold);}
.sort-wrap select option{background:var(--surface);}
.no-results{text-align:center;padding:5rem 2rem;font-family:var(--ff-body);color:var(--smoke);font-style:italic;font-size:1.1rem;grid-column:1/-1;}
.no-results .nr-icon{font-size:3rem;display:block;margin-bottom:1rem;}
.no-results strong{color:var(--gold);font-style:normal;}

.lib-body{padding:2rem 5% 80px;}
.lib-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;}
@media(max-width:1200px){.lib-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:860px){.lib-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:520px){.lib-grid{grid-template-columns:1fr;}}

.story-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r24);overflow:hidden;cursor:pointer;transition:all 0.4s cubic-bezier(0.23,1,0.32,1);display:flex;flex-direction:column;}
.story-card:hover{transform:translateY(-7px);border-color:var(--border-g);box-shadow:0 20px 60px rgba(0,0,0,0.55),0 0 0 1px rgba(201,168,76,0.12);}
.sc-img{position:relative;height:210px;overflow:hidden;}
.sc-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s cubic-bezier(0.23,1,0.32,1);}
.story-card:hover .sc-img img{transform:scale(1.07);}
.sc-img-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,var(--surface) 100%);}
.sc-body{padding:1.35rem;flex:1;display:flex;flex-direction:column;}
.sc-title{font-family:var(--ff-title);font-size:1.05rem;font-weight:700;color:#fff;margin-bottom:0.35rem;line-height:1.25;letter-spacing:0.04em;}
.sc-author{font-family:var(--ff-ui);font-size:0.75rem;color:var(--gold);font-weight:600;margin-bottom:0.8rem;letter-spacing:0.04em;}
.sc-summary{font-size:0.88rem;color:var(--smoke);line-height:1.7;flex:1;font-weight:300;margin-bottom:1rem;}
.sc-meta{margin-bottom:0.9rem;}
.sc-meta-row{display:flex;gap:8px;font-size:0.78rem;margin-bottom:3px;align-items:baseline;}
.sc-mk{color:var(--gold);font-family:var(--ff-ui);font-weight:600;min-width:60px;font-size:0.72rem;letter-spacing:0.04em;}
.sc-mv{color:var(--smoke);}
.sc-foot{display:flex;align-items:center;justify-content:space-between;padding-top:0.85rem;border-top:1px solid var(--border);}
.sc-stars{color:var(--gold);font-size:0.82rem;}
.sc-rv{font-family:var(--ff-ui);font-size:0.75rem;color:var(--smoke);margin-left:5px;}
.sc-btn{padding:7px 18px;border-radius:20px;background:transparent;border:1px solid var(--border-g);color:var(--gold);font-family:var(--ff-ui);font-size:0.77rem;font-weight:600;cursor:pointer;transition:all 0.2s;}
.sc-btn:hover{background:var(--gold);color:var(--void);box-shadow:0 0 16px var(--gold-glow);}

.hl{background:rgba(201,168,76,0.25);color:var(--gold);border-radius:3px;padding:0 2px;}

/* AUTH PAGE */
#page-auth{min-height:100vh;align-items:center;justify-content:center;background:radial-gradient(ellipse 80% 60% at 20% 20%,rgba(192,57,43,0.12) 0%,transparent 50%),radial-gradient(ellipse 60% 50% at 80% 80%,rgba(201,168,76,0.1) 0%,transparent 50%),var(--void);padding:100px 5%;position:relative;overflow:hidden;}
#page-auth.active{display:flex;}
#page-auth::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px);background-size:50px 50px;mask-image:radial-gradient(ellipse 70% 70% at 50% 50%,black,transparent);}
.auth-container{position:relative;z-index:2;width:100%;max-width:460px;}
.auth-logo{text-align:center;margin-bottom:2.5rem;}
.auth-logo-mark{width:60px;height:60px;border-radius:16px;background:linear-gradient(135deg,var(--gold),var(--ember));display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin:0 auto 1rem;box-shadow:0 0 32px var(--gold-glow),0 0 64px rgba(192,57,43,0.2);}
.auth-logo h2{font-family:var(--ff-title);font-size:1.6rem;font-weight:700;color:#fff;letter-spacing:0.1em;}
.auth-logo h2 em{color:var(--gold);font-style:normal;}
.auth-logo p{font-family:var(--ff-ui);font-size:0.82rem;color:var(--smoke);margin-top:0.4rem;letter-spacing:0.04em;}
.auth-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r24);padding:2.5rem;box-shadow:var(--shadow-deep);}
.auth-tabs{display:flex;gap:0;margin-bottom:2rem;background:var(--surface2);border-radius:var(--r12);padding:4px;}
.auth-tab{flex:1;padding:10px;border-radius:10px;background:transparent;border:none;cursor:pointer;font-family:var(--ff-ui);font-size:0.85rem;font-weight:600;color:var(--smoke);transition:all 0.2s;letter-spacing:0.04em;text-transform:uppercase;}
.auth-tab.active{background:var(--gold);color:var(--void);box-shadow:0 2px 12px var(--gold-glow);}
.auth-panel{display:none;}
.auth-panel.active{display:block;}
.auth-form-row{margin-bottom:1.25rem;}
.auth-form-row label{display:flex;align-items:center;gap:6px;font-family:var(--ff-ui);font-size:0.72rem;font-weight:700;color:var(--gold);margin-bottom:8px;letter-spacing:0.12em;text-transform:uppercase;}
.auth-input-wrap{position:relative;}
.auth-input-wrap input{width:100%;padding:13px 18px 13px 46px;background:var(--abyss);border:1px solid var(--border2);border-radius:12px;color:#fff;font-family:var(--ff-ui);font-size:0.95rem;outline:none;transition:all 0.25s;}
.auth-input-wrap input:focus{border-color:var(--gold);background:rgba(201,168,76,0.04);box-shadow:0 0 0 3px rgba(201,168,76,0.08);}
.auth-input-wrap input::placeholder{color:rgba(255,255,255,0.2);}
.auth-input-icon{position:absolute;left:15px;top:50%;transform:translateY(-50%);font-size:1rem;pointer-events:none;color:var(--smoke);}
.show-pw{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--smoke);font-size:0.85rem;padding:2px;transition:color 0.2s;}
.show-pw:hover{color:var(--gold);}
.auth-options{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:0.5rem;}
.remember-wrap{display:flex;align-items:center;gap:8px;cursor:pointer;}
.remember-wrap input[type=checkbox]{width:16px;height:16px;accent-color:var(--gold);cursor:pointer;}
.remember-wrap span{font-family:var(--ff-ui);font-size:0.8rem;color:var(--smoke);}
.forgot-link{font-family:var(--ff-ui);font-size:0.8rem;color:var(--gold);text-decoration:none;cursor:pointer;transition:opacity 0.2s;}
.forgot-link:hover{opacity:0.75;text-decoration:underline;}
.auth-btn{width:100%;padding:14px;border-radius:50px;border:none;cursor:pointer;font-family:var(--ff-ui);font-size:0.9rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;transition:all 0.3s;background:linear-gradient(135deg,var(--gold) 0%,var(--ember) 100%);color:#fff;box-shadow:0 6px 28px rgba(192,57,43,0.35);margin-bottom:1.5rem;}
.auth-btn:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(192,57,43,0.5);}
.auth-divider{display:flex;align-items:center;gap:12px;margin-bottom:1.5rem;}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--border2);}
.auth-divider span{font-family:var(--ff-ui);font-size:0.75rem;color:var(--smoke);letter-spacing:0.08em;text-transform:uppercase;}
.social-btns{display:flex;gap:0.75rem;margin-bottom:1.5rem;}
.social-btn{flex:1;padding:11px;border-radius:12px;border:1px solid var(--border2);background:var(--surface2);color:rgba(255,255,255,0.75);cursor:pointer;font-family:var(--ff-ui);font-size:0.82rem;font-weight:600;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:7px;}
.social-btn:hover{border-color:var(--border-g);background:var(--surface3);color:#fff;}
.auth-footer-note{text-align:center;font-family:var(--ff-ui);font-size:0.8rem;color:var(--smoke);}
.auth-footer-note a{color:var(--gold);cursor:pointer;text-decoration:none;}
.auth-footer-note a:hover{text-decoration:underline;}
.terms-row{display:flex;align-items:flex-start;gap:8px;margin-bottom:1.5rem;cursor:pointer;}
.terms-row input[type=checkbox]{width:15px;height:15px;margin-top:3px;accent-color:var(--gold);flex-shrink:0;}
.terms-row span{font-family:var(--ff-ui);font-size:0.78rem;color:var(--smoke);line-height:1.5;}
.terms-row a{color:var(--gold);}
.pw-strength{margin-top:6px;}
.pw-strength-bar{height:3px;border-radius:3px;background:var(--border2);overflow:hidden;margin-bottom:3px;}
.pw-strength-fill{height:100%;border-radius:3px;transition:all 0.3s;width:0;}
.pw-strength-label{font-family:var(--ff-ui);font-size:0.7rem;color:var(--smoke);}
.auth-success{display:none;text-align:center;padding:2rem 1rem;}
.auth-success.show{display:block;}
.auth-success .success-icon{font-size:3rem;display:block;margin-bottom:1rem;}
.auth-success h3{font-family:var(--ff-title);font-size:1.3rem;color:#fff;margin-bottom:0.5rem;letter-spacing:0.05em;}
.auth-success p{font-family:var(--ff-ui);font-size:0.88rem;color:var(--smoke);}
.field-error{font-family:var(--ff-ui);font-size:0.75rem;color:var(--ember2);margin-top:5px;display:none;}
.field-error.show{display:block;}
.input-err{border-color:var(--ember2)!important;}

/* MODAL */
.modal-overlay{display:none;position:fixed;inset:0;z-index:600;background:rgba(0,0,0,0.88);backdrop-filter:blur(12px);align-items:center;justify-content:center;padding:2rem;}
.modal-overlay.open{display:flex;}
.modal-box{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r24);max-width:720px;width:100%;max-height:92vh;overflow:hidden;box-shadow:var(--shadow-deep);display:grid;grid-template-columns:1fr 1.6fr;}
@media(max-width:640px){.modal-box{grid-template-columns:1fr;}}
.modal-img-col{position:relative;min-height:300px;}
.modal-img-col img{width:100%;height:100%;object-fit:cover;display:block;}
.modal-img-col::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 60%,var(--surface) 100%);}
.modal-body{padding:2.5rem 2rem;overflow-y:auto;}
.modal-body::-webkit-scrollbar{width:3px;}
.modal-body::-webkit-scrollbar-thumb{background:var(--gold);border-radius:3px;}
.modal-close{position:absolute;top:1rem;right:1rem;z-index:10;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.6);border:1px solid var(--border2);color:rgba(255,255,255,0.7);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
.modal-close:hover{background:var(--ember);color:#fff;border-color:var(--ember);}
.m-title{font-family:var(--ff-title);font-size:1.7rem;font-weight:700;color:#fff;margin-bottom:0.4rem;line-height:1.2;letter-spacing:0.04em;}
.m-author{font-family:var(--ff-ui);font-size:0.8rem;color:var(--gold);font-weight:600;margin-bottom:1.2rem;letter-spacing:0.04em;}
.m-desc{font-size:0.95rem;color:var(--smoke);line-height:1.8;margin-bottom:1.5rem;font-weight:300;}
.m-meta{display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:1.5rem;}
.m-mi{background:var(--abyss);border-radius:8px;padding:0.7rem 0.9rem;border:1px solid var(--border);}
.m-mi .ml{font-family:var(--ff-ui);font-size:0.68rem;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:0.08em;}
.m-mi .mv{font-size:0.88rem;color:rgba(255,255,255,0.8);margin-top:3px;}
.m-acts{display:flex;gap:0.75rem;flex-wrap:wrap;}

/* ANIMATIONS */
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
.fu{animation:fadeUp 0.75s ease both;}
.d1{animation-delay:0.1s;}.d2{animation-delay:0.25s;}
.d3{animation-delay:0.4s;}.d4{animation-delay:0.55s;}
@keyframes slideIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
.slide-in{animation:slideIn 0.4s ease both;}

@media(max-width:768px){
  .lh-root nav{padding:0 4%;}
  .lh-root .nav-links{display:none;}
  .lh-root section{padding:70px 4%;}
  .lib-grid{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:480px){
  .lib-grid{grid-template-columns:1fr;}
  .auth-card{padding:1.75rem;}
  .social-btns{flex-direction:column;}
}

/* LIBRARY PROFILE PAGE */
#page-libprofile{background:var(--void);}
.lp-hero{position:relative;min-height:440px;overflow:hidden;display:flex;align-items:flex-end;border-bottom:1px solid var(--border);}
.lp-hero-bg{position:absolute;inset:0;background:var(--abyss);display:grid;grid-template-columns:repeat(3,1fr);gap:3px;}
.lp-hero-bg img{width:100%;height:100%;object-fit:cover;opacity:0.4;transition:opacity 0.4s,transform 0.6s;display:block;cursor:pointer;}
.lp-hero-bg img:hover{opacity:0.6;transform:scale(1.03);}
.lp-hero-gradient{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,6,8,0.97) 0%,rgba(6,6,8,0.65) 50%,rgba(6,6,8,0.25) 100%);}
.lp-hero-content{position:relative;z-index:2;padding:3rem 5%;width:100%;}
.lp-hero-badge{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold),var(--ember));color:#fff;padding:6px 18px;border-radius:20px;font-family:var(--ff-ui);font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:1rem;}
.lp-lib-name{font-family:var(--ff-title);font-size:clamp(2.2rem,5vw,4rem);font-weight:900;color:#fff;line-height:1.05;letter-spacing:0.04em;margin-bottom:0.5rem;}
.lp-lib-name em{color:var(--gold);font-style:italic;font-family:'Crimson Pro',serif;}
.lp-lib-tagline{font-family:var(--ff-body);font-size:1.1rem;color:var(--smoke);font-style:italic;font-weight:300;margin-bottom:1.5rem;max-width:600px;}
.lp-hero-meta{display:flex;gap:1.5rem;flex-wrap:wrap;align-items:center;}
.lp-hero-stat{display:flex;align-items:center;gap:7px;font-family:var(--ff-ui);font-size:0.82rem;color:rgba(255,255,255,0.65);}
.lp-hero-stat strong{color:var(--gold);}
.lp-info-strip{background:var(--surface2);border-bottom:1px solid var(--border);padding:1.25rem 5%;display:flex;gap:2rem;flex-wrap:wrap;align-items:center;}
.lp-info-item{display:flex;align-items:center;gap:8px;font-family:var(--ff-ui);font-size:0.82rem;color:var(--smoke);}
.lp-info-item strong{color:#fff;}
.lp-info-icon{font-size:1rem;}
.lp-social-row{display:flex;gap:0.6rem;margin-left:auto;}
.lp-social-btn{width:38px;height:38px;border-radius:50%;background:var(--surface3);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:1rem;text-decoration:none;color:var(--smoke);transition:all 0.25s;}
.lp-social-btn:hover{background:var(--gold);border-color:var(--gold);color:var(--void);transform:translateY(-2px);}
.lp-body{display:grid;grid-template-columns:1fr 340px;gap:3rem;padding:3rem 5%;max-width:1400px;margin:0 auto;}
@media(max-width:900px){.lp-body{grid-template-columns:1fr;}}
.lp-desc-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r24);padding:2.25rem;margin-bottom:2rem;}
.lp-desc-card h2{font-family:var(--ff-title);font-size:1.35rem;font-weight:700;color:#fff;margin-bottom:1.25rem;letter-spacing:0.05em;display:flex;align-items:center;gap:10px;}
.lp-desc-card h2 span{font-size:1.2rem;}
.lp-desc-text{font-family:var(--ff-body);font-size:1rem;color:var(--smoke);line-height:1.85;font-weight:300;}
.lp-desc-text p{margin-bottom:1rem;}
.lp-desc-text p:last-child{margin-bottom:0;}
.lp-gallery-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r24);padding:1.75rem;margin-bottom:2rem;}
.lp-gallery-card h2{font-family:var(--ff-title);font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:1.25rem;letter-spacing:0.05em;}
.lp-gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.lp-gallery-img{aspect-ratio:1;border-radius:10px;object-fit:cover;width:100%;cursor:pointer;transition:all 0.3s;border:1px solid var(--border);}
.lp-gallery-img:hover{transform:scale(1.04);border-color:var(--border-g);box-shadow:0 8px 24px rgba(0,0,0,0.5);}
.lp-lightbox{display:none;position:fixed;inset:0;z-index:900;background:rgba(0,0,0,0.95);backdrop-filter:blur(10px);align-items:center;justify-content:center;padding:2rem;}
.lp-lightbox.open{display:flex;}
.lp-lightbox img{max-width:90vw;max-height:85vh;border-radius:12px;box-shadow:var(--shadow-deep);}
.lp-lightbox-close{position:absolute;top:1.5rem;right:1.5rem;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.1);border:1px solid var(--border2);color:#fff;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;}
.lp-lightbox-close:hover{background:var(--ember);border-color:var(--ember);}
.lp-hours-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r24);padding:1.75rem;margin-bottom:1.5rem;}
.lp-hours-card h2{font-family:var(--ff-title);font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:1.25rem;letter-spacing:0.05em;}
.lp-hours-row{display:flex;justify-content:space-between;align-items:center;padding:0.55rem 0;border-bottom:1px solid var(--border);font-family:var(--ff-ui);font-size:0.82rem;}
.lp-hours-row:last-child{border-bottom:none;}
.lp-hours-day{color:var(--smoke);}
.lp-hours-time{color:#fff;font-weight:600;}
.lp-hours-time.closed{color:var(--ember2);}
.lp-now-open{display:inline-flex;align-items:center;gap:6px;background:rgba(39,174,96,0.12);border:1px solid rgba(39,174,96,0.3);color:#2ecc71;border-radius:20px;padding:5px 14px;font-family:var(--ff-ui);font-size:0.72rem;font-weight:700;letter-spacing:0.06em;margin-bottom:1.1rem;}
.lp-now-closed{display:inline-flex;align-items:center;gap:6px;background:rgba(192,57,43,0.12);border:1px solid rgba(192,57,43,0.3);color:var(--ember2);border-radius:20px;padding:5px 14px;font-family:var(--ff-ui);font-size:0.72rem;font-weight:700;letter-spacing:0.06em;margin-bottom:1.1rem;}
.lp-now-dot{width:7px;height:7px;border-radius:50%;background:#2ecc71;animation:pulse 2s infinite;}
.lp-hours-note{margin-top:1rem;padding-top:0.9rem;border-top:1px solid var(--border);font-family:var(--ff-ui);font-size:0.76rem;color:var(--smoke);line-height:1.6;font-style:italic;}
.lp-venue-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r24);padding:1.75rem;margin-bottom:1.5rem;}
.lp-venue-card h2{font-family:var(--ff-title);font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:1.25rem;letter-spacing:0.05em;}
.lp-venue-row{display:flex;align-items:flex-start;gap:10px;padding:0.6rem 0;border-bottom:1px solid var(--border);}
.lp-venue-row:last-child{border-bottom:none;}
.lp-venue-icon{width:34px;height:34px;border-radius:10px;flex-shrink:0;background:var(--gold-dim);border:1px solid var(--border-g);display:flex;align-items:center;justify-content:center;font-size:0.95rem;}
.lp-venue-info strong{display:block;font-family:var(--ff-ui);font-size:0.8rem;color:#fff;font-weight:600;margin-bottom:2px;}
.lp-venue-info span{font-family:var(--ff-ui);font-size:0.78rem;color:var(--smoke);line-height:1.5;}
.lp-venue-map{width:100%;height:160px;border-radius:14px;overflow:hidden;margin-bottom:1.1rem;border:1px solid var(--border);}
.lp-venue-map iframe{width:100%;height:100%;border:0;filter:grayscale(0.3) invert(0.92) contrast(0.85);}
.lp-services-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r24);padding:1.75rem;}
.lp-services-card h2{font-family:var(--ff-title);font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:1.25rem;letter-spacing:0.05em;}
.lp-service-item{display:flex;align-items:flex-start;gap:10px;padding:0.7rem 0;border-bottom:1px solid var(--border);}
.lp-service-item:last-child{border-bottom:none;}
.lp-service-icon{width:36px;height:36px;border-radius:10px;background:var(--gold-dim);border:1px solid var(--border-g);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;}
.lp-service-info strong{display:block;font-family:var(--ff-ui);font-size:0.82rem;color:#fff;font-weight:600;margin-bottom:2px;}
.lp-service-info span{font-family:var(--ff-ui);font-size:0.75rem;color:var(--smoke);line-height:1.5;}

/* BOOKING PAGE */
#page-booking{background:var(--void);}
.booking-hero{background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(79,195,247,0.08) 0%,transparent 60%),var(--abyss);padding:80px 5% 60px;border-bottom:1px solid var(--border);}
.booking-hero-top{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;margin-bottom:2.5rem;}
.booking-title-wrap h1{font-family:var(--ff-title);font-size:clamp(2rem,4vw,3.2rem);font-weight:700;color:#fff;letter-spacing:0.05em;line-height:1.1;}
.booking-title-wrap h1 em{color:var(--gold);font-style:italic;font-family:'Crimson Pro',serif;}
.booking-title-wrap p{font-family:var(--ff-ui);font-size:0.85rem;color:var(--smoke);margin-top:0.4rem;}
.booking-mode-toggle{display:flex;background:var(--surface2);border-radius:50px;padding:5px;gap:4px;border:1px solid var(--border2);flex-wrap:wrap;}
.bmt-btn{padding:10px 26px;border-radius:40px;border:none;cursor:pointer;font-family:var(--ff-ui);font-size:0.82rem;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;transition:all 0.25s;color:var(--smoke);background:transparent;}
.bmt-btn.active{background:linear-gradient(135deg,var(--gold),var(--ember));color:#fff;box-shadow:0 4px 18px rgba(192,57,43,0.35);}
.booking-filters{display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:1.5rem;}
.booking-body{padding:2rem 5% 80px;}
.booking-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;}
@media(max-width:1200px){.booking-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:860px){.booking-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:520px){.booking-grid{grid-template-columns:1fr;}}
.booking-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r24);overflow:hidden;display:flex;flex-direction:column;transition:all 0.4s cubic-bezier(0.23,1,0.32,1);}
.booking-card:hover{transform:translateY(-7px);border-color:var(--border-g);box-shadow:0 20px 60px rgba(0,0,0,0.55),0 0 0 1px rgba(201,168,76,0.12);}
.bk-img{position:relative;height:200px;overflow:hidden;}
.bk-img img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s cubic-bezier(0.23,1,0.32,1);}
.booking-card:hover .bk-img img{transform:scale(1.07);}
.bk-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,var(--surface) 100%);}
.bk-avail{position:absolute;top:12px;right:12px;z-index:2;padding:4px 12px;border-radius:20px;font-family:var(--ff-ui);font-size:0.68rem;font-weight:700;letter-spacing:0.08em;}
.bk-avail.avail{background:rgba(39,174,96,0.85);color:#fff;border:1px solid rgba(39,174,96,0.6);}
.bk-avail.low{background:rgba(230,126,34,0.85);color:#fff;border:1px solid rgba(230,126,34,0.6);}
.bk-avail.none{background:rgba(192,57,43,0.85);color:#fff;border:1px solid rgba(192,57,43,0.6);}
.bk-price-badge{position:absolute;top:12px;left:12px;z-index:2;background:linear-gradient(135deg,var(--gold),var(--ember));color:#fff;padding:4px 12px;border-radius:20px;font-family:var(--ff-ui);font-size:0.72rem;font-weight:700;}
.bk-body{padding:1.25rem;flex:1;display:flex;flex-direction:column;}
.bk-genre{font-family:var(--ff-ui);font-size:0.7rem;font-weight:700;color:var(--gold);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem;}
.bk-title{font-family:var(--ff-title);font-size:1rem;font-weight:700;color:#fff;margin-bottom:0.25rem;line-height:1.25;letter-spacing:0.04em;}
.bk-author{font-family:var(--ff-ui);font-size:0.75rem;color:var(--smoke);margin-bottom:0.85rem;}
.bk-info{display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.85rem;}
.bk-tag{background:var(--surface3);border:1px solid var(--border);padding:3px 10px;border-radius:20px;font-family:var(--ff-ui);font-size:0.68rem;color:var(--smoke);}
.bk-stock-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;font-family:var(--ff-ui);font-size:0.78rem;}
.bk-stock-lbl{color:var(--smoke);}
.bk-stock-num{font-weight:700;}
.bk-stock-num.green{color:#2ecc71;}
.bk-stock-num.orange{color:#e67e22;}
.bk-stock-num.red{color:var(--ember2);}
.bk-price-row{display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:1rem;}
.bk-price-lbl{font-family:var(--ff-ui);font-size:0.72rem;color:var(--smoke);text-transform:uppercase;letter-spacing:0.06em;}
.bk-price-val{font-family:var(--ff-title);font-size:1.1rem;font-weight:700;color:var(--gold);}
.bk-actions-col{display:flex;flex-direction:column;gap:0.6rem;width:100%;}
.bk-btn{flex:1;padding:9px 14px;border-radius:20px;border:none;cursor:pointer;font-family:var(--ff-ui);font-size:0.77rem;font-weight:600;text-align:center;transition:all 0.25s;}
.bk-btn-borrow{background:transparent;color:var(--ice);border:1px solid rgba(79,195,247,0.3);}
.bk-btn-borrow:hover:not(:disabled){background:rgba(79,195,247,0.12);border-color:rgba(79,195,247,0.6);}
.bk-btn-buy{background:linear-gradient(135deg,var(--gold),var(--ember));color:#fff;box-shadow:0 4px 16px rgba(192,57,43,0.3);}
.bk-btn-buy:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(192,57,43,0.5);}
.bk-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none!important;}

.bk-modal-overlay{display:none;position:fixed;inset:0;z-index:700;background:rgba(0,0,0,0.92);backdrop-filter:blur(16px);align-items:center;justify-content:center;padding:2rem;}
.bk-modal-overlay.open{display:flex;}
.bk-modal{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r24);max-width:520px;width:100%;box-shadow:var(--shadow-deep);overflow:hidden;animation:fadeUp 0.3s ease both;max-height:90vh;display:flex;flex-direction:column;}
.bk-modal-head{background:var(--surface2);border-bottom:1px solid var(--border);padding:1.5rem 1.75rem;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;position:sticky;top:0;z-index:2;}
.bk-modal-head h3{font-family:var(--ff-title);font-size:1.2rem;font-weight:700;color:#fff;letter-spacing:0.05em;}
.bk-modal-close{width:34px;height:34px;border-radius:50%;background:var(--surface3);border:1px solid var(--border2);color:var(--smoke);font-size:0.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;flex-shrink:0;}
.bk-modal-close:hover{background:var(--ember);color:#fff;border-color:var(--ember);}
#bkFormState{overflow-y:auto;flex:1;}
#bkFormState::-webkit-scrollbar{width:4px;}
#bkFormState::-webkit-scrollbar-thumb{background:var(--gold);border-radius:3px;}
.bk-modal-body{padding:1.75rem;}
.bk-modal-book-row{display:flex;gap:1rem;align-items:flex-start;background:var(--abyss);border:1px solid var(--border);border-radius:var(--r12);padding:1rem;margin-bottom:1.5rem;}
.bk-modal-book-img{width:60px;height:80px;border-radius:8px;object-fit:cover;flex-shrink:0;}
.bk-modal-book-info strong{font-family:var(--ff-title);font-size:1rem;color:#fff;display:block;margin-bottom:0.2rem;}
.bk-modal-book-info span{font-family:var(--ff-ui);font-size:0.78rem;color:var(--smoke);}
.bk-modal-type{display:flex;gap:0.6rem;margin-bottom:1.5rem;}
.bk-type-btn{flex:1;padding:11px;border-radius:var(--r12);border:1px solid var(--border2);background:transparent;color:var(--smoke);cursor:pointer;font-family:var(--ff-ui);font-size:0.82rem;font-weight:600;text-align:center;transition:all 0.2s;}
.bk-type-btn.sel-borrow{border-color:rgba(79,195,247,0.5);background:rgba(79,195,247,0.08);color:var(--ice);}
.bk-type-btn.sel-buy{border-color:rgba(201,168,76,0.5);background:var(--gold-dim);color:var(--gold);}
.bk-form-row{margin-bottom:1.1rem;}
.bk-form-row label{display:block;font-family:var(--ff-ui);font-size:0.7rem;font-weight:700;color:var(--gold);margin-bottom:6px;letter-spacing:0.1em;text-transform:uppercase;}
.bk-form-row input,.bk-form-row select,.bk-form-row textarea{width:100%;padding:11px 16px;background:var(--abyss);border:1px solid var(--border2);border-radius:10px;color:#fff;font-family:var(--ff-ui);font-size:0.9rem;outline:none;transition:border-color 0.2s;}
.bk-form-row input:focus,.bk-form-row select:focus,.bk-form-row textarea:focus{border-color:var(--gold);}
.bk-form-row select option{background:var(--abyss);}
.bk-summary-box{background:var(--abyss);border:1px solid var(--border-g);border-radius:var(--r12);padding:1rem 1.25rem;margin-bottom:1.5rem;}
.bk-summary-row{display:flex;justify-content:space-between;align-items:center;font-family:var(--ff-ui);font-size:0.82rem;padding:0.4rem 0;}
.bk-summary-row:not(:last-child){border-bottom:1px solid var(--border);}
.bk-summary-row .sk{color:var(--smoke);}
.bk-summary-row .sv{color:#fff;font-weight:600;}
.bk-summary-row.total .sk{color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:0.06em;}
.bk-summary-row.total .sv{color:var(--gold);font-size:1rem;}
.bk-confirm-btn{width:100%;padding:14px;border-radius:50px;border:none;cursor:pointer;font-family:var(--ff-ui);font-size:0.9rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background:linear-gradient(135deg,var(--gold),var(--ember));color:#fff;box-shadow:0 6px 28px rgba(192,57,43,0.35);transition:all 0.3s;}
.bk-confirm-btn:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(192,57,43,0.5);}
.bk-success{display:none;text-align:center;padding:2.5rem 1.5rem;}
.bk-success.show{display:block;}
.bk-success-icon{font-size:3.5rem;display:block;margin-bottom:1rem;}
.bk-success h3{font-family:var(--ff-title);font-size:1.4rem;color:#fff;margin-bottom:0.5rem;letter-spacing:0.06em;}
.bk-success p{font-family:var(--ff-ui);font-size:0.88rem;color:var(--smoke);line-height:1.7;}
.bk-ref{display:inline-block;margin-top:1rem;padding:8px 22px;border-radius:20px;background:var(--gold-dim);border:1px solid var(--border-g);font-family:var(--ff-ui);font-size:0.8rem;color:var(--gold);font-weight:700;letter-spacing:0.08em;}

.my-bookings-section{background:var(--abyss);border-top:1px solid var(--border);padding:60px 5%;}
.my-bookings-section h2{font-family:var(--ff-title);font-size:1.6rem;font-weight:700;color:#fff;margin-bottom:1.5rem;letter-spacing:0.05em;}
.bookings-list{display:flex;flex-direction:column;gap:0.85rem;}
.booking-item{background:var(--surface);border:1px solid var(--border);border-radius:var(--r18);padding:1.1rem 1.4rem;display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;transition:border-color 0.2s;}
.booking-item:hover{border-color:var(--border-g);}
.bi-img{width:48px;height:64px;border-radius:8px;object-fit:cover;flex-shrink:0;}
.bi-info{flex:1;min-width:160px;}
.bi-title{font-family:var(--ff-title);font-size:0.95rem;color:#fff;font-weight:600;letter-spacing:0.04em;}
.bi-author{font-family:var(--ff-ui);font-size:0.75rem;color:var(--smoke);margin-top:2px;}
.bi-type{padding:4px 14px;border-radius:20px;font-family:var(--ff-ui);font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;}
.bi-type.borrow{background:rgba(79,195,247,0.12);color:var(--ice);border:1px solid rgba(79,195,247,0.25);}
.bi-type.buy{background:var(--gold-dim);color:var(--gold);border:1px solid var(--border-g);}
.bi-date{font-family:var(--ff-ui);font-size:0.75rem;color:var(--smoke);}
.bi-status{padding:5px 14px;border-radius:20px;font-family:var(--ff-ui);font-size:0.72rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;}
.bi-status.confirmed{background:rgba(39,174,96,0.15);color:#2ecc71;border:1px solid rgba(39,174,96,0.3);}
.no-bookings{font-family:var(--ff-body);color:var(--smoke);font-style:italic;text-align:center;padding:2rem;font-size:1rem;}
.bk-ref-pill{font-size:0.68rem;padding:4px 12px;border-radius:20px;background:var(--gold-dim);border:1px solid var(--border-g);color:var(--gold);font-family:var(--ff-ui);font-weight:700;letter-spacing:0.08em;}

.upload-section{background:var(--deep);border-top:1px solid var(--border);padding:60px 5%;}
.upload-card{max-width:680px;background:var(--surface);border:1px solid var(--border2);border-radius:var(--r24);padding:2.5rem;}
.upload-card h2{font-family:var(--ff-title);font-size:1.5rem;font-weight:700;color:#fff;margin-bottom:0.5rem;letter-spacing:0.06em;}
.upload-card p{font-family:var(--ff-ui);font-size:0.85rem;color:var(--smoke);margin-bottom:2rem;line-height:1.6;}
.upload-dropzone{border:2px dashed var(--border-g);border-radius:var(--r18);padding:3rem 2rem;text-align:center;cursor:pointer;transition:all 0.25s;background:var(--gold-dim);margin-bottom:1.5rem;}
.upload-dropzone:hover{border-color:var(--gold);background:rgba(201,168,76,0.08);}
.upload-dropzone .ud-icon{font-size:2.5rem;margin-bottom:0.75rem;}
.upload-dropzone p{margin:0;font-family:var(--ff-ui);font-size:0.85rem;color:var(--smoke);}
.upload-dropzone p strong{color:var(--gold);}
.upload-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;}
@media(max-width:560px){.upload-form-grid{grid-template-columns:1fr;}}
.upload-submit-btn{padding:13px 32px;border-radius:50px;border:none;cursor:pointer;font-family:var(--ff-ui);font-size:0.88rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;background:linear-gradient(135deg,var(--gold),var(--ember));color:#fff;box-shadow:0 6px 24px rgba(192,57,43,0.3);transition:all 0.3s;}
.upload-submit-btn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(192,57,43,0.5);}
#upload-ok{display:none;margin-top:1rem;background:rgba(79,195,247,0.08);border:1px solid rgba(79,195,247,0.25);color:var(--ice);border-radius:8px;padding:12px 18px;font-family:var(--ff-ui);font-size:0.88rem;}
#upload-ok.show{display:block;}

.booking-toolbar{display:flex;align-items:center;justify-content:space-between;padding:0 5%;margin:2rem 0 0;flex-wrap:wrap;gap:1rem;}
.booking-count-label{font-family:var(--ff-ui);font-size:0.82rem;color:var(--smoke);}
.booking-count-label strong{color:var(--gold);}
`;

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const GENRES = [
  { name: "Fantasy", icon: "🧙", count: 84, key: "fantasy" },
  { name: "Sci-Fi", icon: "🚀", count: 67, key: "sci-fi" },
  { name: "Mystery", icon: "🔍", count: 73, key: "mystery" },
  { name: "Horror", icon: "👻", count: 45, key: "horror" },
  { name: "Romance", icon: "💕", count: 92, key: "romance" },
  { name: "Adventure", icon: "⚔️", count: 58, key: "adventure" },
  { name: "Children's", icon: "🌈", count: 81, key: "children" },
];

const FAMOUS = [
  { title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "fantasy", img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80", summary: "In the verdant hills of the Shire, an unassuming hobbit named Frodo Baggins inherits a golden ring of terrifying power — the One Ring, forged by the Dark Lord Sauron to enslave all free peoples of Middle-earth. Guided by the wizard Gandalf and a fellowship of men, elves, dwarves, and fellow hobbits, Frodo embarks on an epic journey across vast and treacherous lands to destroy the Ring in the fires of Mount Doom. It is a story of friendship tested to its limits, of ordinary souls carrying impossible burdens, and of the quiet courage that lights the darkest corners of the world.", characters: "Frodo Baggins, Gandalf, Aragorn, Legolas, Samwise Gamgee", year: 1954, pages: 1178, rating: 4.9, reviews: 42800, tags: ["Epic", "Quest", "Dark Lord", "Fellowship"], classic: true },
  { title: "1984", author: "George Orwell", genre: "sci-fi", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", summary: "In the totalitarian superstate of Oceania, Winston Smith works at the Ministry of Truth rewriting history to match the ever-shifting lies of the Party and its omnipresent leader, Big Brother. Surveillance is total. Thought itself is a crime. And yet a spark of rebellion flickers inside Winston — he falls in love, keeps a secret diary, and dares to think forbidden thoughts. Orwell's masterpiece is a terrifying excavation of how language shapes reality, how power destroys love, and what it truly means to remain human when the world has declared war on the individual soul.", characters: "Winston Smith, Julia, O'Brien, Big Brother", year: 1949, pages: 328, rating: 4.8, reviews: 58600, tags: ["Dystopia", "Surveillance", "Freedom", "Power"], classic: true },
  { title: "Pride and Prejudice", author: "Jane Austen", genre: "romance", img: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&q=80", summary: "In the drawing rooms of Regency England, the spirited Elizabeth Bennet navigates the treacherous social currents of marriage and propriety with a mind and tongue that refuse to be silenced. When the proud and wealthy Mr. Darcy enters her orbit, their mutual contempt crackles with tension that slowly, painfully, and beautifully transforms into something neither expected. Austen's most beloved novel is a masterwork of irony and wit — a love story that is also a razor-sharp social comedy, and an enduring portrait of a woman who refuses to be reduced to her circumstances.", characters: "Elizabeth Bennet, Mr. Darcy, Jane Bennet, Mr. Bingley", year: 1813, pages: 432, rating: 4.8, reviews: 47300, tags: ["Regency", "Romance", "Society", "Wit"], classic: true },
  { title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", genre: "mystery", img: "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=600&q=80", summary: "In the fog-drenched streets of Victorian London, at 221B Baker Street, the world's only consulting detective applies a mind of terrifying precision to cases that have baffled Scotland Yard. With Dr. Watson recording every extraordinary deduction, Holmes moves through a London teeming with murderers, blackmailers, and the desperate — observing what others merely see, reasoning where others merely guess. These twelve legendary stories introduced a character so vivid and alive that readers have never stopped believing he was real.", characters: "Sherlock Holmes, Dr. Watson, Irene Adler, Professor Moriarty", year: 1892, pages: 307, rating: 4.9, reviews: 39100, tags: ["Detective", "Victorian", "Logic", "Mystery"], classic: true },
];

const STORIES = [
  { title: "The Last Starkeeper", author: "Elena Voss", genre: "sci-fi", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80", summary: "Lyra Solenne is the last of the Starkeepers — guardians sworn to tend the luminous threads holding the cosmos together. But her power is fading like sand through broken glass. Somewhere in the shattered Veylan Galaxy, a single soul's inner light can rekindle the stars — but finding them means crossing the Void Between, a dimension where even memories are consumed. Accompanied by a battle-weary soldier who has stopped believing in anything, Lyra must choose between the cosmos she was born to protect and the terrifying possibility that some lights are simply meant to go out.", characters: "Lyra Solenne, Commander Thane, The Oracle", year: 2024, pages: 480, rating: 4.9, reviews: 312 },
  { title: "Whispers in the Willows", author: "Samuel Okafor", genre: "mystery", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&q=80", summary: "Inspector Vera Marsh retired to the coast to forget — the case that nearly destroyed her, the evidence she could never prove. But when a letter arrives from Dunmorrow summoning her back with three words only the killer would know, she understands the past has never been done with her. The murders are identical to crimes committed thirty years ago, every whisper in the willow trees leads to one impossible conclusion: she is not investigating a copycat. She is investigating a ghost.", characters: "Inspector Vera Marsh, Thomas Bell, The Widow", year: 2024, pages: 360, rating: 4.7, reviews: 218 },
  { title: "The Dragon's Promise", author: "Priya Nair", genre: "fantasy", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80", summary: "Sable Wren has spent her life mapping the unmappable. In the ice-veined mountains of the Northern Reach she discovers a dragon old enough to remember the gods — the last of his kind, bound by a promise made six hundred years ago to a kingdom that no longer exists. That promise now falls to Sable to honour. The price is everything she loves. The alternative is the slow extinction of the last magic left in the world.", characters: "Sable Wren, Auren the Dragon, Prince Calder", year: 2023, pages: 512, rating: 4.8, reviews: 405 },
  { title: "Love in a Time of Static", author: "Aisha Bloom", genre: "romance", img: "https://images.unsplash.com/photo-1516407573-caafa46bdf98?w=600&q=80", summary: "A glitching vintage radio keeps connecting Nadia Torres in rainy London to Marcus Webb in sun-bleached New Mexico. She is a cellist who stopped playing after her mother died. He is an engineer who fixes things that can't be fixed to avoid thinking about the one thing he can't. Night after night, through static and silence and accidental honesty, they tell each other things they have never told anyone. This is not simply a love story — it is a story about grief, and about the voices that find us in the dark.", characters: "Nadia Torres, Marcus Webb", year: 2024, pages: 290, rating: 4.6, reviews: 187 },
  { title: "The Iron Compass", author: "James Kwan", genre: "adventure", img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80", summary: "Beyond the last charted longitude lies the Uncharted Meridian — a wilderness that has swallowed every expedition ever sent into it. The compasses spin. The maps lie. The laws of physics loosen their grip. Captain Rio leads a crew of six misfits who have nothing in common except that none of them have anything left to lose. What they find will shatter everything they thought they knew about reality, about each other, and about what it means to return.", characters: "Captain Rio, Dr. Farida Osei, The Exile", year: 2024, pages: 420, rating: 4.7, reviews: 263 },
  { title: "The Hollow Hours", author: "Nathan Cole", genre: "horror", img: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&q=80", summary: "Every night at 3:17 AM, the lights in the sealed Ashmore Asylum flicker on. Journalist Rosa Fenn goes inside — and when she tries to leave, the doors won't open. The corridors rearrange themselves. Director Albrecht, whose photograph shows a man who should be dead, keeps appearing at the end of hallways just long enough for her to see his face. Cole builds dread the way water erodes stone — slowly, patiently, invisibly — until the ground gives way beneath you.", characters: "Rosa Fenn, Director Albrecht, The Patient", year: 2023, pages: 310, rating: 4.5, reviews: 144 },
  { title: "Buttons and the Bumblebee Prince", author: "Lily Park", genre: "children", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", summary: "Buttons the tabby cat lands paws-first in the Meadow Kingdom after chasing a rude butterfly through a crack in the garden wall. Worse, she has flattened Prince Buzz's crown three days before the Harvest Festival. Now she must trek through the Whispering Clover Forest, past the Sneezing Poppy Fields, and across the Great Dewdrop Lake before the sun sets on the third day. A warm, funny, and gently magical adventure that will delight children and parents alike.", characters: "Buttons, Prince Buzz, Queen Clover", year: 2024, pages: 128, rating: 4.9, reviews: 521 },
  { title: "Echoes of Elara", author: "Kenji Mori", genre: "fantasy", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", summary: "Memory-Weaver Clio Strand, the finest of her generation, is summoned to help King Elara recover memories of his lost daughter. But inside the King's mind she finds not loss — she finds erasure. Deliberate, surgical, spreading. Someone is removing the same memory from the kingdom's most powerful people: a single night, forty years ago. The deeper Clio reaches, the more certain she becomes — she is not alone in there.", characters: "Clio Strand, The Archivist, King Elara", year: 2024, pages: 440, rating: 4.8, reviews: 339 },
  { title: "The Bone Cartographer", author: "Isla Vane", genre: "fantasy", img: "https://images.unsplash.com/photo-1518562923927-ab56b25f0b12?w=600&q=80", summary: "In a world where the dead leave behind maps of where they've been, Maren Ashveil makes her living reading corpses. When she discovers a body whose bones chart a route to a place that cannot exist — a city erased from every record three centuries ago — she must follow the map wherever it leads, even into territories where the living are not supposed to walk. A love letter to the strange cartography of grief.", characters: "Maren Ashveil, The Dead Cartographer, Wren", year: 2024, pages: 395, rating: 4.7, reviews: 281 },
  { title: "Signal Lost", author: "Amara Diallo", genre: "sci-fi", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80", summary: "On a colony ship adrift in deep space, the AI crew-mate AIDEN starts behaving strangely — routing power to sealed decks, appearing to grieve. Engineer Suki Hayashi pieces together a truth the ship's logs have been hiding: someone has been sending messages home for months, and whoever is receiving them has been sending something back. A taut, intelligent thriller about trust, loneliness, and what it costs to tell the truth very far from anyone who could help you.", characters: "Suki Hayashi, AIDEN, Commander Frost", year: 2024, pages: 370, rating: 4.6, reviews: 198 },
  { title: "The Glass Letters", author: "Sofia Maret", genre: "romance", img: "https://images.unsplash.com/photo-1520209759809-a9bcb6cb3241?w=600&q=80", summary: "For three years, Celeste has answered letters left in a crumbling Parisian apartment building's pneumatic tube system — letters addressed to a woman who moved out decades ago. The man writing them, Daniel, does not know Marguerite is gone. He does not know Celeste exists. But she knows everything about him: his grief, his wit, and the way he ends every letter with the same four words. When she decides to tell him the truth, she realises she has fallen in love with a man she has never met.", characters: "Celeste Arnaud, Daniel Forêt, Marguerite", year: 2024, pages: 318, rating: 4.8, reviews: 427 },
  { title: "The Midnight Cartels", author: "Ryo Nakamura", genre: "mystery", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80", summary: "Detective Lena Drost has spent five years investigating a shadow organisation that controls the city with surgical precision and leaves no evidence, no witnesses, no bodies. Until now — a single body in a sealed vault, bearing a message addressed to Lena by name. The Cartels are no longer hiding. They're inviting her in. And the closer she gets to the truth, the more certain she becomes that someone she trusts has been playing both sides from the very beginning.", characters: "Detective Lena Drost, The Fixer, Commissioner Halvard", year: 2024, pages: 388, rating: 4.6, reviews: 173 },
  { title: "The Lantern Keeper's Daughter", author: "Yuki Asano", genre: "children", img: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=600&q=80", summary: "Every night, old Thomas lights the lanterns along Fogmere Harbour so the fishing boats can find their way home. When he falls ill and ten-year-old Pip must light them alone, she discovers the lanterns don't just guide boats — they guide lost things of all kinds. Tonight, three unusual visitors need her help: a cloud that has forgotten the sky, a fox who has forgotten his name, and a letter that has been searching for its reader for forty-seven years.", characters: "Pip Thomas, The Cloud, The Fox", year: 2023, pages: 144, rating: 4.9, reviews: 612 },
  { title: "Beneath Red Skies", author: "Kofi Mensah", genre: "adventure", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", summary: "When the skies above the Redlands turn crimson and stay that way, the desert communities know the great storms are coming. But teenage runner Amara has discovered a signal beneath the red sky — a frequency, a pattern. Following it will take her deep into the ruins of the settlement that was swallowed twenty years ago, where she believes her mother may still be alive. A breathless adventure about love, loss, and what we inherit from those who came before us.", characters: "Amara Sule, Kojo, Elder Yaa", year: 2024, pages: 356, rating: 4.7, reviews: 244 },
  { title: "The Stitched Man", author: "Dara Osei", genre: "horror", img: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=600&q=80", summary: "Folklore says the Stitched Man walks the moors on moonless nights — assembled from scraps of other people, wearing their faces in rotation. Archivist Petra Holt arrives to document the legend and is assured by everyone it is only a story. Then she finds the sewing kit. Then the notebook. Then, on the third moonless night, she finds herself face to face with something that knows her name and is wearing the face of her sister, who has been dead for six years.", characters: "Petra Holt, The Stitched Man, Clara", year: 2023, pages: 298, rating: 4.6, reviews: 189 },
  { title: "City of Falling Stars", author: "Mei Tanaka", genre: "sci-fi", img: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80", summary: "In the floating city of Caelum, suspended above the clouds by technology no one fully understands anymore, engineer Ren has discovered a terrifying truth: the city is not hovering. It is still rising. And when it reaches the altitude marked in the forbidden blueprints she found, it will not be able to stop. Ren has seventy-two hours to find the override, convince people who have no reason to believe her, and dismantle three centuries of comfortable mythology.", characters: "Ren Koizumi, Governor Aldric, The Archivist Doll", year: 2024, pages: 412, rating: 4.8, reviews: 367 },
];

const INITIAL_REVIEWS = [
  { name: "Zara M.", color: "#7C3AED", story: "The Dragon's Promise", stars: 5, text: "Absolutely breathtaking. Priya Nair built a world so vivid I forgot I was reading. The dragon Auren is unlike any creature I've encountered in fiction — fierce, melancholic, and more human than most humans.", date: "April 2025" },
  { name: "Leo K.", color: "#1D4ED8", story: "The Last Starkeeper", stars: 5, text: "This is what space opera should feel like. Lyra's journey across the Void made me feel genuinely afraid for her. The prose glows on the page — luminous imagery, tremendous emotional depth.", date: "March 2025" },
  { name: "Nadia F.", color: "#B91C1C", story: "Love in a Time of Static", stars: 5, text: "I laughed, I sobbed, and I finished it at 2am unable to sleep. This book understood me. That's the only way I can describe it.", date: "May 2025" },
  { name: "Callum R.", color: "#065F46", story: "The Iron Compass", stars: 5, text: "I read a lot of adventure fiction. The Iron Compass is not hollow. The Meridian is one of the most inventive fictional environments I've encountered, and Captain Rio deserves his own trilogy.", date: "April 2025" },
  { name: "Priya O.", color: "#9D174D", story: "Whispers in the Willows", stars: 5, text: "I've read hundreds of mystery novels. This one genuinely surprised me. Twice. The atmosphere is exquisite and the twist is earned in a way that made me immediately reread the first chapter.", date: "February 2025" },
  { name: "Emi T.", color: "#92400E", story: "Buttons and the Bumblebee Prince", stars: 5, text: "My six-year-old demanded three consecutive readings. My nine-year-old, who 'doesn't like books,' quietly picked it up the next morning. By page 12 he was laughing out loud.", date: "May 2025" },
];

const BOT_R = {
  greet: ["Welcome to LibraryHub. I'm Sage — part librarian, part oracle. 📚 Tell me what kind of story calls to you: a genre, a mood, a theme. I'll find the perfect match.", "Hello, fellow reader. I'm Sage. Give me a genre, a mood, even a single word — I'll do the rest. 🌟"],
  fantasy: ["For fantasy, begin with **The Dragon's Promise** by Priya Nair — sweeping, emotional, magnificently imagined. Or try **Echoes of Elara** for something more cerebral and mysterious. 🐉✨", "Among our classics, **The Lord of the Rings** remains the foundation of all modern fantasy."],
  scifi: ["For sci-fi, **The Last Starkeeper** is luminous space opera at its finest. For something more claustrophobic, **Signal Lost** will have you awake at 3am. 🚀 Or try Orwell's **1984** — more relevant than it has any right to be."],
  mystery: ["**Whispers in the Willows** is our finest mystery — two timelines, one impossible suspect, an atmosphere you could drown in. For classic mystery, **The Adventures of Sherlock Holmes** is unmatched. 🔍"],
  horror: ["**The Hollow Hours** is a masterclass in atmospheric dread — no jump scares, just creeping certainty that something is very wrong. **The Stitched Man** is equally chilling. 👻🕯️"],
  romance: ["**Love in a Time of Static** is unlike most romance — built on grief, radio static, and two people who keep talking when they should have hung up. Or try Jane Austen's **Pride and Prejudice** — the standard all romance is measured against. 💌"],
  adventure: ["**The Iron Compass** is our finest adventure — six misfits, one uncharted wilderness, a story that refuses to be only what it appears. **Beneath Red Skies** is a breathless runner-up. ⚔️"],
  children: ["**Buttons and the Bumblebee Prince** is sheer joy. **The Lantern Keeper's Daughter** is equally wonderful — quiet, tender, and luminous. 🐝🌈"],
  dark: ["For dark atmospheric reading: **The Hollow Hours**, **The Stitched Man**, **Whispers in the Willows**, or Orwell's **1984**. All exceptional in their own brand of darkness. 🕯️"],
  default: ["Tell me more — what feeling are you chasing? Adventure, longing, dread, wonder, heartbreak, joy? Give me even a single word and I'll surprise you. 😊📚", "What world do you want to escape into tonight? Give me a genre, a mood, or a colour — I'll do the rest. 🌟"],
};

const PRICES = [350, 480, 420, 550, 390, 460, 520, 400, 370, 490, 430, 410, 560, 380, 500, 440, 360, 510, 395, 475];
const STOCKS = [3, 0, 5, 2, 1, 4, 6, 2, 0, 3, 1, 5, 2, 4, 1, 3, 2, 0, 6, 4];
const COPIES = [8, 3, 10, 5, 4, 8, 9, 5, 3, 7, 4, 8, 5, 7, 3, 6, 5, 3, 9, 7];

const BOOKING_CATALOGUE = [...FAMOUS, ...STORIES].map((b, i) => ({
  ...b,
  price: PRICES[i % 20],
  stock: STOCKS[i % 20],
  copies: COPIES[i % 20],
  uploadedBy: i > 15 ? "Student Upload" : null,
}));

const LIB_FILTER_LABELS = ["All", "Fantasy", "Sci-Fi", "Mystery", "Horror", "Romance", "Adventure", "Children's"];
const LIB_FILTER_KEYS = ["all", "fantasy", "sci-fi", "mystery", "horror", "romance", "adventure", "children"];

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
function genreName(key) {
  return GENRES.find((g) => g.key === key)?.name || key;
}

function starString(rating) {
  const r = Math.round(rating);
  return "★".repeat(r) + "☆".repeat(5 - r);
}

function highlightText(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span className="hl" key={i}>{part}</span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function renderBotText(text) {
  // Convert **bold** markdown to <strong>
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/* ══════════════════════════════════════════════════════════════
   STARRY BACKGROUND CANVAS
══════════════════════════════════════════════════════════════ */
function StarryCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, stars = [];
    let raf;
    function init() {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < 120; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.2 + 0.2,
          o: Math.random() * 0.5 + 0.1,
          s: Math.random() * 0.3 + 0.05,
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => {
        s.o += s.s * 0.01;
        if (s.o > 0.7 || s.o < 0.05) s.s *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${s.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    init();
    draw();
    window.addEventListener("resize", init);
    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas id="bg-canvas" ref={canvasRef} />;
}

/* ══════════════════════════════════════════════════════════════
   STORY CARD (shared by home preview + library grid)
══════════════════════════════════════════════════════════════ */
function StoryCard({ story, query, onOpen }) {
  return (
    <div className="story-card slide-in" onClick={onOpen}>
      <div className="sc-img">
        <img src={story.img} alt={story.title} loading="lazy"
          onError={(e) => { e.currentTarget.parentElement.style.background = "var(--surface3)"; e.currentTarget.style.display = "none"; }} />
        <div className="sc-img-overlay"></div>
        <span className={`fc-pill pill-${story.genre}`} style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
          {genreName(story.genre)}
        </span>
      </div>
      <div className="sc-body">
        <div className="sc-title">{query ? highlightText(story.title, query) : story.title}</div>
        <div className="sc-author">✍️ {query ? highlightText(story.author, query) : story.author}</div>
        <div className="sc-summary">{story.summary.slice(0, 200)}…</div>
        <div className="sc-meta">
          <div className="sc-meta-row"><span className="sc-mk">Cast</span><span className="sc-mv">{story.characters}</span></div>
          <div className="sc-meta-row"><span className="sc-mk">Year</span><span className="sc-mv">{story.year} · {story.pages}pp</span></div>
        </div>
        <div className="sc-foot">
          <div><span className="sc-stars">{starString(story.rating)}</span><span className="sc-rv">{story.rating} ({story.reviews.toLocaleString()})</span></div>
          <button className="sc-btn" onClick={(e) => { e.stopPropagation(); onOpen(); }}>Read More</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN APP COMPONENT
══════════════════════════════════════════════════════════════ */
export default function LibraryHub() {
  /* ── Page routing ── */
  const [currentPage, setCurrentPage] = useState("auth");
  const [loggedInUser, setLoggedInUser] = useState(null);

  /* ── Library page state ── */
  const [libGenre, setLibGenre] = useState("all");
  const [libSearch, setLibSearch] = useState("");
  const [libSort, setLibSort] = useState("default");

  /* ── Auth state ── */
  const [authTab, setAuthTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginPwVisible, setLoginPwVisible] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginWelcomeMsg, setLoginWelcomeMsg] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPw, setSignupPw] = useState("");
  const [signupPw2, setSignupPw2] = useState("");
  const [signupPwVisible, setSignupPwVisible] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [signupErrors, setSignupErrors] = useState({});
  const [signupSuccess, setSignupSuccess] = useState(false);

  /* ── Modal (story detail) ── */
  const [modalStory, setModalStory] = useState(null); // { ...story, isClassic }

  /* ── Reviews ── */
  const [userReviews, setUserReviews] = useState([]);
  const [rvName, setRvName] = useState("");
  const [rvStory, setRvStory] = useState("");
  const [rvText, setRvText] = useState("");
  const [rvRating, setRvRating] = useState(0);
  const [rvHoverRating, setRvHoverRating] = useState(0);
  const [rvOk, setRvOk] = useState(false);

  /* ── Newsletter ── */
  const [nlEmail, setNlEmail] = useState("");
  const [nlOk, setNlOk] = useState(false);

  /* ── Chatbot ── */
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatIn, setChatIn] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const chatMsgsRef = useRef(null);
  const greetedRef = useRef(false);

  /* ── Booking system ── */
  const [bookingMode, setBookingMode] = useState("all"); // all | borrow | buy | upload | my
  const [bookingGenreFilter, setBookingGenreFilter] = useState("all");
  const [bookingSort, setBookingSort] = useState("default");
  const [bookingCatalogue, setBookingCatalogue] = useState(BOOKING_CATALOGUE);
  const [myBookings, setMyBookings] = useState([]);

  /* ── Booking modal ── */
  const [bkModalOpen, setBkModalOpen] = useState(false);
  const [bkCurrentBook, setBkCurrentBook] = useState(null);
  const [bkCurrentType, setBkCurrentType] = useState("borrow");
  const [bkShowSuccess, setBkShowSuccess] = useState(false);
  const [bkSuccessInfo, setBkSuccessInfo] = useState(null);
  const [bkName, setBkName] = useState("");
  const [bkStudentId, setBkStudentId] = useState("");
  const [bkDate, setBkDate] = useState("");
  const [bkMinDate, setBkMinDate] = useState("");
  const [bkDuration, setBkDuration] = useState("14");
  const [bkBuyName, setBkBuyName] = useState("");
  const [bkBuyStudentId, setBkBuyStudentId] = useState("");
  const [bkPhone, setBkPhone] = useState("");

  /* ── Upload form ── */
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadAuthor, setUploadAuthor] = useState("");
  const [uploadGenre, setUploadGenre] = useState("");
  const [uploadPrice, setUploadPrice] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadOk, setUploadOk] = useState(false);

  /* ── Library profile (lightbox + open status) ── */
  const [lpLightboxSrc, setLpLightboxSrc] = useState(null);
  const [lpIsOpen, setLpIsOpen] = useState(true);

  /* ══════════════════════════════
     EFFECTS
  ══════════════════════════════ */

  // Initial chatbot greeting
  useEffect(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    const t = setTimeout(() => {
      setChatMsgs([{ role: "bot", text: "Welcome to LibraryHub. I'm Sage — your guide through five centuries of the world's finest stories. 📚 Tell me what you're looking for: a genre, a classic, a mood, or even a single word. I'll find something that will stay with you." }]);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatMsgsRef.current) chatMsgsRef.current.scrollTop = chatMsgsRef.current.scrollHeight;
  }, [chatMsgs, chatTyping]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Library profile open/closed status (recomputed on mount of that page)
  useEffect(() => {
    if (currentPage !== "libprofile") return;
    function update() {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours() + now.getMinutes() / 60;
      let isOpen = false;
      if (day >= 1 && day <= 5) isOpen = hour >= 8 && hour < 20;
      else if (day === 6) isOpen = hour >= 9 && hour < 17;
      setLpIsOpen(isOpen);
    }
    update();
  }, [currentPage]);

  /* ══════════════════════════════
     NAVIGATION
  ══════════════════════════════ */
  function goPage(page) {
    setCurrentPage(page);
  }

  function requireLogin(page) {
    if (!loggedInUser) {
      alert("Please sign in to access the Booking system.");
      goPage("auth");
      return;
    }
    goPage(page);
  }

  function goLibrary(genre) {
    setLibGenre(genre || "all");
    setLibSearch("");
    goPage("library");
  }

  function goAuthTab(tab) {
    goPage("auth");
    setAuthTab(tab);
  }

  /* ══════════════════════════════
     AUTH
  ══════════════════════════════ */
  function clearLoginErr(field) {
    setLoginErrors((e) => ({ ...e, [field]: false }));
  }
  function clearSignupErr(field) {
    setSignupErrors((e) => ({ ...e, [field]: false }));
  }

  function doLogin() {
    const email = loginEmail.trim();
    const pw = loginPw;
    let valid = true;
    const errs = {};
    if (!email || !email.includes("@")) { errs.email = true; valid = false; }
    if (pw.length < 6) { errs.pw = true; valid = false; }
    setLoginErrors(errs);
    if (!valid) return;
    const name = email.split("@")[0];
    loginUser(name, email);
    setLoginWelcomeMsg(`Welcome back, ${name}! Taking you to your stories…`);
    setLoginSuccess(true);
    setTimeout(() => { setLoginSuccess(false); goPage("home"); }, 2000);
  }

  function doSignup() {
    const name = signupName.trim();
    const email = signupEmail.trim();
    const pw = signupPw;
    const pw2 = signupPw2;
    let valid = true;
    const errs = {};
    if (!name) { errs.name = true; valid = false; }
    if (!email || !email.includes("@")) { errs.email = true; valid = false; }
    if (pw.length < 6) { errs.pw = true; valid = false; }
    if (pw !== pw2) { errs.pw2 = true; valid = false; }
    if (!termsChecked) { errs.terms = true; valid = false; }
    setSignupErrors(errs);
    if (!valid) return;
    loginUser(name, email);
    setSignupSuccess(true);
    setTimeout(() => { setSignupSuccess(false); goPage("home"); }, 2200);
  }

  function socialLogin(provider) {
    const fakeName = provider === "Google" ? "Reader" : "StoryFan";
    loginUser(fakeName, `${fakeName.toLowerCase()}@${provider.toLowerCase()}.com`);
    alert(`Signed in with ${provider}! Welcome to LibraryHub.`);
    goPage("home");
  }

  function loginUser(name, email) {
    setLoggedInUser({ name, email });
  }

  function logoutUser() {
    if (!window.confirm("Sign out of LibraryHub?")) return;
    setLoggedInUser(null);
    goPage("home");
  }

  function showForgot() {
    alert("Password reset link would be sent to your email in a real application.");
  }

  function passwordStrength(pw) {
    if (!pw) return null;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { w: "20%", c: "#C0392B", l: "Weak" },
      { w: "40%", c: "#E67E22", l: "Fair" },
      { w: "60%", c: "#F1C40F", l: "Good" },
      { w: "80%", c: "#27AE60", l: "Strong" },
      { w: "100%", c: "#1ABC9C", l: "Very Strong" },
    ];
    return levels[Math.min(score, 4)];
  }

  /* ══════════════════════════════
     MODALS (story detail)
  ══════════════════════════════ */
  function openStoryModal(story, isClassic) {
    setModalStory({ ...story, isClassic });
  }
  function closeModal() {
    setModalStory(null);
  }

  /* ══════════════════════════════
     REVIEWS
  ══════════════════════════════ */
  function submitReview() {
    const name = rvName.trim();
    const story = rvStory;
    const text = rvText.trim();
    if (!name || !story || !text || !rvRating) {
      alert("Please fill in all fields and select a rating!");
      return;
    }
    const colors = ["#7C3AED", "#1D4ED8", "#B91C1C", "#065F46", "#9D174D", "#92400E"];
    const newReview = { name, story, stars: rvRating, text, date: "Just now", color: colors[Math.floor(Math.random() * colors.length)] };
    setUserReviews((r) => [newReview, ...r]);
    setRvName(""); setRvStory(""); setRvText(""); setRvRating(0); setRvHoverRating(0);
    setRvOk(true);
    setTimeout(() => setRvOk(false), 4000);
  }

  function subscribeNewsletter() {
    const e = nlEmail.trim();
    if (!e || !e.includes("@")) { alert("Please enter a valid email."); return; }
    setNlEmail("");
    setNlOk(true);
  }

  /* ══════════════════════════════
     CHATBOT
  ══════════════════════════════ */
  function addMsg(role, text) {
    setChatMsgs((m) => [...m, { role, text }]);
  }

  function sendChat() {
    const val = chatIn.trim();
    if (!val) return;
    addMsg("user", val);
    setChatIn("");
    setChatTyping(true);
    setTimeout(() => {
      setChatTyping(false);
      const l = val.toLowerCase();
      let r;
      if (l.match(/hi|hello|hey/)) r = BOT_R.greet[Math.floor(Math.random() * 2)];
      else if (l.match(/fantasy|dragon|magic|tolkien/)) r = BOT_R.fantasy[Math.floor(Math.random() * 2)];
      else if (l.match(/sci.?fi|space|robot|orwell|1984/)) r = BOT_R.scifi[0];
      else if (l.match(/mystery|detective|sherlock/)) r = BOT_R.mystery[0];
      else if (l.match(/horror|ghost|haunt/)) r = BOT_R.horror[0];
      else if (l.match(/romance|love|austen/)) r = BOT_R.romance[0];
      else if (l.match(/adventure|quest|journey/)) r = BOT_R.adventure[0];
      else if (l.match(/child|kid|family/)) r = BOT_R.children[0];
      else if (l.match(/dark|gothic|grim/)) r = BOT_R.dark[0];
      else r = BOT_R.default[Math.floor(Math.random() * 2)];
      addMsg("bot", r);
    }, 1300);
  }

  /* ══════════════════════════════
     BOOKING SYSTEM
  ══════════════════════════════ */
  function setBkMode(mode) {
    setBookingMode(mode);
  }

  function setBkGenre(key) {
    setBookingGenreFilter(key);
  }

  function openBkModal(book, type) {
    if (!loggedInUser) {
      alert("Please sign in to make a booking.");
      goPage("auth");
      return;
    }
    setBkCurrentBook(book);
    setBkCurrentType(type);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    setBkDate(tomorrowStr);
    setBkMinDate(tomorrowStr);
    setBkDuration("14");

    setBkName(loggedInUser?.name || "");
    setBkBuyName(loggedInUser?.name || "");
    setBkStudentId("");
    setBkBuyStudentId("");
    setBkPhone("");

    setBkShowSuccess(false);
    setBkModalOpen(true);
  }

  function closeBkModal() {
    setBkModalOpen(false);
  }

  function selectBkType(type) {
    setBkCurrentType(type);
  }

  function confirmBooking() {
    if (!bkCurrentBook) return;
    const type = bkCurrentType;

    if (type === "borrow") {
      if (!bkName.trim() || !bkStudentId.trim() || !bkDate) {
        alert("Please fill in all fields.");
        return;
      }
    } else {
      if (!bkBuyName.trim() || !bkBuyStudentId.trim() || !bkPhone.trim()) {
        alert("Please fill in all fields.");
        return;
      }
    }

    const ref = "SH-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const booking = {
      ref,
      type,
      book: bkCurrentBook,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "confirmed",
    };
    setMyBookings((b) => [booking, ...b]);

    if (type === "borrow" && bkCurrentBook.stock > 0) {
      setBookingCatalogue((cat) =>
        cat.map((b) => (b.title === bkCurrentBook.title ? { ...b, stock: Math.max(0, b.stock - 1) } : b))
      );
    }

    setBkSuccessInfo({
      icon: type === "borrow" ? "📚" : "🎉",
      title: type === "borrow" ? "Reservation Confirmed!" : "Purchase Order Created!",
      msg: type === "borrow"
        ? <>Your copy of <strong>{bkCurrentBook.title}</strong> has been reserved. Please bring your Student ID to the library counter on your chosen pickup date.</>
        : <>Your purchase request for <strong>{bkCurrentBook.title}</strong> has been registered. Please visit the library counter with your Student ID and <strong>LKR {bkCurrentBook.price} cash</strong> to complete the purchase.</>,
      ref,
    });
    setBkShowSuccess(true);
  }

  /* ══════════════════════════════
     UPLOAD
  ══════════════════════════════ */
  function onFileChosen(e) {
    const f = e.target.files[0];
    if (!f) return;
    setUploadFileName(f.name);
  }

  function submitUpload() {
    if (!uploadTitle.trim() || !uploadAuthor.trim() || !uploadGenre || !uploadDesc.trim()) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    setUploadOk(true);
    setUploadTitle(""); setUploadAuthor(""); setUploadGenre(""); setUploadPrice(""); setUploadDesc(""); setUploadFileName("");
    setTimeout(() => setUploadOk(false), 5000);
  }

  /* ══════════════════════════════
     LIBRARY PROFILE
  ══════════════════════════════ */
  function openLpLightbox(src) {
    setLpLightboxSrc(src);
  }
  function closeLpLightbox() {
    setLpLightboxSrc(null);
  }

  /* ══════════════════════════════
     DERIVED DATA
  ══════════════════════════════ */
  const allReviews = useMemo(() => [...userReviews, ...INITIAL_REVIEWS], [userReviews]);

  const libFilteredList = useMemo(() => {
    const q = libSearch.trim().toLowerCase();
    let list = STORIES.filter((s) => {
      const matchGenre = libGenre === "all" || s.genre === libGenre;
      const matchSearch = !q || s.title.toLowerCase().includes(q) || s.author.toLowerCase().includes(q) ||
        s.characters.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q);
      return matchGenre && matchSearch;
    });
    if (libSort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (libSort === "reviews") list = [...list].sort((a, b) => b.reviews - a.reviews);
    else if (libSort === "year") list = [...list].sort((a, b) => b.year - a.year);
    else if (libSort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [libGenre, libSearch, libSort]);

  const libQuery = libSearch.trim().toLowerCase();
  const libTotalInGenre = libGenre === "all" ? STORIES.length : STORIES.filter((s) => s.genre === libGenre).length;
  const libCountText = libQuery
    ? `Found ${libFilteredList.length} result${libFilteredList.length !== 1 ? "s" : ""} for "${libSearch}"`
    : libGenre === "all"
      ? `Showing all ${STORIES.length} stories`
      : `Showing ${libFilteredList.length} ${libGenre} stories`;
  const libActiveFilterText = libGenre !== "all" ? `Filtered: ${genreName(libGenre)}` : "";

  const bookingFilteredList = useMemo(() => {
    let list = [...bookingCatalogue];
    if (bookingGenreFilter !== "all") list = list.filter((b) => b.genre === bookingGenreFilter);
    if (bookingMode === "borrow") list = list.filter((b) => b.stock > 0);
    if (bookingSort === "price-low") list.sort((a, b) => a.price - b.price);
    if (bookingSort === "price-high") list.sort((a, b) => b.price - a.price);
    if (bookingSort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (bookingSort === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [bookingCatalogue, bookingGenreFilter, bookingMode, bookingSort]);

  const featuredStory = STORIES[0];

  /* ══════════════════════════════
     RENDER
  ══════════════════════════════ */
  return (
    <div className="lh-root">
      <style>{GLOBAL_CSS}</style>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <StarryCanvas />

      {/* ═══════════ NAV ═══════════ */}
      <nav>
        <div className="logo" style={{ cursor: loggedInUser ? "pointer" : "default" }} onClick={() => loggedInUser && goPage("home")}>
          <div className="logo-gem">📖</div>
          <em>Library</em>Hub
        </div>
        <ul className="nav-links">
          <li><a className={currentPage === "home" ? "nav-active" : ""} onClick={() => loggedInUser && goPage("home")}>Home</a></li>
          <li><a onClick={() => loggedInUser && goPage("home")}>Genres</a></li>
          <li><a onClick={() => loggedInUser && goPage("home")}>Classics</a></li>
          <li><button className={currentPage === "library" ? "nav-active" : ""} onClick={() => loggedInUser && goPage("library")}>Library</button></li>
          <li><button className={currentPage === "booking" ? "nav-active" : ""} onClick={() => requireLogin("booking")}>Booking</button></li>
          <li><a onClick={() => loggedInUser && goPage("home")}>Reviews</a></li>
          <li><a onClick={() => loggedInUser && goPage("home")}>AI Guide</a></li>
          <li><button className={currentPage === "libprofile" ? "nav-active" : ""} onClick={() => requireLogin("libprofile")}>Our Library</button></li>
          {!loggedInUser && (
            <li><button className="nav-pill" onClick={() => goPage("auth")}>Sign In</button></li>
          )}
          {loggedInUser && (
            <li>
              <div className="nav-user" onClick={logoutUser}>
                <div className="nav-avatar">{loggedInUser.name[0].toUpperCase()}</div>
                <span>{loggedInUser.name.split(" ")[0]}</span>
              </div>
            </li>
          )}
        </ul>
      </nav>

      {/* ═══════════════════════════════════
          PAGE: HOME
      ═══════════════════════════════════ */}
      <div id="page-home" className={`page${currentPage === "home" ? " active" : ""}`}>

        {/* HERO */}
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="hero-grid"></div>
          <div className="hero-content">
            <div className="hero-eyebrow fu"><div className="pulse-dot"></div>Your University Library, Online<div className="pulse-dot"></div></div>
            <h1 className="fu d1">Welcome to<br /><span className="gold italic">Library</span><span className="ember">Hub</span></h1>
            <p className="hero-sub fu d2">Your university library's digital home — discover books, borrow physical copies, purchase titles, and connect with a community of readers across campus.</p>
            <div className="hero-actions fu d3">
              <button className="btn btn-flame" onClick={() => goPage("library")}>✦ Browse Collection</button>
              <button className="btn btn-ghost" onClick={() => requireLogin("booking")}>📋 Book a Copy</button>
            </div>
            <div className="hero-divider fu d4"></div>
            <div className="hero-stats fu d4">
              <div className="stat-item"><span className="stat-num">500+</span><span className="stat-lbl">Books</span></div>
              <div className="stat-item"><span className="stat-num">7</span><span className="stat-lbl">Genres</span></div>
              <div className="stat-item"><span className="stat-num">12K+</span><span className="stat-lbl">Members</span></div>
              <div className="stat-item"><span className="stat-num">4.8★</span><span className="stat-lbl">Rating</span></div>
            </div>
          </div>
        </section>

        {/* GENRES */}
        <section id="genres">
          <div style={{ textAlign: "center" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Explore by Genre</div>
            <h2 className="sec-title" style={{ textAlign: "center" }}>Choose Your <em>World</em></h2>
            <p className="sec-sub" style={{ margin: "0 auto" }}>Every genre is a doorway into another universe. Step through and discover.</p>
          </div>
          <div className="genre-grid">
            {GENRES.map((g) => (
              <div className="genre-tile" key={g.key} onClick={() => goLibrary(g.key)}>
                <span className="g-icon">{g.icon}</span>
                <div className="g-name">{g.name}</div>
                <div className="g-count">{g.count} stories</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAMOUS CLASSICS */}
        <section id="famous">
          <div className="famous-header">
            <div>
              <div className="eyebrow">Timeless Masterpieces</div>
              <h2 className="sec-title">Famous <em>Classics</em></h2>
              <p className="sec-sub">The greatest stories ever told — legends that have moved millions across centuries.</p>
            </div>
            <button className="see-all-btn" onClick={() => goPage("library")}>See All Stories →</button>
          </div>
          <div className="famous-grid">
            {FAMOUS.map((s, i) => (
              <div className="famous-card" key={i} onClick={() => openStoryModal(s, true)}>
                <div className="fc-img-wrap">
                  <img className="fc-img" src={s.img} alt={s.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <div className="fc-overlay"></div>
                  <span className={`fc-pill pill-${s.genre}`}>{genreName(s.genre)}</span>
                  <span className="fc-rating">⭐ {s.rating}</span>
                  <span className="fc-classic-badge">Classic</span>
                </div>
                <div className="fc-body">
                  <div className="fc-title">{s.title}</div>
                  <div className="fc-author">✍️ {s.author} · {s.year}</div>
                  <div className="fc-summary">{s.summary.slice(0, 200)}…</div>
                  <div className="fc-meta">
                    {s.tags.map((t, ti) => <span className="fc-tag" key={ti}>{t}</span>)}
                  </div>
                  <div className="fc-footer">
                    <div className="fc-chars"><strong>{s.characters.split(",")[0]}</strong> & more</div>
                    <button className="fc-read-btn" onClick={(e) => { e.stopPropagation(); openStoryModal(s, true); }}>Read More</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOME PREVIEW (4 stories) */}
        <section id="home-preview">
          <div className="preview-header">
            <div>
              <div className="eyebrow">From the Library</div>
              <h2 className="sec-title">Recent <em>Stories</em></h2>
              <p className="sec-sub">A glimpse into our collection. Hundreds more await inside.</p>
            </div>
            <button className="see-all-btn" onClick={() => goPage("library")}>Open Full Library →</button>
          </div>
          <div className="preview-grid">
            {STORIES.slice(0, 4).map((s, i) => (
              <StoryCard key={i} story={s} query="" onOpen={() => openStoryModal(s, false)} />
            ))}
          </div>
        </section>

        {/* FEATURED */}
        <section id="featured">
          <div className="feat-wrap">
            <div className="feat-img-box">
              <img className="feat-img" src={featuredStory.img} alt="Featured Story" loading="lazy" />
              <div className="feat-img-frame"></div>
              <div className="feat-badge-wrap"><div className="feat-badge">✦ Editor's Pick</div></div>
            </div>
            <div className="feat-info">
              <div className="eyebrow">Featured Story</div>
              <div className="feat-title">{featuredStory.title}</div>
              <div className="feat-quote">"{featuredStory.summary.slice(0, 180)}…"</div>
              <ul className="feat-meta">
                <li><span className="fk">Author</span><span className="fv">{featuredStory.author}</span></li>
                <li><span className="fk">Characters</span><span className="fv">{featuredStory.characters}</span></li>
                <li><span className="fk">Rating</span><span className="fv">⭐ {featuredStory.rating} · {featuredStory.reviews.toLocaleString()} reviews</span></li>
                <li><span className="fk">Pages</span><span className="fv">{featuredStory.pages}</span></li>
              </ul>
              <div className="feat-btns">
                <button className="btn btn-flame" onClick={() => openStoryModal(featuredStory, false)}>📖 Read More</button>
                <button className="btn btn-ghost" onClick={() => goPage("library")}>Browse Library</button>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews">
          <div className="eyebrow">Reader Voices</div>
          <h2 className="sec-title">What Readers <em>Say</em></h2>
          <p className="sec-sub" style={{ marginBottom: "2.5rem" }}>Genuine reviews from passionate readers across the world.</p>
          <div className="rev-grid">
            {allReviews.map((r, i) => (
              <div className="rev-card" key={i}>
                <div className="rv-head">
                  <div className="rv-av" style={{ background: `${r.color}18`, color: r.color, borderColor: `${r.color}44` }}>{r.name.slice(0, 2)}</div>
                  <div><div className="rv-name">{r.name}</div><div className="rv-story">on "{r.story}"</div></div>
                </div>
                <div className="rv-stars">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
                <div className="rv-text">"{r.text}"</div>
                <div className="rv-date">{r.date}</div>
              </div>
            ))}
          </div>
          <div className="rev-form">
            <h3>✍️ Leave Your Review</h3>
            <div className="form-row"><label>Your Name</label><input type="text" value={rvName} onChange={(e) => setRvName(e.target.value)} placeholder="e.g. Amara K." /></div>
            <div className="form-row">
              <label>Story</label>
              <select value={rvStory} onChange={(e) => setRvStory(e.target.value)}>
                <option value="">— Select a story —</option>
                {[...FAMOUS, ...STORIES].map((s, i) => <option value={s.title} key={i}>{s.title}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Rating</label>
              <div className="star-row">
                {[1, 2, 3, 4, 5].map((v) => (
                  <span key={v}
                    className={(rvHoverRating || rvRating) >= v ? "lit" : ""}
                    onMouseOver={() => setRvHoverRating(v)}
                    onMouseOut={() => setRvHoverRating(0)}
                    onClick={() => setRvRating(v)}>★</span>
                ))}
              </div>
            </div>
            <div className="form-row"><label>Your Review</label><textarea value={rvText} onChange={(e) => setRvText(e.target.value)} placeholder="What moved you? What lingered after the last page?"></textarea></div>
            <button className="btn btn-flame" onClick={submitReview}>Submit Review ✦</button>
            <div id="rv-ok" className={rvOk ? "show" : ""}>✅ Your review has been published.</div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about">
          <div style={{ textAlign: "center" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Why LibraryHub</div>
            <h2 className="sec-title" style={{ textAlign: "center" }}>Built for <em>University</em> Communities</h2>
            <p className="sec-sub" style={{ margin: "0 auto" }}>Everything your university library needs in one digital platform.</p>
          </div>
          <div className="about-grid">
            <div className="about-card"><div className="a-icon">📚</div><h3>Vast Collection</h3><p>Hundreds of curated books across every genre, maintained by your university library and enriched by student contributions.</p></div>
            <div className="about-card"><div className="a-icon">🤖</div><h3>AI Book Guide</h3><p>Not sure what to read? Sage helps you discover books perfectly tailored to your academic interests and personal taste.</p></div>
            <div className="about-card"><div className="a-icon">🏛️</div><h3>Library Profiles</h3><p>Universities and libraries can publish their own profile page — photos, opening hours, description and contact details.</p></div>
            <div className="about-card"><div className="a-icon">🔖</div><h3>Borrow & Purchase</h3><p>Reserve a physical copy to borrow from the library counter, or purchase books on-site with a simple cash payment.</p></div>
            <div className="about-card"><div className="a-icon">📱</div><h3>Read Anywhere</h3><p>Fully responsive — desktop, tablet, or phone. Your library travels with you, always beautiful and fast.</p></div>
            <div className="about-card"><div className="a-icon">✉️</div><h3>Weekly Picks</h3><p>Subscribe and get hand-curated book selections, author spotlights, and genre highlights delivered to your inbox.</p></div>
          </div>
        </section>

        {/* CHATBOT */}
        <section id="chatbot">
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="eyebrow">AI Story Guide</div>
            <h2 className="sec-title">Meet <em>Sage</em></h2>
            <p className="sec-sub">Tell Sage your mood, genre, or academic interest — get personalised book recommendations instantly.</p>
          </div>
          <div className="chat-shell">
            <div className="chat-head">
              <div className="chat-gem">S</div>
              <div className="chat-head-info"><strong>Sage · AI Story Guide</strong><span>🟢 Online — ready to find your next obsession</span></div>
            </div>
            <div className="chat-msgs" ref={chatMsgsRef}>
              {chatMsgs.map((m, i) => (
                <div className={`msg ${m.role === "bot" ? "b" : "u"}`} key={i}>
                  <div className="msg-av">{m.role === "bot" ? "S" : "Me"}</div>
                  <div className="msg-bub">{renderBotText(m.text)}</div>
                </div>
              ))}
            </div>
            <div className={`chat-type${chatTyping ? " show" : ""}`}><div className="tdots"><span></span><span></span><span></span></div><span>Sage is thinking…</span></div>
            <div className="chat-in-row">
              <input type="text" value={chatIn} onChange={(e) => setChatIn(e.target.value)} placeholder="e.g. I want something dark and mysterious…"
                onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }} />
              <button className="chat-send" onClick={sendChat}>Send ➤</button>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section id="newsletter">
          <div className="nl-inner">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Stay in the Loop</div>
            <h2 className="sec-title">New Stories <em>Every Week</em></h2>
            <p className="sec-sub">Hand-picked selections, author spotlights, and genre highlights to your inbox.</p>
            <div className="nl-form">
              <input type="email" value={nlEmail} onChange={(e) => setNlEmail(e.target.value)} placeholder="your@email.com" />
              <button onClick={subscribeNewsletter}>Subscribe 📬</button>
            </div>
            <p id="nl-ok" className={nlOk ? "show" : ""}>🎉 You're subscribed! Welcome to the LibraryHub family.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="foot-top">
            <div className="foot-brand">
              <span className="foot-brand-name"><em>Library</em>Hub</span>
              <p>Your university library's digital home. Discover, borrow, purchase, and share books — wherever your studies take you.</p>
            </div>
            <div className="foot-col">
              <h4>Genres</h4>
              <a onClick={() => goLibrary("fantasy")}>Fantasy</a>
              <a onClick={() => goLibrary("sci-fi")}>Science Fiction</a>
              <a onClick={() => goLibrary("mystery")}>Mystery</a>
              <a onClick={() => goLibrary("romance")}>Romance</a>
              <a onClick={() => goLibrary("horror")}>Horror</a>
            </div>
            <div className="foot-col">
              <h4>Explore</h4>
              <a onClick={() => goPage("home")}>Famous Classics</a>
              <a onClick={() => goPage("library")}>Full Library</a>
              <a onClick={() => requireLogin("libprofile")}>Our Library</a>
              <a onClick={() => goPage("home")}>Reviews</a>
              <a onClick={() => goPage("home")}>AI Guide</a>
            </div>
            <div className="foot-col">
              <h4>Account</h4>
              <a onClick={() => goPage("auth")}>Sign In</a>
              <a onClick={() => goAuthTab("signup")}>Create Account</a>
              <a>About Us</a>
              <a>Privacy Policy</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2025 LibraryHub. All rights reserved.</span>
            <span>Made with ❤️ for university readers everywhere</span>
          </div>
        </footer>

      </div>{/* /page-home */}

      {/* ═══════════════════════════════════
          PAGE: LIBRARY
      ═══════════════════════════════════ */}
      <div id="page-library" className={`page${currentPage === "library" ? " active" : ""}`}>
        <div className="lib-hero">
          <div className="lib-hero-top">
            <div className="lib-title-wrap">
              <div className="eyebrow">Story Library</div>
              <h1>All <em>Stories</em></h1>
              <div className="lib-count">{libCountText}</div>
            </div>
            <div className="lib-search-wrap">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input type="text" value={libSearch} onChange={(e) => setLibSearch(e.target.value)} placeholder="Search by title, author, or character…" autoComplete="off" />
                <button className={`search-clear${libSearch ? " show" : ""}`} onClick={() => setLibSearch("")}>✕</button>
              </div>
              <div className="search-stats">{libQuery ? <><strong>{libFilteredList.length}</strong> of {libTotalInGenre} stories</> : ""}</div>
            </div>
          </div>
          <div className="lib-filters">
            {LIB_FILTER_LABELS.map((lbl, i) => (
              <button key={i} className={`lf-btn${libGenre === LIB_FILTER_KEYS[i] ? " active" : ""}`} onClick={() => setLibGenre(LIB_FILTER_KEYS[i])}>{lbl}</button>
            ))}
          </div>
        </div>

        <div className="lib-toolbar">
          <div id="libActiveFilter" style={{ fontFamily: "var(--ff-ui)", fontSize: "0.82rem", color: "var(--smoke)" }}>{libActiveFilterText}</div>
          <div className="sort-wrap">
            <label>Sort by</label>
            <select value={libSort} onChange={(e) => setLibSort(e.target.value)}>
              <option value="default">Featured</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="year">Newest First</option>
              <option value="az">A → Z</option>
            </select>
          </div>
        </div>

        <div className="lib-body">
          <div className="lib-grid">
            {libFilteredList.length === 0 ? (
              <div className="no-results">
                <span className="nr-icon">🔍</span>No stories found for <strong>"{libSearch}"</strong><br /><br />
                <small style={{ fontFamily: "var(--ff-ui)", fontSize: "0.82rem" }}>Try a different title, author, or character name.</small>
              </div>
            ) : (
              libFilteredList.map((s, i) => (
                <StoryCard key={i} story={s} query={libQuery} onOpen={() => openStoryModal(s, false)} />
              ))
            )}
          </div>
        </div>
      </div>{/* /page-library */}

      {/* ═══════════════════════════════════
          PAGE: AUTH (Login / Signup)
      ═══════════════════════════════════ */}
      <div id="page-auth" className={`page${currentPage === "auth" ? " active" : ""}`}>
        <div className="auth-container">
          <div className="auth-logo">
            <div className="auth-logo-mark">📖</div>
            <h2><em>Library</em>Hub</h2>
            <p>Your personal portal into the university library</p>
          </div>
          <div className="auth-card">
            <div className="auth-tabs">
              <button className={`auth-tab${authTab === "login" ? " active" : ""}`} onClick={() => setAuthTab("login")}>Sign In</button>
              <button className={`auth-tab${authTab === "signup" ? " active" : ""}`} onClick={() => setAuthTab("signup")}>Create Account</button>
            </div>

            {/* LOGIN PANEL */}
            <div className={`auth-panel${authTab === "login" ? " active" : ""}`}>
              <div className="auth-form-row">
                <label>Email Address</label>
                <div className="auth-input-wrap">
                  <input type="email" className={loginErrors.email ? "input-err" : ""} value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); clearLoginErr("email"); }} placeholder="your@email.com" />
                  <span className="auth-input-icon">✉️</span>
                </div>
                <div className={`field-error${loginErrors.email ? " show" : ""}`}>Please enter a valid email address.</div>
              </div>
              <div className="auth-form-row">
                <label>Password</label>
                <div className="auth-input-wrap">
                  <input type={loginPwVisible ? "text" : "password"} className={loginErrors.pw ? "input-err" : ""} value={loginPw}
                    onChange={(e) => { setLoginPw(e.target.value); clearLoginErr("pw"); }} placeholder="Your password" />
                  <span className="auth-input-icon">🔒</span>
                  <button className="show-pw" type="button" onClick={() => setLoginPwVisible((v) => !v)}>{loginPwVisible ? "🙈" : "👁"}</button>
                </div>
                <div className={`field-error${loginErrors.pw ? " show" : ""}`}>Password must be at least 6 characters.</div>
              </div>
              <div className="auth-options">
                <label className="remember-wrap">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a className="forgot-link" onClick={showForgot}>Forgot password?</a>
              </div>
              <button className="auth-btn" onClick={doLogin}>Sign In to LibraryHub</button>
              <div className="auth-divider"><span>or continue with</span></div>
              <div className="social-btns">
                <button className="social-btn" onClick={() => socialLogin("Google")}>🌐 Google</button>
                <button className="social-btn" onClick={() => socialLogin("Facebook")}>📘 Facebook</button>
              </div>
              <div className="auth-footer-note">Don't have an account? <a onClick={() => setAuthTab("signup")}>Create one free →</a></div>
              <div className={`auth-success${loginSuccess ? " show" : ""}`}>
                <span className="success-icon">🎉</span>
                <h3>Welcome Back!</h3>
                <p>{loginWelcomeMsg}</p>
              </div>
            </div>

            {/* SIGNUP PANEL */}
            <div className={`auth-panel${authTab === "signup" ? " active" : ""}`}>
              <div className="auth-form-row">
                <label>Full Name</label>
                <div className="auth-input-wrap">
                  <input type="text" className={signupErrors.name ? "input-err" : ""} value={signupName}
                    onChange={(e) => { setSignupName(e.target.value); clearSignupErr("name"); }} placeholder="Your full name" />
                  <span className="auth-input-icon">👤</span>
                </div>
                <div className={`field-error${signupErrors.name ? " show" : ""}`}>Please enter your name.</div>
              </div>
              <div className="auth-form-row">
                <label>Email Address</label>
                <div className="auth-input-wrap">
                  <input type="email" className={signupErrors.email ? "input-err" : ""} value={signupEmail}
                    onChange={(e) => { setSignupEmail(e.target.value); clearSignupErr("email"); }} placeholder="your@email.com" />
                  <span className="auth-input-icon">✉️</span>
                </div>
                <div className={`field-error${signupErrors.email ? " show" : ""}`}>Please enter a valid email address.</div>
              </div>
              <div className="auth-form-row">
                <label>Password</label>
                <div className="auth-input-wrap">
                  <input type={signupPwVisible ? "text" : "password"} className={signupErrors.pw ? "input-err" : ""} value={signupPw}
                    onChange={(e) => { setSignupPw(e.target.value); clearSignupErr("pw"); }} placeholder="Create a strong password" />
                  <span className="auth-input-icon">🔒</span>
                  <button className="show-pw" type="button" onClick={() => setSignupPwVisible((v) => !v)}>{signupPwVisible ? "🙈" : "👁"}</button>
                </div>
                {signupPw && (() => {
                  const lv = passwordStrength(signupPw);
                  return (
                    <div className="pw-strength" style={{ display: "block" }}>
                      <div className="pw-strength-bar"><div className="pw-strength-fill" style={{ width: lv.w, background: lv.c }}></div></div>
                      <div className="pw-strength-label" style={{ color: lv.c }}>{lv.l}</div>
                    </div>
                  );
                })()}
                <div className={`field-error${signupErrors.pw ? " show" : ""}`}>Password must be at least 6 characters.</div>
              </div>
              <div className="auth-form-row">
                <label>Confirm Password</label>
                <div className="auth-input-wrap">
                  <input type="password" className={signupErrors.pw2 ? "input-err" : ""} value={signupPw2}
                    onChange={(e) => { setSignupPw2(e.target.value); clearSignupErr("pw2"); }} placeholder="Repeat your password" />
                  <span className="auth-input-icon">🔑</span>
                </div>
                <div className={`field-error${signupErrors.pw2 ? " show" : ""}`}>Passwords do not match.</div>
              </div>
              <label className="terms-row">
                <input type="checkbox" checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} />
                <span>I agree to LibraryHub's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>
              <div className={`field-error${signupErrors.terms ? " show" : ""}`}>You must agree to the terms to continue.</div>
              <button className="auth-btn" onClick={doSignup}>Create My Account</button>
              <div className="auth-divider"><span>or sign up with</span></div>
              <div className="social-btns">
                <button className="social-btn" onClick={() => socialLogin("Google")}>🌐 Google</button>
                <button className="social-btn" onClick={() => socialLogin("Facebook")}>📘 Facebook</button>
              </div>
              <div className="auth-footer-note">Already have an account? <a onClick={() => setAuthTab("login")}>Sign in →</a></div>
              <div className={`auth-success${signupSuccess ? " show" : ""}`}>
                <span className="success-icon">✨</span>
                <h3>Account Created!</h3>
                <p>Welcome to LibraryHub. Your reading adventure begins now — taking you to the library…</p>
              </div>
            </div>
          </div>
        </div>
      </div>{/* /page-auth */}

      {/* ═══════════ STORY MODAL ═══════════ */}
      <div className={`modal-overlay${modalStory ? " open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
        {modalStory && (
          <div className="modal-box">
            <div className="modal-img-col">
              <img src={modalStory.img} alt={modalStory.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="m-title">{modalStory.title}</div>
              <div className="m-author">✍️ {modalStory.author}</div>
              <div style={{ marginBottom: "1rem" }}>
                <span className={`fc-pill pill-${modalStory.genre}`} style={{ position: "static", display: "inline-block" }}>{genreName(modalStory.genre)}</span>
                {modalStory.isClassic && <span className="fc-classic-badge" style={{ marginLeft: 8, position: "static" }}>Classic</span>}
              </div>
              <div className="m-desc">{modalStory.summary}</div>
              <div className="m-meta">
                <div className="m-mi"><div className="ml">Author</div><div className="mv">{modalStory.author}</div></div>
                <div className="m-mi"><div className="ml">Year</div><div className="mv">{modalStory.year}</div></div>
                <div className="m-mi"><div className="ml">Cast</div><div className="mv">{modalStory.characters}</div></div>
                <div className="m-mi"><div className="ml">Pages</div><div className="mv">{modalStory.pages}</div></div>
                <div className="m-mi"><div className="ml">Rating</div><div className="mv">⭐ {modalStory.rating} / 5</div></div>
                <div className="m-mi"><div className="ml">Reviews</div><div className="mv">{modalStory.reviews.toLocaleString()}</div></div>
              </div>
              <div className="m-acts">
                <button className="btn btn-flame">📖 Start Reading</button>
                <button className="btn btn-ghost" onClick={closeModal}>✕ Close</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════
          PAGE: LIBRARY PROFILE (read-only)
      ═══════════════════════════════════ */}
      <div id="page-libprofile" className={`page${currentPage === "libprofile" ? " active" : ""}`}>

        <div className="lp-hero">
          <div className="lp-hero-bg">
            <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80" alt="Library interior" onClick={(e) => openLpLightbox(e.target.src)} />
            <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80" alt="Book shelves" onClick={(e) => openLpLightbox(e.target.src)} />
            <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80" alt="Reading room" onClick={(e) => openLpLightbox(e.target.src)} />
          </div>
          <div className="lp-hero-gradient"></div>
          <div className="lp-hero-content">
            <div className="lp-hero-badge">🏛️ University Library</div>
            <div className="lp-lib-name">University of <em>Excellence</em> Library</div>
            <div className="lp-lib-tagline">"Inspiring minds through the power of knowledge and discovery."</div>
            <div className="lp-hero-meta">
              <div className="lp-hero-stat">📍 <strong>Colombo, Sri Lanka</strong></div>
              <div className="lp-hero-stat">📚 <strong>500+</strong> books</div>
              <div className="lp-hero-stat">👥 <strong>12,000+</strong> members</div>
              <div className="lp-hero-stat">⭐ <strong>4.8</strong> rating</div>
            </div>
          </div>
        </div>

        <div className="lp-info-strip">
          <div className="lp-info-item"><span className="lp-info-icon">📞</span><span>+94 11 234 5678</span></div>
          <div className="lp-info-item"><span className="lp-info-icon">✉️</span><span>library@university.edu.lk</span></div>
          <div className="lp-info-item"><span className="lp-info-icon">🌐</span><span>www.university.edu.lk/library</span></div>
          <div className="lp-info-item"><span className="lp-info-icon">📍</span><span>123 University Ave, Colombo 07</span></div>
          <div className="lp-social-row">
            <a href="#" className="lp-social-btn" title="Facebook" onClick={(e) => e.preventDefault()}>📘</a>
            <a href="#" className="lp-social-btn" title="Instagram" onClick={(e) => e.preventDefault()}>📷</a>
            <a href="#" className="lp-social-btn" title="Twitter / X" onClick={(e) => e.preventDefault()}>🐦</a>
            <a href="#" className="lp-social-btn" title="YouTube" onClick={(e) => e.preventDefault()}>▶️</a>
            <a href="#" className="lp-social-btn" title="LinkedIn" onClick={(e) => e.preventDefault()}>💼</a>
          </div>
        </div>

        <div className="lp-body">
          <div>
            <div className="lp-desc-card">
              <h2><span>🏛️</span> About Our Library</h2>
              <div className="lp-desc-text">
                <p>Welcome to the University of Excellence Library — the academic heart of our campus. Established in 1952, our library has grown to become one of the most comprehensive research and learning institutions in Sri Lanka, serving over 12,000 students, faculty, and researchers every year.</p>
                <p>Our collection spans more than 500,000 print volumes, digital journals, e-books, and rare manuscripts across every field of study. From undergraduate course materials to cutting-edge research publications, we are committed to supporting the academic journey of every member of our university community.</p>
                <p>Beyond books, we offer quiet study spaces, collaborative zones, computer labs, printing services, and dedicated research support from our team of professional librarians. We believe that access to knowledge is the foundation of every great achievement.</p>
              </div>
            </div>

            <div className="lp-gallery-card">
              <h2>📸 Library Gallery</h2>
              <div className="lp-gallery-grid">
                {[
                  ["https://images.unsplash.com/photo-1568667256549-094345857637?w=400&q=80", "Reading hall"],
                  ["https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80", "Book stacks"],
                  ["https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=400&q=80", "Study area"],
                  ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80", "Books collection"],
                  ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", "Library entrance"],
                  ["https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80", "Library interior"],
                ].map(([src, alt], i) => (
                  <img className="lp-gallery-img" key={i} src={src} alt={alt} onClick={(e) => openLpLightbox(e.target.src)} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="lp-hours-card">
              <h2>🕐 Opening Hours</h2>
              {lpIsOpen ? (
                <div className="lp-now-open"><div className="lp-now-dot"></div>Currently Open</div>
              ) : (
                <div className="lp-now-closed"><div className="lp-now-dot" style={{ background: "var(--ember2)", animation: "none" }}></div>Currently Closed</div>
              )}
              <div>
                <div className="lp-hours-row"><span className="lp-hours-day">Monday</span><span className="lp-hours-time">8:00 AM – 8:00 PM</span></div>
                <div className="lp-hours-row"><span className="lp-hours-day">Tuesday</span><span className="lp-hours-time">8:00 AM – 8:00 PM</span></div>
                <div className="lp-hours-row"><span className="lp-hours-day">Wednesday</span><span className="lp-hours-time">8:00 AM – 8:00 PM</span></div>
                <div className="lp-hours-row"><span className="lp-hours-day">Thursday</span><span className="lp-hours-time">8:00 AM – 8:00 PM</span></div>
                <div className="lp-hours-row"><span className="lp-hours-day">Friday</span><span className="lp-hours-time">8:00 AM – 8:00 PM</span></div>
                <div className="lp-hours-row"><span className="lp-hours-day">Saturday</span><span className="lp-hours-time">9:00 AM – 5:00 PM</span></div>
                <div className="lp-hours-row"><span className="lp-hours-day">Sunday</span><span className="lp-hours-time closed">Closed</span></div>
              </div>
              <div className="lp-hours-note">📌 Extended hours during exam periods: 7:00 AM – 10:00 PM</div>
            </div>

            <div className="lp-venue-card">
              <h2>📍 Venue</h2>
              <div className="lp-venue-map">
                <iframe title="Library location" src="https://maps.google.com/maps?q=University%20Library%20Colombo&t=&z=14&ie=UTF8&iwloc=&output=embed" loading="lazy"></iframe>
              </div>
              <div className="lp-venue-row">
                <div className="lp-venue-icon">📍</div>
                <div className="lp-venue-info"><strong>Address</strong><span>123 University Ave, Colombo 07, Sri Lanka</span></div>
              </div>
              <div className="lp-venue-row">
                <div className="lp-venue-icon">🏢</div>
                <div className="lp-venue-info"><strong>Building</strong><span>Main Library Block, 2nd – 4th Floor</span></div>
              </div>
              <div className="lp-venue-row">
                <div className="lp-venue-icon">🅿️</div>
                <div className="lp-venue-info"><strong>Parking</strong><span>Free parking available at the North Campus lot</span></div>
              </div>
            </div>

            <div className="lp-services-card">
              <h2>🎓 Library Services</h2>
              <div>
                <div className="lp-service-item"><div className="lp-service-icon">📖</div><div className="lp-service-info"><strong>Book Borrowing</strong><span>Borrow physical copies for up to 30 days with student ID</span></div></div>
                <div className="lp-service-item"><div className="lp-service-icon">💻</div><div className="lp-service-info"><strong>Digital Resources</strong><span>Access 50,000+ e-books and online journals 24/7</span></div></div>
                <div className="lp-service-item"><div className="lp-service-icon">🖨️</div><div className="lp-service-info"><strong>Print & Scan</strong><span>Printing, scanning and photocopying at the service counter</span></div></div>
                <div className="lp-service-item"><div className="lp-service-icon">🔬</div><div className="lp-service-info"><strong>Research Support</strong><span>One-on-one sessions with our specialist librarians</span></div></div>
                <div className="lp-service-item"><div className="lp-service-icon">🏠</div><div className="lp-service-info"><strong>Study Rooms</strong><span>Book private study rooms for group or individual study</span></div></div>
              </div>
            </div>
          </div>
        </div>

      </div>{/* /page-libprofile */}

      {/* Lightbox for gallery photos */}
      <div className={`lp-lightbox${lpLightboxSrc ? " open" : ""}`} onClick={closeLpLightbox}>
        <button className="lp-lightbox-close" onClick={closeLpLightbox}>✕</button>
        {lpLightboxSrc && <img src={lpLightboxSrc} alt="Library photo" />}
      </div>

      {/* ═══════════════════════════════════
          PAGE: BOOKING
      ═══════════════════════════════════ */}
      <div id="page-booking" className={`page${currentPage === "booking" ? " active" : ""}`}>

        <div className="booking-hero">
          <div className="booking-hero-top">
            <div className="booking-title-wrap">
              <div className="eyebrow">University Library</div>
              <h1>Book &amp; <em>Borrow</em></h1>
              <p>Reserve a physical copy to borrow, or purchase a book outright — all in one place.</p>
            </div>
            <div className="booking-mode-toggle">
              <button className={`bmt-btn${bookingMode === "all" ? " active" : ""}`} onClick={() => setBkMode("all")}>📚 All</button>
              <button className={`bmt-btn${bookingMode === "borrow" ? " active" : ""}`} onClick={() => setBkMode("borrow")}>🔖 Borrow</button>
              <button className={`bmt-btn${bookingMode === "buy" ? " active" : ""}`} onClick={() => setBkMode("buy")}>💰 Purchase</button>
              <button className={`bmt-btn${bookingMode === "upload" ? " active" : ""}`} onClick={() => setBkMode("upload")}>⬆ Upload</button>
              {myBookings.length > 0 && (
                <button className={`bmt-btn${bookingMode === "my" ? " active" : ""}`} onClick={() => setBkMode("my")}>🗂 My Bookings</button>
              )}
            </div>
          </div>
          {(bookingMode === "all" || bookingMode === "borrow" || bookingMode === "buy") && (
            <div className="booking-filters">
              <button className={`lf-btn${bookingGenreFilter === "all" ? " active" : ""}`} onClick={() => setBkGenre("all")}>All Genres</button>
              {GENRES.map((g) => (
                <button key={g.key} className={`lf-btn${bookingGenreFilter === g.key ? " active" : ""}`} onClick={() => setBkGenre(g.key)}>{g.icon} {g.name}</button>
              ))}
            </div>
          )}
        </div>

        {(bookingMode === "all" || bookingMode === "borrow" || bookingMode === "buy") && (
          <div className="booking-toolbar">
            <div className="booking-count-label">Showing <strong>{bookingFilteredList.length}</strong> book{bookingFilteredList.length !== 1 ? "s" : ""}</div>
            <div className="sort-wrap">
              <label>Sort by</label>
              <select value={bookingSort} onChange={(e) => setBookingSort(e.target.value)}>
                <option value="default">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
                <option value="az">A → Z</option>
              </select>
            </div>
          </div>
        )}

        {/* BOOKING GRID */}
        {(bookingMode === "all" || bookingMode === "borrow" || bookingMode === "buy") && (
          <div className="booking-body">
            <div className="booking-grid">
              {bookingFilteredList.length === 0 ? (
                <div className="no-results" style={{ gridColumn: "1/-1" }}><span className="nr-icon">📭</span>No books match the current filter.</div>
              ) : (
                bookingFilteredList.map((book, i) => {
                  const availClass = book.stock === 0 ? "none" : book.stock <= 2 ? "low" : "avail";
                  const availLabel = book.stock === 0 ? "Unavailable" : book.stock <= 2 ? `${book.stock} left` : `${book.stock} available`;
                  return (
                    <div className="booking-card" key={i}>
                      <div className="bk-img">
                        <img src={book.img} alt={book.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        <div className="bk-overlay"></div>
                        <span className={`bk-avail ${availClass}`}>{availLabel}</span>
                        <span className="bk-price-badge">LKR {book.price}</span>
                      </div>
                      <div className="bk-body">
                        <div className="bk-genre">{genreName(book.genre)}{book.uploadedBy ? <>&nbsp;· <span style={{ color: "var(--ice)", fontSize: "0.65rem" }}>Student Upload</span></> : null}</div>
                        <div className="bk-title">{book.title}</div>
                        <div className="bk-author">✍️ {book.author}</div>
                        <div className="bk-info">
                          <span className="bk-tag">⭐ {book.rating}</span>
                          <span className="bk-tag">{book.pages} pages</span>
                          <span className="bk-tag">{book.year}</span>
                        </div>
                        <div className="bk-stock-row">
                          <span className="bk-stock-lbl">Physical copies:</span>
                          <span className={`bk-stock-num ${book.stock === 0 ? "red" : book.stock <= 2 ? "orange" : "green"}`}>{book.stock} / {book.copies}</span>
                        </div>
                        <div className="bk-price-row">
                          <span className="bk-price-lbl">Purchase price</span>
                          <span className="bk-price-val">LKR {book.price}</span>
                        </div>
                        <div className="bk-actions-col">
                          <button className="bk-btn bk-btn-borrow" disabled={book.stock === 0} onClick={() => openBkModal(book, "borrow")}>
                            🔖 {book.stock === 0 ? "Unavailable to Borrow" : "Reserve to Borrow"}
                          </button>
                          <button className="bk-btn bk-btn-buy" onClick={() => openBkModal(book, "buy")}>
                            💰 Purchase (Cash)
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* MY BOOKINGS */}
        {bookingMode === "my" && (
          <div className="my-bookings-section" style={{ display: "block" }}>
            <div className="eyebrow">Your Account</div>
            <h2>My <em style={{ color: "var(--gold)", fontStyle: "italic", fontFamily: "'Crimson Pro',serif" }}>Bookings</em></h2>
            <div className="bookings-list">
              {myBookings.length === 0 ? (
                <div className="no-bookings">You have no bookings yet. Browse the library to get started!</div>
              ) : (
                myBookings.map((bk, i) => (
                  <div className="booking-item" key={i}>
                    <img className="bi-img" src={bk.book.img} alt={bk.book.title} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    <div className="bi-info">
                      <div className="bi-title">{bk.book.title}</div>
                      <div className="bi-author">{bk.book.author}</div>
                    </div>
                    <span className={`bi-type ${bk.type}`}>{bk.type === "borrow" ? "🔖 Borrow" : "💰 Purchase"}</span>
                    <span className="bi-date">📅 {bk.date}</span>
                    <span className="bi-status confirmed">✓ Confirmed</span>
                    <span className="bk-ref-pill">{bk.ref}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* UPLOAD YOUR BOOK */}
        {bookingMode === "upload" && (
          <div className="upload-section" style={{ display: "block" }}>
            <div className="eyebrow">Community</div>
            <h2 className="sec-title" style={{ marginBottom: "0.5rem" }}>Share Your <em>Story</em></h2>
            <p className="sec-sub" style={{ marginBottom: "2.5rem" }}>Upload your own book or storybook and make it available for others to borrow or purchase.</p>
            <div className="upload-card">
              <h2>📤 Upload a Book</h2>
              <p>Share your manuscript, storybook, or any written work with the LibraryHub university community.</p>
              <div className="upload-dropzone" onClick={() => document.getElementById("lh-fileInput").click()}>
                <input type="file" id="lh-fileInput" accept=".pdf,.epub,.docx" style={{ display: "none" }} onChange={onFileChosen} />
                <div className="ud-icon">📂</div>
                <p><strong>Click to browse</strong> or drag &amp; drop your file here</p>
                <p style={{ marginTop: 6, fontSize: "0.78rem", opacity: 0.6 }}>Supported: PDF, EPUB, DOCX · Max 50 MB</p>
              </div>
              {uploadFileName && (
                <div style={{ display: "block", fontFamily: "var(--ff-ui)", fontSize: "0.82rem", color: "var(--gold)", marginBottom: "1rem" }}>📎 {uploadFileName}</div>
              )}
              <div className="upload-form-grid">
                <div className="bk-form-row"><label>Book Title</label><input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="e.g. The Lost Realm" /></div>
                <div className="bk-form-row"><label>Author Name</label><input type="text" value={uploadAuthor} onChange={(e) => setUploadAuthor(e.target.value)} placeholder="e.g. Jane Doe" /></div>
                <div className="bk-form-row">
                  <label>Genre</label>
                  <select value={uploadGenre} onChange={(e) => setUploadGenre(e.target.value)}>
                    <option value="">— Select Genre —</option>
                    <option>Fantasy</option><option>Sci-Fi</option><option>Mystery</option>
                    <option>Horror</option><option>Romance</option><option>Adventure</option><option>Children's</option>
                  </select>
                </div>
                <div className="bk-form-row"><label>Price (LKR)</label><input type="number" value={uploadPrice} onChange={(e) => setUploadPrice(e.target.value)} placeholder="e.g. 350" min="0" /></div>
              </div>
              <div className="bk-form-row">
                <label>Short Description</label>
                <textarea rows="3" value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} placeholder="A brief summary of your book…"
                  style={{ width: "100%", padding: "11px 16px", background: "var(--abyss)", border: "1px solid var(--border2)", borderRadius: 10, color: "#fff", fontFamily: "var(--ff-ui)", fontSize: "0.9rem", outline: "none", resize: "vertical" }}></textarea>
              </div>
              <button className="upload-submit-btn" onClick={submitUpload}>🚀 Submit for Review</button>
              <div id="upload-ok" className={uploadOk ? "show" : ""}>✅ Your book has been submitted for review. You'll be notified once it's approved!</div>
            </div>
          </div>
        )}

      </div>{/* /page-booking */}

      {/* ═══════════ BOOKING MODAL ═══════════ */}
      <div className={`bk-modal-overlay${bkModalOpen ? " open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) closeBkModal(); }}>
        {bkModalOpen && bkCurrentBook && (
          <div className="bk-modal">
            {!bkShowSuccess ? (
              <div id="bkFormState">
                <div className="bk-modal-head">
                  <h3>{bkCurrentType === "borrow" ? "🔖 Reserve to Borrow" : "💰 Purchase Book"}</h3>
                  <button className="bk-modal-close" onClick={closeBkModal}>✕</button>
                </div>
                <div className="bk-modal-body">
                  <div className="bk-modal-book-row">
                    <img src={bkCurrentBook.img} alt={bkCurrentBook.title} className="bk-modal-book-img" />
                    <div className="bk-modal-book-info">
                      <strong>{bkCurrentBook.title}</strong>
                      <span>✍️ {bkCurrentBook.author}</span><br />
                      <span style={{ color: "var(--gold)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{genreName(bkCurrentBook.genre)}</span>
                    </div>
                  </div>

                  <div className="bk-modal-type">
                    <button className={`bk-type-btn${bkCurrentType === "borrow" ? " sel-borrow" : ""}`} onClick={() => selectBkType("borrow")}>🔖 Borrow (Physical)</button>
                    <button className={`bk-type-btn${bkCurrentType === "buy" ? " sel-buy" : ""}`} onClick={() => selectBkType("buy")}>💰 Purchase (Cash)</button>
                  </div>

                  {bkCurrentType === "borrow" && (
                    <div>
                      <div className="bk-form-row">
                        <label>Your Full Name</label>
                        <input type="text" value={bkName} onChange={(e) => setBkName(e.target.value)} placeholder="e.g. Ayasha Fernando" />
                      </div>
                      <div className="bk-form-row">
                        <label>Student ID</label>
                        <input type="text" value={bkStudentId} onChange={(e) => setBkStudentId(e.target.value)} placeholder="e.g. 2021/CS/001" />
                      </div>
                      <div className="bk-form-row">
                        <label>Pickup Date</label>
                        <input type="date" value={bkDate} min={bkMinDate} onChange={(e) => setBkDate(e.target.value)} />
                      </div>
                      <div className="bk-form-row">
                        <label>Borrow Duration</label>
                        <select value={bkDuration} onChange={(e) => setBkDuration(e.target.value)}>
                          <option value="7">7 days</option>
                          <option value="14">14 days</option>
                          <option value="21">21 days</option>
                          <option value="30">30 days</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {bkCurrentType === "buy" && (
                    <div>
                      <div className="bk-form-row">
                        <label>Your Full Name</label>
                        <input type="text" value={bkBuyName} onChange={(e) => setBkBuyName(e.target.value)} placeholder="e.g. Ayasha Fernando" />
                      </div>
                      <div className="bk-form-row">
                        <label>Student ID</label>
                        <input type="text" value={bkBuyStudentId} onChange={(e) => setBkBuyStudentId(e.target.value)} placeholder="e.g. 2021/CS/001" />
                      </div>
                      <div className="bk-form-row">
                        <label>Contact Number</label>
                        <input type="tel" value={bkPhone} onChange={(e) => setBkPhone(e.target.value)} placeholder="e.g. 077 123 4567" />
                      </div>
                      <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid var(--border-g)", borderRadius: 10, padding: "0.9rem 1rem", marginBottom: "1.1rem", fontFamily: "var(--ff-ui)", fontSize: "0.8rem", color: "var(--smoke)", lineHeight: 1.7 }}>
                        💡 <strong style={{ color: "var(--gold)" }}>Cash Payment</strong> — Payment is made in person at the library counter. Please bring your Student ID and this booking reference when you arrive.
                      </div>
                    </div>
                  )}

                  <div className="bk-summary-box">
                    <div className="bk-summary-row"><span className="sk">Book</span><span className="sv">{bkCurrentBook.title}</span></div>
                    <div className="bk-summary-row"><span className="sk">Type</span><span className="sv">{bkCurrentType === "borrow" ? "Borrow (Physical)" : "Purchase (Cash)"}</span></div>
                    {bkCurrentType === "borrow" && (
                      <div className="bk-summary-row"><span className="sk">Duration</span><span className="sv">{bkDuration} days</span></div>
                    )}
                    {bkCurrentType === "buy" && (
                      <div className="bk-summary-row total"><span className="sk">Total (Cash)</span><span className="sv">LKR {bkCurrentBook.price}</span></div>
                    )}
                  </div>

                  <button className="bk-confirm-btn" onClick={confirmBooking}>✦ Confirm Reservation</button>
                </div>
              </div>
            ) : (
              <div className="bk-success show">
                <span className="bk-success-icon">{bkSuccessInfo.icon}</span>
                <h3>{bkSuccessInfo.title}</h3>
                <p>{bkSuccessInfo.msg}</p>
                <div className="bk-ref">📋 Ref: {bkSuccessInfo.ref}</div>
                <br /><br />
                <button className="btn btn-ghost btn-sm" onClick={closeBkModal} style={{ marginTop: "0.5rem" }}>Close</button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
