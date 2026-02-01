'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/layout/Container'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { ImpactStats, MaterialBreakdown, CarbonFootprint } from '@/components/sustainability'
import { useAppSelector } from '@/store/hooks'
import { selectCartCount } from '@/store/slices/cartSlice'

const certifications = [
  {
    name: 'GOTS Certified',
    description: 'Global Organic Textile Standard',
    icon: '🌿',
  },
  {
    name: 'Fair Trade',
    description: 'Ethically sourced and produced',
    icon: '🤝',
  },
  {
    name: 'OEKO-TEX',
    description: 'Tested for harmful substances',
    icon: '✓',
  },
  {
    name: 'B Corp',
    description: 'Meeting highest social standards',
    icon: '🏆',
  },
]

const impactMetrics = [
  {
    value: '12,450',
    unit: 'kg',
    label: 'CO₂ Offset',
    description: 'Through reforestation projects',
  },
  {
    value: '2.5M',
    unit: 'liters',
    label: 'Water Saved',
    description: 'Compared to conventional fashion',
  },
  {
    value: '8,200',
    unit: 'kg',
    label: 'Plastic Diverted',
    description: 'From oceans and landfills',
  },
  {
    value: '15,000',
    unit: 'trees',
    label: 'Trees Planted',
    description: 'In partnership with One Tree Planted',
  },
]

const materials = [
  {
    name: 'Recycled Cotton',
    percentage: 35,
    description: 'Post-consumer and post-industrial cotton waste',
    impact: 'Saves 2,700L water per kg',
  },
  {
    name: 'Organic Cotton',
    percentage: 25,
    description: 'GOTS certified organic cotton',
    impact: '46% less carbon emissions',
  },
  {
    name: 'Recycled Polyester',
    percentage: 20,
    description: 'Made from ocean plastic bottles',
    impact: '75% less CO₂ than virgin polyester',
  },
  {
    name: 'Hemp',
    percentage: 12,
    description: 'Naturally grown without pesticides',
    impact: 'Uses 50% less water than cotton',
  },
  {
    name: 'Tencel™',
    percentage: 8,
    description: 'Sustainably sourced wood pulp',
    impact: '100% biodegradable',
  },
]

const initiatives = [
  {
    title: 'Carbon Neutral Shipping',
    description:
      'Every order is shipped carbon neutral. We calculate and offset the emissions from transportation through verified carbon credit projects.',
    icon: '🚚',
    stat: '100%',
    statLabel: 'Orders Offset',
  },
  {
    title: 'Circular Fashion Program',
    description:
      'Return your worn CURATE items and receive store credit. We repair, resell, or recycle every piece to keep clothes out of landfills.',
    icon: '♻️',
    stat: '2,500+',
    statLabel: 'Items Recycled',
  },
  {
    title: 'Zero Waste Packaging',
    description:
      'All our packaging is made from recycled materials and is 100% recyclable or compostable. No plastic, ever.',
    icon: '📦',
    stat: '0',
    statLabel: 'Single-Use Plastic',
  },
  {
    title: 'Fair Wages Initiative',
    description:
      'We pay all workers in our supply chain living wages, verified by third-party audits. Transparency is our priority.',
    icon: '💰',
    stat: '150%',
    statLabel: 'Above Minimum Wage',
  },
]

const timeline = [
  { year: '2024', milestone: 'Founded with sustainability-first mission' },
  { year: '2024', milestone: 'Achieved carbon neutral operations' },
  { year: '2025', milestone: 'Launched circular fashion program' },
  { year: '2025', milestone: 'B Corp certification obtained' },
  { year: '2026', milestone: 'Planted 15,000 trees globally' },
  { year: '2027', milestone: 'Goal: 100% recycled materials' },
]

export default function SustainabilityPage() {
  const cartCount = useAppSelector(selectCartCount)

  return (
    <main className="min-h-screen">
      <Header cartCount={cartCount} />

      {/* Hero Section */}
      <section className="py-24 border-b border-border">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="success" className="mb-6">
              Our Commitment
            </Badge>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6">
              FASHION THAT
              <br />
              <span className="text-accent">DOESN'T COST</span>
              <br />
              THE EARTH
            </h1>
            <p className="font-mono text-lg text-foreground-muted max-w-2xl mx-auto mb-8">
              Every piece we create is designed with the planet in mind. From sourcing to 
              shipping, we're committed to reducing fashion's environmental impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button variant="brutal">Shop Sustainable</Button>
              </Link>
              <Button variant="secondary">Download Impact Report</Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-background-secondary">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tighter text-center mb-12">
            OUR IMPACT IN NUMBERS
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric) => (
              <div key={metric.label} className="text-center p-6 border border-border bg-background">
                <div className="font-display text-4xl md:text-5xl font-bold text-accent mb-1">
                  {metric.value}
                </div>
                <div className="font-mono text-sm text-foreground-muted uppercase tracking-wider mb-2">
                  {metric.unit}
                </div>
                <div className="font-mono text-sm font-semibold mb-2">{metric.label}</div>
                <p className="font-mono text-xs text-foreground-muted">{metric.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Eco Rating System */}
      <section className="py-16 border-b border-border">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tighter mb-6">
                ECO RATING SYSTEM
              </h2>
              <p className="font-mono text-foreground-muted mb-6">
                Every product on CURATE comes with a transparent eco-rating from A to F, 
                helping you make informed choices about your fashion footprint.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-eco-green">
                  <span className="w-12 h-12 bg-eco-green text-black flex items-center justify-center font-display text-xl font-bold">
                    A
                  </span>
                  <div>
                    <p className="font-mono text-sm font-semibold">Excellent</p>
                    <p className="font-mono text-xs text-foreground-muted">
                      Lowest environmental impact, recycled/organic materials
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-eco-b">
                  <span className="w-12 h-12 bg-eco-b text-black flex items-center justify-center font-display text-xl font-bold">
                    B
                  </span>
                  <div>
                    <p className="font-mono text-sm font-semibold">Very Good</p>
                    <p className="font-mono text-xs text-foreground-muted">
                      Sustainable practices, minimal water usage
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-eco-c">
                  <span className="w-12 h-12 bg-eco-c text-black flex items-center justify-center font-display text-xl font-bold">
                    C
                  </span>
                  <div>
                    <p className="font-mono text-sm font-semibold">Good</p>
                    <p className="font-mono text-xs text-foreground-muted">
                      Meeting basic sustainability standards
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-accent p-8 bg-accent/5">
              <h3 className="font-display text-2xl font-bold tracking-tighter mb-4 text-accent">
                HOW WE CALCULATE
              </h3>
              <ul className="space-y-3 font-mono text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-accent">→</span>
                  <span>Material sourcing and certification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent">→</span>
                  <span>Water consumption in production</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent">→</span>
                  <span>Carbon emissions from manufacturing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent">→</span>
                  <span>Transportation and packaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent">→</span>
                  <span>End-of-life recyclability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent">→</span>
                  <span>Worker welfare and fair wages</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Materials */}
      <section className="py-16 bg-background-secondary">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tighter text-center mb-4">
            SUSTAINABLE MATERIALS
          </h2>
          <p className="font-mono text-foreground-muted text-center max-w-2xl mx-auto mb-12">
            We carefully select materials that minimize environmental impact while 
            maintaining the quality and durability you expect.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Card key={material.name} variant="hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-bold">{material.name}</h3>
                    <span className="font-display text-2xl font-bold text-accent">
                      {material.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-background-tertiary mb-4">
                    <div
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: `${material.percentage}%` }}
                    />
                  </div>
                  <p className="font-mono text-sm text-foreground-muted mb-2">
                    {material.description}
                  </p>
                  <p className="font-mono text-xs text-eco-green">{material.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Initiatives */}
      <section className="py-16 border-b border-border">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tighter text-center mb-12">
            OUR INITIATIVES
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {initiatives.map((initiative) => (
              <Card key={initiative.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 border border-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">{initiative.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold tracking-tighter mb-2">
                        {initiative.title}
                      </h3>
                      <p className="font-mono text-sm text-foreground-muted mb-4">
                        {initiative.description}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-2xl font-bold text-accent">
                          {initiative.stat}
                        </span>
                        <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider">
                          {initiative.statLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-background-secondary">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tighter text-center mb-12">
            CERTIFICATIONS & PARTNERS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="text-center p-6 border border-border bg-background hover:border-accent transition-colors"
              >
                <div className="text-4xl mb-4">{cert.icon}</div>
                <h3 className="font-mono text-sm font-semibold mb-1">{cert.name}</h3>
                <p className="font-mono text-xs text-foreground-muted">{cert.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-16 border-b border-border">
        <Container>
          <h2 className="font-display text-3xl font-bold tracking-tighter text-center mb-12">
            OUR JOURNEY
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative border-l-2 border-accent pl-8 space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[41px] w-4 h-4 bg-accent" />
                  <span className="font-mono text-xs text-accent uppercase tracking-wider">
                    {item.year}
                  </span>
                  <p className="font-mono text-sm mt-1">{item.milestone}</p>
                </div>
              ))}
            </div>
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
              Every purchase you make is a vote for the kind of world you want to live in. 
              Choose fashion that cares about the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button variant="brutal" size="lg">
                  Shop Sustainable Fashion
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg">
                  Learn Our Story
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
