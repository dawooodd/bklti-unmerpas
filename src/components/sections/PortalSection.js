import { Icon } from "@iconify/react";
import { SectionHeading } from "#/SectionHeading";
import { Button } from "../base";

const portalItems = [
  {
    icon: "tabler:device-laptop",
    title: "Konsultasi Teknologi",
    description:
      "Dapatkan arahan teknis untuk sistem, jaringan, dan kebutuhan digital Anda.",
  },
  {
    icon: "tabler:clipboard-list",
    title: "Pendaftaran Layanan",
    description:
      "Sederhanakan pengajuan layanan dengan alur yang jelas dan mudah dipantau.",
  },
  {
    icon: "tabler:chart-line",
    title: "Monitoring Kebutuhan",
    description:
      "Ikuti perkembangan kebutuhan layanan dan prioritas dukungan Anda.",
  },
  {
    icon: "tabler:message-circle",
    title: "Dukungan Responsif",
    description:
      "Terhubung dengan tim BKLTI melalui kanal komunikasi yang lebih terstruktur.",
  },
];

export function PortalSection({ id, title, description, badge, buttons = [] }) {
  return (
    <section id={id} className="bg-base-50 py-12 lg:py-16 dark:bg-base-950">
      <div className="container mx-auto px-4">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <SectionHeading
              align="left"
              title={title}
              description={description}
              badge={badge}
            />
            <div className="flex flex-wrap gap-3">
              {buttons.map((button, index) => (
                <Button key={index} {...button} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {portalItems.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl border border-base-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md dark:border-base-800 dark:bg-base-900"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-600">
                  <Icon icon={item.icon} className="size-6" />
                </div>
                <h3 className="text-lg font-semibold text-title">{item.title}</h3>
                <p className="mt-2 text-sm text-base-600 dark:text-base-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
