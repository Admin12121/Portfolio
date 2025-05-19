import React from 'react'
import dynamic from 'next/dynamic'

const Document = dynamic(() => import("./_compoents"));


const page = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}) => {
    const slug = (await params).slug;
    return (
        <div className="w-full container border-b border-x mx-auto min-h-[95vh] px-10">
            <Document params={slug} />
        </div>
    )
}

export default page