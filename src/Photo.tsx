import React from 'react';

export type PhotoProps = {
  id: string,
  author: string,
  width: string,
  height: string,
  url: string,
  download_url: string,
}

export const Photo = ({
  id,
  author,
  width,
  height,
  url,
  download_url,
}: PhotoProps) => (
  <div>
    <img src={download_url} width={width} height={height} alt="" />
  </div>
)
