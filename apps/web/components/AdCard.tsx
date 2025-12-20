import React from 'react';

type Ad = {
  id: string;
  name: string;
  intro: string;
};

type Props = {
  ad: Ad;
  onShowDetail: () => void;
  onStartChat: () => void;
};

export const AdCard = ({ ad, onShowDetail, onStartChat }: Props) => {
  return (
    <div className="ad-card">
      <h3>{ad.name}</h3>
      <p>{ad.intro}</p>

      <button onClick={onShowDetail}>Zobraziť inzerát</button>
      <button onClick={onStartChat}>Začať chat</button>
    </div>
  );
};
