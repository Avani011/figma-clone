import dynamic from 'next/dynamic';

// Dynamically import Room component (ensure default export)
const Room = dynamic(() => import('./Room').then(mod => mod.Room), { ssr: false });

export default function Page() {
  return (
    <div>
      <Room>
        <h1 className="text-5xl text-white">Liveblocks Figma Clone</h1>
      </Room>
    </div>
  );
}
