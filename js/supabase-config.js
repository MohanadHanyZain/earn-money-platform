// js/supabase-config.js
const SUPABASE_URL = 'https://qilhlovlotvieatbtkhw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpbGhsb3Zsb3R2aWVhdGJ0a2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQ4MDYsImV4cCI6MjA5NDM0MDgwNn0.b7NeZuXf_IighzSDDV2OpgIlM0QiaeKHBwyz2leo1GA';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// وظيفة عامة للتحقق من جلسة المستخدم في كل الصفحات
async function checkUserSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}