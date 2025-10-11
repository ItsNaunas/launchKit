"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundGrid = ({ className, containerClassName }: { className?: string; containerClassName?: string }) => {
  return (
    <div
      className={cn(
        "h-full w-full dark:bg-black bg-white  dark:bg-grid-white/[0.03] bg-grid-black/[0.03] absolute flex items-center justify-center",
        containerClassName
      )}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div className={cn("absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]", className)}></div>
    </div>
  );
};

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
  ];

  return (
    <div
      className={cn(
        "absolute h-screen w-screen top-0 left-0 overflow-hidden bg-black pointer-events-none",
        className
      )}
    >
      {paths.map((path, index) => (
        <motion.svg
          key={`path-${index}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute w-[150%] h-[150%] -left-[25%] top-0"
        >
          <motion.path
            d={path}
            stroke={`url(#linearGradient-${index})`}
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
          <defs>
            <motion.linearGradient
              id={`linearGradient-${index}`}
              initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
              animate={{
                x1: ["0%", "100%"],
                x2: ["0%", "95%"],
                y1: ["0%", "100%"],
                y2: ["0%", `${93 + Math.random() * 8}%`],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                ease: "easeInOut",
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <stop stopColor="#1DCD9F" stopOpacity="0"></stop>
              <stop stopColor="#1DCD9F"></stop>
              <stop offset="32.5%" stopColor="#5eead4"></stop>
              <stop offset="100%" stopColor="#99f6e4" stopOpacity="0"></stop>
            </motion.linearGradient>
          </defs>
        </motion.svg>
      ))}
    </div>
  );
};

