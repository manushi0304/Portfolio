import { motion } from "framer-motion";
import { Heart, Mail, Calendar, Send, Coffee, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || ""; 

export default function ContactSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", message: "", botField: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "err" | null; msg: string }>({ type: null, msg: "" });

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return "All fields are required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) return setStatus({ type: "err", msg: v });

    setSending(true);
    setStatus({ type: null, msg: "" });

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed");
      setStatus({ type: "ok", msg: "Thanks! Your message has been sent." });
      setForm({ name: "", email: "", message: "", botField: "" });
    } catch {
      setStatus({ type: "err", msg: "Something went wrong. Please try again later." });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-dark-secondary to-dark relative overflow-hidden">
      {/* Interactive Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{ x: mousePosition.x * 0.02, y: mousePosition.y * 0.02 }}
          transition={{ type: "spring", stiffness: 50 }}
        />
        <motion.div
          className="absolute top-1/2 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{ x: mousePosition.x * -0.01, y: mousePosition.y * -0.01 }}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div className="mb-16">
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-8 gradient-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            Let's Talk
          </motion.h2>

          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            viewport={{ once: true }}
          >
            <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Heart className="w-16 h-16 text-red-500 drop-shadow-2xl" />
            </motion.div>
          </motion.div>

          <motion.p
            className="text-xl text-gray-light mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Got a question, proposal, project, or want to work together on something?{" "}
            <span className="text-blue-400 font-semibold">I'd love to hear from you!</span>
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            className="flex justify-center space-x-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { icon: MessageCircle, label: "24h Response", value: "Usually" },
              { icon: Coffee, label: "Coffee Chats", value: "Always" },
              { icon: Send, label: "Projects Started", value: "This Week" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</div>
                <div className="text-xs text-gray-500 font-medium">{stat.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Main CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="lg" data-testid="button-send-email" className="pulse-glow">
              <a
                href="mailto:manushibombaywala0304@gmail.com?subject=Let's%20work%20together!&body=Hello%2C%20I%20think%20we%20need%20you%20to%20work%20on%2Fcollaborate%20this%20particular%20product...%20Reach%20out%20as%20soon%20as%20you%20can."
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg flex items-center space-x-3 shadow-lg hover:shadow-xl"
              >
                <Mail size={20} />
                <span>Send me an email</span>
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Send size={16} />
                </motion.div>
              </a>
            </Button>
          </motion.div>

          <motion.span className="text-gray-light font-medium" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
            or
          </motion.span>

          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="lg" asChild data-testid="button-book-call-contact">
              <a
                href="https://cal.com/manushi-bombaywala-fvhunx"
                className="border-2 border-gray-600 hover:border-blue-500 text-white hover:bg-blue-500/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg flex items-center space-x-3 hover:shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar size={20} />
                <span>Book a call</span>
                <motion.div animate={{ rotate: [0, 15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Coffee size={16} />
                </motion.div>
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Quick Contact Form Toggle */}
        <motion.div className="mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1 }} viewport={{ once: true }}>
        <motion.button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="text-gray-400 hover:text-blue-400 transition-colors text-sm underline"
          whileHover={{ scale: 1.05 }}
        >
          {isFormVisible ? "Hide" : "Show"} quick contact form
        </motion.button>

        <motion.div
          className="mt-6 overflow-hidden"
          initial={false}
          animate={{ height: isFormVisible ? "auto" : 0, opacity: isFormVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isFormVisible && (
            <div className="max-w-md mx-auto bg-dark-secondary p-6 rounded-2xl border border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
                {/* Honeypot */}
                <input type="text" name="botField" value={form.botField} onChange={onChange} className="hidden" tabIndex={-1} autoComplete="off" />

                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  value={form.message}
                  onChange={onChange}
                  className="w-full px-4 py-3 bg-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  required
                />

                <motion.button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all duration-300"
                  whileHover={{ scale: sending ? 1 : 1.02 }}
                  whileTap={{ scale: sending ? 1 : 0.98 }}
                >
                  {sending ? "Sending…" : "Send Message"}
                </motion.button>

                {status.type && (
                  <p className={status.type === "ok" ? "text-green-400 text-sm" : "text-red-400 text-sm"}>{status.msg}</p>
                )}
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
        {/* Social Links */}
        <motion.div
          className="flex justify-center space-x-8 text-gray-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          viewport={{ once: true }}
        >
          <a
            href="https://github.com/manushi0304"
            className="hover:text-white transition-colors font-medium text-lg"
            data-testid="link-social-github"
            target="_blank"
            rel="noopener noreferrer"
          >
            GH
          </a>
          <a
            href="https://www.linkedin.com/in/manushi-bombaywala/"
            className="hover:text-white transition-colors font-medium text-lg"
            data-testid="link-social-linkedin"
            target="_blank"
            rel="noopener noreferrer"
          >
            LN
          </a>

          <a
            href="https://www.instagram.com/_manushiii.__/"
            className="hover:text-white transition-colors font-medium text-lg"
            data-testid="link-social-instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            IG
          </a>
          <a
            href="https://medium.com/@manushibombaywala0304/"
            className="hover:text-white transition-colors font-medium text-lg"
            data-testid="link-social-blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            MD
          </a>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-light mb-2" data-testid="text-copyright">
            Copyright 2025
          </p>
          <p className="text-gray-light" data-testid="text-credits">
            Design & Development by <a>Manushi Bombaywala</a>
          </p>
        </div>
      </footer>
    </section>
  );
}
