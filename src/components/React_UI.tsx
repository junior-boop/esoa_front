import { twMerge } from "tailwind-merge"
import { RiArrowLeftLine, RiArrowRightLine } from "./icons"
import { useState, useEffect, useRef } from "react"

/**
 * ============================================
 * PROPRIÉTÉS ASTRO/REACT - GESTION DES STATES
 * ============================================
 * 
 * EN ASTRO, les composants React avec useState/useEffect doivent être hydratés.
 * 
 * DIRECTIVES CLIENT DISPONIBLES:
 * - client:load      → Hydrate immédiatement au chargement (recommandé pour states)
 * - client:idle      → Hydrate après que le navigateur soit inactif
 * - client:visible   → Hydrate seulement quand visible dans la viewport
 * - client:media     → Hydrate selon une media query
 * - client:only      → Rend SEULEMENT sur le client (pas de SSR)
 * 
 * SANS DIRECTIVE CLIENT: Les states seront ignorés et le composant ne sera pas interactif
 * 
 * EXEMPLE D'UTILISATION DANS UN FICHIER .astro:
 * <Slider 
 *   client:load 
 *   imageSrc={...} 
 *   texte=\"\" 
 *   title=\"\"
 * />
 */

export function Liste_element({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <div className='flex-1'>
            <h3 className="bebas-neue-regular text-[40px]" style={{ lineHeight: 1 }}>{title}</h3>
            <span className='text-base lg:text-xl inter'>{children}</span>
        </div>
    )
}

export function React_Container({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={twMerge("max-w-287.5 mx-auto px-4 sm:px-6 lg:px-8", className ? className : "")}>
            {children}
        </div>
    )
}


export function Section({ imageSrc, texte, title }: { imageSrc: string, texte: string, title: string }) {
    return (
        <div className='flex items-start justify-between'>
            <div className='lg:w-[50%]'>
                <h3 className="bebas-neue-regular text-[96px]" style={{ lineHeight: 1 }}>{title}</h3>
                <p className="text-xl">
                    {texte}
                </p>
            </div>
            <div className='lg:w-[500px] lg:h-[500px] overflow-hidden rounded-3xl'>
                <img
                    src={imageSrc}
                    alt='Banniere Image'
                    className='w-full h-full object-cover'
                />
            </div>
        </div>
    )
}


/**
 * Slider Component for Astro
 * 
 * Component React avec gestion d'état pour créer un slider d'images interactif
 * avec animations fluides selon la direction du déplacement.
 * 
 * @param {string | object[]} imageSrc - Image(s) à afficher (chaîne unique ou tableau d'objets {src, alt})
 * @param {string} texte - Texte descriptif (optionnel, non utilisé actuellement)
 * @param {string} title - Titre du slider
 * 
 * @usage
 * Usage dans un fichier .astro:
 * ---
 * import Slider from '../components/React_UI';
 * ---
 * 
 * <!-- Hydratation REQUISE avec une directive client:* pour que les states fonctionnent -->
 * <Slider 
 *   client:load
 *   imageSrc={[
 *     { src: '/image1.jpg', alt: 'Image 1' },
 *     { src: '/image2.jpg', alt: 'Image 2' },
 *     { src: '/image3.jpg', alt: 'Image 3' }
 *   ]}
 *   texte="Description"
 *   title="Mon Slider"
 * />
 * 
 * @directives
 * - client:load - Charge immédiatement (recommandé pour contrôles interactifs)
 * - client:idle - Charge après que le navigateur soit inactif
 * - client:visible - Charge quand le composant est visible dans la viewport
 * 
 * @note
 * Ce composant utilise:
 * - React State (useState) pour gérer l'index actuel et la direction
 * - React Effects (useEffect) pour l'auto-play (5 sec) et les animations
 * - Web Animations API pour les animations fluides
 */
export function Slider({ imageSrc, texte, title }: { imageSrc: { src: string; alt: string }[] | string, texte: string, title: string }) {
    const images = Array.isArray(imageSrc)
        ? imageSrc
        : [{ src: imageSrc, alt: 'Image' }];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [overlayOpacity, setOverlayOpacity] = useState(1);
    const [progress, setProgress] = useState(0); // Progress bar (0-100)
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<Animation | null>(null);
    const intersectionRatioRef = useRef<number>(0); // ← ratio courant
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                const ratio = entry.intersectionRatio;

                intersectionRatioRef.current = ratio; // ← on stocke le ratio

                const opacity = ratio < 0.5 ? 0.8 : 0;
                setOverlayOpacity(opacity);
            },
            { threshold: thresholds }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Autoplay — ne tourne que si ratio === 1
    useEffect(() => {
        const interval = setInterval(() => {
            if (intersectionRatioRef.current < 1) return; // ← bloqué si pas pleinement visible
            setDirection('right');
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [images.length, currentIndex]);

    useEffect(() => {
        if (!imgRef.current) return;
        if (animationRef.current) animationRef.current.cancel();

        const keyframes = direction === 'left'
            ? [{ opacity: 0, transform: 'translateX(-50px)' }, { opacity: 1, transform: 'translateX(0)' }]
            : [{ opacity: 0, transform: 'translateX(50px)' }, { opacity: 1, transform: 'translateX(0)' }];

        animationRef.current = imgRef.current.animate(keyframes, {
            duration: 600,
            easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
            fill: 'forwards'
        });
    }, [currentIndex, direction]);

    const handlePrev = () => {
        setDirection('left');
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setDirection('right');
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div ref={containerRef} className='relative'>
            <div className='overflow-hidden'>
                <img
                    ref={imgRef}
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt}
                    className='w-full lg:h-200 object-cover'
                />
            </div>

            <div
                className='absolute inset-0 bg-black pointer-events-none transition-opacity duration-500'
                style={{ opacity: overlayOpacity }}
            />

            <div
                className='absolute top-0 w-full py-30 h-full flex items-end'
                style={{ pointerEvents: overlayOpacity > 0.5 ? 'none' : 'auto' }}
            >
                <React_Container>
                    <div className='flex lg:justify-end items-end'>
                        <div className='lg:w-[50%] bg-[#fff7] p-6 backdrop-blur-sm'>
                            <h3 className='bebas-neue-regular text-8xl font-bold mb-10'>
                                {title}
                            </h3>
                            <p className='inter text-xl'>
                                {texte}
                            </p>

                            <div className="flex items-center gap-8 mt-10">
                                <button
                                    onClick={handlePrev}
                                    className='bg-black text-white w-[56px] h-[56px] flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors'
                                    style={{ cursor: 'pointer' }}
                                >
                                    <RiArrowLeftLine className="h-8 w-8" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className='bg-black text-white w-[56px] h-[56px] flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors'
                                    style={{ cursor: 'pointer' }}
                                >
                                    <RiArrowRightLine className="h-8 w-8" />
                                </button>
                            </div>

                            <div className='flex gap-2 mt-6 absolute bottom-4 left-1/2'>
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setDirection(index > currentIndex ? 'right' : 'left');
                                            setCurrentIndex(index);
                                        }}
                                        className={`h-2 rounded-full transition-all ${index === currentIndex ? 'bg-black w-24' : 'bg-gray-400 w-2'}`}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </React_Container>
            </div>
        </div>
    );
}