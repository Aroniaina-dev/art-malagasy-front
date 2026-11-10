import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  truck: (<><path d="M2 6h11v10H2zM13 9h4l3 3v4h-7" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" /></>),
  star: <path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  search: (<><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>),
  cart: (<><path d="M3 4h2.5l2 11h10l2-8H7" /><circle cx="9" cy="19.5" r="1.4" /><circle cx="17" cy="19.5" r="1.4" /></>),
  heart: <path d="M12 20s-7.5-4.6-9-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-1.500 5.400-9 10-9 10z" />,
  filter: <path d="M3 5h18l-7 8v6l-4-2v-4z" />,
  grid: (<><rect x="4" y="4" width="6.500" height="6.500" rx="1" /><rect x="13.500" y="4" width="6.500" height="6.500" rx="1" /><rect x="4" y="13.500" width="6.500" height="6.500" rx="1" /><rect x="13.500" y="13.500" width="6.500" height="6.500" rx="1" /></>),
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
  refresh: <path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  shield: (<><path d="M12 3 4.500 6v6c0 4.500 3 7.500 7.500 9 4.500-1.500 7.500-4.500 7.500-9V6z" /><path d="m8.500 12 2.500 2.500 4.500-5" /></>),
  headset: (<><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.500" /><rect x="17" y="14" width="4" height="6" rx="1.500" /></>),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.500c0-.3.200-.5.500-.5z" />,
  instagram: (<><rect x="3.500" y="3.500" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" /></>),
  tiktok: <path d="M14 3v11.500a3.500 3.500 0 1 1-3.500-3.500M14 3c.3 2.500 2 4 4.500 4.200" />,
  youtube: (<><rect x="2.500" y="5.500" width="19" height="13" rx="4" /><path d="m10 9.500 5 2.500-5 2.500z" /></>),
};

export function Icon({ name }: { name: keyof typeof paths | string }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
