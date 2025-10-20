import { AnimeUtil, GameModel, SelectUtil } from "hearthstone-core";
import { useEffect, useState } from "react";
import { Model } from "set-piece";

export class Option {
    public readonly code: string;
    public readonly hint: string;
    public readonly desc: string;
        
    public readonly handler: () => void;

    constructor(options: {
        hint: string;
        code: string;
        desc: string;
    }, handler: () => void) {
        this.hint = options.hint;
        this.code = options.code;
        this.desc = options.desc;
        this.handler = handler;
    }
}

export function useOption(game?: GameModel) {
    const [options, setOptions] = useState<Option[]>([]);
    const turn = game?.child.turn;
    const current = turn?.refer.current;

    const refresh = () => {
        const result: Option[] = [];
        if (!current) return result;
        const selector = SelectUtil.current
        if (selector?.options) {
            selector.options.forEach(item => {
                const name = item instanceof Model ? item.name : String(item);
                const uuid = item instanceof Model ? item.uuid : String(item);
                let desc = '';
                if (typeof selector.desc === 'function') desc = selector.desc(item);
                else desc = `Select ${name}${selector.desc ? ` (${selector.desc})` : ''}`;
                result.push(new Option({
                    hint: `Select ${name}`,
                    code: `select-${uuid}`,
                    desc
                }, span(() => SelectUtil.set(item))));
            });
            result.push(new Option({
                hint: 'Cancel',
                code: 'cancel',
                desc: 'Cancel'
            }, span(() => SelectUtil.set(undefined))));
        } else {
            // base
            result.push(new Option({
                hint: 'End Turn',
                code: 'end-turn',
                desc: 'End Turn'
            }, span(() => turn.next())));
            // play
            const cards = current.child.hand.refer.queue;
            cards.forEach((item, index) => {
                if (!item.status) return;
                result.push(new Option({
                    hint: `Play ${item.name}`,
                    code: `play-${item.uuid}`,
                    desc: `Play Card ${item.name}`
                }, span(() => item.play())));
            });
            // attack
            const roles = current.query();
            roles.forEach(item => {
                const action = item.child.action;
                if (!action.status) return;
                result.push(new Option({
                    hint: `Use ${item.name}`,
                    code: `use-${item.uuid}`,
                    desc: `Use ${item.name} to launch an Attack`
                }, span(() => action.run())));
            });
            // skill
            const skill = current.child.hero.child.skill;
            if (skill.status) {
                result.push(new Option({
                    hint: `Use ${skill.name}`,
                    code: `use-skill`,
                    desc: `Use ${skill.name}`
                }, span(() => skill.run())));
            }
        }
        setOptions(result);
    }
    
    const span = (handler: () => void) => {
        return () => {
            AnimeUtil.reset();
            handler();
            AnimeUtil.reset();
            setTimeout(() => refresh());
        }
    }

    useEffect(() => {
        refresh();
    }, [turn?.state.current])

    return {
        options,
        setOptions,
    }
}