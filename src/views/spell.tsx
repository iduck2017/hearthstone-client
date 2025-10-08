import { SpellCardModel } from "hearthstone-core";
import React from "react";
import { ICardView } from "./card";

export function SpellCardView(props: {
    card?: SpellCardModel
}) {
    return <ICardView card={props.card}>
    </ICardView>
}