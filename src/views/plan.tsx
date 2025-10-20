import { AppModel } from "hearthstone-core";
import React, { useEffect, useRef, useState } from "react";
import { useSSE } from "../hooks/use-sse";

export function PlanView(props: {
    app?: AppModel
}) {
    const game = props.app?.child.game;
    const { content, start, loading, thinking, stop, clear } = useSSE({ 
        api: 'http://localhost:8080/plan-generate' 
    });   
    
    const thinkingRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const request = () => {
        stop();
        clear();
        const current = game?.child.turn?.refer.current;
        if (!current) return;
        const body: {
            snapshot: string;
            player: string;
            config: string;
        } = {
            snapshot: JSON.stringify(game?.chunk),
            config: JSON.stringify({
                playerA: game.child.playerA.child.collection.chunk,
                playerB: game.child.playerB.child.collection.chunk,
            }),
            player: current.name,
        }
        console.log(body);
        start(body);
    }

    // 检查是否在底部
    const checkIfAtBottom = () => {
        if (!thinkingRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = thinkingRef.current;
        const threshold = 5; // 允许5px的误差
        const atBottom = scrollHeight - scrollTop - clientHeight <= threshold;
        setIsAtBottom(atBottom);
    };

    // 滚动到底部
    const scrollToBottom = () => {
        if (thinkingRef.current) {
            thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight;
        }
    };

    // 监听thinking内容变化
    useEffect(() => {
        if (thinking && isAtBottom) {
            setTimeout(scrollToBottom, 0); // 使用setTimeout确保DOM已更新
        }
    }, [thinking, isAtBottom]);

    return <div>
        <h1 className="text-lg font-bold cursor-pointer" onClick={() => request()}>Plan</h1>
        <div 
            ref={thinkingRef}
            className="mb-2 text-gray-300 font-normal max-h-[300px] overflow-y-auto hide-scrollbar" 
            style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE and Edge */
            }}
            onScroll={checkIfAtBottom}
        >
            {thinking}
        </div>
        <div className="mb-2">{content}{loading ? '...' : ''}</div>
    </div>
}