"use client";

import { Button } from "@components/ui/button";
import { motion } from "framer-motion";
import { Github, MessageCircle, Twitter, Users } from "lucide-react";
import Link from "next/link";

export function CommunitySection() {
  const stats = [
    { icon: Github, value: "53.6K", label: "GitHub Stars" },
    { icon: Users, value: "650+", label: "Contributors" },
    { icon: MessageCircle, value: "5K+", label: "Discord Members" },
    { icon: Twitter, value: "12K+", label: "Followers" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/knowhere-api",
      color: "hover:text-foreground",
    },
    {
      name: "Discord",
      icon: MessageCircle,
      href: "https://discord.gg/knowhere",
      color: "hover:text-[#5865F2]",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/knowhere_api",
      color: "hover:text-[#1DA1F2]",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            Join Thousands of{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Developers
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Be part of our growing community building the future of document parsing
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-2xl border border-border/50 p-6 text-center hover:border-primary/50 transition-all cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="mb-3"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/30 rounded-lg blur-md" />
                  <div className="relative h-10 w-10 mx-auto rounded-lg bg-card border border-primary/20 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </motion.div>
              <div className="text-2xl font-bold font-mono text-foreground mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* GitHub Stats Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="glass rounded-2xl border border-border/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-card border border-primary/20 flex items-center justify-center">
                  <Github className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">knowhere-api/knowhere</h3>
                  <p className="text-sm text-muted-foreground">Open source document parsing</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="https://github.com/knowhere-api"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Star
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold font-mono text-accent mb-1">⭐ 53.6K</div>
                <div className="text-xs text-muted-foreground">Stars</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-primary mb-1">🍴 1.2K</div>
                <div className="text-xs text-muted-foreground">Forks</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-accent mb-1">📊 Active</div>
                <div className="text-xs text-muted-foreground">Development</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {socialLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ scale: 1.05 }}>
              <Button
                variant="outline"
                className={`h-12 px-6 border-border/50 hover:border-primary/50 ${link.color} transition-colors`}
                asChild
              >
                <Link href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon className="h-5 w-5 mr-2" />
                  {link.name}
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
