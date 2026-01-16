<script>
/** ====== 設定ここだけ ====== */
const RTDB_BASE = "https://izakayaorder-default-rtdb.firebaseio.com";
/** ======================== */

/** ====== localStorage 統一キー ====== */
const LS_SHOP = "shopCode";
const LS_PIN  = "shopPin";

/** ====== 互換：旧 sessionStorage から自動移行 ======
 * 旧コードが ssSet("shop","pin") を使っていた場合でも、
 * 初回アクセスで localStorage にコピーして以後は localStorage 運用に寄せる
 */
(function migrateSessionToLocal(){
  try{
    const oldShop = (sessionStorage.getItem("shop") || "").trim();
    const oldPin  = (sessionStorage.getItem("pin")  || "").trim();
    const curShop = (localStorage.getItem(LS_SHOP) || "").trim();
    const curPin  = (localStorage.getItem(LS_PIN)  || "").trim();

    if(!curShop && oldShop) localStorage.setItem(LS_SHOP, oldShop);
    if(!curPin  && oldPin)  localStorage.setItem(LS_PIN,  oldPin);
  }catch(e){
    // Safari等で例外が出ても致命にしない
  }
})();

/** ====== storage helpers ====== */
function lsGet(k){ return (localStorage.getItem(k) || "").trim(); }
function lsSet(k,v){ localStorage.setItem(k, String(v||"")); }
function lsDel(k){ localStorage.removeItem(k); }
function lsClearShopLogin(){
  localStorage.removeItem(LS_SHOP);
  localStorage.removeItem(LS_PIN);
}

/** 互換：旧コードが ssGet/ssSet を呼んでも動くように残す */
function ssGet(k){ return (sessionStorage.getItem(k) || "").trim(); }
function ssSet(k,v){ sessionStorage.setItem(k, String(v||"")); }
function ssClear(){ sessionStorage.clear(); }

/** ====== login state ====== */
function getShop(){ return lsGet(LS_SHOP); }
function getPin(){  return lsGet(LS_PIN); }

function setShop(shop){ lsSet(LS_SHOP, (shop||"").trim()); }
function setPin(pin){   lsSet(LS_PIN,  (pin||"").trim()); }

function requireLogin(){
  const shop = getShop();
  const pin  = getPin();
  if(!shop || !pin){
    location.href = "login.html?v=" + Date.now();
    return false;
  }
  return true;
}

/** ====== RTDB REST helpers ====== */
async function rtdbGet(path){
  const url = `${RTDB_BASE}/${path}.json`;
  const res = await fetch(url, { method:"GET" });
  const text = await res.text();
  let json; try{ json = JSON.parse(text); }catch{ json = { raw:text }; }
  return { ok: res.ok, status: res.status, json, url };
}

async function rtdbPut(path, data){
  const url = `${RTDB_BASE}/${path}.json`;
  const res = await fetch(url, {
    method:"PUT",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(data)
  });
  const text = await res.text();
  let json; try{ json = JSON.parse(text); }catch{ json = { raw:text }; }
  return { ok: res.ok, status: res.status, json, url };
}

async function rtdbPatch(path, data){
  const url = `${RTDB_BASE}/${path}.json`;
  const res = await fetch(url, {
    method:"PATCH",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(data)
  });
  const text = await res.text();
  let json; try{ json = JSON.parse(text); }catch{ json = { raw:text }; }
  return { ok: res.ok, status: res.status, json, url };
}

async function rtdbPost(path, data){
  const url = `${RTDB_BASE}/${path}.json`;
  const res = await fetch(url, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(data)
  });
  const text = await res.text();
  let json; try{ json = JSON.parse(text); }catch{ json = { raw:text }; }
  return { ok: res.ok, status: res.status, json, url };
}

function esc(s){
  return String(s||"").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}
</script>

