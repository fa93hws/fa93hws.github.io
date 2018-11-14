import React from 'react';
import { Link } from 'react-router-dom';

import { ILabelModel } from '@/models/label';
import './style.less';

function calculateTextColor(hex: string) {
  const hexRGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (hexRGB === undefined || hexRGB.length != 4)
    throw new Error(`color ${hex} is not correct in label component`);
  const rgb = hexRGB
  .filter((_, idx) => idx !== 0)
  .map(h => parseInt(h, 16));

  // http://www.w3.org/TR/AERT#color-contrast
  const o = Math.round(
    (
      (rgb[0] * 299) +
      (rgb[1] * 587) +
      (rgb[2] * 114)
    ) / 1000
  );
  return o > 125 ? 'black' : 'white';
}

const Label = ({ label }: { label: ILabelModel }) => (
  <Link to={`/label/${label.name}`} className="db">
    <p
      className="lt-label__wrapper"
      style={{
        background: '#' + label.color,
        color: calculateTextColor(label.color)
      }}
    >
      {label.name}
    </p>
  </Link>
);

export default Label;