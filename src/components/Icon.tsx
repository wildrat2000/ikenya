import React from 'react';
import {
  Code,
  Globe,
  Network,
  Server,
  Box,
  Briefcase,
  ShieldCheck,
  Zap,
  Wrench,
  LucideProps,
} from 'lucide-react';

const map: Record<string, React.ComponentType<LucideProps>> = {
  code: Code,
  globe: Globe,
  network: Network,
  server: Server,
  box: Box,
  briefcase: Briefcase,
  shield: ShieldCheck,
  zap: Zap,
  wrench: Wrench,
};

const Icon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const Cmp = map[name] || Box;
  return <Cmp className={className} />;
};

export default Icon;
