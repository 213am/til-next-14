// import { useRouter } from "next/navigation"; // 15 버전 - app router
import { useRouter } from "next/router"; // 14 버전 - pages router

export default function Page() {
  const router = useRouter();
  const { keyword } = router.query;

  return (
    <div>
      검색 <b>{keyword}</b> 페이지
    </div>
  );
}
