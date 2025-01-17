"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface Article {
  id: number;
  title: string;
  content: string;
  image_path?: string;
}

export default function ArticlePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;

      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (showModal) {
      router.push("/"); // Redirige vers la page d'accueil lorsque la modale est affichée
    }
  }, [showModal, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Article not found.</p>
      </div>
    );
  }

  return (
    <>
      <Header setShowModal={setShowModal} />
      <div className="px-5 md:px-20 my-10">
        <div className="mb-10">
          <Image
            src={
              article.image_path ||
              "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&auto=format&fit=crop&w=2607&q=80"
            }
            alt={article.title}
            width={1600}
            height={900}
            className="w-full h-auto rounded-lg object-cover"
            priority
          />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-4">{article.title}</h1>
        <p className="text-base md:text-lg">{article.content}</p>
      </div>
      <Footer />
    </>
  );
}
