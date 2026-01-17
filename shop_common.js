<script>
/** ====== 設定ここだけ ====== */
const RTDB_BASE = "https://izakayaorder-default-rtdb.firebaseio.com";
/** ======================== */

/** localStorage 統一キー（店側） */
const KEY_SHOP = "shopCode";
const KEY_PIN  = "shopPin";

function lsGet(k){ return (localStorage.getItem(k) || "").trim(); }
function lsSet(k,v){ localStorage.setItem(k, String(v||"")); }
function lsClear(){ localStorage.removeItem(KEY_SHOP); localStorage.removeItem(KEY_PIN); }

function getShop(){ return lsGet(KEY_SHOP); }
function getPin(){ return lsGet(KEY_PIN); } // 数字/英字どちらでもOK

function requireLogin(){
  const shop = getShop();
  const pin  = getPin();
  if(!shop || !pin){
    location.href = "login.html?v=" + Date.now();
    return false;
  }
  return true;
}

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

