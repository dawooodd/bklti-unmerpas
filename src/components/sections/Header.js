"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "#/base";
import { ThemeSwitch } from "#/ThemeSwitch";

export function Header({ logo, links, buttons, className, ...rest }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 w-full bg-base-50/50 dark:bg-base-950/50 backdrop-blur-xl z-[100]">
      <nav
        className={cn(
          "relative h-14 container px-4 mx-auto border-b border-base flex flex-wrap justify-start items-center gap-4 lg:gap-8",
          className
        )}
        {...rest}
      >
        <Link href={logo.href} prefetch={false} className="flex items-center gap-2">
          <Image
            src={logo.src}
            alt={logo.alt || "Logo"}
            width={160}
            height={40}
            priority
            className="h-10 w-auto dark:invert"
          />
          <div className="hidden lg:flex justify-center">
            <span className="font-bold text-sm text-title leading-tight">BKLTI Universitas Merdeka Pasuruan</span>
          </div>
        </Link>
        <div
          className={cn(
            "hidden md:block md:w-auto",
            open &&
              "block absolute top-14 m-2 right-0 w-2/3 border border-base dark:border-base-900 rounded-lg overflow-hidden bg-base-50 dark:bg-base-900 shadow-xl"
          )}
        >
          <ul className="font-medium flex flex-col gap-2 p-4 md:p-0 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                prefetch={false}
                className={
                  open
                    ? "text-sm font-normal text-base-600 dark:text-base-400 hover:bg-base-100 dark:hover:bg-base-950 py-3 px-4 rounded-md"
                    : "text-sm font-normal text-base-600 dark:text-base-400 hover:text-base-800 dark:hover:text-base-300"
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </ul>
        </div>
        <div className="flex gap-2 ml-auto items-center">
          <ThemeSwitch />
          
          {!session ? (
            <>
              <Button label="Masuk" color="transparent" size="small" onClick={() => signIn()} />
              <Button label="Daftar" color="dark" size="small" href="/register" />
            </>
          ) : (
            <>
              <Button 
                label={session.user.role === "USER" ? "Profil" : "Dashboard"} 
                color="transparent" 
                size="small" 
                href={session.user.role === "SUPER_ADMIN" ? "/super-admin/dashboard" : session.user.role === "ADMIN" ? "/admin/content-manager" : "/profile"} 
              />
              <Button label="Keluar" color="dark" size="small" onClick={() => signOut()} />
            </>
          )}
        </div>
        <Button
          icon={open ? "tabler:x" : "tabler:menu-2"}
          color="transparent"
          className="p-2 md:hidden"
          onClick={() => setOpen(!open)}
        />
      </nav>
    </header>
  );
}
