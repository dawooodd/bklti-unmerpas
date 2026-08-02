/* eslint-disable @next/next/no-img-element */
import { Badge, Button } from "#/base";
import { Brands } from "#/Brands";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export function HeroSection({
  badge,
  title,
  description,
  buttons,
  image,
  clientsLabel,
  clients,
  ...rest
}) {
  return (
    <section {...rest} className={cn("relative overflow-hidden", rest.className)}>
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full mix-blend-screen pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-purple-500/20 blur-3xl rounded-full mix-blend-screen pointer-events-none -z-10" />

      {/* Floating Animated Icons */}
      <div className="absolute top-1/3 left-[15%] hidden lg:block opacity-60 animate-bounce" style={{ animationDuration: '3s' }}>
        <Icon icon="tabler:code" className="w-12 h-12 text-primary-500" />
      </div>
      <div className="absolute top-1/4 right-[20%] hidden lg:block opacity-60 animate-bounce" style={{ animationDuration: '4s' }}>
        <Icon icon="tabler:database" className="w-14 h-14 text-blue-500" />
      </div>
      <div className="absolute bottom-1/3 left-[20%] hidden lg:block opacity-60 animate-pulse">
        <Icon icon="tabler:server" className="w-10 h-10 text-emerald-500" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center items-center min-h-[85vh]"
        >
          <div className="flex flex-col justify-center items-center gap-4 text-center max-w-4xl mx-auto mt-24 pb-12">
            <Badge {...badge} />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary-500 to-purple-500 pb-2">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-muted max-w-2xl mt-4">{description}</p>
            {buttons.length > 0 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                {buttons.map((button, index) => (
                  <Button key={index} {...button} />
                ))}
              </div>
            )}
          </div>
          
          {/* Static Image Removed as requested */}

        </motion.div>
      </div>
    </section>
  );
}
