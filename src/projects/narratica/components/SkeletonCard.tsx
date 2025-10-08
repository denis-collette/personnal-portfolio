import React from 'react';

const SkeletonCard = () => {
    return (
        <section className='rounded-lg bg-neutral-800/50 w-full shadow-lg animate-pulse'>
            <section className='relative w-full aspect-square'>
                <section className='rounded-t-lg p-2 w-full h-full bg-neutral-700/50' />
            </section>
            <section className='p-3 space-y-2'>
                <section className='h-4 bg-neutral-700/50 rounded w-3/4' />
                <section className='h-3 bg-neutral-700/50 rounded w-1/2' />
            </section>
        </section>
    )
}

export default SkeletonCard;