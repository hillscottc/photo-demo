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
    <div style={{padding: '20px'}}>
      <img src={download_url} 
      width={big ? '300px' :'200px'} 
      height={big ? '200px' :'133px'} 
      alt=""
      onClick={() => setBig(!big)} 
      />
    </div>
  )
}
