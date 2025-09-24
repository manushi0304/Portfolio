import { motion } from "framer-motion";
import { ExternalLink, Clock, Eye } from "lucide-react";
import { useState } from "react";

const blogPosts = [
  {
    title: "Jailbreaks, Poisons, and Prompts: The Dark Arts of Hacking LLMs",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
    url: "https://medium.com/@manushibombaywala0304/jailbreaks-poisons-and-prompts-the-dark-arts-of-hacking-llms-6185df89bf75",
  },
  {
    title: " What is OWASP TOP 10? ",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&h=300&q=80",
    url: "https://medium.com/@manushibombaywala0304/what-is-owasp-top-10-0539916f1678",
  },
  {
    title: "History Of Cyber Attacks",
    image:
      "https://images.unsplash.com/photo-1592431913823-7af6b323da9b?auto=format&fit=crop&w=600&h=300&q=80https://images.unsplash.com/photo-1580894742597-87bc8789db3d?auto=format&fit=crop&w=600&h=300&q=80",
    url: "https://medium.com/@manushibombaywala0304/history-of-cyber-attacks-116f0c1743ae",
  },
];

export default function BlogSection() {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  
  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-dark to-dark-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #10b981 0%, transparent 50%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 50%)'
        }} />
      </div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4 gradient-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            Blog
          </motion.h2>
          <motion.p
            className="text-xl text-gray-light max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            I write articles to reinforce my knowledge and help out others who might be building something similar.
            <span className="text-green-400 font-semibold"> Knowledge shared is knowledge multiplied.</span>
          </motion.p>
          
          {/* Blog Stats */}
          <motion.div
            className="flex justify-center space-x-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              { value: "5+", label: "Articles" },
              { icon: Clock, value: "5 min", label: "Avg Read" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                whileHover={{ scale: 1.05, y: -2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
              >
               
                <div className="text-lg font-bold text-white group-hover:gradient-text transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.title}
              className="bg-gradient-to-br from-dark-secondary to-dark-tertiary rounded-2xl overflow-hidden border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group hover-lift"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              data-testid={`card-blog-${post.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
              onMouseEnter={() => setHoveredPost(post.title)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  data-testid={`img-blog-${post.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Read More Button Overlay */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                >
                  <motion.a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium flex items-center space-x-2 hover:bg-white/30 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye size={16} />
                    <span>Read Article</span>
                  </motion.a>
                </motion.div>
                
                {/* Article Number */}
                <div className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  #{index + 1}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <motion.div 
                  className="flex items-center space-x-2 mb-3"
                  animate={hoveredPost === post.title ? { x: 5 } : { x: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  
                  <div className="text-sm text-green-400 font-medium" data-testid={`text-date-${post.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`}>
                  </div>
                </motion.div>
                
                <motion.h3 
                  className="text-xl font-bold mb-4 leading-tight group-hover:gradient-text transition-all duration-300" 
                  data-testid={`text-title-${post.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                  animate={hoveredPost === post.title ? { x: 5 } : { x: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {post.title}
                </motion.h3>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    index === 0 ? "CyberSecurity" : index === 1 ? "CyberSecurity" : "History",
                    index === 0 ? "LLMs" : index === 1 ? "OWASP" : "Discovery",
                    index === 0 ? "Attacks" : index === 2 ? "Risks and Mitigation" : "Risks"
                  ].map((tag, tagIndex) => (
                    <span
                      key={tag}
                      className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <motion.a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-300 font-medium flex items-center space-x-2 group/link"
                  data-testid={`link-blog-${post.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                  whileHover={{ x: 5 }}
                >
                  <span>Read Full Article</span>
                  <motion.div
                    animate={{ x: hoveredPost === post.title ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ExternalLink size={16} className="group-hover/link:rotate-12 transition-transform duration-300" />
                  </motion.div>
                </motion.a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
