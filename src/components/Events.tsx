
import image from '../assets/image/rec_1.png';

export function EventsItemsLarge() {
    return (
        <div className="w-full aspect-[3/4] lg:w-[458px] lg:h-[514px] relative overflow-hidden rounded-2xl lg:rounded-3xl animation_hover">
            <div className="w-full h-full absolute top-0 left-0">
                <img src={image.src} alt="Events" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 lg:p-8">
                <h1 className='text-3xl font-bold text-white w-[80%] mb-4'>Compétition des jeunes U20 </h1>
                <p className='text-white'>Mardi 24 mars, 2026 <br />12h 30 - Limoge</p>
            </div>
        </div>
    );
}

export function EventsItemsSmall() {
    return (
        <div className="w-full h-auto lg:w-[326px] lg:h-[469px] animation_hover">
            <div className='rounded-3xl overflow-hidden w-full aspect-square lg:w-[326px] lg:h-[328px]'>
                <img src={image.src} alt="Events" className="w-full h-full object-cover" />
            </div>
            <div className='p-4'>
                <h1 className='text-3xl font-extrabold text-black  mb-4 inter' style={{ lineHeight: 1 }}>Compétition des jeunes U20 </h1>
                <p className='text-black inter'>Mardi 24 mars, 2026 <br />12h 30 - Limoge</p>
            </div>
        </div>
    );
}

export function EventsSection() {
    return (
        <div className="flex flex-col lg:flex-row items-top gap-[21px]">
            <EventsItemsLarge />
            <EventsItemsSmall />
            <EventsItemsSmall />
        </div>
    )
}

export function Stats({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <div className='max-w-87.5 w-fit flex flex-col lg:block justify-between items-center gap-4 lg:gap-0'>
            <h3 className='bebas-neue-regular text-8xl lg:text-[128px] text-center lg:text-left uppercase  mb-2' style={{ lineHeight: 0.9 }}>{title}</h3>
            <div className='w-[70%] lg:w-full flex justify-center lg:justify-start items-center'>
                <span className='inter text-2xl lg:text-4xl text-center lg:text-left font-bold'>{children}</span>
            </div>
        </div>
    )
}