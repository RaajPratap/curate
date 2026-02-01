'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { useAppSelector } from '@/store/hooks'
import { selectCartCount } from '@/store/slices/cartSlice'

const teamMembers = [
  {
    name: 'Arjun Mehta',
    role: 'Founder & CEO',
    bio: 'Former fashion industry veteran who left to build a sustainable alternative.',
    image: '/team/arjun.jpg',
  },
  {
    name: 'Priya Sharma',
    role: 'Creative Director',
    bio: 'Award-winning designer focused on zero-waste pattern making.',
    image: '/team/priya.jpg',
  },
  {
    name: 'Vikram Rao',
    role: 'Head of Sustainability',
    bio: 'Environmental scientist ensuring our practices match our promises.',
    image: '/team/vikram.jpg',
  },
  {
    name: 'Ananya Patel',
    role: 'Operations Lead',
    bio: 'Building ethical supply chains across South Asia.',
    image: '/team/ananya.jpg',
  },
]

const values = [
  {
    title: 'Radical Transparency',
    description:
      'We share everything—our costs, our margins, our factory conditions. No greenwashing, just facts.',
    icon: '👁️',
  },
  {
    title: 'Planet First',
    description:
      "Every decision we make starts with one question: what's the impact on the environment?",
    icon: '🌍',
  },
  {
    title: 'Fair for All',
    description:
      'Living wages, safe conditions, and respect for every person in our supply chain.',
    icon: '🤝',
  },
  {
    title: 'Quality Over Quantity',
    description:
      'We make clothes meant to last years, not seasons. Buy less, choose better.',
    icon: '✨',
  },
]

const timeline = [
  {
    year: '2024',
    title: 'The Beginning',
    description:
      'CURATE was born from frustration with fast fashion and a vision for something better.',
  },
  {
    year: '2024',
    title: 'First Collection',
    description:
      'Launched our debut collection with 100% recycled materials. Sold out in 48 hours.',
  },
  {
    year: '2025',
    title: 'Carbon Neutral',
    description:
      'Achieved carbon neutral operations across all aspects of our business.',
  },
  {
    year: '2025',
    title: 'Circular Program',
    description:
      'Launched our take-back program, giving old clothes new life.',
  },
  {
    year: '2026',
    title: 'Today',
    description:
      'Growing community of 50,000+ conscious consumers choosing sustainable style.',
  },
]

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '12.4T', label: 'kg CO₂ Offset' },
  { value: '2.5M', label: 'Liters Water Saved' },
  { value: '15K', label: 'Trees Planted' },
]

export default function AboutPage() {
  const cartCount = useAppSelector(selectCartCount)

  return (
    <main className="min-h-screen">
      <Header cartCount={cartCount} />

      {/* Hero */}
      <section className="py-24 border-b border-border">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="accent" className="mb-6">
                Our Story
              </Badge>
              <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tighter mb-6">
                FASHION
                <br />
                <span className="text-accent">REIMAGINED</span>
              </h1>
              <p className="font-mono text-lg text-foreground-muted mb-8">
                We started CURATE because we believed streetwear could be bold, 
                beautiful, and kind to the planet. No compromises.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button variant="brutal">Shop Now</Button>
                </Link>
                <Link href="/sustainability">
                  <Button variant="secondary">Our Impact</Button>
                </Link>
              </div>
            </div>
            <div className="h-96 bg-background-secondary border border-border flex items-center justify-center">
              <span className="font-mono text-foreground-muted">BRAND IMAGE</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-12 bg-accent text-black">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold">{stat.value}</div>
                <div className="font-mono text-sm uppercase tracking-wider opacity-80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-24 border-b border-border">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl font-bold tracking-tighter mb-8">
              OUR MISSION
            </h2>
            <p className="font-mono text-xl text-foreground-muted leading-relaxed mb-8">
              "To prove that fashion can be a force for good. We're building a brand that 
              puts people and planet alongside profit—because that's the only way forward."
            </p>
            <p className="font-mono text-sm text-accent uppercase tracking-wider">
              — Arjun Mehta, Founder
            </p>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-24 bg-background-secondary">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tighter text-center mb-12">
            WHAT WE STAND FOR
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} variant="hover">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-display text-lg font-bold tracking-tighter mb-2">
                    {value.title}
                  </h3>
                  <p className="font-mono text-sm text-foreground-muted">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-24 border-b border-border">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tighter text-center mb-12">
            OUR JOURNEY
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div
                      className={`p-6 border border-border bg-background hover:border-accent transition-colors ${
                        index % 2 === 0 ? 'md:text-right' : ''
                      }`}
                    >
                      <span className="font-mono text-xs text-accent uppercase tracking-wider">
                        {item.year}
                      </span>
                      <h3 className="font-display text-xl font-bold tracking-tighter mt-1 mb-2">
                        {item.title}
                      </h3>
                      <p className="font-mono text-sm text-foreground-muted">{item.description}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 top-6 w-3 h-3 bg-accent -translate-x-[5px] md:-translate-x-1.5" />

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-24 bg-background-secondary">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tighter text-center mb-4">
            THE TEAM
          </h2>
          <p className="font-mono text-foreground-muted text-center max-w-xl mx-auto mb-12">
            A small, passionate team committed to changing fashion for good.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name} variant="hover">
                <CardContent className="p-0">
                  <div className="h-48 bg-background border-b border-border flex items-center justify-center">
                    <span className="font-mono text-foreground-muted text-sm">PHOTO</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-bold tracking-tighter">
                      {member.name}
                    </h3>
                    <p className="font-mono text-xs text-accent uppercase tracking-wider mb-2">
                      {member.role}
                    </p>
                    <p className="font-mono text-sm text-foreground-muted">{member.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Manufacturing */}
      <section className="py-24 border-b border-border">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="h-80 bg-background-secondary border border-border flex items-center justify-center order-2 lg:order-1">
              <span className="font-mono text-foreground-muted">FACTORY IMAGE</span>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="font-display text-3xl font-bold tracking-tighter mb-6">
                MADE WITH CARE
              </h2>
              <p className="font-mono text-foreground-muted mb-6">
                Every CURATE piece is crafted in our partner facilities in Tamil Nadu and 
                Gujarat, where workers earn living wages and work in safe, dignified conditions.
              </p>
              <ul className="space-y-3">
                {[
                  'Fair Trade certified factories',
                  'Regular third-party audits',
                  'Living wages for all workers',
                  'No child labor, ever',
                  'Healthcare and education support',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="text-accent">→</span>
                    <span className="font-mono text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Press */}
      <section className="py-16 bg-background-secondary">
        <Container>
          <h2 className="font-mono text-xs uppercase tracking-widest text-foreground-muted text-center mb-8">
            As Featured In
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {['VOGUE', 'GQ INDIA', 'ELLE', 'FORBES', 'HYPEBEAST'].map((pub) => (
              <span key={pub} className="font-display text-2xl font-bold tracking-tighter">
                {pub}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl font-bold tracking-tighter mb-6">
              JOIN THE MOVEMENT
            </h2>
            <p className="font-mono text-foreground-muted mb-8">
              Every purchase is a choice. Choose to support sustainable fashion, fair wages, 
              and a healthier planet. Choose CURATE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button variant="brutal" size="lg">
                  Shop the Collection
                </Button>
              </Link>
              <Link href="/sustainability">
                <Button variant="secondary" size="lg">
                  Read Impact Report
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
