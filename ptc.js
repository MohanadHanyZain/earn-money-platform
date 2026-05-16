// 1. إعداد الاتصال بـ Supabase (استبدل القيم ببيانات مشروعك)
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let timerInterval;
let timeLeft = 0;
let currentAdId = null;
let currentAdReward = 0;

// 2. جلب إعلانات الـ PTC وعرضها عند فتح الصفحة
async function loadAds() {
    // جلب نقاط المستخدم أولاً
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return window.location.href = "index.html"; // توجيه للتسجيل لو مش مسجل

    let { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single();
    document.getElementById('user-points').innerText = `نقاطك الحالية: ${profile.points}`;

    // جلب الإعلانات من قاعدة البيانات
    let { data: ads } = await supabase.from('ptc_ads').select('*');
    const adsList = document.getElementById('ads-list');
    adsList.innerHTML = "";

    ads.forEach(ad => {
        adsList.innerHTML += `
            <div class="ad-card" id="ad-${ad.id}">
                <h3>${ad.title}</h3>
                <p>المكافأة: ${ad.reward_points} نقاط | المدة: ${ad.duration} ثانية</p>
                <button onclick="startAd('${ad.adsterra_url}', ${ad.duration}, ${ad.reward_points}, ${ad.id})">شاهد الآن واكسب</button>
            </div>
        `;
    });
}

// 3. تشغيل الإعلان والعداد
function startAd(url, duration, reward, adId) {
    timeLeft = duration;
    currentAdReward = reward;
    currentAdId = adId;

    // فتح رابط Adsterra المباشر في صفحة جديدة
    window.open(url, '_blank');

    // إظهار العداد وتحديثه
    const timerContainer = document.getElementById('timer-container');
    const countdownEl = document.getElementById('countdown');
    timerContainer.style.display = "block";
    countdownEl.innerText = timeLeft;

    // بدء العد التنازلي
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        // حماية: التأكد أن المستخدم يركز في صفحتنا ولم يهرب لتبويب آخر
        if (!document.hidden) {
            timeLeft--;
            countdownEl.innerText = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerContainer.style.display = "none";
                claimReward();
            }
        }
    }, 1000);
}

// 4. إعطاء المكافأة للمستخدم عبر دالة السيرفر المحمية
async function claimReward() {
    alert("مبروك! أنهيت المشاهدة بنجاح وجاري إضافة النقاط.");
    
    // استدعاء دالة السيرفر الآمنة التي أنشأناها في الخطوة 1
    const { error } = await supabase.rpc('add_user_points', { points_to_add: currentAdReward });
    
    if (!error) {
        loadAds(); // إعادة تحميل النقاط والقائمة
    } else {
        alert("حدث خطأ أثناء إضافة النقاط.");
    }
}

// تشغيل جلب البيانات فور فتح الصفحة
loadAds();