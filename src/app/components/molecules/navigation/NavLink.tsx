'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const navLinkVariants = cva(
  'inline-flex items-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:text-primary',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        active: 'text-primary font-bold', // Active links have bold text
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface NavLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof navLinkVariants> {
  href: string; // Target URL for the navigation
  exactMatch?: boolean; // Match full path or partial
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, href, variant, size, exactMatch = false, ...props }, ref) => {
    const pathname = usePathname(); // Get the current route

    // Ensure the `isActive` logic works for exact and partial matches
    const isActive = React.useMemo(() => {
      if (!href.startsWith('/')) href = `/${href}`; // Enforce absolute path
      return exactMatch ? pathname === href : pathname.startsWith(href);
    }, [pathname, href, exactMatch]);

    return (
      <Link
        href={href.startsWith('/') ? href : `/${href}`} // Ensure href is absolute
        className={cn(
          navLinkVariants({ variant, size, className }),
          isActive && 'active' // Add active class if isActive is true
        )}
        {...props}
        ref={ref}
      >
        {props.children}
      </Link>
    );
  }
);

NavLink.displayName = 'NavLink';
