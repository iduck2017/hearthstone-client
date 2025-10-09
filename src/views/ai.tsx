import { useSSE } from "../hooks/use-sse";
import React, { useEffect } from "react";

export function AIView() {
    const { content, start, loading } = useSSE();   

    useEffect(() => {
        start('');
    }, [])

    return <div className="mb-4 p-4">
        {content}{loading ? '...' : ''}
    </div>
}