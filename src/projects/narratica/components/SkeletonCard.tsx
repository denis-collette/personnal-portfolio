import React from 'react';

const SkeletonCard = () => {
    return (
        <section className='rounded-lg bg-narratica-gray-light/50 w-full shadow-lg animate-pulse'>
            <section className='relative w-full aspect-square'>
                <section className='rounded-t-lg p-2 w-full h-full bg-narratica-gray-dark/50' />
            </section>
            <section className='p-3 space-y-2'>
                <section className='h-4 bg-narratica-gray-dark/50 rounded w-3/4' />
                <section className='h-3 bg-narratica-gray-dark/50 rounded w-1/2' />
            </section>
        </section>
    )
}

export default SkeletonCard;