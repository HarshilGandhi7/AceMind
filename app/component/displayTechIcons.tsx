import { getTechLogos } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const displayTechIcons = async ({ techStack }: TechIconProps) => {
  const TechIcons = await getTechLogos(techStack);
  return (
    <div className="flex flex-row gap-2 mt-3">
      {TechIcons.slice(0, 3).map((tech, index) => (
        <div
          key={index}
          className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full p-2 shadow-sm"
        >
          <Image
            src={tech.url}
            alt={tech.tech}
            height={22}
            width={22}
            className="object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default displayTechIcons;
