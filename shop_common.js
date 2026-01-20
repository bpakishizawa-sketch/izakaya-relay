/** ====== 設定ここだけ ====== */
const RTDB_BASE = "https://izakayaorder-default-rtdb.firebaseio.com";
/** ======================== */

/* =========================
   Firebase 初期化（compat）
   ※各HTMLで firebase-app-compat.js / firebase-auth-compat.js を読み込んだ後に
     この shop_common.js を読み込むこと！
   ========================= */
const firebaseConfig = {
  apiKey: "AIzaSyCZTWH0Lv1EfUiW5iSX1skQ9MvUao6Dx10",
  authDomain: "izakayaorder.firebaseapp.com",
  databaseURL: "https://izakayaorder-default-rtdb.firebaseio.com",
  projectId: "izakayaorder",
  storageBucket: "izakayaorder.firebasestorage.app",
  messagingSenderId: "1083271376500",
  appId: "1:1083271376500:web:248f32d5aa470be087ab21",
  measurementId: "G-009BPY8BFP"
};

(function initFirebaseOnce(){
  try{
    if(typeof firebase === "undefined") return;          // SDK未読込なら何もしない
    if(firebase.apps && firebase.apps.length > 0) return; // 初期化済みなら何もしない
    firebase.initializeApp(firebaseConfig);
  }catch(e){
    console.log("firebase init error:", e);
  }
})();

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

/* ===== Auth ガード（店側） =====
  使い方：
  - kitchen / checkout / menu などの先頭で  await requireAuth();
  - Auth未ログインなら login.html に強制戻し
*/
async function requireAuth(){
  if(typeof firebase === "undefined" || !firebase.auth){
    location.href = "login.html?v=" + Date.now();
    return false;
  }

  // 初期化されてない/失敗してる場合を確実に弾く
  try{ firebase.auth(); }catch(e){
    location.href = "login.html?v=" + Date.now();
    return false;
  }

  // 既にログイン済みならOK
  const u = firebase.auth().currentUser;
  if(u) return true;

  // 復元待ちを必ず待つ
  return new Promise((resolve)=>{
    const unsub = firebase.auth().onAuthStateChanged(user=>{
      try{ unsub && unsub(); }catch{}
      if(user){
        resolve(true);
      }else{
        location.href = "login.html?v=" + Date.now();
        resolve(false);
      }
    });
  });
}

/* ログアウト（Auth + localStorage両方） */
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


