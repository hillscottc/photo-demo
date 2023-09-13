import React, { useState } from 'react';

export type PhotoProps = {
  id: string,
  download_url: string,
}

export const Photo = ({
  id,
  download_url,
}: PhotoProps) => {
  const [big, setBig] = useState(false) 
  return (
    <div>
      <img src={download_url} 
      width={!big ? '200px' :'300px'} 
      height={!big ? '133px' :'200px'} 
      alt=""
      onClick={() => setBig(!big)} 
      />
    </div>
  )
}
