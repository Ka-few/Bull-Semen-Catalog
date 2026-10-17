import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Clock3, Search } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

type Article = {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    imageAlt: string;
    featured?: boolean;
    paragraphs: string[];
};

const articles: Article[] = [
    {
        slug: 'choosing-genetics-for-your-herd-goals',
        title: 'Choose genetics that fit the herd you want to build',
        excerpt: 'A practical way to turn breeding goals into a shortlist of traits, without losing sight of the cows already in your shed.',
        category: 'Genetics',
        author: 'Dr. Miriam Wanjiku',
        date: 'October 2, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1500&q=85',
        imageAlt: 'Dairy cows standing together on a farm',
        featured: true,
        paragraphs: [
            'A breeding plan works best when it starts with a clear picture of the herd you are trying to build. Before comparing bulls, write down the outcomes that matter most on your farm: reliable fertility, manageable calving, milk solids, longevity, or a combination of these.',
            'Then look at your current cows. Identify strengths worth protecting and weaknesses that should not be repeated. Matching a bull to an individual cow is more useful than choosing a single favourite sire for every mating.',
            'Genetic indexes help narrow the field, but the figures need context. Compare bulls on the traits connected to your goals, check the reliability of their evaluations, and consider how much variation you are comfortable introducing into the next generation.',
            'Keep the plan simple enough to use consistently. Review results each season, note which matings worked, and adjust gradually as your herd changes. Good decisions compound over generations.'
        ]
    },
    {
        slug: 'semen-handling-cold-chain-basics',
        title: 'From depot to tank: the essentials of semen handling',
        excerpt: 'Small temperature swings can compromise a straw. Keep these cold-chain basics in mind from collection through insemination day.',
        category: 'Farm practice',
        author: 'Peter Mwangi, AI Technician',
        date: 'September 18, 2026',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1100&q=85',
        imageAlt: 'Open farmland under a bright morning sky',
        paragraphs: [
            'Frozen semen depends on an unbroken cold chain. Plan collection before you visit the storage tank, keep the canister in the neck only briefly, and return it below the frost line as soon as you have selected the straw.',
            'Thawing instructions vary by supplier, so follow the protocol that comes with the semen. Use a clean, insulated thaw unit and a timer rather than estimating by eye. Avoid water that is too cool or too hot, and protect the straw from direct sunlight and wind once it is thawed.',
            'Keep a simple inventory of tank levels, canister positions, and doses used. If a tank has been tilted, damaged, or left open, contact your supplier or technician before using the stock.'
        ]
    },
    {
        slug: 'spotting-heat-and-timing-service',
        title: 'Recognising heat early makes timing easier',
        excerpt: 'A consistent observation routine helps you catch behavioural signs and coordinate service at the right time.',
        category: 'Herd health',
        author: 'Dr. Miriam Wanjiku',
        date: 'September 4, 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1100&q=85',
        imageAlt: 'A cow resting in a grassy field',
        paragraphs: [
            'Standing to be mounted is one of the clearest signs of heat, but it is not the only one. Increased activity, mounting other cattle, clear mucus, and a change in appetite can all be useful clues when considered together.',
            'Observe the herd at calm times when cattle are likely to show normal behaviour. Short checks morning and evening are more reliable than one long check in the middle of a busy day. Record what you see and when it happened.',
            'A written heat record gives you and your AI technician a shared timeline. If signs are uncertain or cycles are irregular, ask a veterinarian to help assess the animal before changing the breeding plan.'
        ]
    },
    {
        slug: 'calving-ease-for-heifers',
        title: 'Why calving ease deserves a place in heifer matings',
        excerpt: 'Matching sire selection to the age and size of the dam can reduce avoidable stress around first calving.',
        category: 'Breeding',
        author: 'Grace Njeri, Livestock Advisor',
        date: 'August 21, 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1100&q=85',
        imageAlt: 'Young calf standing beside its mother',
        paragraphs: [
            'First calving is a demanding transition for a heifer. Sire choice is one part of preparation, alongside appropriate growth, nutrition, observation, and a plan for getting help when needed.',
            'Look for calving-ease information where it is available and interpret it using the evaluation scale for that breed. Avoid comparing figures across systems without checking what each score means.',
            'Keep an eye on the heifer as calving approaches and make sure a trained person can assess her if labour does not progress. A good mating decision supports, but never replaces, attentive care.'
        ]
    },
    {
        slug: 'keeping-breeding-records-that-help',
        title: 'The breeding records worth keeping this season',
        excerpt: "A few consistent records can reveal repeat patterns and make next season's choices more informed.",
        category: 'Farm practice',
        author: 'Grace Njeri, Livestock Advisor',
        date: 'August 8, 2026',
        readTime: '3 min read',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1100&q=85',
        imageAlt: 'Green fields stretching across a farm landscape',
        paragraphs: [
            'Useful breeding records do not need to be complicated. Start with animal identification, observed heat dates, service dates, sire used, and the outcome of each pregnancy check.',
            'Record problems as they happen rather than relying on memory at the end of the season. Consistent notes can help a veterinarian spot patterns and help you evaluate whether your breeding goals are being met.',
            'Choose a format you will keep using: a notebook, spreadsheet, or digital system. The best record is the one that is accurate, easy to find, and reviewed before the next breeding decision.'
        ]
    }
];

const categories = ['All stories', ...new Set(articles.map((article) => article.category))];

function ArticleCard({ article }: { article: Article }) {
    return (
        <Link to={`/articles/${article.slug}`} className="group flex h-full flex-col border-t border-[#d7ddd3] pt-4">
            <div className="overflow-hidden bg-[#e6e9df] aspect-[1.55]">
                <img src={article.image} alt={article.imageAlt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </div>
            <div className="flex items-center justify-between gap-3 pt-4 text-xs font-bold uppercase tracking-wider text-[#617066]">
                <span>{article.category}</span>
                <span className="flex shrink-0 items-center gap-1 normal-case tracking-normal font-medium"><Clock3 className="h-3.5 w-3.5" />{article.readTime}</span>
            </div>
            <h3 className="mt-2 text-xl font-bold leading-snug text-[#173b32] group-hover:text-[#9a4e2b] transition-colors">{article.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[#58625b]">{article.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#9a4e2b]">Read article <ArrowUpRight className="h-4 w-4" /></span>
        </Link>
    );
}

function ArticleDetail({ article }: { article: Article }) {
    return (
        <article className="mx-auto max-w-4xl pb-16">
            <Link to="/articles" className="inline-flex items-center gap-2 text-sm font-bold text-[#49645a] hover:text-[#9a4e2b]">
                <ArrowLeft className="h-4 w-4" /> All articles
            </Link>
            <header className="py-10 sm:py-14">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#9a4e2b]">{article.category}</p>
                <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.08] text-[#173b32] sm:text-6xl">{article.title}</h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#58625b]">{article.excerpt}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#617066]">
                    <span className="font-bold text-[#173b32]">{article.author}</span>
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1"><Clock3 className="h-4 w-4" />{article.readTime}</span>
                </div>
            </header>
            <img src={article.image} alt={article.imageAlt} className="aspect-[16/8] w-full object-cover" />
            <div className="mx-auto max-w-2xl pt-9 sm:pt-12">
                {article.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mb-6 text-lg leading-[1.85] text-[#36423b]">{paragraph}</p>
                ))}
                <div className="mt-12 border-t border-[#d7ddd3] pt-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9a4e2b]">More from the journal</p>
                    <Link to="/articles" className="mt-3 inline-flex items-center gap-2 text-lg font-bold text-[#173b32] hover:text-[#9a4e2b]">
                        Browse all articles <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

const Articles = () => {
    const { slug } = useParams();
    const [activeCategory, setActiveCategory] = useState('All stories');
    const [query, setQuery] = useState('');

    if (slug) {
        const article = articles.find((item) => item.slug === slug);
        return article ? <ArticleDetail article={article} /> : (
            <div className="py-24 text-center">
                <h1 className="text-3xl font-black text-[#173b32]">Article not found</h1>
                <Link to="/articles" className="mt-4 inline-flex items-center gap-2 font-bold text-[#9a4e2b]">Back to articles <ArrowRight className="h-4 w-4" /></Link>
            </div>
        );
    }

    const filteredArticles = articles.filter((article) => {
        const matchesCategory = activeCategory === 'All stories' || article.category === activeCategory;
        const searchableText = `${article.title} ${article.excerpt} ${article.category} ${article.author}`.toLowerCase();
        return matchesCategory && searchableText.includes(query.trim().toLowerCase());
    });
    const [featuredArticle, ...moreArticles] = filteredArticles;

    return (
        <div className="mx-auto max-w-6xl pb-16 text-[#173b32]">
            <header className="border-b border-[#d7ddd3] pb-8 pt-4 sm:pb-10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9a4e2b]">
                    <BookOpen className="h-4 w-4" /> PrimeGenetics journal
                </div>
                <div className="mt-4 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <h1 className="max-w-3xl text-4xl font-black leading-[1.06] sm:text-6xl">Good decisions grow good herds.</h1>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#58625b] sm:text-lg">Field-tested ideas on breeding, genetics, and the everyday work of raising healthier cattle.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#617066]">
                        <span className="h-px w-8 bg-[#9a4e2b]" /> Knowledge for the long run
                    </div>
                </div>
            </header>

            <div className="flex flex-col gap-4 border-b border-[#d7ddd3] py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter articles by category">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setActiveCategory(category)}
                            aria-pressed={activeCategory === category}
                            className={`shrink-0 border px-3 py-2 text-sm font-semibold transition-colors ${activeCategory === category ? 'border-[#173b32] bg-[#173b32] text-white' : 'border-[#d7ddd3] text-[#49645a] hover:border-[#173b32]'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <label className="flex h-10 w-full items-center gap-2 border border-[#d7ddd3] bg-white px-3 sm:w-64">
                    <Search className="h-4 w-4 shrink-0 text-[#617066]" />
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search articles"
                        aria-label="Search articles"
                        className="min-w-0 flex-1 bg-transparent text-sm text-[#173b32] outline-none placeholder:text-[#89948d]"
                    />
                </label>
            </div>

            {featuredArticle ? (
                <>
                    <Link to={`/articles/${featuredArticle.slug}`} className="group grid gap-6 border-b border-[#d7ddd3] py-7 sm:py-9 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
                        <div className="order-2 flex flex-col justify-center md:order-1">
                            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#9a4e2b]">
                                <span>{featuredArticle.category}</span><span className="h-px w-7 bg-[#d6a04b]" /><span>Editor&apos;s pick</span>
                            </div>
                            <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight group-hover:text-[#9a4e2b] transition-colors sm:text-4xl">{featuredArticle.title}</h2>
                            <p className="mt-4 max-w-xl leading-relaxed text-[#58625b]">{featuredArticle.excerpt}</p>
                            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#617066]">
                                <span className="font-bold text-[#173b32]">{featuredArticle.author}</span>
                                <span>{featuredArticle.date}</span>
                                <span className="flex items-center gap-1"><Clock3 className="h-4 w-4" />{featuredArticle.readTime}</span>
                            </div>
                            <span className="mt-7 inline-flex items-center gap-2 font-bold text-[#9a4e2b]">Read the story <ArrowUpRight className="h-4 w-4" /></span>
                        </div>
                        <div className="order-1 aspect-[1.35] overflow-hidden bg-[#e6e9df] md:order-2">
                            <img src={featuredArticle.image} alt={featuredArticle.imageAlt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                        </div>
                    </Link>
                    {moreArticles.length > 0 && (
                        <section className="pt-8 sm:pt-10">
                            <div className="mb-5 flex items-end justify-between gap-4">
                                <h2 className="text-2xl font-black">Latest stories</h2>
                                <span className="text-sm text-[#617066]">{filteredArticles.length} articles</span>
                            </div>
                            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                                {moreArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
                            </div>
                        </section>
                    )}
                </>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-lg font-bold">No stories match that search.</p>
                    <button type="button" onClick={() => { setQuery(''); setActiveCategory('All stories'); }} className="mt-3 text-sm font-bold text-[#9a4e2b]">Clear filters</button>
                </div>
            )}
        </div>
    );
};

export default Articles;