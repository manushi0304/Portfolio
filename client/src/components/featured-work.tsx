import { motion } from "framer-motion";
import { ExternalLink, Github, Eye } from "lucide-react";
import { useState } from "react";

const projects = [
  {
    title: "Diabetic Retinopathy Detection",
    description:
      "Using APTOS-2019 retinal images, we first benchmark six common backbones:(NASNetMobile, DenseNet121, EfficientNetV2B0, MobileNetV2, InceptionV3, ResNet50V2) and then deploy quantized feature-extractor variants (FP16/INT8/FP32) to reduce compute and model size while preserving accuracy. Our best hybrid DenseNet121 FP16 features with SVM achieve strong accuracy and F1 with markedly smaller footprints and fast inference, demonstrating a favourable accuracy efficiency trade-off suitable for deployment on point-of-care devices.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800",
    tech: ["Keras", "Tensorflow", "CNNs"],
    github: "https://github.com/manushi0304/Diabetic-Retinopathy-Detection",
    // demo: "https://www.odunsi.xyz/",
  },
  {
    title: "Kidney Disease Prediction",
    description:
      "ML project that classifies whether a patient has kidney disease based on various health parameters. Utilized data preprocessing, feature engineering, and model evaluation techniques to achieve high accuracy and reliability. Implemented using Python and popular ML libraries such as Scikit-learn and Pandas.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800",
    tech: ["ML", "Data pipelining","Image Processing"],
    github: "https://github.com/manushi0304/Kidney-Diseas-Classification",
    //demo: "https://interlock-teal.vercel.app/",
  },
  {
    title: "Vulberta for C/Cpp",
    description:
    " Our approach pre-trains a RoBERTa model with a custom tokenisation pipeline on real-world code from open-source C/C++ projects. The model learns a deep knowledge representation of the code syntax and semantics, which we leverage to train vulnerability detection classifiers."
     , image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800",
    tech: ["Deep Learning", "Vulnerability detection","Representation learning"],
    github: "https://github.com/manushi0304/Vublerta-for-C-Cpp",
    //demo: "https://synthetix-iota.vercel.app/",
  },
];

export default function FeaturedWork() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : projects.slice(0, 3);

  return (
    <section id="work" className="py-20 bg-gradient-to-b from-dark-secondary to-dark-tertiary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 className="text-4xl md:text-6xl font-bold mb-4 gradient-text" whileHover={{ scale: 1.02 }}>
            Featured Work
          </motion.h2>
          <motion.p
            className="text-xl text-gray-light max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A collection of projects that showcase my passion for creating exceptional digital experiences
          </motion.p>
        </motion.div>

        <div className="space-y-24">
          {visibleProjects.map((project, index) => {
            // AUTO alternating layout: even => image right, odd => image left
            const isReversed = index % 2 === 1;

            return (
              <motion.div
                key={project.title}
                className="grid lg:grid-cols-2 gap-16 items-center group"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredProject(project.title)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Project Image */}
                <motion.div
                  className={`relative ${isReversed ? "lg:order-1 order-2" : "lg:order-2 order-2"}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover Actions */}
                    <motion.div
                      className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                    >
                      <div className="flex space-x-4">
                        {/*{project.demo && (
                          <motion.a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye className="w-5 h-5" />
                          </motion.a>
                        )} */}
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Github className="w-5 h-5" />
                        </motion.a>
                      </div>
                    </motion.div>

                    <motion.img
                      src={project.image}
                      alt={`${project.title} project`}
                      className="w-full h-64 lg:h-80 object-cover"
                      data-testid={`img-project-${project.title.toLowerCase()}`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Project Number */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                      0{index + 1}
                    </div>
                  </div>

                  {/* Floating Tech Stack */}
                  <motion.div
                    className="absolute -bottom-4 left-4 right-4 flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: hoveredProject === project.title ? 1 : 0,
                      y: hoveredProject === project.title ? 0 : 20,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-dark/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
                      <div className="flex space-x-2">
                        {project.tech.slice(0, 3).map((tech, techIndex) => (
                          <span key={tech} className="text-xs text-gray-300">
                            {tech}
                            {techIndex < 2 ? " •" : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Project Content */}
                <motion.div
                  className={`space-y-6 ${isReversed ? "lg:order-2 order-1" : "lg:order-1 order-1"}`}
                  initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                    <h3
                      className="text-4xl font-bold mb-2 group-hover:gradient-text transition-all duration-300"
                      data-testid={`text-title-${project.title.toLowerCase()}`}
                    >
                      {project.title}
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4" />
                  </motion.div>

                  <p
                    className="text-gray-light text-lg leading-relaxed group-hover:text-gray-300 transition-colors duration-300"
                    data-testid={`text-description-${project.title.toLowerCase()}`}
                  >
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {project.tech.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                        data-testid={`tag-tech-${tech.toLowerCase()}`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: techIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  <div className="flex space-x-6 pt-4">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-light hover:text-white transition-all duration-300 group/link"
                      data-testid={`link-github-${project.title.toLowerCase()}`}
                      whileHover={{ x: 5 }}
                    >
                      <Github className="w-5 h-5 group-hover/link:rotate-12 transition-transform duration-300" />
                      <span className="font-medium">GitHub</span>
                      <motion.div className="w-0 h-0.5 bg-white group-hover/link:w-full transition-all duration-300" />
                    </motion.a>

                   {/* {project.demo && (
                      <motion.a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-light hover:text-white transition-all duration-300 group/link"
                        data-testid={`link-demo-${project.title.toLowerCase()}`}
                        whileHover={{ x: 5 }}
                      >
                        <ExternalLink className="w-5 h-5 group-hover/link:rotate-12 transition-transform duration-300" />
                        <span className="font-medium">Live Demo</span>
                        <motion.div className="w-0 h-0.5 bg-white group-hover/link:w-full transition-all duration-300" />
                      </motion.a>
                    )}*/}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* View All / Show Less Button */}
      {projects.length > 3 && (
        <motion.div
          className="text-center mt-16 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => setShowAll((s) => !s)}
            aria-expanded={showAll}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl pulse-glow"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAll ? "Show Less" : `View All Projects (${projects.length - 3} more)`}
          </motion.button>
        </motion.div>
      )}
    </section>
  );
}
