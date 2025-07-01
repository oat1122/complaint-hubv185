"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SWRConfig } from "swr";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SWRConfig value={{ dedupingInterval: 5 * 60 * 1000 }}>
        {children}
      </SWRConfig>
    </SessionProvider>
  );
}
