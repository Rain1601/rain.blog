'use client';

import React from 'react';
import { isInternalLink } from '@/utils/linkAnalyzer';

interface LinkTagProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const LinkTag: React.FC<LinkTagProps> = ({ href, children, className = '' }) => {
  const external = !isInternalLink(href);

  return (
    <a href={href} className={className} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
      {children}
    </a>
  );
};

export default LinkTag;
