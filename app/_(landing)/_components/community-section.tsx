"use client";

import { PixelButton } from "@app/_(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@app/_(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@app/_(landing)/_components/pixel/pixel-icon";
import Image from "next/image";
import Link from "next/link";

export function CommunitySection() {
  const stats = [
    // TODO: Temporarily hide GitHub-related stats until the project is open source.
    // { icon: "github" as const, value: "53.6K", label: "GitHub Stars" },
    { icon: "users" as const, value: "650+", label: "Contributors" },
    { icon: "message" as const, value: "5K+", label: "Discord Members" },
    { icon: "twitter" as const, value: "12K+", label: "Followers" },
  ];

  const socialLinks = [
    // TODO: Temporarily hide GitHub-related social links until the project is open source.
    // {
    //   name: "GitHub",
    //   iconSrc: "/images/social/github.svg",
    //   iconSize: { className: "size-6" },
    //   href: SOCIAL_LINKS.github,
    // },
    {
      name: "Discord",
      iconSrc: "/images/social/discord.svg",
      iconSize: { className: "size-6" },
      href: "",
    },
    {
      name: "X (Twitter)",
      iconSrc: "/images/social/x.svg",
      iconSize: { className: "size-[22.5px]" },
      href: "",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-pixel-bg border-y-2 border-pixel-border">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <PixelHeading as="h2" className="mb-4">
            JOIN THOUSANDS OF <span className="text-pixel-green">DEVELOPERS</span>
          </PixelHeading>
          <p className="text-base text-pixel-muted font-sans">
            Be part of our growing community building the future of document parsing
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <PixelCard key={stat.label}>
              <div className="text-center p-6">
                <div className="mb-3">
                  <PixelIcon icon={stat.icon} color="green" size={24} />
                </div>
                <div className="text-2xl font-bold font-mono text-pixel-fg mb-1">{stat.value}</div>
                <div className="text-xs text-pixel-muted font-sans">{stat.label}</div>
              </div>
            </PixelCard>
          ))}
        </div>

        {/* TODO: Temporarily hide the GitHub widget until the project is open source. */}
        {/*
        <div className="max-w-2xl mx-auto mb-12">
          <PixelCard>
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/social/github.svg"
                    alt="GitHub icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <div>
                    <h3 className="text-[12px] font-pixel leading-relaxed text-[var(--pixel-text-muted)]">
                      knowhere-api/knowhere
                    </h3>
                    <p className="text-sm text-pixel-muted font-sans">
                      Open source document parsing
                    </p>
                  </div>
                </div>
                <PixelButton variant="secondary" asChild>
                  <Link href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer">
                    STAR
                  </Link>
                </PixelButton>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold font-mono text-pixel-yellow mb-1">53.6K</div>
                  <div className="text-xs text-pixel-muted font-sans">Stars</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-pixel-green mb-1">1.2K</div>
                  <div className="text-xs text-pixel-muted font-sans">Forks</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-pixel-yellow mb-1">Active</div>
                  <div className="text-xs text-pixel-muted font-sans">Development</div>
                </div>
              </div>
            </div>
          </PixelCard>
        </div>
        */}

        {/* Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {socialLinks.map((link) => (
            <PixelButton
              key={link.name}
              variant="secondary"
              className="flex items-center gap-2"
              asChild
            >
              <Link href={link.href} target="_blank" rel="noopener noreferrer">
                <Image
                  src={link.iconSrc}
                  alt={`${link.name} icon`}
                  width={16}
                  height={16}
                  className={`${link.iconSize.className} social-icon`}
                />
                {link.name}
              </Link>
            </PixelButton>
          ))}
        </div>
      </div>
    </section>
  );
}
