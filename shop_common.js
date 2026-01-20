/** ====== 設定ここだけ ====== */
const RTDB_BASE = "https://izakayaorder-default-rtdb.firebaseio.com";
/** ======================== */

/** localStorage 統一キー（店側） */
const KEY_SHOP = "shopCode";   // shopコードだけ必須（PINは使わない）

function lsGet(k){ return (localStorage.getItem(k) || "").trim(); }
function lsSet(k,v){ localStorage.setItem(k, String(v||"").trim()); }
function lsClear(){
  localStorage.removeItem(KEY_SHOP);
}

/** 取得 */
function getShop(){ return lsGet(KEY_SHOP); }

/** shopCode ガード（未設定なら loginへ） */
function requireShop(){
  const shop = getShop();
  if(!shop){
    location.href = "login.html?v=" + Date.now();
    return false;
  }
  return true;
}

/* ===== Auth ガード（店側） =====
  使い方：
  - 各ページ先頭で  await requireAuth();
  - Auth未ログインなら login.html に戻す
*/
async function requireAuth(){
  if(typeof firebase === "undefined" || !firebase.auth){
    location.href = "login.html?v=" + Date.now();
    return false;
  }

  const user = firebase.auth().currentUser;
  if(user) return true;

  return new Promise((resolve)=>{
    firebase.auth().onAuthStateChanged(u=>{
      if(u){
        resolve(true);
      }else{
        location.href = "login.html?v=" + Date.now();
        resolve(false);
      }
    });
  });
}

/** Auth + shop 両方チェック（店側ページ共通） */
async function requireStaff(){
  const ok = await requireAuth();
  if(!ok) return false;
  return requireShop();
}

/* ログアウト（Auth + localStorage） */
async function doLogout(){
  try{
    if(typeof firebase !== "undefined" && firebase.auth){
      await firebase.auth().signOut();
    }
  }catch{}
  lsClear();
  location.href = "login.html?v=" + Date.now();
}

/* ===== RTDB REST ===== */
async function rtdbGet(path){
  const url = `${RTDB_BASE}/${path}.json`;
  const res = await fetch(url, { method:"GET" });
  const text = await res.text();
  let json; try{ json = JSON.parse(text); }catch{ json = null; }
  return { ok: res.ok, status: res.status, json, url, raw:text };
}

async function rtdbPut(path, data){
  const url = `${RTDB_BASE}/${path}.json`;
  const res = await fetch(url, {
    method:"PUT",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(data)
  });
  const text = await res.text();
  let json; try{ json = JSON.parse(text); }catch{ json = null; }
  return { ok: res.ok, status: res.status, json, url, raw:text };
}

async function rtdbPatch(path, data){
  const url = `${RTDB_BASE}/${path}.json`;
  const res = await fetch(url, {
    method:"PATCH",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(data)
  });
  const text = await res.text();
  let json; try{ json = JSON.parse(text); }catch{ json = null; }
  return { ok: res.ok, status: res.status, json, url, raw:text };
}

async function rtdbPost(path, data){
  const url = `${RTDB_BASE}/${path}.json`;
  const res = await fetch(url, {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(data)
  });
  const text = await res.text();
  let json; try{ json = JSON.parse(text); }catch{ json = null; }
  return { ok: res.ok, status: res.status, json, url, raw:text };
}

function esc(s){
  return String(s||"").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}
