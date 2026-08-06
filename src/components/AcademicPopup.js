import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const TYPE_CONFIG = {
  SPP:        { icon: "tabler:credit-card",    color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", label: "Tagihan SPP" },
  UJIAN:      { icon: "tabler:writing",        color: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-100 dark:bg-blue-900/30",       label: "Jadwal Ujian" },
  SKRIPSI:    { icon: "tabler:book",           color: "text-violet-600 dark:text-violet-400",   bg: "bg-violet-100 dark:bg-violet-900/30",   label: "Info Skripsi" },
  YUDISIUM:   { icon: "tabler:certificate",    color: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-100 dark:bg-amber-900/30",     label: "Yudisium" },
  WISUDA:     { icon: "tabler:school",         color: "text-pink-600 dark:text-pink-400",       bg: "bg-pink-100 dark:bg-pink-900/30",       label: "Wisuda" },
  PENGUMUMAN: { icon: "tabler:speakerphone",   color: "text-cyan-600 dark:text-cyan-400",       bg: "bg-cyan-100 dark:bg-cyan-900/30",       label: "Pengumuman" },
};

export default function AcademicPopup() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    
    if (status !== "authenticated" || session?.user?.role !== "USER") return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications/active");
        const json = await res.json();

        if (!json.success || !json.data?.length) return;

        const unseen = json.data.filter((n) => {
          return !localStorage.getItem(`notif_dismissed_${n.id}`);
        });

        if (unseen.length > 0) {
          setNotifications(unseen);
          
          setTimeout(() => setIsVisible(true), 1500);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [session, status]);

  const handleDismiss = () => {
    
    const current = notifications[currentIndex];
    if (current) {
      localStorage.setItem(`notif_dismissed_${current.id}`, "true");
    }

    if (currentIndex < notifications.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsVisible(false);
    }
  };

  const handleDismissAll = () => {
    
    notifications.forEach((n) => {
      localStorage.setItem(`notif_dismissed_${n.id}`, "true");
    });
    setIsVisible(false);
  };

  if (!isVisible || notifications.length === 0) return null;

  const current = notifications[currentIndex];
  const config = TYPE_CONFIG[current.type] || TYPE_CONFIG.PENGUMUMAN;

  return (
    <AnimatePresence>
      {isVisible && (
        <>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white dark:bg-base-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">

              <div className="p-6 pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${config.bg}`}>
                      <Icon icon={config.icon} className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-title">
                        {config.label}
                      </h3>
                      <p className="text-xs text-muted mt-0.5">
                        {new Date(current.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="p-1.5 text-muted hover:text-title hover:bg-base-100 dark:hover:bg-base-800 rounded-xl transition-colors"
                  >
                    <Icon icon="tabler:x" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="bg-base-50 dark:bg-base-800/50 p-5 rounded-2xl border border-base-200 dark:border-base-800">
                  <p className="text-title leading-relaxed font-medium">
                    {current.message}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-2 rounded-lg border border-primary-100 dark:border-primary-800/50 w-fit">
                    <Icon icon="tabler:calendar-event" className="w-4 h-4" />
                    Tenggat: {new Date(current.date).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs text-muted">
                    {currentIndex + 1} dari {notifications.length} notifikasi
                  </p>
                  {notifications.length > 1 && (
                    <button
                      onClick={handleDismissAll}
                      className="text-xs text-muted hover:text-title underline transition-colors"
                    >
                      Tutup Semua
                    </button>
                  )}
                </div>

                <button
                  onClick={handleDismiss}
                  className="w-full mt-4 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transition-all active:scale-[0.98]"
                >
                  {currentIndex < notifications.length - 1 ? "Berikutnya" : "Saya Mengerti, Tutup"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
