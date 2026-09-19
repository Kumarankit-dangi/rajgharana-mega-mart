import { Icon, SectionHeading } from "./ui";
import { Reveal } from "./Reveal";

const HIGHLIGHTS = [
  {
    icon: Icon.Family,
    title: "Family Shopping",
    text: "Women, men and kids — everyone in the family finds their style under one roof.",
  },
  {
    icon: Icon.Sparkles,
    title: "Latest Fashion",
    text: "Contemporary cuts, trending colours and fusion silhouettes, refreshed through the season.",
  },
  {
    icon: Icon.Lamp,
    title: "Ethnic Collection",
    text: "Lehengas, sarees, sherwanis and kurta sets rooted in Indian craftsmanship.",
  },
  {
    icon: Icon.Tag,
    title: "New Arrivals",
    text: "Fresh styles arrive regularly — visit often or follow us to catch them first.",
  },
  {
    icon: Icon.Diamond,
    title: "Festival Collection",
    text: "Curated edits for Chhath, Diwali, Holi, Eid and the wedding season.",
  },
  {
    icon: Icon.Shield,
    title: "Quality Products",
    text: "Carefully selected fabrics and finishing, checked before they reach our racks.",
  },
];

export function Highlights() {
  return (
    <section className="relative overflow-hidden bg-maroon-900 py-16 text-cream-50 sm:py-24">
      <div className="dots-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="glow-maroon pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full" aria-hidden="true" />
      <div className="glow-gold-soft pointer-events-none absolute -bottom-40 -left-40 h-[34rem] w-[34rem] rounded-full" aria-hidden="true" />

      <div className="container-x relative">
        <SectionHeading
          eyebrow="Why Rajgharana"
          title="Everything your family needs, beautifully in one place"
          description="From daily wear to wedding trousseaus, Rajgharana Mega Mart brings together the styles Nawada loves."
          light
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={i * 70} className="h-full">
              <div className="group h-full rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-500 hover:-translate-y-1 hover:border-gold-400/50 hover:bg-white/10">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-400 text-maroon-950 shadow-soft transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <h.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-cream-50">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-200/80">{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
