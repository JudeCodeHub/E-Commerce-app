import { categories } from "@/assets/assets";

const CategoriesMarquee = () => {

    return (
        <div className="overflow-hidden w-full relative max-w-[1600px] mx-auto select-none group sm:my-20">
            <div className="absolute left-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-r from-neutral-950 to-transparent" />
            <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-3" >
                {[...categories, ...categories, ...categories, ...categories].map((company, index) => (
                    <button key={index} className="px-6 py-2.5 bg-[#232257] border border-[#33306e] rounded-full text-slate-200 font-medium text-xs sm:text-sm hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500 active:scale-95 transition-all duration-300">
                        {company}
                    </button>
                ))}
            </div>
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-neutral-950 to-transparent" />
        </div>
    );
};

export default CategoriesMarquee;