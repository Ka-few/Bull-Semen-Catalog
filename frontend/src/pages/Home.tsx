import { Link } from 'react-router-dom';
import { ShieldCheck, Stethoscope, ShoppingBag, ArrowRight, ArrowUpRight, BookOpen, Star } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col gap-16 md:gap-24 pb-20 animate-fade-in">
            {/* Hero Section */}
            <section className="relative pt-12 md:pt-20 lg:pt-32 pb-16 px-4">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden -z-10">
                    <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#dce6cc]/70 blur-3xl opacity-70" />
                    <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#ead9ca]/65 blur-3xl opacity-70" />
                </div>

                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e9efdf] border border-[#dce6cc] text-[#24543c] text-sm font-bold mb-4 shadow-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        Premium Genetics Marketplace
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#26352d] tracking-tight leading-[1.1]">
                        Elevate Your Herd with <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24543c] via-[#71834b] to-[#a65d3b]">
                            Superior Genetics
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        The premier digital platform connecting dairy farmers to elite bull semen and verified veterinary AI technicians across the country.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link
                            to="/catalog"
                            className="w-full sm:w-auto px-8 py-4 bg-[#24543c] hover:bg-[#173b2a] text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            Browse Catalog <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl font-bold text-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            Join as Farmer
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Verified Quality</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Access high-yield bull semen from top breeders. Every catalog entry includes detailed genetic merit, yield stats, and calving ease data.
                            </p>
                        </div>

                        <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Stethoscope className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Certified Vets</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Easily find, compare, and book licensed Veterinary AI Technicians in your local county. Transparent ratings and service fees.
                            </p>
                        </div>

                        <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ShoppingBag className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Seamless Logistics</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Integrated checkout lets you purchase semen, assign a vet, and select a nearby agri-supplier depot for secure cold-chain pickup.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1.05fr] overflow-hidden rounded-2xl bg-[#173b32] text-white">
                    <div className="flex flex-col justify-center items-start p-8 sm:p-12 lg:p-16">
                        <div className="flex items-center gap-2 text-[#d2e66f] text-sm font-bold uppercase tracking-[0.12em]">
                            <BookOpen className="w-4 h-4" /> Field notes
                        </div>
                        <h2 className="mt-5 max-w-lg text-3xl sm:text-4xl font-black leading-tight">
                            Better breeding starts with better decisions.
                        </h2>
                        <p className="mt-4 max-w-md text-white/75 leading-relaxed">
                            Practical guidance on genetics, reproductive health, and building a stronger herd.
                        </p>
                        <Link to="/articles" className="mt-8 inline-flex items-center gap-2 font-bold text-[#d2e66f] hover:text-white transition-colors">
                            Explore the journal <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <img
                        src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1400&q=85"
                        alt="Cattle grazing in a green pasture"
                        className="h-64 md:h-full min-h-72 w-full object-cover"
                    />
                </div>
            </section>
        </div>
    );
};

export default Home;
