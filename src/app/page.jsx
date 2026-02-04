import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// UI / system icons
import {
	Github,
	ExternalLink,
	Mail,
	Phone,
	Linkedin,
	ChevronRight,
	Terminal,
	Code2,
	Palette,
	Zap,
	Menu,
	Instagram,
	MessageSquare,
} from "lucide-react";

// Brand icons
import { FaTiktok, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { motion, AnimatePresence } from "motion/react";

// --- Components ---

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 50);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navLinks = [
		{ name: "Home", href: "#home" },
		{ name: "About", href: "#about" },
		{ name: "Projects", href: "#projects" },
		{ name: "Skills", href: "#skills" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<nav
			className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#a855f7]/20 py-3" : "bg-transparent py-6"}`}
		>
			<div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
				<a
					href="#home"
					className="text-2xl font-black tracking-tighter text-cyan-400 group"
				>
					Lucky Philip
				</a>

				{/* Desktop Links */}
				<div className="hidden md:flex gap-8">
					{navLinks.map((link) => (
						<a
							key={link.name}
							href={link.href}
							className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#00ffff] hover:drop-shadow-[0_0_5px_#00ffff] transition-all"
						>
							{link.name}
						</a>
					))}
				</div>

				<button
					className="md:hidden text-white"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
				>
					{mobileMenuOpen ? <X /> : <Menu />}
				</button>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="absolute top-full left-0 w-full bg-[#121212] border-b border-[#a855f7]/20 p-6 flex flex-col gap-4 md:hidden"
					>
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								onClick={() => setMobileMenuOpen(false)}
								className="text-lg font-bold text-gray-300 hover:text-[#a855f7]"
							>
								{link.name}
							</a>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

const Hero = () => {
	const phrases = [
		"Shaping interfaces where motion guides meaning and interaction feels alive.",
		"Designing digital experiences that move visually, emotionally, intuitively.",
		"Blending code, motion, and design into interfaces you can feel.",
		"Experienced in designing usable, accessible, and maintainable digital experiences.",
	];

	const [index, setIndex] = useState(0);
	const [subIndex, setSubIndex] = useState(0);
	const [reverse, setReverse] = useState(false);

	useEffect(() => {
		if (subIndex === phrases[index].length + 1 && !reverse) {
			setTimeout(() => setReverse(true), 2000);
			return;
		}

		if (subIndex === 0 && reverse) {
			setReverse(false);
			setIndex((prev) => (prev + 1) % phrases.length);
			return;
		}

		const timeout = setTimeout(
			() => {
				setSubIndex((prev) => prev + (reverse ? -1 : 1));
			},
			reverse ? 75 : 150,
		);

		return () => clearTimeout(timeout);
	}, [subIndex, index, reverse]);

	return (
		<section
			id="home"
			className="min-h-screen flex flex-col justify-center items-center pt-20 px-6 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a0b2e] via-[#0a0a0a] to-[#0a0a0a]"
		>
			<div className="relative mb-8">
				<div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-[#a855f7] shadow-[0_0_30px_#a855f7]">
					<img
						src="https://avatars.githubusercontent.com/u/224676908?v=4"
						alt="Lucky Philip"
						className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
					/>
				</div>
				<div className="absolute -inset-4 border-2 border-[#00ffff]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
			</div>

			<h1 className="text-4xl md:text-7xl font-black text-[#2FD6D2] drop-shadow-[0_0_10px_#00FFF0] mb-6 tracking-tighter">
				FRONTEND{" "}
				<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#00ffff] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
					DEVELOPER
				</span>
			</h1>

			<div className="h-12 md:h-20 mb-10">
				<p className="text-xl md:text-3xl font-mono text-[#00ffff]">
					{phrases[index].substring(0, subIndex)}
					<span className="animate-pulse">|</span>
				</p>
			</div>

			<div className="flex gap-4">
				<a
					href="#projects"
					className="px-8 py-4 bg-[#a855f7] text-white font-bold rounded-full hover:shadow-[0_0_20px_#a855f7] transition-all transform hover:scale-105"
				>
					VIEW PROJECTS
				</a>
				<a
					href="#contact"
					className="px-8 py-4 border-2 border-[#00ffff] text-[#00ffff] font-bold rounded-full hover:bg-[#00ffff]/10 transition-all"
				>
					CONTACT ME
				</a>
			</div>
		</section>
	);
};

const About = () => {
	return (
		<section id="about" className="py-32 px-6 bg-[#0a0a0a]">
			<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
				<div className="space-y-8">
					<h2 className="text-5xl font-black text-white leading-none">
						ABOUT{" "}
						<span className="text-[#a855f7] drop-shadow-[0_0_10px_#a855f7]">
							ME
						</span>
					</h2>
					<div className="space-y-6 text-gray-400 text-lg leading-relaxed">
						<p>
							I'm Lucky Philip, a passionate Frontend Developer who transforms
							ideas into exceptional digital experiences. With a keen eye for
							design and a deep understanding of modern web technologies, I
							create interfaces that are not only visually stunning but also
							intuitive and performant.
						</p>
						<p>
							My journey in web development is driven by the belief that great
							user experiences are born from the intersection of beautiful
							design and flawless functionality. I specialize in building
							responsive, accessible web applications using cutting-edge
							technologies like <span className="text-[#00ffff]">React</span>,{" "}
							<span className="text-[#a855f7]">Next.js</span>, and modern{" "}
							<span className="text-[#10b981]">CSS frameworks</span>.
						</p>
						<p>
							Whether it's crafting pixel-perfect layouts, optimizing
							performance, or implementing complex interactions, I approach
							every project with dedication and attention to detail. I believe
							in writing clean, maintainable code that stands the test of time.
						</p>
						<div className="grid grid-cols-2 gap-4 pt-4">
							<div className="p-4 bg-[#121212] border-l-4 border-[#a855f7] rounded-r-lg">
								<p className="text-[#a855f7] font-bold mb-1">4+</p>
								<p className="text-sm">Years Experience</p>
							</div>
						</div>
					</div>
				</div>

				<div className="relative">
					<div className="aspect-square bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden group">
						<div className="absolute inset-0 bg-gradient-to-tr from-[#a855f7]/20 to-[#00ffff]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
						<div className="p-10 flex flex-col justify-center h-full space-y-8">
							<div className="flex items-center gap-4">
								<Terminal className="text-[#a855f7]" size={40} />
								<div>
									<h3 className="text-white font-bold text-xl">Clean Code</h3>
									<p className="text-gray-500 text-sm">
										Semantic & maintainable structure
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<Palette className="text-[#00ffff]" size={40} />
								<div>
									<h3 className="text-white font-bold text-xl">Dynamic UI</h3>
									<p className="text-gray-500 text-sm">
										Interactive & engaging designs
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<Zap className="text-[#ffff00]" size={40} />
								<div>
									<h3 className="text-white font-bold text-xl">Optimized</h3>
									<p className="text-gray-500 text-sm">
										Fast loading & SEO friendly
									</p>
								</div>
							</div>
						</div>
					</div>
					{/* Decorative Elements */}
					<div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-[#a855f7] rounded-tr-3xl"></div>
					<div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-[#00ffff] rounded-bl-3xl"></div>
				</div>
			</div>
		</section>
	);
};

const Projects = () => {
	const { data: projects, isLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: async () => {
			const res = await fetch("/api/projects");
			if (!res.ok) throw new Error("Failed to fetch");
			return res.json();
		},
	});

	if (isLoading)
		return (
			<div className="py-20 text-center text-[#a855f7]">
				LOADING DATA FROM CMS...
			</div>
		);

	return (
		<section id="projects" className="py-32 px-6 bg-[#0d0d0d]">
			<div className="max-w-7xl mx-auto">
				<div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
					<h2 className="text-5xl font-black text-[#00ffff] leading-none">
						PROJECTS{" "}
					</h2>
					<p className="text-gray-500 font-mono">
						/ TOTAL PROJECTS: {projects?.length || 0}
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{projects?.map((project) => (
						<motion.div
							key={project.id}
							whileHover={{ y: -10 }}
							className="group bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden hover:border-[#a855f7]/50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
						>
							<div className="aspect-video relative overflow-hidden bg-[#1a1a1a]">
								<img
									src={
										project.image_url ||
										"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80"
									}
									alt={project.title}
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
								/>
								<div className="absolute top-4 right-4 bg-[#0a0a0a]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700 text-[10px] font-bold text-[#00ffff] tracking-widest uppercase">
									{project.category || "PROJECT"}
								</div>
							</div>

							<div className="p-8">
								<h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#a855f7] transition-colors">
									{project.title}
								</h3>
								<p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
									{project.description}
								</p>

								<div className="flex flex-wrap gap-2 mb-8">
									{project.technologies?.split(",").map((tech) => (
										<span
											key={tech}
											className="text-[10px] font-bold bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700"
										>
											{tech.trim()}
										</span>
									))}
								</div>

								<div className="flex justify-between items-center pt-6 border-t border-gray-800">
									<a
										href={project.github_link || "#"}
										target="_blank"
										className="text-gray-500 hover:text-white transition-colors"
									>
										<Github size={20} />
									</a>
									<a
										href={project.live_link || "#"}
										target="_blank"
										className="flex items-center gap-2 text-sm font-bold text-[#a855f7] hover:drop-shadow-[0_0_5px_#a855f7] transition-all"
									>
										LIVE DEMO <ChevronRight size={16} />
									</a>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

const Skills = () => {
	const skillCategories = [
		{
			title: "Frontend Core",
			color: "#a855f7",
			skills: [
				"React",
				"Next.js",
				"TypeScript",
				"JavaScript (ES6+)",
				"HTML5",
				"CSS3/SCSS",
			],
		},
		{
			title: "Design & Styling",
			color: "#00ffff",
			skills: [
				"Tailwind CSS",
				"Figma",
				"Framer Motion",
				"Styled Components",
				"Responsive Design",
			],
		},
		{
			title: "Backend & Tools",
			color: "#ffff00",
			skills: [
				"Node.js",
				"PostgreSQL",
				"Git/GitHub",
				"REST APIs",
				"Vercel",
				"Testing (Jest)",
			],
		},
	];

	return (
		<section id="skills" className="py-32 px-6 bg-[#0a0a0a]">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-5xl font-black text-white text-center mb-20 leading-none">
					MY{" "}
					<span className="text-[#ffff00] drop-shadow-[0_0_10px_#ffff00]">
						TOOLKIT
					</span>
				</h2>

				<div className="grid md:grid-cols-3 gap-12">
					{skillCategories.map((cat) => (
						<div
							key={cat.title}
							className="p-8 bg-[#121212] border border-gray-800 rounded-3xl relative overflow-hidden group"
						>
							<div
								className="absolute top-0 left-0 w-1 h-full opacity-50 transition-all group-hover:w-full group-hover:opacity-5"
								style={{ backgroundColor: cat.color }}
							></div>

							<h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
								<Code2 style={{ color: cat.color }} />
								{cat.title}
							</h3>

							<div className="flex flex-wrap gap-3">
								{cat.skills.map((skill) => (
									<span
										key={skill}
										className="px-4 py-2 bg-black/40 border border-gray-800 rounded-full text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all cursor-default"
									>
										{skill}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

const Contact = () => {
	const socialLinks = [
		{ icon: Github, href: "https://github.com/Malonee58", label: "GitHub" },
		{
			icon: Linkedin,
			href: "https://www.linkedin.com/in/miraclephilip58/",
			label: "LinkedIn",
		},
		{
			icon: Instagram,
			href: "https://instagram.com/malonee12",
			label: "Instagram",
		},
		{
			icon: FaXTwitter,
			href: "https://x.com/Malonee_58",
			label: "X",
		},
		{
			icon: FaTiktok,
			href: "https://vm.tiktok.com/ZS91vpe931vYn-uqvZx/",
			label: "TikTok",
		},
		{
			icon: FaWhatsapp,
			href: "https://wa.me/2349125383458",
			label: "WhatsApp Business",
		},
	];

	return (
		<section
			id="contact"
			className="py-32 px-6 bg-[#050505] relative overflow-hidden"
		>
			{/* Background Glow */}
			<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#a855f7]/10 blur-[120px] rounded-full"></div>

			<div className="max-w-4xl mx-auto text-center relative z-10">
				<h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
					LET'S{" "}
					<span className="text-[#a855f7] drop-shadow-[0_0_15px_#a855f7]">
						TALK
					</span>
				</h2>

				<p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
					Currently open to new opportunities and interesting collaborations.
					Feel free to reach out for a project or just to say hi!
				</p>

				<div className="grid md:grid-cols-3 gap-6 mb-20">
					<a
						href="mailto:miraclemalonee58@gmail.com"
						className="group p-6 bg-[#121212] border border-gray-800 rounded-2xl hover:border-[#00ffff]/50 transition-all"
					>
						<Mail
							className="mx-auto mb-4 text-[#00ffff] group-hover:scale-110 transition-transform"
							size={28}
						/>
						<p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">
							Email
						</p>
						<p className="text-white text-sm font-medium truncate">
							miraclemalonee58@gmail.com
						</p>
					</a>
					<a
						href="https://wa.me/2349125383458"
						target="_blank"
						rel="noopener noreferrer"
						className="group p-6 bg-[#121212] border border-gray-800 rounded-2xl hover:border-[#10b981]/50 transition-all"
					>
						<MessageSquare
							className="mx-auto mb-4 text-[#10b981] group-hover:scale-110 transition-transform"
							size={28}
						/>
						<p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">
							WhatsApp
						</p>
						<p className="text-white text-sm font-medium">+234 912 538 3458</p>
					</a>
					<a
						href="tel:+2349125383458"
						className="group p-6 bg-[#121212] border border-gray-800 rounded-2xl hover:border-[#a855f7]/50 transition-all"
					>
						<Phone
							className="mx-auto mb-4 text-[#a855f7] group-hover:scale-110 transition-transform"
							size={28}
						/>
						<p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">
							Phone
						</p>
						<p className="text-white text-sm font-medium">+234 912 538 3458</p>
					</a>
				</div>

				<div className="flex flex-wrap justify-center gap-6 mb-20">
					{socialLinks.map((social, i) => (
						<a
							key={i}
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							title={social.label}
							className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-800 text-gray-400 hover:text-white hover:border-[#a855f7] hover:shadow-[0_0_10px_#a855f7] transition-all"
						>
							<social.icon size={24} />
						</a>
					))}
				</div>

				<footer className="pt-20 border-t border-gray-900 text-gray-600 text-xs font-mono tracking-widest">
					&copy; {new Date().getFullYear()} LUCKY PHILIP. ALL RIGHTS RESERVED.
					DESIGNED FOR THE FUTURE.
				</footer>
			</div>
		</section>
	);
};

// --- Page Wrapper ---

export default function PortfolioPage() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] selection:bg-[#a855f7] selection:text-white overflow-x-hidden">
			<style jsx global>{`
				html {
					scroll-behavior: smooth;
				}
				@keyframes spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
				::selection {
					background: #a855f7;
					color: white;
				}
				::-webkit-scrollbar {
					width: 8px;
				}
				::-webkit-scrollbar-track {
					background: #0a0a0a;
				}
				::-webkit-scrollbar-thumb {
					background: #333;
					border-radius: 10px;
				}
				::-webkit-scrollbar-thumb:hover {
					background: #a855f7;
				}
			`}</style>

			<Navbar />
			<Hero />
			<About />
			<Projects />
			<Skills />
			<Contact />
		</div>
	);
}
