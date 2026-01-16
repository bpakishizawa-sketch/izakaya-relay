<script>
/** ====== 設定ここだけ ====== */
const RTDB_BASE = "https://izakayaorder-default-rtdb.firebaseio.com";
/** ======================== */

function ssGet(k){ return (sessionStorage.getItem(k) || "").trim(); }
function ssSet(k,v){ sessionStorage.setItem(k, String(v||"")); }
function ssClear(){ sessionStorage.clear(); }

function lsGet(k){ return (localStorage.getItem(k) || "").trim(); }
function lsSet(k,v){ localStorage.setItem(k, String(v||"")); }
function lsDel(k){ localStorage.removeItem(k); }

function getShop(){ return ssGet("shop"); }
function getPin(){ return ssGet("pin"); }

// Remember（任意）: localStorage -> sessionStorage 復元
function restoreRememberedLogin(){
  const shop = getShop();
  const pin  = getPin();
  if(shop && pin) return true;

  const rShop = lsGet("shop");
  const rPin  = lsGet("pin");
  if(rShop && rPin){
    ssSet("shop", rShop);
    ssSet("pin",  rPin);
    return true;
  }
  return false;
}

// ログアウト（session + remember）
function logoutAll(){
  ssClear();
  lsDel("shop");
  lsDel("pin");
}

function requireLogin(){
  // remember復元を先に試す
  restoreRememberedLogin();

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

