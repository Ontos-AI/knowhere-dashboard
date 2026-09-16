import { type ShareNetwork, shareIntentUrl, type WordpressPost } from "@lib/wordpress";
import type { ReactNode } from "react";

const networks: readonly {
  readonly name: string;
  readonly service: ShareNetwork;
  readonly icon: ReactNode;
}[] = [
  {
    name: "LinkedIn",
    service: "linkedin",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M4.98 3.5A2.49 2.49 0 1 1 5 8.48 2.49 2.49 0 0 1 4.98 3.5ZM3.5 9.25h2.97V20.5H3.5Zm5.34 0h2.85v1.54h.04c.4-.75 1.37-1.54 2.82-1.54 3.02 0 3.58 1.99 3.58 4.57V20.5h-2.97v-5.02c0-1.2-.02-2.73-1.67-2.73-1.67 0-1.92 1.3-1.92 2.64V20.5H8.84Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Mastodon",
    service: "mastodon",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M16.63 17.92c-2.3.1-4.63.1-6.94-.12-1.4-.13-2.86-.4-3.9-1.32C4.2 15.2 3.9 13 3.9 11.04V8.3c0-2.93.76-5.18 4.18-5.77C9.3 2.3 14.7 2.3 15.92 2.53c3.42.59 4.18 2.84 4.18 5.77v2.73c0 2.02-.3 4.23-1.9 5.52-1.04.92-2.5 1.19-3.9 1.32l.33.05Zm.55-9.02c0-1.12-.3-2.03-1.04-2.57-.73-.54-1.7-.78-2.86-.78h-2.56v9.1h2.18V11.4h.38c.7 0 1.24-.12 1.62-.4.38-.27.6-.72.7-1.32.07-.38.1-.8.1-1.28Zm-5.08 4.27V7.55h.9c.86 0 1.45.16 1.8.5.35.33.53.86.53 1.58 0 .73-.18 1.27-.54 1.6-.36.34-.95.52-1.8.52h-.89Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Bluesky",
    service: "bluesky",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M12 11.2c-1.3-2.52-4.84-7.24-8.13-7.55C1.7 3.47 1 5.05 1 6.3c0 1.22.66 10.1 8.73 13.2C10.7 20.02 11.35 20.2 12 20.2s1.3-.18 2.27-.7C22.34 16.4 23 7.52 23 6.3c0-1.25-.7-2.83-2.87-2.65-3.29.31-6.83 5.03-8.13 7.55Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "X",
    service: "twitter",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M14.5 10.4 22 2h-2.2l-6.4 7.2L8.2 2H2l7.9 11.3L2 22h2.2l7-7.9L15.8 22H22Zm-2.5 2.8-.8-1.1L5.2 3.5h2.5l5.2 7.3.8 1.1 6.8 9.6h-2.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Facebook",
    service: "facebook",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path
          d="M14.5 8.5V6.7c0-.7.5-1 1-1h2V3h-2.8C12.4 3 11 4.6 11 6.8v1.7H8.5V11H11v10h3.5V11h2.6l.4-2.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

type ShareLinksProps = {
  readonly post: WordpressPost;
  readonly shareLabel: string;
  readonly shareOnLabel: (network: string) => string;
};

export function ShareLinks({ post, shareLabel, shareOnLabel }: ShareLinksProps) {
  return (
    <nav aria-label={shareLabel} className="kb-detail-share">
      <span>{shareLabel}</span>
      {networks.map((network) => (
        <a
          aria-label={shareOnLabel(network.name)}
          href={shareIntentUrl(network.service, post.permalinkUrl, post.title)}
          key={network.service}
          rel="noopener noreferrer"
          target="_blank"
          title={shareOnLabel(network.name)}
        >
          {network.icon}
        </a>
      ))}
    </nav>
  );
}
