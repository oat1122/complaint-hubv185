import dynamic from "next/dynamic";

export const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false });
export const LineChart = dynamic(() => import('recharts').then(m => ({ default: m.LineChart })), { ssr: false });
export const Line = dynamic(() => import('recharts').then(m => ({ default: m.Line })), { ssr: false });
export const AreaChart = dynamic(() => import('recharts').then(m => ({ default: m.AreaChart })), { ssr: false });
export const Area = dynamic(() => import('recharts').then(m => ({ default: m.Area })), { ssr: false });
export const XAxis = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })), { ssr: false });
export const YAxis = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })), { ssr: false });
export const CartesianGrid = dynamic(() => import('recharts').then(m => ({ default: m.CartesianGrid })), { ssr: false });
export const Tooltip = dynamic(() => import('recharts').then(m => ({ default: m.Tooltip })), { ssr: false });
export const PieChart = dynamic(() => import('recharts').then(m => ({ default: m.PieChart })), { ssr: false });
export const Pie = dynamic(() => import('recharts').then(m => ({ default: m.Pie })), { ssr: false });
export const Cell = dynamic(() => import('recharts').then(m => ({ default: m.Cell })), { ssr: false });
export const BarChart = dynamic(() => import('recharts').then(m => ({ default: m.BarChart })), { ssr: false });
export const Bar = dynamic(() => import('recharts').then(m => ({ default: m.Bar })), { ssr: false });
