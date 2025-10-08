import { useEffect, useRef, useState } from "react";
import { Event, Frame, FrameUtil, Model } from "set-piece";

export function useModel<M extends Model>(model?: M): Frame<M> | undefined {
    const [frame, setFrame] = useState<Frame<M>>()
    const tasks = useRef<Record<number, NodeJS.Timeout>>({})

    useEffect(() => {
        if (!model) return;
        setFrame({
            state: model.state,
            refer: model.refer,
            route: model.route,
            child: model.child
        })
        return FrameUtil.bind(
            model.proxy.event.onChange, 
            (that: M, event: Event<Frame<M>>) => {
                const time = FrameUtil.time;
                const frame: Frame<M> = {
                    state: that.state,
                    refer: that.refer,
                    route: that.route,
                    child: that.child
                }
                if (tasks.current[time]) clearTimeout(tasks.current[time]);
                tasks.current[time] = setTimeout(() => setFrame(frame), time);
            }
        )
    }, [model])

    return frame;
}