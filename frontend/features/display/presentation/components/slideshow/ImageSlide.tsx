interface ImageSlideProps {
    url: string;
}

export default function ImageSlide({ url }: ImageSlideProps) {
    return (
        <>
            <img src={url} className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 brightness-50" alt="" />
            <img src={url} className="relative z-10 w-full h-full object-contain object-center" alt="" />
        </>
    );
}