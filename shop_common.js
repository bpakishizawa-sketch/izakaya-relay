<script>
/** ====== 設定ここだけ ====== */
const RTDB_BASE = "https://izakayaorder-default-rtdb.firebaseio.com";
/** ======================== */

function ssGet(k){ return (sessionStorage.getItem(k) || "").trim(); }
function ssSet(k,v){ sessionStorage.setItem(k, String(v||"")); }
function ssClear(){ sessionStorage.clear(); }

function getShop(){ return ssGet("shop"); }
function getPin(){ return ssGet("pin"); } // 現状は簡易。後でAuth化可。

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
