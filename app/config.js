if(window.supabase){
const SUPABASE_URL='https://xgcsdpqaqxstcfwgwaxw.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY3NkcHFhcXhzdGNmd2d3YXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDE3MTQsImV4cCI6MjEwMjM3NzcxNH0.WFYm2q4ljkQMRiaQzhJ-yf01wj80xsO0ykmH7jhtUoo';
window.mobileClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});


}
