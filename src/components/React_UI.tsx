export function Liste_element({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <div className='flex-1'>
            <h3 className="bebas-neue-regular text-[40px]" style={{ lineHeight: 1 }}>{title}</h3>
            <span className='text-xl inter'>{children}</span>
        </div>
    )
}