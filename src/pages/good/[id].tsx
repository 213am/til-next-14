import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  // id 는 파일명을 따른것
  const { id } = router.query;

  return (
    <div>
      <b>{id}</b>번 제품정보
    </div>
  );
}
