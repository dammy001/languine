"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdClose,
  MdGraphicEq,
  MdMenu,
  MdOutlineBook,
  MdOutlineSettings,
  MdOutlineStackedBarChart,
} from "react-icons/md";
import { UserMenu } from "./user-menu";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const pathname = usePathname();
  const t = useI18n();

  const navigation = [
    {
      icon: MdOutlineStackedBarChart,
      path: "/",
      isActive: pathname.endsWith(`/${params.organization}/${params.project}`),
      label: t("menu.dashboard"),
    },
    {
      icon: MdGraphicEq,
      path: "/tuning",
      isActive: pathname.endsWith("/tuning"),
      label: t("menu.tuning"),
    },
    {
      icon: MdOutlineSettings,
      path: "/settings",
      isActive: pathname.endsWith("/settings"),
      label: t("menu.settings"),
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <MdClose className="size-6" />
        ) : (
          <MdMenu className="size-6" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 top-[70px] bg-background bg-noise"
          >
            <div className="flex flex-col h-full">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/${params.organization}/${params.project}${item.path}`}
                    className={cn(
                      "flex items-center gap-4 px-6 py-5 border-b border-border text-secondary",
                      item.isActive && "text-primary",
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="size-6" />
                    <span className="text-lg">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="mt-auto border-t border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: navigation.length * 0.05,
                  duration: 0.3,
                }}
              >
                <Link href="/docs">
                  <motion.div
                    className="flex items-center gap-4 px-6 py-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: navigation.length * 0.05 + 0.1,
                      duration: 0.2,
                    }}
                  >
                    <MdOutlineBook className="size-6" />
                    <span className="text-lg">{t("menu.docs")}</span>
                  </motion.div>
                </Link>

                <motion.div
                  className="flex items-center gap-4 px-6 py-5 border-t border-border"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: navigation.length * 0.05 + 0.2,
                    duration: 0.2,
                  }}
                >
                  <UserMenu />
                  <span className="text-lg">{t("menu.account")}</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
