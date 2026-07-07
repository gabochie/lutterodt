/* ===== BRAND =====
 * Colors:   Burgundy #5C1A2B | Gold #C6A15B | Ivory #FAF6EF | Charcoal #211D1A
 * Display:  Fraunces (serif) for headings
 * Body:     Inter (sans-serif)
 * Mono:     IBM Plex Mono for labels/tables
 * Radius:   2px throughout
 * ================ */

const sharedCss = `*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',-apple-system,sans-serif;background:#FAF6EF;color:#211D1A;display:flex;min-height:100vh;-webkit-font-smoothing:antialiased}
.sidebar{width:240px;background:#2A0B14;padding:24px 20px;border-right:1px solid rgba(250,246,239,0.18);display:flex;flex-direction:column;flex-shrink:0}
.sidebar-logo{font-family:'Fraunces','Iowan Old Style',serif;font-size:17px;font-weight:650;letter-spacing:.02em;color:#FAF6EF;text-decoration:none;display:flex;align-items:center;gap:10px;margin-bottom:32px}
.sidebar-logo svg{width:30px;height:30px;flex-shrink:0}
.sidebar-logo span{color:#8C744A;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;display:block;margin-top:1px}
.sidebar-nav{display:flex;flex-direction:column;gap:2px}
.sidebar-nav a{color:rgba(250,246,239,0.6);text-decoration:none;padding:8px 12px;font-size:13px;letter-spacing:.02em;border-radius:2px;transition:all .2s}
.sidebar-nav a:hover{background:rgba(250,246,239,0.08);color:#FAF6EF}
.sidebar-nav a.active{background:rgba(198,161,91,0.15);color:#E4C989}
.sidebar-spacer{flex:1}
.sidebar-foot{color:rgba(250,246,239,0.35);font-size:12px;padding:12px;text-decoration:none;transition:color .2s}
.sidebar-foot:hover{color:rgba(250,246,239,0.6)}
.main-wrap{flex:1;min-width:0;display:flex;flex-direction:column}
.topbar{position:sticky;top:0;z-index:30;background:rgba(250,246,239,0.92);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid rgba(33,29,26,0.14);padding:14px 32px;display:flex;align-items:center;justify-content:space-between}
.topbar h1{font-family:'Fraunces','Iowan Old Style',serif;font-size:22px;font-weight:500;letter-spacing:-.01em;color:#2A0B14}
.topbar-actions{display:flex;align-items:center;gap:12px}
.main-content{padding:32px;flex:1}
.card{background:#FAF6EF;border:1px solid rgba(33,29,26,0.14);padding:20px}
.card-gold{border-color:#C6A15B}
.card-h{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(33,29,26,0.4);font-weight:400;margin-bottom:6px}
.card-v{font-family:'Fraunces','Iowan Old Style',serif;font-size:34px;font-weight:500;color:#C6A15B;letter-spacing:-.01em}
.card-v-sm{font-family:'Fraunces','Iowan Old Style',serif;font-size:26px;font-weight:500;color:#C6A15B;letter-spacing:-.01em}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:2px;background:rgba(33,29,26,0.14);margin-bottom:32px;border:1px solid rgba(33,29,26,0.14)}
.stats-grid .card{border:0}
.btn{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.15em;text-transform:uppercase;padding:10px 20px;border:1px solid transparent;border-radius:2px;cursor:pointer;text-decoration:none;transition:all .25s}
.btn:hover{transform:translateY(-1px)}
.btn-p{background:#5C1A2B;color:#FAF6EF}
.btn-p:hover{background:#3A0F1C}
.btn-g{background:#C6A15B;color:#2A0B14}
.btn-g:hover{background:#E4C989}
.btn-o{border-color:#5C1A2B;color:#5C1A2B}
.btn-o:hover{background:#5C1A2B;color:#FAF6EF}
.btn-sm{padding:6px 14px;font-size:10px}
.actions-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}
.tbl-wrap{background:#FAF6EF;border:1px solid rgba(33,29,26,0.14);overflow-x:auto}
.tbl-wrap table{width:100%;border-collapse:collapse}
.tbl-wrap th{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(33,29,26,0.4);font-weight:400;text-align:left;padding:12px 16px;border-bottom:1px solid rgba(33,29,26,0.14)}
.tbl-wrap td{padding:12px 16px;font-size:13.5px;color:#211D1A;border-bottom:1px solid rgba(33,29,26,0.14)}
.tbl-wrap tbody tr:last-child td{border-bottom:0}
.tbl-wrap tbody tr:hover{background:rgba(241,234,218,0.5)}
.data-box{background:#FAF6EF;border:1px solid rgba(33,29,26,0.14);padding:24px;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:13px;color:#211D1A;white-space:pre-wrap;overflow-x:auto;line-height:1.6}
.loading{text-align:center;padding:40px;color:rgba(33,29,26,0.4);font-size:13px}
.error-msg{text-align:center;padding:24px;color:#5C1A2B;font-size:13px;border:1px solid rgba(92,26,43,0.2);background:rgba(92,26,43,0.04)}
.empty-msg{text-align:center;padding:40px;color:rgba(33,29,26,0.35);font-size:13px}
.badge{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:9px;letter-spacing:.15em;text-transform:uppercase;padding:3px 8px;border:1px solid;display:inline-block}
.badge-done{background:rgba(47,74,60,0.08);color:#2F4A3C;border-color:rgba(47,74,60,0.15)}
.badge-pending{background:rgba(33,29,26,0.04);color:rgba(33,29,26,0.45);border-color:rgba(33,29,26,0.1)}
.badge-progress{background:rgba(140,116,74,0.08);color:#8C744A;border-color:rgba(140,116,74,0.15)}
.badge-new{color:#5C1A2B;border-color:#5C1A2B}
.login-body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#FAF6EF}
.login-box{width:100%;max-width:380px;padding:40px}
.login-box h1{font-family:'Fraunces','Iowan Old Style',serif;font-size:26px;font-weight:500;text-align:center;color:#2A0B14;letter-spacing:-.01em;margin-bottom:6px}
.login-box .sub{text-align:center;color:rgba(33,29,26,0.45);font-size:14px;margin-bottom:28px}
.login-box form{display:flex;flex-direction:column;gap:16px}
.login-box label{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(33,29,26,0.5)}
.login-box input{padding:12px 14px;border:1px solid rgba(33,29,26,0.14);background:#FAF6EF;color:#211D1A;font-size:15px;font-family:'Inter',-apple-system,sans-serif;border-radius:2px;outline:none;transition:border-color .2s}
.login-box input:focus{border-color:#C6A15B}
.login-box button{padding:12px;background:#5C1A2B;color:#FAF6EF;border:none;border-radius:2px;font-size:13px;font-family:'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:background .2s}
.login-box button:hover{background:#3A0F1C}
.login-error{background:rgba(92,26,43,0.06);color:#5C1A2B;padding:10px 14px;border:1px solid rgba(92,26,43,0.15);font-size:13px;text-align:center}
.sec-label{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(33,29,26,0.4);margin-bottom:12px}
.tag-line{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#8C744A;display:flex;align-items:center;gap:12px}
.tag-line::before{content:'';width:22px;height:1px;background:#8C744A}
.cl{max-width:720px}.cl-grp{margin-bottom:28px}.cl-h{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(33,29,26,0.4);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(33,29,26,0.14)}.cl-itm{display:flex;align-items:flex-start;gap:12px;padding:8px 0;border-bottom:1px solid rgba(33,29,26,0.06);cursor:pointer;transition:opacity .2s}.cl-itm:last-child{border-bottom:0}.cl-itm.done{opacity:.55}.cl-itm.done .cl-lbl{text-decoration:line-through;color:rgba(33,29,26,0.4)}.cl-cb{width:18px;height:18px;border:1.5px solid rgba(33,29,26,0.2);border-radius:2px;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;transition:all .2s;background:transparent}.cl-cb.checked{background:#2F4A3C;border-color:#2F4A3C}.cl-cb.checked::after{content:'';width:6px;height:10px;border:solid #FAF6EF;border-width:0 2px 2px 0;transform:rotate(45deg);margin-top:-2px}.cl-lbl{font-size:13.5px;color:#211D1A;line-height:1.4;flex:1}.cl-desc{font-size:11.5px;color:rgba(33,29,26,0.4);margin-top:2px}.cl-progress{margin-bottom:24px}.cl-progress-bar{height:4px;background:rgba(33,29,26,0.08);border-radius:2px;overflow:hidden;margin-bottom:6px}.cl-progress-fill{height:100%;background:#2F4A3C;border-radius:2px;transition:width .4s ease}.cl-progress-txt{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.05em;color:rgba(33,29,26,0.4)}.cl-actions{display:flex;gap:10px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(33,29,26,0.14)}
@keyframes spin{to{transform:rotate(360deg)}}.spinner{width:18px;height:18px;border:2px solid rgba(33,29,26,0.12);border-top-color:#5C1A2B;border-radius:50%;animation:spin .6s linear infinite;margin:0 auto}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.fade-in{animation:fadeIn .3s ease}
@media(max-width:768px){body{flex-direction:column}.sidebar{position:fixed;top:0;left:-280px;height:100vh;z-index:100;transition:left .3s ease;width:260px}.sidebar.open{left:0}.main-wrap{margin-left:0;width:100%}.topbar{padding:12px 16px}.topbar h1{font-size:18px}.stats-grid{grid-template-columns:1fr 1fr}.menu-toggle{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:none;border:1px solid rgba(33,29,26,0.14);border-radius:2px;cursor:pointer;flex-shrink:0;color:#2A0B14;font-size:18px;margin-right:8px;transition:all .2s;line-height:1}.menu-toggle:hover{border-color:#C6A15B;color:#5C1A2B}.main-content{padding:24px}}@media(max-width:480px){.stats-grid{grid-template-columns:1fr}.main-content{padding:16px}.topbar{padding:10px 12px}.topbar h1{font-size:16px}.btn{padding:8px 14px;font-size:10px}.card{padding:14px}.card-v{font-size:26px}.tbl-wrap td,.tbl-wrap th{padding:8px 10px}}`;

const pages = {
  login: (error) => `...`,

  verifyForm: (error, success) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Verify \u2014 Lutterodt Family Directory</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,650&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"><style>${sharedCss}.vrfy-body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#FAF6EF;padding:20px}.vrfy-box{width:100%;max-width:460px;padding:40px}.vrfy-box h1{font-family:'Fraunces','Iowan Old Style',serif;font-size:26px;font-weight:500;text-align:center;color:#2A0B14;letter-spacing:-.01em;margin-bottom:6px}.vrfy-box .sub{text-align:center;color:rgba(33,29,26,0.45);font-size:14px;margin-bottom:28px}.vrfy-box form{display:flex;flex-direction:column;gap:14px}.vrfy-box label{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;color:rgba(33,29,26,0.5)}.vrfy-box input,.vrfy-box select{padding:12px 14px;border:1px solid rgba(33,29,26,0.14);background:#FAF6EF;color:#211D1A;font-size:15px;font-family:'Inter',-apple-system,sans-serif;border-radius:2px;outline:none;transition:border-color .2s}.vrfy-box input:focus,.vrfy-box select:focus{border-color:#C6A15B}.vrfy-box .btn-submit{padding:12px;background:#5C1A2B;color:#FAF6EF;border:none;border-radius:2px;font-size:13px;font-family:'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase;cursor:pointer;transition:background .2s}.vrfy-box .btn-submit:hover{background:#3A0F1C}.vrfy-box .footnote{text-align:center;margin-top:20px;border-top:1px solid rgba(33,29,26,0.14);padding-top:20px;font-size:13px;color:rgba(33,29,26,0.45)}.vrfy-box .footnote a{color:#5C1A2B;text-decoration:none;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.15em;text-transform:uppercase}</style></head><body class="vrfy-body"><div class="vrfy-box"><svg viewBox="0 0 40 40" fill="none" style="width:40px;height:40px;display:block;margin:0 auto 16px"><circle cx="20" cy="20" r="19" stroke="#C6A15B" stroke-width="1"/><path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#5C1A2B" stroke-width="1.1"/><circle cx="20" cy="20" r="3" fill="#C6A15B"/></svg><h1>Lutterodt Family Directory</h1><p class="sub">This directory is reserved for those who carry the Lutterodt name. Verify your identity to access the full family archive and connect with Lutterodts worldwide.</p>${error?`<div class="login-error">${error}</div>`:''}${success?`<div style="background:rgba(47,74,60,0.06);color:#2F4A3C;padding:10px 14px;border:1px solid rgba(47,74,60,0.15);font-size:13px;text-align:center;margin-bottom:16px">${success}</div>`:''}<form method="POST" action="/api/verify"><label for="full_name">Full Name</label><input type="text" id="full_name" name="full_name" placeholder="e.g. Kwame Lutterodt" required><label for="email">Email Address</label><input type="email" id="email" name="email" placeholder="you@example.com" required><label for="country">Country of Residence</label><input type="text" id="country" name="country" placeholder="e.g. Ghana, UK, USA"><label for="relationship">Your Connection to the Lutterodt Family</label><input type="text" id="relationship" name="relationship" placeholder="e.g. Grandson of George Lutterodt, cousin, etc."><button type="submit" class="btn-submit">Verify &amp; Access Directory</button></form><div class="footnote"><a href="/">Return to lutterodt.org</a></div></div></body></html>`,

  verifySuccess: () => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Verified \u2014 Lutterodt Family Directory</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,650&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"><style>${sharedCss}.vrfy-body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#FAF6EF;padding:20px}.vrfy-box{width:100%;max-width:460px;padding:40px;text-align:center}.vrfy-box h1{font-family:'Fraunces','Iowan Old Style',serif;font-size:26px;font-weight:500;color:#2A0B14;letter-spacing:-.01em;margin-bottom:10px}.vrfy-box p{color:rgba(33,29,26,0.55);font-size:15px;line-height:1.6;margin-bottom:24px}.vrfy-box .check{width:48px;height:48px;border-radius:50%;background:#2F4A3C;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:#FAF6EF;font-size:24px}.vrfy-box .btn{display:inline-block;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.15em;text-transform:uppercase;padding:12px 28px;background:#5C1A2B;color:#FAF6EF;text-decoration:none;border-radius:2px;transition:background .2s;margin:4px}.vrfy-box .btn:hover{background:#3A0F1C}.vrfy-box .btn-sec{background:transparent;border:1px solid rgba(33,29,26,0.14);color:#5C1A2B}.vrfy-box .btn-sec:hover{background:rgba(92,26,43,0.04)}</style></head><body class="vrfy-body"><div class="vrfy-box"><div class="check">&#10003;</div><h1>You&rsquo;re verified</h1><p>Welcome to the Lutterodt Family Directory. Your identity has been confirmed and you now have access to the full directory of Lutterodt profiles worldwide. This access is valid for 30 days.</p><a href="/directory" class="btn">Browse the Directory</a><a href="/" class="btn btn-sec">Return Home</a></div></body></html>`,

  accessDenied: () => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Access Restricted \u2014 Lutterodt Family Directory</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,650&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"><style>${sharedCss}.deny-body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#FAF6EF;padding:20px}.deny-box{width:100%;max-width:480px;padding:40px;text-align:center}.deny-box h1{font-family:'Fraunces','Iowan Old Style',serif;font-size:28px;font-weight:500;color:#2A0B14;letter-spacing:-.01em;margin-bottom:10px}.deny-box p{color:rgba(33,29,26,0.55);font-size:15px;line-height:1.6;margin-bottom:20px}.deny-box .divider{width:40px;height:1px;background:rgba(33,29,26,0.12);margin:0 auto 20px}.deny-box .btn{display:inline-block;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.15em;text-transform:uppercase;padding:12px 28px;background:#5C1A2B;color:#FAF6EF;text-decoration:none;border-radius:2px;transition:background .2s;margin:4px}.deny-box .btn:hover{background:#3A0F1C}.deny-box .btn-sec{background:transparent;border:1px solid rgba(33,29,26,0.14);color:#5C1A2B}.deny-box .btn-sec:hover{background:rgba(92,26,43,0.04)}</style></head><body class="deny-body"><div class="deny-box"><svg viewBox="0 0 40 40" fill="none" style="width:40px;height:40px;display:block;margin:0 auto 16px"><circle cx="20" cy="20" r="19" stroke="#C6A15B" stroke-width="1"/><path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#5C1A2B" stroke-width="1.1"/><circle cx="20" cy="20" r="3" fill="#C6A15B"/></svg><h1>Family Directory</h1><p class="sub" style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8C744A;margin-bottom:16px">Access Restricted</p><p>The Lutterodt Family Directory is reserved for those who carry the Lutterodt name. This is a private archive of Lutterodt family members across the globe, maintained as part of the Lutterodt Renaissance project.</p><div class="divider"></div><p style="font-size:14px;color:rgba(33,29,26,0.5)">If you are a Lutterodt, verify your identity to gain access. If you have questions about the project, please reach out through our contact page.</p><div style="margin-top:24px"><a href="/verify" class="btn">I Am a Lutterodt</a><a href="/contact" class="btn btn-sec">Contact Us</a></div><div style="margin-top:20px;border-top:1px solid rgba(33,29,26,0.14);padding-top:20px"><a href="/" style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#8C744A;text-decoration:none">Return to lutterodt.org</a></div></div></body></html>`,

  preview: () => {
    const sections = {
      dashboard: { title:'Dashboard', html:'<div class="stats-grid"><div class="card"><h3 class="card-h">Contacts</h3><div class="card-v">12</div></div><div class="card"><h3 class="card-h">Articles</h3><div class="card-v">8</div></div><div class="card"><h3 class="card-h">Timeline Events</h3><div class="card-v">43</div></div><div class="card"><h3 class="card-h">Gallery Items</h3><div class="card-v">27</div></div></div><span class="tag-line" style="margin-bottom:16px">Quick Actions</span><div class="actions-row"><a href="/login" class="btn btn-o">Contacts</a><a href="/login" class="btn btn-o">Budget</a><a href="/login" class="btn btn-o">Roadmap</a><a href="/login" class="btn btn-o">Settings</a></div>' },
      contacts: { title:'Contacts', html:'<div class="tbl-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Date</th></tr></thead><tbody><tr><td>Kwame Asante</td><td><a href="mailto:kwame@example.com" style="color:#5C1A2B;text-decoration:none">kwame@example.com</a></td><td style="color:rgba(33,29,26,0.6)">Interested in sponsoring the digitisation project</td><td style="font-family:monospace;font-size:11px;color:rgba(33,29,26,0.4);white-space:nowrap">2026-06-28</td></tr><tr><td>Abena Lutterodt</td><td><a href="mailto:abena@example.com" style="color:#5C1A2B;text-decoration:none">abena@example.com</a></td><td style="color:rgba(33,29,26,0.6)">I have old photographs from the 1960s to contribute</td><td style="font-family:monospace;font-size:11px;color:rgba(33,29,26,0.4);white-space:nowrap">2026-06-25</td></tr><tr><td>Dr. Mensah</td><td><a href="mailto:mensa@example.com" style="color:#5C1A2B;text-decoration:none">mensa@example.com</a></td><td style="color:rgba(33,29,26,0.6)">Research inquiry about Harbour Road archives</td><td style="font-family:monospace;font-size:11px;color:rgba(33,29,26,0.4);white-space:nowrap">2026-06-20</td></tr></tbody></table></div>' },
      budget: { title:'Budget', html:'<div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))"><div class="card"><h3 class="card-h">Total Budget</h3><div class="card-v-sm">$12,450</div></div><div class="card"><h3 class="card-h">Spent</h3><div class="card-v-sm">$8,230</div></div><div class="card"><h3 class="card-h">Remaining</h3><div class="card-v-sm" style="color:#2F4A3C">$4,220</div></div><div class="card"><h3 class="card-h">Transactions</h3><div class="card-v-sm">34</div></div></div><span class="tag-line" style="margin-bottom:12px">Recent Transactions</span><div class="tbl-wrap"><table><thead><tr><th>Item</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead><tbody><tr><td>Server hosting (Jul)</td><td>$299</td><td style="font-family:monospace;font-size:11px;color:rgba(33,29,26,0.4)">2026-07-01</td><td><span class="badge badge-done">Paid</span></td></tr><tr><td>Domain renewal</td><td>$48</td><td style="font-family:monospace;font-size:11px;color:rgba(33,29,26,0.4)">2026-06-15</td><td><span class="badge badge-done">Paid</span></td></tr><tr><td>Archivist consultation</td><td>$1,200</td><td style="font-family:monospace;font-size:11px;color:rgba(33,29,26,0.4)">2026-06-10</td><td><span class="badge badge-progress">Pending</span></td></tr></tbody></table></div>' },
      roadmap: { title:'Roadmap', html:'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:2px;background:rgba(33,29,26,0.14);border:1px solid rgba(33,29,26,0.14)"><div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px"><span class="card-h">Phase 1</span><span class="badge badge-done">Completed</span></div><div style="font-family:Fraunces,serif;font-size:17px;font-weight:500;color:#2A0B14;margin-bottom:6px">Foundation &amp; Archive Setup</div><div style="font-size:13px;color:rgba(33,29,26,0.6);line-height:1.5">Core infrastructure, family tree database, timeline framework</div></div><div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px"><span class="card-h">Phase 2</span><span class="badge badge-progress">In Progress</span></div><div style="font-family:Fraunces,serif;font-size:17px;font-weight:500;color:#2A0B14;margin-bottom:6px">Public Directory &amp; Profiles</div><div style="font-size:13px;color:rgba(33,29,26,0.6);line-height:1.5">Member directory, individual profile pages, search and filter</div></div><div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px"><span class="card-h">Phase 3</span><span class="badge badge-pending">Planned</span></div><div style="font-family:Fraunces,serif;font-size:17px;font-weight:500;color:#2A0B14;margin-bottom:6px">Sponsorship &amp; Payments</div><div style="font-size:13px;color:rgba(33,29,26,0.6);line-height:1.5">Stripe integration, sponsorship tiers, patron dashboard</div></div><div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px"><span class="card-h">Phase 4</span><span class="badge badge-pending">Planned</span></div><div style="font-family:Fraunces,serif;font-size:17px;font-weight:500;color:#2A0B14;margin-bottom:6px">Member Dashboard &amp; Auth</div><div style="font-size:13px;color:rgba(33,29,26,0.6);line-height:1.5">User accounts, subscription management, gated content for patrons</div></div></div>' },
      settings: { title:'Settings', html:'<div class="data-box">{\n  "coming_soon": false,\n  "site_name": "The Lutterodt Renaissance",\n  "contact_email": "hello@lutterodt.org",\n  "registration_open": true,\n  "maintenance_mode": false,\n  "ga_tracking_id": "G-XXXXXXXXXX",\n  "last_updated": "2026-07-07"\n}</div>' },
      checklist: { title:'Checklist', html:'<p class="empty-msg">Sign in to use the interactive pre-deployment checklist.</p><div class="actions-row"><a href="/login" class="btn btn-p">Sign In</a></div>' }
    };
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Preview \u2014 Lutterodt Admin</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,650&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"><style>${sharedCss}.preview-banner{background:#5C1A2B;color:#FAF6EF;text-align:center;padding:6px 16px;font-family:monospace;font-size:10px;letter-spacing:.1em} .preview-banner a{color:#E4C989;text-decoration:underline}</style></head><body><div class="preview-banner">Preview mode \u2014 demo data shown. <a href="/login">Sign in to access live admin.</a></div><div style="display:flex;flex:1;min-height:0"><div class="sidebar"><a href="/admin/preview" class="sidebar-logo"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="#C6A15B" stroke-width="1"/><path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#FAF6EF" stroke-width="1.1"/><circle cx="20" cy="20" r="3" fill="#C6A15B"/></svg>Lutterodt<span>Renaissance</span></a><nav class="sidebar-nav"><a href="#" data-section="dashboard" class="active">Dashboard</a><a href="#" data-section="contacts">Contacts</a><a href="#" data-section="budget">Budget</a><a href="#" data-section="roadmap">Roadmap</a><a href="#" data-section="checklist">Checklist</a><a href="#" data-section="settings">Settings</a></nav><div class="sidebar-spacer"></div><a href="/login" class="sidebar-foot">Sign in \u2192</a></div><div class="main-wrap"><div class="topbar"><button id="menuToggle" class="menu-toggle" aria-label="Toggle navigation">\u2630</button><h1 id="previewTitle">Dashboard</h1><div class="topbar-actions"><span style="font-family:monospace;font-size:10px;letter-spacing:.1em;color:rgba(33,29,26,0.35)">Preview</span></div></div><div class="main-content" id="previewContent"></div></div></div><script>const sections=${JSON.stringify(sections)};function showSection(key){const s=sections[key];if(!s)return;document.getElementById('previewTitle').textContent=s.title;document.getElementById('previewContent').innerHTML=s.html;document.querySelectorAll('.sidebar-nav a').forEach(a=>a.classList.toggle('active',a.dataset.section===key))}document.querySelectorAll('.sidebar-nav a[data-section]').forEach(a=>a.addEventListener('click',function(e){e.preventDefault();showSection(this.dataset.section)}));showSection('dashboard');document.getElementById('menuToggle')?.addEventListener('click',function(){document.querySelector('.sidebar').classList.toggle('open')});document.addEventListener('click',function(e){const s=document.querySelector('.sidebar');if(s&&!s.contains(e.target)&&!document.getElementById('menuToggle')?.contains(e.target))s.classList.remove('open')});</script></body></html>`;
  },

  adminPage: (token, active, title, subtitle, bodyHtml, extraJs) => `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} \u2014 Lutterodt Admin</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,650&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"><style>${sharedCss}</style></head><body><div class="sidebar"><a href="/admin" class="sidebar-logo"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="#C6A15B" stroke-width="1"/><path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#FAF6EF" stroke-width="1.1"/><circle cx="20" cy="20" r="3" fill="#C6A15B"/></svg>Lutterodt<span>Renaissance</span></a><nav class="sidebar-nav"><a href="/admin"${active==='dashboard'?' class="active"':''}>Dashboard</a><a href="/admin/contacts"${active==='contacts'?' class="active"':''}>Contacts</a><a href="/admin/verified"${active==='verified'?' class="active"':''}>Verified</a><a href="/admin/budget"${active==='budget'?' class="active"':''}>Budget</a><a href="/admin/roadmap"${active==='roadmap'?' class="active"':''}>Roadmap</a><a href="/admin/checklist"${active==='checklist'?' class="active"':''}>Checklist</a><a href="/admin/settings"${active==='settings'?' class="active"':''}>Settings</a></nav><div class="sidebar-spacer"></div><a href="/api/logout" id="logoutLink" class="sidebar-foot">Logout</a></div><div class="main-wrap"><div class="topbar"><button id="menuToggle" class="menu-toggle" aria-label="Toggle navigation">\u2630</button><h1>${title}</h1>${subtitle?`<div class="topbar-actions"><span style="font-family:monospace;font-size:10px;letter-spacing:.1em;color:rgba(33,29,26,0.35)">${subtitle}</span></div>`:''}</div><div class="main-content">${bodyHtml}</div></div><script>const t=${JSON.stringify(token)};${extraJs||''}document.getElementById('menuToggle')?.addEventListener('click',function(){document.querySelector('.sidebar').classList.toggle('open')});document.addEventListener('click',function(e){const s=document.querySelector('.sidebar');if(s&&!s.contains(e.target)&&!document.getElementById('menuToggle')?.contains(e.target))s.classList.remove('open')});document.getElementById("logoutLink")?.addEventListener("click",function(e){e.preventDefault();fetch("/api/logout").then(()=>{window.location.href="/login"})});</script></body></html>`
};

/* ===== SESSION HELPERS ===== */

function b64ToBytes(b64) {
  const bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToB64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function verifySession(cookie, env) {
  if (!cookie) return null;
  try {
    const parts = cookie.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, sigB64] = parts;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('HMAC', key, b64ToBytes(sigB64), new TextEncoder().encode(payloadB64));
    if (!valid) return null;
    return JSON.parse(atob(payloadB64));
  } catch { return null; }
}

async function createSession(env) {
  const payload = { role: 'admin', ts: Date.now() };
  const payloadB64 = btoa(JSON.stringify(payload));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  return payloadB64 + '.' + bytesToB64(new Uint8Array(sig));
}

/* ===== VERIFICATION TOKENS ===== */

async function createVerificationToken(name, email, env) {
  const payload = JSON.stringify({ name, email, role: 'lutterodt', ts: Date.now() });
  const payloadB64 = btoa(payload);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.ADMIN_PASSWORD + '_vrfy'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  return payloadB64 + '.' + bytesToB64(new Uint8Array(sig));
}

async function verifyVerificationToken(token, env) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, sigB64] = parts;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.ADMIN_PASSWORD + '_vrfy'), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('HMAC', key, b64ToBytes(sigB64), new TextEncoder().encode(payloadB64));
    if (!valid) return null;
    return JSON.parse(atob(payloadB64));
  } catch { return null; }
}

/* ===== CHECKLIST DEFAULTS ===== */
const CHECKLIST_DEFAULTS = [
  {id:"eslint",grp:"Code Quality",lbl:"ESLint passes",desc:"npm run lint \u2014 zero errors",done:false},
  {id:"typecheck",grp:"Code Quality",lbl:"TypeScript compiles",desc:"npm run typecheck \u2014 zero errors",done:false},
  {id:"tests",grp:"Code Quality",lbl:"Unit tests pass",desc:"npm test \u2014 all green",done:false},
  {id:"secrets",grp:"Environment",lbl:"Secrets set on worker",desc:"ADMIN_PASSWORD, AUTH_SECRET in Cloudflare",done:false},
  {id:"bindings",grp:"Environment",lbl:"KV & D1 bindings active",desc:"LUTTERODT_KV, LUTTERODT_D1 connected",done:false},
  {id:"d1",grp:"Data",lbl:"D1 tables created",desc:"contacts, articles, timeline_events, gallery_items",done:false},
  {id:"kv",grp:"Data",lbl:"KV keys populated",desc:"coming_soon, roadmap, budget, outreach, checklist",done:false},
  {id:"profiles",grp:"Data",lbl:"77 directory profiles verified",desc:"All profiles render, no broken links",done:false},
  {id:"assets",grp:"Build",lbl:"Static assets copied",desc:".next/server/app/ \u2192 .open-next/assets/",done:false},
  {id:"worker",grp:"Build",lbl:"Worker.js patched",desc:"Admin router, preview, checklist in worker",done:false},
  {id:"build",grp:"Build",lbl:"Build succeeds",desc:"npx opennextjs-cloudflare build",done:false},
  {id:"domain",grp:"Deployment",lbl:"Custom domain DNS ready",desc:"lutterodt.org resolves to worker",done:false},
  {id:"ssl",grp:"Deployment",lbl:"SSL certificate active",desc:"HTTPS valid, no warnings",done:false},
  {id:"notfound",grp:"Deployment",lbl:"Custom 404 page working",desc:"not-found.tsx renders branded 404",done:false},
  {id:"smoke",grp:"Post-Deployment",lbl:"Homepage loads (200)",desc:"lutterodt.org/ returns 200 OK",done:false},
  {id:"pages",grp:"Post-Deployment",lbl:"Key pages respond",desc:"/about, /directory, /sponsor, /contact all 200",done:false},
  {id:"login",grp:"Post-Deployment",lbl:"Admin login works",desc:"POST /api/login \u2192 302 to /admin",done:false},
  {id:"api",grp:"Post-Deployment",lbl:"API endpoints respond",desc:"/api/stats, /api/settings return 200",done:false}
];

/* ===== ADMIN ROUTER ===== */

async function adminRouter(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method;

  const cookie = request.headers.get('Cookie') || '';
  const authHeader = request.headers.get('Authorization') || '';
  const cookies = Object.fromEntries(cookie.split(';').filter(c => c.trim()).map(c => { const [k, ...v] = c.trim().split('='); return [k, v.join('=')]; }));
  const tokenStr = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (cookies['admin_token'] || '');

  function html(resp, status = 200) { return new Response(resp, { status, headers: { 'Content-Type': 'text/html;charset=utf-8' } }); }
  function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }); }

  // Login page
  if (pathname === '/login' && method === 'GET') return html(pages.login(null));

  // Login POST
  if (pathname === '/api/login' && method === 'POST') {
    const formData = await request.formData();
    const password = formData.get('password');
    if (password === env.ADMIN_PASSWORD) {
      const sessionToken = await createSession(env);
      return new Response('Redirecting...', {
        status: 302,
        headers: { Location: '/admin', 'Set-Cookie': `admin_token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400` }
      });
    }
    return html(pages.login('Invalid password'), 401);
  }

  // Logout (any method)
  if (pathname === '/api/logout') {
    return new Response('Redirecting...', {
      status: 302,
      headers: { Location: '/login', 'Set-Cookie': 'admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0' }
    });
  }

  // Preview (no auth)
  if (pathname === '/admin/preview') return html(pages.preview());

  // Verify page (public)
  if (pathname === '/verify' && method === 'GET') return html(pages.verifyForm(null, null));

  // Verify success page (public)
  if (pathname === '/verify/success' && method === 'GET') return html(pages.verifySuccess());

  // Verify POST (public - issues cookie)
  if (pathname === '/api/verify' && method === 'POST') {
    const formData = await request.formData();
    const fullName = (formData.get('full_name') || '').trim();
    const email = (formData.get('email') || '').trim();
    const country = (formData.get('country') || '').trim();
    const relationship = (formData.get('relationship') || '').trim();
    if (!fullName || !email) {
      return html(pages.verifyForm('Full name and email are required.', null), 400);
    }
    try {
      await env.LUTTERODT_D1.prepare(
        'CREATE TABLE IF NOT EXISTS verified_lutterodts (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT NOT NULL, email TEXT NOT NULL, country TEXT DEFAULT "", relationship TEXT DEFAULT "", status TEXT DEFAULT "pending", created_at TEXT DEFAULT (datetime("now")), verified_at TEXT, notes TEXT DEFAULT "")'
      ).run();
      await env.LUTTERODT_D1.prepare(
        'INSERT INTO verified_lutterodts (full_name, email, country, relationship) VALUES (?, ?, ?, ?)'
      ).bind(fullName, email, country, relationship).run();
      const vToken = await createVerificationToken(fullName, email, env);
      return new Response('Redirecting...', {
        status: 302,
        headers: { Location: '/verify/success', 'Set-Cookie': `lutterodt_verified=${vToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000` }
      });
    } catch (err) {
      return html(pages.verifyForm('An error occurred. Please try again.', null), 500);
    }
  }

  // Admin pages (auth required)
  if (pathname.startsWith('/admin')) {
    const session = await verifySession(tokenStr, env);
    if (!session) return new Response('Redirecting...', { status: 302, headers: { Location: '/login' } });

    if (pathname === '/admin') {
      const dashHtml = `<div id="statsContainer" class="stats-grid"><div class="card"><h3 class="card-h">Loading</h3></div></div><span class="tag-line" style="margin-bottom:16px">Quick Actions</span><div class="actions-row"><a href="/admin/contacts" class="btn btn-o">Contacts</a><a href="/admin/verified" class="btn btn-o">Verified</a><a href="/admin/checklist" class="btn btn-o">Checklist</a><a href="/admin/budget" class="btn btn-o">Budget</a><a href="/admin/roadmap" class="btn btn-o">Roadmap</a><a href="/admin/settings" class="btn btn-o">Settings</a></div>`;
      return html(pages.adminPage(tokenStr, 'dashboard', 'Dashboard', 'Session active', dashHtml,
        `fetch("/api/stats",{headers:{Authorization:"Bearer "+t}}).then(r=>r.json()).then(d=>{const s=document.getElementById("statsContainer");if(d.error){s.innerHTML='<p class="error-msg">Error: '+(d.error||"Unknown")+'</p>';return}const tables=['contacts','articles','timeline_events','gallery_items','verified_lutterodts'];s.innerHTML=tables.map((t,i)=>{const label=i===4?'Verified<br>Lutterodts':t.replace(/_/g,' ').replace(/\\b\\w/g,c=>c.toUpperCase());return '<div class="card"><h3 class="card-h">'+label+'</h3><div class="card-v">'+(d[t]||0)+'</div></div>'}).join('')}).catch(()=>{document.getElementById("statsContainer").innerHTML='<p class="error-msg">Failed to load stats.</p>'})`));
    }

    if (pathname === '/admin/contacts') {
      const bodyHtml = `<div id="contactsContainer"><p class="loading">Loading contacts...</p></div>`;
      return html(pages.adminPage(tokenStr, 'contacts', 'Contacts', 'Messages submitted via the contact form', bodyHtml,
        `fetch("/api/stats",{headers:{Authorization:"Bearer "+t}}).then(r=>r.json()).then(d=>{const c=document.getElementById("contactsContainer");if(d.error){c.innerHTML='<p class="error-msg">Error: '+(d.error||"Unknown")+'</p>';return}const cnt=typeof d.contacts==='number'?d.contacts:0;if(cnt===0){c.innerHTML='<p class="empty-msg">No messages yet.</p>';return}c.innerHTML='<p class="empty-msg">'+cnt+' contact submission'+(cnt>1?'s':'')+' recorded. Individual contact viewer coming soon.</p>'}).catch(()=>{document.getElementById("contactsContainer").innerHTML='<p class="error-msg">Failed to load contacts.</p>'})`));
    }

    if (pathname === '/admin/budget') {
      const bodyHtml = `<div id="budgetContainer"><p class="loading">Loading budget data...</p></div>`;
      return html(pages.adminPage(tokenStr, 'budget', 'Budget', null, bodyHtml,
        `fetch("/api/budget",{headers:{Authorization:"Bearer "+t}}).then(r=>r.json()).then(d=>{const c=document.getElementById("budgetContainer");c.innerHTML=d.error?'<p class="error-msg">Error: '+d.error+'</p>':'<div class="data-box">'+JSON.stringify(d,null,2).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div>'}).catch(()=>{document.getElementById("budgetContainer").innerHTML='<p class="error-msg">Failed to load budget.</p>'})`));
    }

    if (pathname === '/admin/roadmap') {
      const bodyHtml = `<div id="roadmapContainer"><p class="loading">Loading roadmap data...</p></div>`;
      return html(pages.adminPage(tokenStr, 'roadmap', 'Roadmap', null, bodyHtml,
        `fetch("/api/roadmap",{headers:{Authorization:"Bearer "+t}}).then(r=>r.json()).then(d=>{const c=document.getElementById("roadmapContainer");if(d.error){c.innerHTML='<p class="error-msg">Error: '+d.error+'</p>';return}const roads=Array.isArray(d)?d:(d.items||d.phases||[]);c.innerHTML=roads.length?'<span class="tag-line" style="margin-bottom:16px">Build Phases</span><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:2px;background:rgba(33,29,26,0.14);border:1px solid rgba(33,29,26,0.14)">'+roads.map(r=>'<div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px"><span class="card-h">'+(r.name||r.phase||'Phase')+'</span><span class="badge badge-'+(r.status==='completed'?'done':r.status==='active'?'progress':'pending')+'">'+(r.status||'planned')+'</span></div><div style="font-family:Fraunces,serif;font-size:17px;font-weight:500;color:#2A0B14;margin-bottom:6px">'+(r.title||'')+'</div><div style="font-size:13px;color:rgba(33,29,26,0.6);line-height:1.5">'+(r.desc||r.description||'')+'</div></div>').join('')+'</div>':'<p class="empty-msg">No roadmap data yet.</p>'}).catch(()=>{document.getElementById("roadmapContainer").innerHTML='<p class="error-msg">Failed to load roadmap.</p>'})`));
    }

    if (pathname === '/admin/settings') {
      const bodyHtml = `<div id="settingsContainer"><p class="loading">Loading settings...</p></div>`;
      return html(pages.adminPage(tokenStr, 'settings', 'Settings', null, bodyHtml,
        `fetch("/api/settings",{headers:{Authorization:"Bearer "+t}}).then(r=>r.json()).then(d=>{const c=document.getElementById("settingsContainer");c.innerHTML=d.error?'<p class="error-msg">Error: '+d.error+'</p>':'<div class="data-box">'+JSON.stringify(d,null,2).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div>'}).catch(()=>{document.getElementById("settingsContainer").innerHTML='<p class="error-msg">Failed to load settings.</p>'})`));
    }

    if (pathname === '/admin/checklist') {
      const defs = JSON.stringify(CHECKLIST_DEFAULTS);
      const bodyHtml = `<div class="cl"><div class="cl-progress"><div class="cl-progress-bar"><div class="cl-progress-fill" id="progressFill" style="width:0%"></div></div><div class="cl-progress-txt" id="progressTxt">0 of 0 items checked</div></div><div id="checklistBody"><p class="loading">Loading checklist...</p></div><div class="cl-actions"><button class="btn btn-o btn-sm" id="resetBtn">Reset All</button><button class="btn btn-p btn-sm" id="saveBtn" style="display:none">Save Changes</button></div></div>`;
      const js = `const D=${defs};let items=[];let dirty=false;function saveState(){dirty=true;document.getElementById('saveBtn').style.display=''}function render(){const c=document.getElementById('checklistBody');if(!items.length){c.innerHTML='<p class="loading">No checklist items.</p>';return}const grps={};items.forEach(i=>{if(!grps[i.grp])grps[i.grp]=[];grps[i.grp].push(i)});let h='';Object.keys(grps).forEach(g=>{h+='<div class="cl-grp"><div class="cl-h">'+g+'</div>';grps[g].forEach(i=>{h+='<div class="cl-itm'+(i.done?' done':'')+'" data-id="'+i.id+'"><div class="cl-cb'+(i.done?' checked':'')+'"></div><div><div class="cl-lbl">'+i.lbl+'</div><div class="cl-desc">'+i.desc+'</div></div></div>'});h+='</div>'});c.innerHTML=h;const tot=items.length;const don=items.filter(i=>i.done).length;document.getElementById('progressFill').style.width=(tot?Math.round(don/tot*100):0)+'%';document.getElementById('progressTxt').textContent=don+' of '+tot+' items checked';document.querySelectorAll('.cl-itm').forEach(el=>{el.addEventListener('click',function(){const id=this.dataset.id;const it=items.find(i=>i.id===id);if(it){it.done=!it.done;saveState();render()}})})}function loadState(){fetch('/api/checklist',{headers:{Authorization:'Bearer '+t}}).then(r=>r.json()).then(d=>{items=(d.items&&d.items.length)?d.items:JSON.parse(JSON.stringify(D));render()}).catch(()=>{items=JSON.parse(JSON.stringify(D));render()})}document.getElementById('resetBtn').addEventListener('click',function(){if(confirm('Reset all checklist items?')){items=JSON.parse(JSON.stringify(D));saveState();render()}});document.getElementById('saveBtn').addEventListener('click',function(){fetch('/api/checklist',{method:'POST',headers:{'Authorization':'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify({items})}).then(r=>{if(r.ok){dirty=false;document.getElementById('saveBtn').style.display='none'}})});loadState()`;
      return html(pages.adminPage(tokenStr, 'checklist', 'Pre-Deployment Checklist', '0 / 0', bodyHtml, js));
    }

    if (pathname === '/admin/verified') {
      const bodyHtml = `<div id="verifiedContainer"><p class="loading">Loading verified Lutterodts...</p></div>`;
      return html(pages.adminPage(tokenStr, 'verified', 'Verified Lutterodts', 'Manage family directory access', bodyHtml,
        `fetch("/api/verified",{headers:{Authorization:"Bearer "+t}}).then(r=>r.json()).then(d=>{const c=document.getElementById("verifiedContainer");if(d.error){c.innerHTML='<p class="error-msg">Error: '+(d.error||"Unknown")+'</p>';return}const list=Array.isArray(d)?d:(d.results||[]);if(!list.length){c.innerHTML='<p class="empty-msg">No verified Lutterodt registrations yet.</p>';return}function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}let h='<div class="tbl-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Country</th><th>Status</th><th>Date</th></tr></thead><tbody>';list.forEach(function(r){h+='<tr><td>'+esc(r.full_name)+'</td><td><a href="mailto:'+esc(r.email)+'" style="color:#5C1A2B;text-decoration:none">'+esc(r.email)+'</a></td><td>'+(r.country||'-')+'</td><td><span class="badge badge-'+(r.status==="verified"?"done":r.status==="rejected"?"pending":"progress")+'">'+(r.status||"pending")+'</span></td><td style="font-family:monospace;font-size:11px;color:rgba(33,29,26,0.4);white-space:nowrap">'+(r.created_at||'')+'</td></tr>'});h+='</tbody></table></div><p style="margin-top:16px;font-size:13px;color:rgba(33,29,26,0.45)">'+list.length+' registration'+(list.length>1?'s':'')+' total.</p>';c.innerHTML=h}).catch(function(){document.getElementById("verifiedContainer").innerHTML='<p class="error-msg">Failed to load verified Lutterodts.</p>'})`));
    }

    return html(pages.adminPage(tokenStr, 'dashboard', 'Dashboard', 'Session active', '<p class="error-msg">Page not found.</p>'));
  }

  // API routes (auth required)
  if (pathname.startsWith('/api/') && pathname !== '/api/login') {
    const session = await verifySession(tokenStr, env);
    if (!session) return json({ error: 'Unauthorized' }, 401);

    try {
      // GET /api/stats (parallel D1 queries + KV cache)
      if (pathname === '/api/stats' && method === 'GET') {
        const cached = await env.LUTTERODT_KV.get('stats_cache', 'json');
        if (cached && cached.ts > Date.now() - 60000) {
          return json(cached.stats);
        }
        const db = env.LUTTERODT_D1;
        const tables = ['contacts', 'articles', 'timeline_events', 'gallery_items', 'verified_lutterodts'];
        const results = await Promise.all(
          tables.map(table => db.prepare('SELECT COUNT(*) as count FROM ' + table).first())
        );
        const stats = {};
        tables.forEach((t, i) => { stats[t] = results[i] ? results[i].count : 0; });
        await env.LUTTERODT_KV.put('stats_cache', JSON.stringify({ stats, ts: Date.now() }));
        return json(stats);
      }

      // GET /api/budget
      if (pathname === '/api/budget' && method === 'GET') {
        const data = await env.LUTTERODT_KV.get('budget', 'json');
        return json(data || { message: 'No budget data' });
      }

      // GET /api/roadmap
      if (pathname === '/api/roadmap' && method === 'GET') {
        const data = await env.LUTTERODT_KV.get('roadmap', 'json');
        return json(data || { message: 'No roadmap data' });
      }

      // GET /api/settings
      if (pathname === '/api/settings' && method === 'GET') {
        const data = await env.LUTTERODT_KV.get('settings', 'json');
        return json(data || { coming_soon: false });
      }

      // GET /api/checklist
      if (pathname === '/api/checklist' && method === 'GET') {
        const data = await env.LUTTERODT_KV.get('checklist', 'json');
        return json(data || { items: [] });
      }

      // POST /api/checklist
      if (pathname === '/api/checklist' && method === 'POST') {
        const body = await request.json();
        await env.LUTTERODT_KV.put('checklist', JSON.stringify(body));
        return json({ ok: true });
      }

      // GET /api/verified (admin only)
      if (pathname === '/api/verified' && method === 'GET') {
        await env.LUTTERODT_D1.prepare(
          'CREATE TABLE IF NOT EXISTS verified_lutterodts (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT NOT NULL, email TEXT NOT NULL, country TEXT DEFAULT "", relationship TEXT DEFAULT "", status TEXT DEFAULT "pending", created_at TEXT DEFAULT (datetime("now")), verified_at TEXT, notes TEXT DEFAULT "")'
        ).run();
        const { results } = await env.LUTTERODT_D1.prepare(
          'SELECT id, full_name, email, country, relationship, status, created_at FROM verified_lutterodts ORDER BY created_at DESC'
        ).all();
        return json(results || []);
      }
    } catch (err) {
      return json({ error: err.message }, 500);
    }

    return json({ error: 'Not found' }, 404);
  }

  // Directory access control (Lutterodts only)
  if (pathname === '/directory' || pathname.startsWith('/directory/')) {
    const adminSession = tokenStr ? await verifySession(tokenStr, env) : null;
    if (adminSession) return null;
    const vToken = cookies['lutterodt_verified'] || '';
    const vSession = await verifyVerificationToken(vToken, env);
    if (vSession) return null;
    return html(pages.accessDenied());
  }

  return null;
}
