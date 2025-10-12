import { useSSE } from "../hooks/use-sse";
import React, { useEffect } from "react";

export function AIView() {
    const { content, start, loading, thinking } = useSSE();   

    useEffect(() => {
        // start('');
    }, [])

    return <div className="mb-4 p-4">
        <div className="mb-2 text-gray-300 font-normal">
            {thinking}
        </div>
        <div>
            {content}{loading ? '...' : ''}
        </div>
    </div>
}