import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../Navigation/PublicNav';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const { user } = useAuthStore();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    // Handle navigation from other pages
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      // Clear the state to prevent scrolling on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Basic oral health analysis",
        "Limited patient records",
        "Standard support",
        "Basic reporting"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Professional",
      price: "₹1,500",
      period: "/month",
      features: [
        "Advanced analysis features",
        "Unlimited patient records",
        "Priority support",
        "Detailed analytics",
        "Custom reporting"
      ],
      gradient: "from-cyan-500 to-teal-500",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "₹4,000",
      period: "/month",
      features: [
        "Full feature access",
        "Dedicated support",
        "Custom integration",
        "Advanced analytics",
        "Team collaboration"
      ],
      gradient: "from-teal-500 to-emerald-500"
    }
  ];

  const useCases = [
    {
      title: "Dental Clinics",
      description: "Streamline patient screening and maintain comprehensive records",
      icon: "",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Research Institutions",
      description: "Analyze patterns and contribute to oral health research",
      icon: "",
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      title: "Healthcare Centers",
      description: "Integrate oral health screening into general health checkups",
      icon: "",
      gradient: "from-teal-500 to-emerald-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };
    console.log('Contact form submitted:', data);
    // Add your form submission logic here
    e.currentTarget.reset();
  };

  const handleGetStarted = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      <PublicNav />
      
      {/* Hero Section with Parallax Effect */}
      <motion.section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center py-32"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 dark:bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-200 dark:bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-8xl md:text-9xl font-bold"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent inline-block mb-16">
                H.O.P.E
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl text-gray-700 dark:text-gray-300 mb-8 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              HOPE combines medical documentation, management, analysis & diagnostics into a single unified environment
            </motion.p>
            <motion.p
              className="text-2xl text-blue-600 dark:text-cyan-400 font-semibold mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              so that you can focus on what really matters - <span className="text-cyan-600 dark:text-teal-400">"To Save Life"</span>
            </motion.p>

            <motion.button
              onClick={handleGetStarted}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 bg-white dark:bg-gray-900 shadow-lg">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              Use Cases
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 dark:text-gray-300"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Discover how H.O.P.E can transform your practice
            </motion.p>
          </motion.div>

          {/* Use Cases Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className={`text-2xl font-bold mb-4 bg-gradient-to-r ${useCase.gradient} bg-clip-text text-transparent`}>
                  {useCase.title}
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">Pricing Plans</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">Choose the perfect plan for your needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <motion.div
              className="bg-blue-50 dark:bg-gray-800 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="min-h-[200px] flex flex-col justify-between">
                <h3 className="text-3xl font-bold text-blue-500 mb-4">Starter Plan</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">0$</span>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    Always free!
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  For individuals and small teams exploring the power of oral health screening
                </p>
              </div>

              <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors mt-4 mb-8" onClick={() => navigate('/auth?mode=signup')}>
                Sign up
              </button>

              <div className="flex-grow">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Basic oral health screening</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Up to 50 screenings/month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Basic analytics dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Community support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Basic patient records</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Email notifications</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Professional Plan */}
            <motion.div
              className="bg-purple-50 dark:bg-gray-800 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full relative transform scale-105 border-2 border-purple-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute -top-4 right-8 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div className="min-h-[200px] flex flex-col justify-between">
                <h3 className="text-3xl font-bold text-purple-500 mb-4">Professional Plan</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">0$</span>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    Free during beta*
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  For dental clinics and healthcare providers scaling their practice
                </p>
              </div>

              <button className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors mt-4 mb-8" onClick={() => navigate('/auth?mode=signup')}>
                Get started
              </button>

              <div className="flex-grow">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Everything in Starter +</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Unlimited screenings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Priority email support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Custom patient forms</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Team collaboration tools</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">API access</span>
                  </li>
                </ul>
                <p className="mt-6 text-sm text-gray-700 dark:text-gray-300">
                  * Keep screening! It's free for now. We won't lock your data behind a paywall, and we'll offer a special deal for our beta users.
                </p>
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              className="bg-orange-50 dark:bg-gray-800 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="min-h-[200px] flex flex-col justify-between">
                <h3 className="text-3xl font-bold text-orange-500 mb-4">Enterprise Plan</h3>
                <div className="flex items-baseline mb-4">
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    Coming soon
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  For large healthcare organizations with custom requirements
                </p>
              </div>

              <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors mt-4 mb-8" onClick={() => window.location.href = 'mailto:arkacreatos@gmail.com?subject=Enterprise Plan Inquiry'}>
                Contact Us
              </button>

              <div className="flex-grow">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Everything in Professional +</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Custom integration options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Advanced admin controls</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Dedicated support manager</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Custom model training</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">SLA guarantees</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">HIPAA compliance support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">Multi-location support</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-secondary-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              About Us
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 dark:text-gray-300"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Discover how we're transforming oral healthcare
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Our Mission",
                description: "To enhance oral healthcare through innovative solutions",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Our Vision",
                description: "To be the leading platform in oral health screening",
                gradient: "from-cyan-500 to-teal-500"
              },
              {
                title: "Our Values",
                description: "Innovation, accuracy, and accessibility in healthcare",
                gradient: "from-teal-500 to-emerald-500"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="relative group"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                <div className="relative bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                  <h3 className={`text-2xl font-semibold mb-4 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                    {item.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">Get in Touch</h2>
              <p className="text-xl text-gray-700 dark:text-gray-300">Have questions? We'd love to hear from you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-700 dark:text-gray-300">arkacreatos@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h3>
                    <p className="text-gray-700 dark:text-gray-300">+91-0836-3578562</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">H.O.P.E</h3>
              <p className="text-gray-700 dark:text-gray-400">
                Revolutionizing oral healthcare through advanced technology.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="mailto:arkacreatos@gmail.com"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-medical-primary-400"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4.236l-8 4.882-8-4.882V6h16v2.236z" />
                  </svg>
                </motion.a>
                <motion.a
                  href="tel:+91-0836-3578562"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-medical-primary-400"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    href="#about"
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-medical-primary-400"
                    whileHover={{ x: 5 }}
                  >
                    About Us
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#services"
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-medical-primary-400"
                    whileHover={{ x: 5 }}
                  >
                    Services
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#contact"
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-medical-primary-400"
                    whileHover={{ x: 5 }}
                  >
                    Contact
                  </motion.a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-medical-primary-400"
                    whileHover={{ x: 5 }}
                  >
                    Oral Health Screening
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-medical-primary-400"
                    whileHover={{ x: 5 }}
                  >
                    Patient Management
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#"
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-medical-primary-400"
                    whileHover={{ x: 5 }}
                  >
                    Risk Assessment
                  </motion.a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:arkacreatos@gmail.com" className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-medical-primary-400">
                    arkacreatos@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+91-0836-3578562" className="text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-medical-primary-400">
                    +91-0836-3578562
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center">
              <motion.p 
                className="text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {new Date().getFullYear()} H.O.P.E. All rights reserved.
              </motion.p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}