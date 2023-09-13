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
    <div className='photoDiv'>
      <img 
      src={download_url} 
      className={big ? 'photo_big' : 'photo'}
      alt=""
      onClick={() => setBig(!big)} 
      />
    </div>
  )
}

