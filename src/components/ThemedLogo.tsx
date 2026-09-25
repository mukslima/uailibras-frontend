import Image from "next/image";
import { asset } from "@/data/site";

type ThemedLogoProps = {
  className?: string;
};

export function ThemedLogo({ className }: ThemedLogoProps) {
  return (
    <span className={className}>
      <Image className="logo-image logo-image-light" src={asset("06.png")} alt="" width={500} height={500} priority aria-hidden="true" />
      <Image className="logo-image logo-image-dark" src={asset("07.png")} alt="" width={4000} height={2504} priority aria-hidden="true" />
    </span>
  );
}
