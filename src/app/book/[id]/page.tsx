import { notFound } from "next/navigation";
import style from "./page.module.css";
import { ReviewData } from "@/types";
import ReviewItem from "@/components/review-item";
import ReviewEditor from "@/components/review-editor";
import Image from "next/image";

// generateStaticParams로 설정한 파라미터 외에 다른 id로 접속할 시 404 not found로 설정
// export const dynamicParams = false;

export function generateStaticParams () {
  return [{ id: "1" }, { id: "2" },{ id: "3" }]
}

async function BookDetail({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`,
    { cache: "force-cache" }
  );

  if(!response.ok) {
    if(response.status === 404) {
      notFound();
    }
    return <div>오류가 발생했습니다...</div>;
  }

  const book = await response.json();

  const { id, title, subTitle, description, author, publisher, coverImgUrl } = book;

  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <Image 
          src={coverImgUrl} 
          width={240}
          height={300} 
          alt={`도서 ${title}의 표시 이미지`}
        />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
} 

async function ReviewList({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`,
    { next: { tags: [`review-${bookId}`] } }
  );

  if(!response.ok) {
    throw new Error(`Review fetch failed : ${response.statusText}`);
  }

  const reviews: ReviewData[] = await response.json();

  return (
    <section>
      {reviews.map((review) => (
        <ReviewItem key={`review-item-${review.id}`} {...review} />
      ))}
    </section>
  );
}

export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  return (
    <div className={style.container}>
      <BookDetail bookId={(await params).id} />
      <ReviewEditor bookId={(await params).id} />
      <ReviewList bookId={(await params).id} />
    </div>
  );
}