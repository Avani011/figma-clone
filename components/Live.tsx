/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useMyPresence, useOthers } from "@/liveblocks.config";
import LiveCursors from "./cursor/LiveCursors";
import { useCallback, useEffect, useState } from "react";
import CursorChat from "./cursor/CursorChat";
import { CursorMode, CursorState, Reaction } from "@/types/type";
import ReactionSelector from "./reactions/Reactionbutton";
import FlyingReaction from "./reactions/FlyingReaction";
import useInterval from "@/hooks/useInterval";

const s = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const others = useOthers() ;
    const [{cursor}, updateMyPresence] = useMyPresence() as any;

    const [cursorState, setcursorState] = useState<CursorState>({
        mode: CursorMode.Hidden,
    })

    const [reactions, setReaction] = useState<Reaction[]>([])

    useInterval(() => {
        if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor){
            setReaction((reactions) => reactions.concat([{
                point: { x: cursor.x, y: cursor.y },
                value: cursorState.reaction,
                timestamp: Date.now(),
            }]))
        }
    }, 100);

    const handlePointerMove = useCallback((event: React.PointerEvent) =>{
        event.preventDefault();

        if(cursor === null || cursorState.mode !== CursorMode.ReactionSelector){
            const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
            const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

            updateMyPresence({
                cursor:{x,y}
            });
        }   
    }, [cursorState.mode, setcursorState])


    const handlePointerLeave = useCallback((event: React.PointerEvent) =>{
        setcursorState({mode: CursorMode.Hidden})

        updateMyPresence({
            cursor: null, message: null
        });
    }, [])

    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({
            cursor:{x,y}
        });

        setcursorState((state: CursorState) => 
            cursorState.mode === CursorMode.Reaction ? 
            { ...state, isPressed: true } : state
        );

    }, [cursorState.mode, setcursorState])

    const handlePointerUp = useCallback((event: React.PointerEvent) => {
        setcursorState((state : CursorState) => 
            cursorState.mode === CursorMode.Reaction ? 
            {...state, isPressed: true } : state
        );

    }, [cursorState.mode, setcursorState])

    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) =>{
            if(e.key === '/'){
                setcursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: '',
                })
            } else if(e.key === 'Escape'){
                updateMyPresence({ message: ''})
                setcursorState({ mode: CursorMode.Hidden})
            } else if(e.key === 'e'){
                setcursorState({
                    mode: CursorMode.ReactionSelector,
                })
            }
        }

        const onKeyDown = (e: KeyboardEvent) =>{
            if(e.key === '/'){
                e.preventDefault();
            }
        }

        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('keydown', onKeyDown);
        }

    }, [updateMyPresence]);

    const setReactions = useCallback((reaction: string) =>{
        setcursorState({ mode: CursorMode.Reaction,
            reaction, isPressed: false })
    }, [])

  return (
    <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="h-[100vh] w-full flex justify-center items-center text-center"
    >
        <h1 className="text-2xl text-white">Liveblocks Figma Clone</h1>

        {reactions.map((r) => {
            <FlyingReaction 
            key={r.timestamp.toString()}
            x={r.point.x}
            y={r.point.y}
            timestamp={r.timestamp}
            value={r.value}
            />
        })}
        
        {cursor &&(
            <CursorChat 
                cursor = {cursor}
                cursorState={cursorState}
                setCursorState={setcursorState}
                updateMyPresence={updateMyPresence}
            />
        )}

        {cursorState.mode === CursorMode.ReactionSelector && (
            <ReactionSelector 
                setReaction={setReactions}
            />
        )}

        <LiveCursors others={others} />
    </div>
  );
}

export default s;
