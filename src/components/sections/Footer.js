import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "../SocialLinks";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

export function Footer({ copyright, logo, links, social, ...rest }) {
  return (
    <footer className="bg-base-100 dark:bg-base-900 pt-6" {...rest}>
      <div className="container px-4 mx-auto">
        <div
          className={cn(
            "flex flex-col gap-6 md:flex-row md:justify-between items-center py-6"
          )}
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={160}
            height={40}
            priority
            className="h-10 w-auto opacity-70 hover:opacity-100 dark:invert"
          />
          <div className="flex flex-row gap-4 text-sm">
            {links.map((link, index) => (
              <Link href={link.href} key={index} prefetch={false}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <SocialLinks links={social} />
            <a 
              href="https://www.tiktok.com/@bklti.unmerpas_?_t=zs-8tgonikg89d&_r=1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted hover:text-title transition-colors"
              aria-label="TikTok"
            >
              <Icon icon="tabler:brand-tiktok" className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-base py-4 text-center flex justify-center">
          <p className="text-sm">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
