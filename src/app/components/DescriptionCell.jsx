import React, { useState } from 'react';


const MAX_WORDS = 10;

const DescriptionCell = ({ description }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const words = description.split(' ');
    return (
        <>
            {description && (
                <>
                    {showFullDescription ? (
                        <div className='flex flex-col gap-[10px]'>
                            {description}
                            <span style={{  cursor: 'pointer' }} className='text-[#cfaa4d] font-[600] hover:opacity-80' onClick={() => setShowFullDescription(false)}>Read less</span>
                        </div>
                    ) : words.length > MAX_WORDS ? (
                        <>
                            {words.slice(0, MAX_WORDS).join(' ')}...
                            <span style={{  cursor: 'pointer' }} className='text-[#cfaa4d] font-[600] hover:opacity-80' onClick={() => setShowFullDescription(true)}>Read more</span>
                        </>
                    ) : (
                        <>
                            {description}
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default DescriptionCell