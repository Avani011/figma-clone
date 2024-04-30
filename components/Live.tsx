import { useOthers } from "@/liveblocks.config";
import LiveCursors from "./cursor/LiveCursors";

const s = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const others = useOthers() ;

  return (
    <div>
      <LiveCursors others={others} />
    </div>
  );
}

export default s;
