import React from 'react';
import { Street, streetStand, LEG_LEN, Glow, Dust } from '../../engine';
import { XoiCart } from './che-xoi-cart-and-money-props';

// The mouth of the alley at dawn: the VN street set (warm, low sun at the end of the street) with a pink-gold wash,
// and mum's xôi cart on the left sidewalk. CART gives the cart's ground point and the hero scale that matches it.

const P = streetStand(-5.0, 6, { sidewalk: true });
export const CART = { x: P.x, y: P.y + LEG_LEN * P.scale, s: P.scale };

/** The street at dawn; `blur` puts it out of focus for mediums (draw the cart and people on top, same camera). */
export const DawnAlley: React.FC<{ t: number; id: string; blur?: number; cart?: boolean }> = ({ t, id, blur = 0, cart = false }) => (
  <g>
    <g filter={blur ? `url(#blur${blur})` : undefined}>
      <Street t={t} id={id} market={0.25} veil={0.28} />
      <rect x={-400} y={-300} width={2720} height={1700} fill="#FFB890" opacity={0.14} style={{ mixBlendMode: 'screen' }} />
    </g>
    <Glow x={960} y={480} r={620} o={0.28} />
    {cart ? <XoiCart x={CART.x} y={CART.y} s={CART.s} t={t} /> : null}
  </g>
);

/** Morning motes in the low sun, over the cart. */
export const DawnMotes: React.FC<{ t: number; seed: number }> = ({ t, seed }) => <Dust t={t} seed={seed} x0={CART.x - 300} y0={CART.y - 420} w={900} h={460} n={22} o={0.5} />;
