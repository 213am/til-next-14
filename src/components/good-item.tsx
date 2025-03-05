import styles from "@/components/good-item.module.css";
import { GoodDataType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const GoodItem = ({ title, id, image, category, rating }: GoodDataType) => {
  return (
    <Link href={`/good/${id}`} className={styles.container}>
      <Image src={image} alt={title} width={80} height={115} />
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.category}>{category}</div>
        <br />
        <div className={styles.rating}>
          Rating : {rating.rate} | {rating.count}
        </div>
      </div>
    </Link>
  );
};

export default GoodItem;
