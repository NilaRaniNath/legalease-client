export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-slate-700/40 rounded animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}