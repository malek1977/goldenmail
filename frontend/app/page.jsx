"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [blog, setBlog] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    API.get("/products").then((r) => setProducts(r.data || [])).catch(() => {});
    API.get("/blog").then((r) => setBlog(r.data || [])).catch(() => {});
    API.get("/settings").then((r) => setSettings(r.data || {})).catch(() => {});
  }, []);

  return (
    <main style={{ padding: 40, direction: "rtl" }} className="min-h-screen bg-ink-900 text-slate-100">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gradient-gold">{settings.site_name || "مؤسسة الميل الذهبي"}</h1>
        <p className="text-slate-400 mt-2">{settings.site_address || "الرياض، المملكة العربية السعودية"}</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gold-300 mb-4">منتجاتنا</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="card p-4">
              <p className="font-bold text-white">{p.name}</p>
              <p className="text-sm text-slate-400 mt-1">{p.category}</p>
              <p className="text-gold-300 font-extrabold mt-2">{p.price} ر.س</p>
              {p.stock < 5 && <span className="badge badge-warning mt-2 inline-block">مخزون منخفض</span>}
            </div>
          ))}
          {products.length === 0 && <p className="text-slate-500">لا توجد منتجات حالياً</p>}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gold-300 mb-4">المدونة</h2>
        <div className="space-y-3">
          {blog.map((post) => (
            <a key={post.id} href={`#${post.slug}`} className="card p-4 block hover:card-hover">
              <p className="font-bold text-white">{post.title}</p>
              <p className="text-sm text-slate-400 mt-1">{post.excerpt}</p>
              <p className="text-[11px] text-slate-500 mt-2">{post.authorName} • {post.category}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <a href="/contact" className="btn-gold inline-flex">اتصل بنا</a>
        <a href="/admin/login" className="btn-outline-gold inline-flex mr-3">لوحة التحكم</a>
      </section>
    </main>
  );
}